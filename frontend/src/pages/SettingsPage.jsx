import React from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const SettingsPage = () => {
    const { logout } = useAuth();
    const userId = localStorage.getItem('user_id');

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                await userAPI.deleteAccount(userId);
                logout();
            } catch (error) {
                alert("Failed to delete account.");
            }
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="card">
                <h2 className="mb-4">Settings</h2>

                <div className="mb-4">
                    <h3>Account Actions</h3>
                    <p className="text-muted mb-4">Manage your account and session.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button onClick={logout} className="btn btn-secondary" style={{ width: '100%' }}>
                            Log Out
                        </button>

                        <button onClick={handleDeleteAccount} className="btn" style={{ width: '100%', backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                            Delete Account
                        </button>
                    </div>
                </div>

                <div>
                    <h3>About MindMate</h3>
                    <p className="text-muted mt-2">
                        MindMate is an AI-powered mental wellness companion designed to support college students.
                        <br /><br />
                        Version: 1.0.0 (MVP)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
