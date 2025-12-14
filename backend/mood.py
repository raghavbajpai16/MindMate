from fastapi import APIRouter
from pydantic import BaseModel
from database import save_mood, get_moods_week
from datetime import datetime
from collections import defaultdict

router = APIRouter()

from typing import Optional


class MoodLogRequest(BaseModel):
    user_id: str
    mood_emoji: str
    mood_score: int
    note: Optional[str] = None
    timestamp: str


@router.post("/log")
async def log_mood(request: MoodLogRequest):
    data = request.dict()
    await save_mood(request.user_id, data)
    return {"success": True, "message": "Mood logged successfully!"}


@router.get("/today/{user_id}")
async def get_today_moods(user_id: str):
    # For MVP, we fetch week and filter for today in python or just return all
    # Ideally, DB query should filter.
    all_moods = await get_moods_week(user_id)
    today_str = datetime.now().strftime("%Y-%m-%d")

    today_moods = [m for m in all_moods if m.get("timestamp", "").startswith(today_str)]
    return {"moods": today_moods}


@router.get("/week/{user_id}")
async def get_week_moods(user_id: str):
    moods = await get_moods_week(user_id)

    # Process data for chart
    # Group by date
    grouped = defaultdict(list)
    for m in moods:
        # timestamp format: 2025-12-07T20:30:00Z
        date_str = m.get("timestamp", "").split("T")[0]
        grouped[date_str].append(m.get("mood_score", 0))

    week_data = []
    total_score = 0
    total_entries = 0

    # Sort by date
    sorted_dates = sorted(grouped.keys())

    for date in sorted_dates:
        scores = grouped[date]
        avg = sum(scores) / len(scores)
        week_data.append(
            {
                "date": date,
                "average_score": round(avg, 1),
                "entries": len(scores),
                "moods": [],  # simplified
            }
        )
        total_score += sum(scores)
        total_entries += len(scores)

    stats = {
        "weekly_average": (
            round(total_score / total_entries, 1) if total_entries > 0 else 0
        ),
        "total_entries": total_entries,
        "best_day": (
            max(week_data, key=lambda x: x["average_score"])["date"]
            if week_data
            else "N/A"
        ),
        "worst_day": (
            min(week_data, key=lambda x: x["average_score"])["date"]
            if week_data
            else "N/A"
        ),
    }

    return {
        "moods": moods,  # Return raw data for frontend dashboard
        "week_data": week_data,
        "statistics": stats,
    }
