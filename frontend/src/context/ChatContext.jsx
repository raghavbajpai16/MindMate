import React, { createContext, useState, useContext } from 'react';
import { chatAPI } from '../services/api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([
        { id: 1, type: 'ai', content: "Hey there! I'm MindMate. I'm here to listen and support you. How are you feeling today?", timestamp: new Date().toISOString() }
    ]);
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState('groq');

    const sendMessage = async (userId, text) => {
        // Add user message immediately
        const userMsg = { id: Date.now(), type: 'user', content: text, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const response = await chatAPI.sendMessage(userId, text, model);
            const aiMsg = {
                id: Date.now() + 1,
                type: 'ai',
                content: response.data.response,
                timestamp: response.data.timestamp,
                isCrisis: response.data.is_crisis,
                helplines: response.data.helplines
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg = { id: Date.now() + 1, type: 'ai', content: "I'm having trouble connecting right now. Please try again.", timestamp: new Date().toISOString() };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ChatContext.Provider value={{ messages, loading, sendMessage, model, setModel }}>
            {children}
        </ChatContext.Provider>
    );
};
