import os
import jwt
from fastapi import Request, HTTPException

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY", "your-shared-nextauth-jwt-token-secret-key-12345"
)


async def verify_user_jwt(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Access Denied: Missing or malformed authentication header token.",
        )

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        request.state.user_id = payload.get("user_id") or payload.get("sub")
        if not request.state.user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token context: missing user identification keys.",
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401, detail="Token validation failed: identity string expired."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401, detail="Token validation failed: signature corrupted."
        )
