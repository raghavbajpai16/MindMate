import React from 'react';

const moods = [
    { emoji: '😊', label: 'Great', score: 5 },
    { emoji: '🙂', label: 'Good', score: 4 },
    { emoji: '😐', label: 'Okay', score: 3 },
    { emoji: '😕', label: 'Bad', score: 2 },
    { emoji: '😞', label: 'Very Bad', score: 1 },
    { emoji: '😴', label: 'Tired', score: 2 },
    { emoji: '😰', label: 'Anxious', score: 1 },
];

const MoodEmojis = ({ onSelect, selected }) => {
    return (
        <div className="mood-grid">
            {moods.map((mood) => (
                <button
                    key={mood.label}
                    onClick={() => onSelect(mood)}
                    className={`mood-btn ${selected?.label === mood.label ? 'selected' : ''}`}
                >
                    <span className="emoji">{mood.emoji}</span>
                    <span className="mood-label">{mood.label}</span>
                </button>
            ))}
        </div>
    );
};

export default MoodEmojis;
