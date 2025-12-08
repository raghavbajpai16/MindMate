import React, { useState, useEffect } from 'react';
import MoodChart from '../components/MoodChart';
import { moodAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
    const [weekData, setWeekData] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const response = await moodAPI.getMoodWeek(userId);
            setWeekData(response.data.week_data);
            setStats(response.data.statistics);
        } catch (error) {
            console.error("Error loading dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-4"><LoadingSpinner /></div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
            <h2 className="mb-4">Your Wellness Dashboard</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card text-center">
                    <h4 className="text-muted">Weekly Average</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats?.weekly_average || 0}/5</div>
                </div>
                <div className="card text-center">
                    <h4 className="text-muted">Total Entries</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.total_entries || 0}</div>
                </div>
                <div className="card text-center">
                    <h4 className="text-muted">Best Day</h4>
                    <div style={{ fontSize: '1.25rem', fontWeight: '500' }}>{stats?.best_day || 'N/A'}</div>
                </div>
                <div className="card text-center">
                    <h4 className="text-muted">Toughest Day</h4>
                    <div style={{ fontSize: '1.25rem', fontWeight: '500' }}>{stats?.worst_day || 'N/A'}</div>
                </div>
            </div>

            <div className="card">
                <MoodChart data={weekData} />
            </div>
        </div>
    );
};

export default DashboardPage;
