# MindMate API Reference

Base URL: `http://localhost:8000`

## Authentication

### POST /auth/signup
Create a new user account.
- **Body**: `{ "name": "string", "email": "string", "password": "string" }`
- **Response**: `{ "success": true, "user_id": "string", "message": "string" }`

### POST /auth/login
Authenticate a user.
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: `{ "success": true, "user_id": "string", "token": "string", "redirect": "string" }`

## Chat

### POST /chat
Send a message to the AI.
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "user_id": "string", "message": "string", "model_choice": "string" }`
- **Response**: 
  ```json
  {
    "response": "string",
    "is_crisis": boolean,
    "helplines": { "name": "number" },
    "timestamp": "string"
  }
  ```

## Mood

### POST /mood/log
Log a mood entry.
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "user_id": "string", "mood_emoji": "string", "mood_score": int, "timestamp": "string" }`
- **Response**: `{ "success": true, "message": "string" }`

### GET /mood/week/{user_id}
Get mood statistics for the last 7 days.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "week_data": [
      { "date": "string", "average_score": float, "entries": int }
    ],
    "statistics": {
      "weekly_average": float,
      "best_day": "string",
      "worst_day": "string"
    }
  }
  ```

## User

### GET /user/{user_id}/profile
Get user profile details.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "name": "string", "email": "string", "bio": "string", ... }`

### PUT /user/{user_id}/profile
Update user profile.
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "bio": "string", "preferred_model": "string", ... }`
- **Response**: `{ "success": true, "message": "string" }`
