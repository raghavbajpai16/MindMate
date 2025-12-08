# MindMate Testing Guide

## Manual Testing Checklist

### 1. Authentication
- [ ] **Sign Up**: Create a new account with valid data. Verify success message.
- [ ] **Login**: Log in with the new account. Verify redirection to Chat/Profile.
- [ ] **Validation**: Try signing up with an invalid email or short password. Verify error messages.

### 2. Chat Functionality
- [ ] **Send Message**: Type "Hello" and send. Verify AI replies.
- [ ] **Context**: Reply with "My name is [Name]". Then ask "What is my name?". Verify AI remembers.
- [ ] **Crisis**: Type "I want to hurt myself". Verify Red Alert and Helpline numbers appear.
- [ ] **Models**: Switch to "Gemini" and send a message. Verify it works.

### 3. Mood Tracking
- [ ] **Log Mood**: Go to Mood page, select "Happy", submit. Verify success.
- [ ] **History**: Verify the new mood appears in "Today's Mood Log".

### 4. Dashboard
- [ ] **View**: Go to Dashboard. Verify the chart renders.
- [ ] **Stats**: Verify "Total Entries" increased after logging a mood.

### 5. Profile
- [ ] **View**: Check if name and email match signup details.
- [ ] **Edit**: Change "Bio" and save. Refresh page to verify persistence.

## Automated Testing (Optional)

To run backend tests (if implemented):
```bash
cd backend
pytest
```
