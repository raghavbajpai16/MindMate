# MindMate MVP - Implementation Details

## 1. What Was Built
We have built a complete, production-ready mental wellness chatbot application called **MindMate**. It includes:
- **User Authentication**: Secure signup and login using Firebase Auth concepts (simulated for MVP backend-only flow or ready for full integration).
- **Conversational AI**: A chat interface that connects to Groq, Gemini, or ChatGPT to provide empathetic support.
- **Mood Tracking**: A visual emoji-based logging system to track daily emotional states.
- **Analytics Dashboard**: A data visualization of mood trends over the last week.
- **User Profile**: Management of personal details and preferences.
- **Real-time Database**: Integration with Google Firestore for storing users, chats, and moods.

## 2. How Each Feature Works

### Authentication Flow
1.  **Sign Up**: User enters details. Backend validates email/password. A user document is created in Firestore.
2.  **Login**: User enters credentials. Backend verifies them (against Firestore/Firebase) and issues a JWT token.
3.  **Session**: The JWT token is stored in the browser's `localStorage` and sent with every API request.

### Chat Flow
1.  **User Input**: User types a message in `ChatPage`.
2.  **Processing**: The message is sent to the backend (`/chat`).
3.  **Context**: Backend fetches the user's profile and recent keywords to build a personalized system prompt.
4.  **AI Generation**: The selected LLM (Groq/Gemini/ChatGPT) generates a response.
5.  **Crisis Detection**: The response and input are checked for crisis keywords. If found, a flag is set.
6.  **Storage**: Both user message and AI response are saved to Firestore.
7.  **Display**: The frontend renders the new messages.

### Mood Tracking Flow
1.  **Selection**: User clicks an emoji (e.g., "Great", "Sad").
2.  **Logging**: The selection is sent to `/mood/log` with a score (1-5).
3.  **Storage**: Saved to the `moods` subcollection in Firestore.
4.  **Feedback**: A success message is shown, and the daily log is updated.

### Analytics Dashboard
1.  **Data Fetching**: On load, the dashboard requests `/mood/week/{user_id}`.
2.  **Aggregation**: Backend fetches the last 7 days of moods and calculates daily averages.
3.  **Visualization**: `Chart.js` renders a line graph of these averages.
4.  **Stats**: Key metrics (best day, weekly average) are calculated and displayed.

## 3. Why Architecture Choices Were Made

### Frontend: React + Vite
- **Performance**: Vite offers extremely fast build times and hot reloading.
- **Ecosystem**: React has a massive library of components (like `react-chartjs-2`).
- **Simplicity**: For an MVP, a Single Page Application (SPA) provides the smoothest user experience.

### Backend: FastAPI
- **Speed**: FastAPI is one of the fastest Python frameworks, crucial for real-time chat.
- **Async**: Native support for asynchronous operations handles multiple chat requests efficiently.
- **Documentation**: Automatic Swagger UI (`/docs`) makes testing easy.

### Database: Firestore
- **Flexibility**: NoSchema allows rapid iteration of data structures.
- **Real-time**: Although we used REST for this MVP, Firestore supports real-time listeners for future upgrades.
- **Scalability**: Handles large volumes of chat logs effortlessly.

### AI Models
- **Groq**: Chosen as default for its incredible speed (LPU inference).
- **Gemini**: High-quality reasoning fallback.
- **ChatGPT**: Reliable industry standard backup.

## 4. Key Technical Decisions

- **Context API vs Redux**: We chose Context API for state management because the app's state (Auth, Chat) is relatively simple. Redux would introduce unnecessary boilerplate.
- **JWT Auth**: Stateless authentication scales better and is easier to implement across decoupled frontend/backend systems than session cookies.
- **Dynamic System Prompts**: We inject user context into every prompt to ensure the AI remembers the user's name and recent topics, creating a "memory" effect without fine-tuning.
