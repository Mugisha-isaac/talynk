"""
In-memory replacement for the Redis cache that used to back the sector
top-5 recommendation feed. Render doesn't offer a managed Redis instance,
so this trades cross-instance/cross-restart caching for zero extra
infrastructure. Behavior (5-minute TTL, invalidate-on-new-upload) is
preserved; the only difference is the cache is per-process instead of
shared, which is fine for a single-instance deployment.
"""

import time
from typing import Any, Optional

_store: dict[str, tuple[float, Any]] = {}


def get(key: str) -> Optional[Any]:
    entry = _store.get(key)
    if not entry:
        return None

    expires_at, value = entry
    if time.monotonic() > expires_at:
        _store.pop(key, None)
        return None

    return value


def setex(key: str, ttl_seconds: int, value: Any) -> None:
    _store[key] = (time.monotonic() + ttl_seconds, value)


def delete(key: str) -> None:
    _store.pop(key, None)
