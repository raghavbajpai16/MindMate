# MindMate MVP - Setup Guide

## 1. Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.10 or higher)
- **Git**
- **Firebase Account**

## 2. API Keys Needed

### AI Models
1.  **Groq**: Get key from [console.groq.com](https://console.groq.com).
2.  **Gemini**: Get key from [makersuite.google.com](https://makersuite.google.com).
3.  **OpenAI**: Get key from [platform.openai.com](https://platform.openai.com).

### Firebase
1.  Go to [firebase.google.com](https://firebase.google.com) and create a project.
2.  Enable **Firestore Database** (Start in Test Mode).
3.  Enable **Authentication** (Email/Password provider).
4.  Go to Project Settings > Service Accounts > Generate New Private Key.
5.  Save the JSON file as `firebase-key.json` in the `backend/` folder.
6.  Go to Project Settings > General > Your Apps > Add Web App. Copy the config.

## 3. Backend Setup

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```

2.  Create a virtual environment:
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configure Environment:
    - Copy `.env.example` to `.env`.
    - Fill in your API keys and Firebase details.
    - Ensure `firebase-key.json` is present if using the file method.

5.  Run the server:
    ```bash
    python main.py
    ```
    The API will be running at `http://localhost:8000`.

## 4. Frontend Setup

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment:
    - Copy `.env.example` to `.env`.
    - Fill in your Firebase Web Config keys.

4.  Run the development server:
    ```bash
    npm run dev
    ```
    The app will be running at `http://localhost:5173`.

## 5. Verification

1.  Open `http://localhost:5173`.
2.  Click **Sign Up** and create an account.
3.  You should be redirected to Login. Log in.
4.  Go to **Chat** and say "Hello".
5.  Go to **Mood** and log a mood.
6.  Check **Dashboard** to see if it updates.
