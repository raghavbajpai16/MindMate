import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

import json

# Initialize Firebase
# Try to load from service account file first (local dev), then env vars (deployment)
cred = None

# Check for full JSON in env var (Railway/Render friendly)
if os.getenv("FIREBASE_CREDENTIALS_JSON"):
    try:
        json_str = os.getenv("FIREBASE_CREDENTIALS_JSON")
        cred_dict = json.loads(json_str)
        cred = credentials.Certificate(cred_dict)
    except Exception as e:
        print(f"❌ Error loading FIREBASE_CREDENTIALS_JSON: {e}")

# Fallback to file if no JSON env var
if not cred and os.path.exists(os.getenv("FIREBASE_KEY_PATH", "firebase-key.json")):
    cred = credentials.Certificate(os.getenv("FIREBASE_KEY_PATH", "firebase-key.json"))

if not cred:
    # Fallback for deployment where key might be in individual env vars
    # Note: Handling newlines in private key env var is tricky, usually requires replace
    private_key = os.getenv("FIREBASE_PRIVATE_KEY")
    if private_key:
        private_key = private_key.replace("\\n", "\n")
        cred = credentials.Certificate(
            {
                "type": "service_account",
                "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                "private_key_id": "some_id",  # Not strictly needed for init
                "private_key": private_key,
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        )

if cred:
    try:
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("✅ Firebase initialized successfully")
    except ValueError:
        # App already initialized
        db = firestore.client()
else:
    print("⚠️ WARNING: Firebase credentials not found. Database operations will fail.")
    db = None

# --- User Operations ---


async def create_user(user_id: str, user_data: dict):
    if not db:
        return
    user_data["created_at"] = datetime.utcnow().isoformat()
    db.collection("users").document(user_id).set(user_data)


async def get_user(user_id: str):
    if not db:
        return None
    doc = db.collection("users").document(user_id).get()
    if doc.exists:
        return doc.to_dict()
    return None


async def update_user(user_id: str, data: dict):
    if not db:
        return
    db.collection("users").document(user_id).update(data)


async def delete_user(user_id: str):
    if not db:
        return
    db.collection("users").document(user_id).delete()


# --- Chat Operations ---


async def save_message(user_id: str, message_data: dict):
    if not db:
        return
    # We'll store messages in a subcollection 'messages' under the user
    # Or a separate 'conversations' collection. Let's follow the prompt schema:
    # users/{user_id}/conversations/{session_id}/messages/{msg_id}

    # For MVP simplicity, let's just use a single 'history' collection or append to a list
    # But prompt says: users/{user_id}/conversations/{session_id}/messages/

    # We need a session ID. For now, let's assume a 'default' session or generate one based on date
    session_id = datetime.now().strftime("%Y-%m-%d")

    # Add timestamp
    message_data["timestamp"] = datetime.utcnow().isoformat()

    db.collection("users").document(user_id).collection("conversations").document(
        session_id
    ).collection("messages").add(message_data)


async def get_messages(user_id: str, limit: int = 10):
    if not db:
        return []
    session_id = datetime.now().strftime("%Y-%m-%d")

    docs = (
        db.collection("users")
        .document(user_id)
        .collection("conversations")
        .document(session_id)
        .collection("messages")
        .order_by("timestamp", direction=firestore.Query.ASCENDING)
        .limit(limit)
        .stream()
    )

    return [doc.to_dict() for doc in docs]


async def get_user_keywords(user_id: str):
    # In a real app, we'd query a 'keywords' field.
    # For MVP, we'll just return empty or fetch from profile if we stored them.
    user = await get_user(user_id)
    return user.get("keywords", []) if user else []


# --- Mood Operations ---


async def save_mood(user_id: str, mood_data: dict):
    if not db:
        return
    mood_data["timestamp"] = datetime.utcnow().isoformat()
    db.collection("users").document(user_id).collection("moods").add(mood_data)


async def get_moods_week(user_id: str):
    if not db:
        return []
    # In production, filter by date range. For MVP, fetch last 50 and filter in code or just return all
    docs = (
        db.collection("users")
        .document(user_id)
        .collection("moods")
        .order_by("timestamp", direction=firestore.Query.DESCENDING)
        .limit(50)
        .stream()
    )
    return [doc.to_dict() for doc in docs]
