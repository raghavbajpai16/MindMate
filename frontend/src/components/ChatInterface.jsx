import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import LoadingSpinner from './LoadingSpinner';

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
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        sendMessage(userId, input);
        setInput('');
    };

    return (
        <div className="chat-container">
            <div className="chat-header" style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Chat Session</h3>
                <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="input-field"
                    style={{ width: 'auto', padding: '0.5rem' }}
                >
                    <option value="groq">Groq (Fastest)</option>
                    <option value="gemini">Gemini (Smartest)</option>
                    <option value="chatgpt">ChatGPT (Balanced)</option>
                </select>
            </div>

            <div className="messages-area">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-bubble message-${msg.type}`}>
                        <div className="message-content">{msg.content}</div>

                        {msg.isCrisis && (
                            <div className="crisis-alert">
                                <strong>⚠️ Crisis Support Resources</strong>
                                <ul className="helpline-list">
                                    {Object.entries(msg.helplines || {}).map(([name, number]) => (
                                        <li key={name}>{name}: <a href={`tel:${number}`}>{number}</a></li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="message-time">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message-bubble message-ai">
                        <LoadingSpinner size="small" />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                    disabled={loading}
                />
                <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
