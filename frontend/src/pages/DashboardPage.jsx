import React, { useState, useEffect, useMemo } from 'react';
import { moodAPI } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Smile, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/dashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const DashboardPage = () => {
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchMoods = async () => {
            try {
                // Fetching last 50 moods to get a good history
                const response = await moodAPI.getMoodWeek(userId);
                setMoods(response.data.moods || []);
            } catch (error) {
                console.error('Error fetching mood history', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMoods();
    }, [userId]);

    // Calculate Statistics
    const stats = useMemo(() => {
        if (!moods.length) return { avg: 0, total: 0, trend: 0 };

        const total = moods.length;
        const sum = moods.reduce((acc, curr) => acc + (curr.mood_score || 0), 0);
        const avg = (sum / total).toFixed(1);

        // Simple trend: Compare avg of last 3 vs avg of previous 3
        const sorted = [...moods].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const recent = sorted.slice(-3);
        const previous = sorted.slice(-6, -3);

        const recentAvg = recent.length ? recent.reduce((a, c) => a + c.mood_score, 0) / recent.length : 0;
        const prevAvg = previous.length ? previous.reduce((a, c) => a + c.mood_score, 0) / previous.length : recentAvg;

        const trend = (recentAvg - prevAvg).toFixed(1);

        return { avg, total, trend };
    }, [moods]);

    // Chart Data
    const chartData = useMemo(() => {
        // Group by Date for the chart (Avg per day)
        const days = {};
        // Sort by date ascending
        const sorted = [...moods].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        sorted.forEach(m => {
            const date = new Date(m.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
            if (!days[date]) days[date] = [];
            days[date].push(m.mood_score);
        });

        const labels = Object.keys(days).slice(-7); // Last 7 days with data
        const dataPoints = labels.map(date => {
            const scores = days[date];
            return scores.reduce((a, b) => a + b, 0) / scores.length;
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Average Mood',
                    data: dataPoints,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#6366f1',
                    pointBorderWidth: 2,
                }
            ]
        };
    }, [moods]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#1e293b',
                bodyColor: '#1e293b',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
            }
        },
        scales: {
            y: {
                min: 0,
                max: 6, // 1-5 scale
                grid: { display: true, color: '#f1f5f9' },
                ticks: { stepSize: 1 }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    // Insights Generation (Mocked logic based on reference)
    const getInsights = () => {
        const insights = [];
        if (stats.avg >= 4) {
            insights.push({ icon: '🌟', text: "You're doing great! Your mood has been consistently positive." });
        } else if (stats.avg < 3 && stats.total > 0) {
            insights.push({ icon: '💙', text: "It seems like a tough week. Remember to take time for self-care." });
        }

        if (stats.trend > 0) {
            insights.push({ icon: '📈', text: "Your mood is trending upwards! Keep up the good habits." });
        }

        if (stats.total > 5) {
            insights.push({ icon: '✅', text: "Great consistency in logging your mood. Self-awareness is key!" });
        }

        return insights;
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading dashboard...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2 className="dashboard-title">Your Wellness Journey</h2>
                <p className="dashboard-subtitle">Track your emotional patterns and insights</p>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
                    <div className="stat-icon blue">
                        <Smile size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="label">Average Mood</div>
                        <div className="value">{stats.avg || '-'} <span style={{ fontSize: '1rem' }}> / 5</span></div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
                    <div className="stat-icon green">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <div className="label">Total Entries</div>
                        <div className="value">{stats.total}</div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
                    <div className="stat-icon orange">
                        {stats.trend >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                    <div className="stat-info">
                        <div className="label">Recent Trend</div>
                        <div className="value">
                            {stats.trend > 0 ? '+' : ''}{stats.trend}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Chart */}
            <motion.div initial={{ opacity: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="chart-section">
                <h3 className="section-title">Mood Trends (Last 7 Active Days)</h3>
                {moods.length > 0 ? (
                    <div style={{ height: '300px' }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No mood data yet. Start tracking to see trends.</p>
                )}
            </motion.div>

            {/* Insights and Heatmap Side-by-Side (or stacked on mobile) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Insights */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="chart-section">
                    <h3 className="section-title">Personalized Insights</h3>
                    {getInsights().length > 0 ? (
                        <div className="insights-list">
                            {getInsights().map((insight, idx) => (
                                <div key={idx} className="insight-card">
                                    <div className="insight-icon">{insight.icon}</div>
                                    <div className="insight-text">{insight.text}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>Log more entries to get personalized insights.</p>
                    )}
                </motion.div>

                {/* Heatmap (Visual only for now) */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="chart-section">
                    <h3 className="section-title">Mood Calendar (Recent)</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Your mood intensity over recent entries</p>
                    <div className="heatmap-grid">
                        {moods.slice(-30).map((m, idx) => (
                            <div
                                key={idx}
                                className="heatmap-day"
                                data-mood={Math.round(m.mood_score)}
                                title={`${new Date(m.timestamp).toLocaleDateString()}: Mood ${m.mood_score}`}
                            ></div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default DashboardPage;
