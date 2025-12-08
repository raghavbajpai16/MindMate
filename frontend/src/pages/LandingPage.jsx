import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>MindMate 🧠</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                Your compassionate AI companion for mental wellness. Always here to listen, support, and help you navigate college life.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/signup" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                    Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                    Login
                </Link>
            </div>

            <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div className="card">
                    <h3>💬 24/7 Chat</h3>
                    <p>Talk to an empathetic AI friend anytime, anywhere.</p>
                </div>
                <div className="card">
                    <h3>📊 Mood Tracking</h3>
                    <p>Log your feelings and visualize your emotional trends.</p>
                </div>
                <div className="card">
                    <h3>🔒 Private & Secure</h3>
                    <p>Your conversations are private and secure.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
