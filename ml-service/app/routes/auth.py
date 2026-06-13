import os
import datetime
import jwt
import asyncpg
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

router = APIRouter(prefix="/auth", tags=["User Authentication"])

# Configuration constants
JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY", "your-shared-nextauth-jwt-token-secret-key-12345"
)
DATABASE_URL = os.getenv("DATABASE_URL")

# Set up password hashing configurations
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    sector: str  # e.g., 'drawing', 'music', 'gaming'


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_new_user(payload: RegisterRequest):
    """
    Creates a new user record in PostgreSQL and assigns them to a permanent sector.
    """
    hashed_password = pwd_context.hash(payload.password)
    target_sector = payload.sector.strip().lower()

    try:
        conn = await asyncpg.connect(DATABASE_URL)

        # Check if the email already exists
        user_exists = await conn.fetchrow(
            "SELECT user_id FROM platform_users WHERE email = $1", payload.email
        )
        if user_exists:
            await conn.close()
            raise HTTPException(
                status_code=400,
                detail="Registration failed: An account with this email already exists.",
            )

        # Insert user account metadata
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
    """
    Verifies user credentials and returns a secure JWT bearer access token.
    """
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        user_record = await conn.fetchrow(
            "SELECT user_id, password_hash, sector FROM platform_users WHERE email = $1",
            payload.email,
        )
        await conn.close()

        if not user_record or not pwd_context.verify(
            payload.password, user_record["password_hash"]
        ):
            raise HTTPException(
                status_code=401,
                detail="Authentication failed: Invalid email or password credentials.",
            )

        # Structure token token assertions expiration windows (e.g., 24 Hours validity)
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
