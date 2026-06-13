import os
import datetime
import jwt
import asyncpg
import bcrypt
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["User Authentication"])

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY", "your-shared-nextauth-jwt-token-secret-key-12345"
)
DATABASE_URL = os.getenv("DATABASE_URL")


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    sector: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_new_user(payload: RegisterRequest):
    # Native bcrypt requires password strings to be encoded into bytes first
    password_bytes = payload.password.encode("utf-8")
    salt = bcrypt.gensalt()
    # Generate the hash, then decode it back to a standard string for database storage
    hashed_password = bcrypt.hashpw(password_bytes, salt).decode("utf-8")

    target_sector = payload.sector.strip().lower()

    try:
        conn = await asyncpg.connect(DATABASE_URL)

        user_exists = await conn.fetchrow(
            "SELECT user_id FROM platform_users WHERE email = $1", payload.email
        )
        if user_exists:
            await conn.close()
            raise HTTPException(
                status_code=400,
                detail="Registration failed: An account with this email already exists.",
            )

        await conn.execute(
            """
            INSERT INTO platform_users (email, password_hash, sector)
            VALUES ($1, $2, $3)
        """,
            payload.email,
            hashed_password,
            target_sector,
        )

        await conn.close()
        return {
            "status": "success",
            "message": f"Account successfully registered under sector '{target_sector}'.",
        }

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500, detail=f"Internal database entry error: {str(e)}"
        )


@router.post("/login")
async def login_user(payload: LoginRequest):
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        user_record = await conn.fetchrow(
            "SELECT user_id, password_hash, sector FROM platform_users WHERE email = $1",
            payload.email,
        )
        await conn.close()

        # Check credentials using native bcrypt verification logic
        if not user_record:
            raise HTTPException(
                status_code=401,
                detail="Authentication failed: Invalid email or password credentials.",
            )

        supplied_password_bytes = payload.password.encode("utf-8")
        stored_hash_bytes = user_record["password_hash"].encode("utf-8")

        if not bcrypt.checkpw(supplied_password_bytes, stored_hash_bytes):
            raise HTTPException(
                status_code=401,
                detail="Authentication failed: Invalid email or password credentials.",
            )

        token_expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=24)

        token_payload = {
            "user_id": str(user_record["user_id"]),
            "email": payload.email,
            "sector": user_record["sector"],
            "exp": token_expiration,
        }

        access_token = jwt.encode(token_payload, JWT_SECRET_KEY, algorithm="HS256")

        return {
            "status": "success",
            "access_token": access_token,
            "token_type": "bearer",
            "assigned_sector": user_record["sector"],
        }

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500, detail=f"Internal authentication system failure: {str(e)}"
        )
