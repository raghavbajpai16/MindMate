from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import get_user, save_message, get_messages, get_user_keywords
from prompts import get_system_prompt
from utils import detect_crisis_keywords, extract_keywords
import os
import requests
from datetime import datetime

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str
    model_choice: str = "groq"

# --- LLM Callers ---

def call_groq(system_prompt, user_message):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key: return "Error: Groq API Key missing."
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7,
        "max_tokens": 300
    }
    try:
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers)
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        return f"Groq Error: {response.text}"
    except Exception as e:
        return f"Groq Exception: {str(e)}"

def call_gemini(system_prompt, user_message):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key: return "Error: Gemini API Key missing."
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{"text": f"{system_prompt}\n\nUser: {user_message}"}]
        }]
    }
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            return response.json()["candidates"][0]["content"]["parts"][0]["text"]
        return f"Gemini Error: {response.text}"
    except Exception as e:
        return f"Gemini Exception: {str(e)}"

def call_chatgpt(system_prompt, user_message):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key: return "Error: OpenAI API Key missing."
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    }
    try:
        response = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        return f"OpenAI Error: {response.text}"
    except Exception as e:
        return f"OpenAI Exception: {str(e)}"

# --- Endpoint ---

@router.post("/")
async def chat(request: ChatRequest):
    # 1. Crisis Detection
    if detect_crisis_keywords(request.message):
        return {
            "response": "I'm really glad you told me this. That feeling is real, but you don't have to go through it alone.",
            "is_crisis": True,
            "helplines": {
                "AMICA": "1800-300-0019",
                "iCall": "1800-389-5146",
                "VANDREVALA": "1860-2662-345"
            },
            "timestamp": datetime.utcnow().isoformat()
        }

    # 2. Load User Context
    user = await get_user(request.user_id)
    user_name = user.get("name", "Friend") if user else "Friend"
    keywords = await get_user_keywords(request.user_id)
    context_str = ", ".join(keywords)

    # 3. Build Prompt
    system_prompt = get_system_prompt(user_name, context_str)

    # 4. Call LLM
    if request.model_choice == "gemini":
        response_text = call_gemini(system_prompt, request.message)
    elif request.model_choice == "chatgpt":
        response_text = call_chatgpt(system_prompt, request.message)
    else:
        response_text = call_groq(system_prompt, request.message)

    # 5. Save Conversation
    await save_message(request.user_id, {
        "type": "user",
        "content": request.message,
        "model": request.model_choice
    })
    await save_message(request.user_id, {
        "type": "ai",
        "content": response_text,
        "model": request.model_choice
    })

    # 6. Extract & Update Keywords (Simple implementation)
    # In real app, we'd update the user profile with new keywords
    
    return {
        "response": response_text,
        "is_crisis": False,
        "timestamp": datetime.utcnow().isoformat()
    }
