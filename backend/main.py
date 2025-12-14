from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Import routers
from auth import router as auth_router
from chat import router as chat_router
from mood import router as mood_router
from user import router as user_router

if os.getenv("ENVIRONMENT") != "production":
    load_dotenv()

app = FastAPI(title="MindMate API", description="AI Mental Wellness Backend")

# CORS
# CORS
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(mood_router, prefix="/mood", tags=["Mood"])
app.include_router(user_router, prefix="/user", tags=["User"])


@app.get("/")
def read_root():
    return {"message": "MindMate API is running! 🧠"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
