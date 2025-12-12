import React, { useState, useEffect } from 'react';
import { moodAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/mood.css';

const MOODS = [
    { value: 1, emoji: '😢', label: 'Very Sad', color: '#E57373' },
    { value: 2, emoji: '😟', label: 'Sad', color: '#FFB74D' },
    { value: 3, emoji: '😐', label: 'Neutral', color: '#FFF176' },
    { value: 4, emoji: '🙂', label: 'Happy', color: '#81C784' },
    { value: 5, emoji: '😄', label: 'Very Happy', color: '#6AC474' },
];

const MoodTrackerPage = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [todayMoods, setTodayMoods] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        loadTodayMoods();
    }, []);

    const loadTodayMoods = async () => {
        try {
            const response = await moodAPI.getMoodToday(userId);
            setTodayMoods(response.data.moods || []);
        } catch (error) {
            console.error("Error loading moods", error);
        }
    };

    const handleSelect = (mood) => {
        setSelectedMood(mood);
    };

    const handleSubmit = async () => {
        if (!selectedMood) return;
        setLoading(true);
        try {
            // Note: Update backend to accept 'note' if not already
            await moodAPI.logMood(userId, selectedMood.emoji, selectedMood.value, note);

            setSuccessMsg('Mood logged successfully! Keep it up. ✨');
            setTodayMoods([{ mood_emoji: selectedMood.emoji, timestamp: new Date(), note }, ...todayMoods]);

            // Reset
            setSelectedMood(null);
            setNote('');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error("Failed to log mood", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mood-container">
            {successMsg && (
                <div className="success-banner">
                    {successMsg}
                </div>
            )}

            <div className="mood-card">
                <h2 className="mood-title">How are you feeling?</h2>
                <p className="mood-subtitle">Select the emoji that matches your mood</p>

                <div className="mood-grid">
                    {MOODS.map((mood) => (
                        <div key={mood.value} style={{ textAlign: 'center' }}>
                            <button
                                onClick={() => handleSelect(mood)}
                                className={`mood-btn ${selectedMood?.value === mood.value ? 'selected' : ''}`}
                                aria-label={mood.label}
                            >
                                {mood.emoji}
                                {selectedMood?.value === mood.value && <div className="mood-dot" />}
                            </button>
                            <div className="mood-label" style={{ opacity: selectedMood?.value === mood.value ? 1 : 0.7 }}>
                                {mood.label}
                            </div>
                        </div>
                    ))}
                </div>

                {selectedMood && (
                    <div className="note-section">
                        <label className="note-label">Add a note (optional)</label>
                        <textarea
                            className="note-input"
                            placeholder="What's making you feel this way?"
                            rows="3"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <button onClick={handleSubmit} className="submit-btn" disabled={loading}>
                            {loading ? <LoadingSpinner size="small" /> : 'Save Entry'}
                        </button>
                    </div>
                )}
            </div>

            {todayMoods.length > 0 && (
                <div className="recent-list">
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Recent Entries
                    </h3>
                    {todayMoods.map((entry, index) => (
                        <div key={index} className="recent-entry">
                            <div className="entry-emoji">{entry.mood_emoji}</div>
                            <div style={{ flex: 1 }}>
                                {entry.note && <div className="entry-note">{entry.note}</div>}
                                <div className="entry-date">
                                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Today
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MoodTrackerPage;
