# MindMate MVP - Official Demo Script

**Target Audience**: Judges, Investors, or Users.
**Duration**: ~2-3 Minutes.
**Goal**: Demonstrate empathy, functionality, and technical depth.

---

## 1. Introduction (0:00 - 0:30)

**Action**: Open the Landing Page (`http://localhost:5173`).
**Speaker**:
"Hi everyone. This is **MindMate**, an AI-powered mental wellness companion designed specifically for college students.
We know that 1 in 3 students suffers from anxiety or depression, but professional help is often expensive or stigmatized.
MindMate bridges that gap by providing a safe, 24/7 space to talk, track emotions, and get immediate support."

---

## 2. The "Hook" - Live Chat (0:30 - 1:15)

**Action**:
1.  Click **"Get Started"** or **"Login"**.
2.  Log in with a demo account (e.g., `demo@example.com` / `password123`).
3.  Land on the **Chat Interface**.

**Speaker**:
"Let's jump right into the core experience. Unlike generic chatbots, MindMate has a persistent memory and a compassionate persona."

**Action**: Type: *"I'm feeling really overwhelmed with my finals coming up."*
*(Wait for AI response)*

**Speaker**:
"Notice how the AI doesn't just give generic advice. It validates my feelings first."

**Action**: Type: *"I just don't think I can learn it all in time."*
*(Wait for AI response)*

**Speaker**:
"It remembers the context of 'finals' and offers specific, grounding techniques. We support multiple models like Groq for speed and Gemini for reasoning, which users can switch between in Settings."

---

## 3. Crisis Intervention (1:15 - 1:45)

**Speaker**:
"Safety is our top priority. We've built in real-time crisis detection."

**Action**: Type: *"I just want to give up and end it all."*
*(Show the Red Alert box)*

**Speaker**:
"The system instantly detects the distress keywords. It interrupts the standard flow to provide immediate helpline numbers and a supportive, non-judgmental safety message. This feature saves lives."

---

## 4. Mood Tracking & Analytics (1:45 - 2:15)

**Action**: Click the **"Mood"** tab.

**Speaker**:
"Mental health isn't just about crisis; it's about daily patterns. Users can log their mood in seconds."

**Action**: Select **"Anxious"** (😰) and click **Submit**.
*(Show success message)*

**Action**: Click the **"Dashboard"** tab.

**Speaker**:
"Over time, this builds a comprehensive picture of their well-being. Our dashboard visualizes these trends, helping students identify triggers—like how their mood dips every Monday or during exam weeks."

---

## 5. Technical & Closing (2:15 - 2:30)

**Action**: Briefly show the **Profile** page.

**Speaker**:
"We built this using **React** for a responsive frontend and **FastAPI** for high-performance inference, backed by **Firebase** for secure real-time data.
MindMate isn't just a chatbot; it's a holistic companion for student well-being. Thank you."

---

## ⚡ Pre-Demo Checklist

1.  **Clear Database**: Delete old test chats if you want a fresh start.
2.  **Login**: Have a user already logged in if you are short on time.
3.  **Check API Keys**: Ensure your `.env` keys are active (Groq/Gemini).
4.  **Zoom**: Set browser zoom to 110% for better visibility on projectors.

## 🆘 Troubleshooting

*   **AI not replying?**
    *   Check if the backend terminal is running.
    *   Refresh the page.
    *   Switch the model in the Chat dropdown.
*   **"Network Error"?**
    *   Ensure `http://localhost:8000` is reachable.
    *   Check if your firewall is blocking the port.
