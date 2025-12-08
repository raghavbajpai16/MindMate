import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Optional
import os
import re

# Config
SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def generate_jwt(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_jwt(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

def validate_email(email: str) -> bool:
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(pattern, email) is not None

def detect_crisis_keywords(message: str) -> bool:
    crisis_keywords = [
        "suicide", "kill myself", "hurt myself", "end it all", 
        "want to die", "give up", "can't take it", "no point living"
    ]
    message_lower = message.lower()
    return any(keyword in message_lower for keyword in crisis_keywords)

def extract_keywords(text: str) -> list:
    # Simple keyword extraction for MVP (stopwords removal could be added)
    ignore_words = {"the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "i", "my", "me"}
    words = text.lower().split()
    keywords = [w for w in words if w not in ignore_words and len(w) > 3]
    return list(set(keywords))[:5] # Return top 5 unique keywords
