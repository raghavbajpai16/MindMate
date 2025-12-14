import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
from dotenv import load_dotenv

load_dotenv()


def verify_user(email):
    # Initialize Firebase
    if not firebase_admin._apps:
        cred_path = os.getenv("FIREBASE_KEY_PATH", "firebase-key.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print(f"✅ Firebase initialized with credentials from {cred_path}")
        else:
            print(f"❌ Credentials file not found at {cred_path}")
            return

    db = firestore.client()

    print(f"\n--- Checking User: {email} ---")

    # 1. Check Firebase Authentication
    uid = None
    try:
        user = auth.get_user_by_email(email)
        print(f"✅ [AUTH] User found!")
        print(f"   - UID: {user.uid}")
        print(f"   - Email: {user.email}")
        print(f"   - Display Name: {user.display_name}")
        uid = user.uid
    except auth.UserNotFoundError:
        print(f"❌ [AUTH] User NOT found in Firebase Authentication.")
    except Exception as e:
        print(f"❌ [AUTH] Error checking Auth: {e}")

    # 2. Check Firestore Database
    if uid:
        try:
            doc = db.collection("users").document(uid).get()
            if doc.exists:
                print(f"✅ [FIRESTORE] User profile found!")
                print(f"   - Data: {doc.to_dict()}")
            else:
                print(
                    f"❌ [FIRESTORE] User profile document does NOT exist for UID {uid}."
                )
        except Exception as e:
            print(f"❌ [FIRESTORE] Error checking Firestore: {e}")
    else:
        print("ℹ️ Skipping Firestore check because Auth user was not found.")


if __name__ == "__main__":
    # Check the email from the screenshot
    verify_user("xyx@gmail.com")
