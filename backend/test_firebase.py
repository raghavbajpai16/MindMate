import firebase_admin
from firebase_admin import credentials, firestore
import os

import json
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase from Env Var
firebase_json = os.getenv("FIREBASE_CREDENTIALS_JSON")

if not firebase_json:
    print("❌ Error: FIREBASE_CREDENTIALS_JSON not set.")
    exit(1)

try:
    if "\\n" in firebase_json:
        firebase_json = firebase_json.replace("\\n", "\n")
    cred = credentials.Certificate(json.loads(firebase_json))
    
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    # Test connection
    db = firestore.client()
    doc = db.collection("test").document("test_doc")
    doc.set({"status": "connected", "timestamp": firestore.SERVER_TIMESTAMP})

    print("✅ Firebase connection successful!")
except Exception as e:
    print(f"❌ Firebase connection failed: {e}")
