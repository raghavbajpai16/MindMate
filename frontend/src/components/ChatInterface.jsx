import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import '../styles/chat.css';

const ChatInterface = () => {
    const { messages, sendMessage, loading, model, setModel } = useChat();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const userId = localStorage.getItem('user_id');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        sendMessage(userId, input);
        setInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    return (
        <div className="chat-container">
            {/* Header */}
            <div className="chat-header-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar bot">🌸</div>

                    <div className="chat-header-title">
                        MindMate Chat
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
                            {model === 'groq' ? 'Fast' : model === 'gemini' ? 'Smart' : 'Balanced'}
                        </span>
                    </div>
                </div>

                <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    style={{
                        border: '1px solid var(--border)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        outline: 'none',
                        background: 'var(--surface)',
                        color: 'var(--text-main)'
                    }}
                >
                    <option value="groq">Groq (Llama 3)</option>
                    <option value="gemini">Gemini Pro</option>
                    <option value="chatgpt">ChatGPT</option>
                </select>
            </div>

            {/* Messages Area */}
            <div className="messages-area">
                {messages.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon-circle">✨</div>
                        <h3 style={{ margin: '0.5rem 0', color: 'var(--text-main)' }}>Start your conversation</h3>
                        <p>I'm here to listen and support you without judgment.</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`message-wrapper ${msg.type === 'ai' ? 'bot' : 'user'}`}>
                        {msg.type === 'ai' && <div className="avatar bot">🌸</div>}

                        <div className="message-bubble">
                            <div className="message-content">{msg.content}</div>

                            {msg.isCrisis && (
                                <div className="crisis-alert-bubble">
                                    <strong>❤️ Crisis Support Available</strong>
                                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                                        <li>National Helpline: <a href="tel:988" className="helpline-link">988</a></li>
                                        <li>Emergency: <a href="tel:911" className="helpline-link">911</a></li>
                                    </ul>
                                </div>
                            )}

                            <div className={`message-time ${msg.type === 'user' ? 'text-white' : ''}`} style={{ color: msg.type === 'user' ? 'rgba(255,255,255,0.8)' : '' }}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="message-wrapper bot">
                        <div className="avatar bot">🌸</div>
                        <div className="message-bubble">
                            <div className="typing-dots">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-container">
                <form onSubmit={handleSubmit} className="chat-input-wrapper">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Share your thoughts..."
                        className="chat-input-field"
                        disabled={loading}
                    />
                    <button type="submit" className="send-button" disabled={loading || !input.trim()}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
