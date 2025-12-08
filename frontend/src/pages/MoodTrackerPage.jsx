import React, { useState, useEffect } from 'react';
import MoodEmojis from '../components/MoodEmojis';
import { moodAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MoodTrackerPage = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [loading, setLoading] = useState(false);
    const [todayMoods, setTodayMoods] = useState([]);
    const [message, setMessage] = useState('');
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        loadTodayMoods();
    }, []);

    const loadTodayMoods = async () => {
        try {
            const response = await moodAPI.getMoodToday(userId);
            setTodayMoods(response.data.moods);
        } catch (error) {
            console.error("Error loading moods", error);
        }
    };

    const handleSubmit = async () => {
        if (!selectedMood) return;
        setLoading(true);
        try {
            await moodAPI.logMood(userId, selectedMood.emoji, selectedMood.score);
            setMessage('Mood logged successfully! 🌟');
            setSelectedMood(null);
            await loadTodayMoods();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to log mood. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="card text-center">
                <h2>How are you feeling right now?</h2>
                <p className="text-muted mb-4">Select an emoji that best represents your mood.</p>

                <MoodEmojis onSelect={setSelectedMood} selected={selectedMood} />

                {selectedMood && (
                    <div className="mb-4">
                        <p>You selected: <strong>{selectedMood.label}</strong></p>
                        <button onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
                            {loading ? <LoadingSpinner /> : 'Submit Mood'}
                        </button>
                    </div>
                )}

                {message && <div className={`mt-4 ${message.includes('Failed') ? 'text-red' : 'text-success'}`}>{message}</div>}
            </div>

            <div className="mt-4">
                <h3 className="mb-4">Today's Mood Log</h3>
                {todayMoods.length === 0 ? (
                    <p className="text-muted text-center">No moods logged today yet.</p>
                ) : (
                    <div className="card" style={{ padding: '1rem' }}>
                        {todayMoods.map((mood, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: index < todayMoods.length - 1 ? '1px solid #eee' : 'none' }}>
                                <span style={{ fontSize: '1.5rem' }}>{mood.mood_emoji}</span>
                                <span className="text-muted">
                                    {new Date(mood.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodTrackerPage;
