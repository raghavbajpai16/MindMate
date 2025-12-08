import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [profile, setProfile] = React.useState(null);

    React.useEffect(() => {
        if (user?.id) {
            // Fetch profile for name
            import('../services/api').then(module => {
                module.userAPI.getProfile(user.id).then(res => setProfile(res.data)).catch(() => { });
            });
        }
    }, [user]);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <header className="header">
            <div className="container header-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        borderRadius: '50%', backgroundColor: '#e0e7ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.25rem'
                    }}>
                        🌸
                    </div>
                    <div>
                        <Link to="/chat" className="logo" style={{ fontSize: '1.125rem', display: 'block', lineHeight: '1.2' }}>MindMate</Link>
                        {profile && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hello, {profile.name}</span>}
                    </div>
                </div>

                <nav className="nav-links">
                    <Link to="/chat" className={`nav-link ${isActive('/chat')}`}>Chat</Link>
                    <Link to="/mood" className={`nav-link ${isActive('/mood')}`}>Mood</Link>
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
                    <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>Profile</Link>
                    <button onClick={logout} className="btn btn-secondary btn-sm">Logout</button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
