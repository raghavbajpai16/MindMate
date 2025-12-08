import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';

// Pages
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import MoodTrackerPage from './pages/MoodTrackerPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';

// Components
import Header from './components/Header';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return (
        <>
            {isAuthenticated && <Header />}
            <main className="container">{children}</main>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <ChatProvider>
                <Router>
                    <AppLayout>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/login" element={<LoginPage />} />

                            <Route path="/profile" element={
                                <ProtectedRoute><ProfilePage /></ProtectedRoute>
                            } />
                            <Route path="/chat" element={
                                <ProtectedRoute><ChatPage /></ProtectedRoute>
                            } />
                            <Route path="/mood" element={
                                <ProtectedRoute><MoodTrackerPage /></ProtectedRoute>
                            } />
                            <Route path="/dashboard" element={
                                <ProtectedRoute><DashboardPage /></ProtectedRoute>
                            } />
                            <Route path="/settings" element={
                                <ProtectedRoute><SettingsPage /></ProtectedRoute>
                            } />
                        </Routes>
                    </AppLayout>
                </Router>
            </ChatProvider>
        </AuthProvider>
    );
}

export default App;
