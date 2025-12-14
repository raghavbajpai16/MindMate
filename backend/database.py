import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime
import json

if os.getenv("ENVIRONMENT") != "production":
    from dotenv import load_dotenv
    load_dotenv()

# Initialize Firebase
# STRICT MODE: Only load from FIREBASE_CREDENTIALS_JSON env var (Railway/Render friendly)
firebase_json = os.getenv("FIREBASE_CREDENTIALS_JSON")

if not firebase_json:
    # Fail loudly if credentials are missing
    print("❌ Runtime Error: FIREBASE_CREDENTIALS_JSON environment variable not set.")
    print("   Please set this variable with the content of your serviceAccountKey.json.")
    raise RuntimeError("FIREBASE_CREDENTIALS_JSON not set")

try:
    # Handle potential double-escaped newlines
    if "\\n" in firebase_json:
        firebase_json = firebase_json.replace("\\n", "\n")
        
    cred_dict = json.loads(firebase_json)
    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Firebase initialized successfully from environment variable")
except Exception as e:
    print(f"❌ Failed to initialize Firebase: {e}")
    raise e


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
