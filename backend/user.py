from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_user, update_user, delete_user
from typing import Optional

router = APIRouter()


class UpdateProfileRequest(BaseModel):
    bio: Optional[str] = None
    emergency_contact: Optional[str] = None
    preferred_model: Optional[str] = None


@router.get("/{user_id}/profile")
async def get_profile(user_id: str):
    user = await get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}/profile")
async def update_profile(user_id: str, request: UpdateProfileRequest):
    data = {k: v for k, v in request.dict().items() if v is not None}
    await update_user(user_id, data)
    return {"success": True, "message": "Profile updated"}


@router.delete("/{user_id}")
async def delete_account(user_id: str):
    await delete_user(user_id)
    return {"success": True, "message": "Account deleted"}
