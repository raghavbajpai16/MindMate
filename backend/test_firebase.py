import firebase_admin
from firebase_admin import credentials, firestore
import os

# Check for key file
key_path = "firebase-key.json"
if not os.path.exists(key_path):
    print(f"❌ Error: {key_path} not found!")
    exit(1)

# Load credentials
try:
    cred = credentials.Certificate(key_path)
    # Check if app is already initialized
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    # Test connection
    db = firestore.client()
    doc = db.collection("test").document("test_doc")
    doc.set({"status": "connected", "timestamp": firestore.SERVER_TIMESTAMP})

    print("✅ Firebase connection successful!")
except Exception as e:
    print(f"❌ Firebase connection failed: {e}")
