import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await userAPI.getProfile(userId);
            setProfile(response.data);
            setFormData(response.data);
        } catch (error) {
            console.error("Error loading profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await userAPI.updateProfile(userId, formData);
            setProfile(formData);
            setEditing(false);
        } catch (error) {
            console.error("Error updating profile", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) return <div className="text-center mt-4"><LoadingSpinner /></div>;

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>My Profile</h2>
                    {!editing ? (
                        <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm">Edit Profile</button>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => setEditing(false)} className="btn btn-secondary btn-sm">Cancel</button>
                            <button onClick={handleSave} className="btn btn-primary btn-sm">Save</button>
                        </div>
                    )}
                </div>

                <div className="input-group">
                    <label className="input-label">Name</label>
                    <div className="input-field" style={{ background: '#F9FAFB' }}>{profile?.name}</div>
                </div>

                <div className="input-group">
                    <label className="input-label">Email</label>
                    <div className="input-field" style={{ background: '#F9FAFB' }}>{profile?.email}</div>
                </div>

                <div className="input-group">
                    <label className="input-label">Bio</label>
                    {editing ? (
                        <textarea
                            className="input-field"
                            value={formData.bio || ''}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows="3"
                        />
                    ) : (
                        <div className="input-field" style={{ background: '#F9FAFB', minHeight: '80px' }}>{profile?.bio || 'No bio yet.'}</div>
                    )}
                </div>

                <div className="input-group">
                    <label className="input-label">Emergency Contact</label>
                    {editing ? (
                        <input
                            type="text"
                            className="input-field"
                            value={formData.emergency_contact || ''}
                            onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                            placeholder="+91-XXXXXXXXXX"
                        />
                    ) : (
                        <div className="input-field" style={{ background: '#F9FAFB' }}>{profile?.emergency_contact || 'Not set'}</div>
                    )}
                </div>

                <div className="input-group">
                    <label className="input-label">Preferred AI Model</label>
                    {editing ? (
                        <select
                            className="input-field"
                            value={formData.preferred_model || 'groq'}
                            onChange={(e) => setFormData({ ...formData, preferred_model: e.target.value })}
                        >
                            <option value="groq">Groq</option>
                            <option value="gemini">Gemini</option>
                            <option value="chatgpt">ChatGPT</option>
                        </select>
                    ) : (
                        <div className="input-field" style={{ background: '#F9FAFB', textTransform: 'capitalize' }}>{profile?.preferred_model || 'Groq'}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
