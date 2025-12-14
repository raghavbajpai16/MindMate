# MindMate MVP Backend

## Deployment Instructions (Railway)

**IMPORTANT:** This backend must be deployed with **Root Directory = backend**.

### 1. Project Structure
The backend lives in the `backend/` directory. When deploying on Railway, go to **Settings > Build > Root Directory** and set it to `/backend`.

### 2. Environment Variables
Secrets are NOT stored in the repository. You must set them in the **Railway Variables Dashboard**.

**Required Environment Variables:**
- `GROQ_API_KEY`: Your Groq API Key
- `GEMINI_API_KEY`: Your Google Gemini API Key
- `OPENAI_API_KEY`: (Optional) OpenAI Key
- `FIREBASE_CREDENTIALS_JSON`: The **entire content** of your `firebase-key.json` file (as a single string).
- `ALLOWED_ORIGINS`: `*` (or your frontend URL, comma-separated)
- `PORT`: `8000` (Optional, Railway often sets this automatically)
- `ENVIRONMENT`: `production`

### 3. Start Command
Railway will automatically detect the `Procfile` and use:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```
