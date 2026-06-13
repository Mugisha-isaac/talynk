import os
import asyncio
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

import asyncpg
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from app.routes import (
    auth,
    audio_quality,
    image_quality,
    video_quality,
    recommendations,
)

DATABASE_URL = os.getenv("DATABASE_URL")


async def init_db_schema():
    """Reads the local init.sql file and executes it programmatically."""
    init_script_path = os.path.join(os.path.dirname(__file__), "..", "init.sql")

    if not os.path.exists(init_script_path):
        print(
            f"⚠️ Warning: init.sql not found at {init_script_path}. Skipping programmatic setup."
        )
        return

    print("🚀 Initializing database schema programmatically...")

    # Simple retry loop to handle cases where the app starts faster than Postgres is ready
    for attempt in range(5):
        try:
            conn = await asyncpg.connect(DATABASE_URL)
            with open(init_script_path, "r") as f:
                schema_sql = f.read()

            # Execute the SQL script directly
            await conn.execute(schema_sql)
            await conn.close()
            print(
                "Layout Verification: [✔] Database schema verified/created successfully."
            )
            break
        except Exception as e:
            print(
                f"🔄 Connection attempt {attempt + 1}/5 failed. Retrying in 2 seconds... Error: {e}"
            )
            await asyncio.sleep(2)
    else:
        print("❌ Error: Could not connect to the database to initialize schema.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs BEFORE the application starts accepting requests
    await init_db_schema()
    yield
    # Any cleanup code would go here (e.g., closing global connection pools)


# Pass the lifespan handler to FastAPI
app = FastAPI(
    title="Talynk AI/ML Core Inference Service",
    version="2.1.0",
    docs_url="/docs",
    lifespan=lifespan,
)

# --- Your standard routes and OpenAPI specs continue below ---
app.include_router(auth.router, prefix="/api/v1")
app.include_router(audio_quality.router, prefix="/api/v1")
app.include_router(image_quality.router, prefix="/api/v1")
app.include_router(video_quality.router, prefix="/api/v1")
app.include_router(recommendations.router, prefix="/api/v1")


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title, version=app.version, routes=app.routes
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your raw JWT token here.",
        }
    }
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
