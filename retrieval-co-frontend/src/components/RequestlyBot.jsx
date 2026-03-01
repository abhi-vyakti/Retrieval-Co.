import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RequestlyBot() {
    const { token, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', content: "Hey! I'm your campus AI assistant. I can help you find lost items, suggest lenders, or check current matches. What do you need?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input.trim() };
        const newMessages = [...messages, userMsg];

        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const context = user ? {
                userName: user.name,
                userKarma: user.karma
            } : null;

            const res = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers,
                body: JSON.stringify({ messages: newMessages, context })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to get response');
            setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'model',
                content: "I'm having trouble connecting right now. Please try again later."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[400] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div
                    className="w-[360px] bg-card border border-border rounded-[18px] overflow-hidden mb-4 flex flex-col"
                    style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.5)', animation: 'fadeUp 0.3s ease' }}
                >
                    {/* Header */}
                    <div className="px-5 py-4 bg-surface border-b border-border flex items-center gap-3">
                        <div
                            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-base"
                            style={{ background: 'linear-gradient(135deg, #00c9c8, #008f8e)' }}
                        >
                            🤖
                        </div>
                        <div className="flex-1">
                            <h4 className="text-[0.9rem] font-bold">Retrieval Assistant</h4>
                            <p className="text-[0.75rem] text-green">● Online</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text transition-colors cursor-pointer bg-transparent border-none">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 flex flex-col gap-3 h-[260px] overflow-y-auto">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`max-w-[80%] text-[0.875rem] leading-[1.5] px-3.5 py-2.5 ${msg.role === 'user'
                                        ? 'bg-[rgba(0,201,200,0.15)] rounded-[14px_4px_14px_14px] self-end text-amber'
                                        : 'bg-surface rounded-[4px_14px_14px_14px] self-start text-text'
                                    }`}
                            >
                                {msg.content.split('**').map((text, i) => i % 2 === 1 ? <strong key={i}>{text}</strong> : text)}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bg-surface rounded-[4px_14px_14px_14px] self-start px-3.5 py-2.5 flex items-center gap-2">
                                <Loader2 size={14} className="animate-spin text-amber" />
                                <span className="text-xs text-text-muted">Typing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex gap-2 px-4 py-3.5 border-t border-border">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
                            placeholder="Ask me anything…"
                            className="flex-1 bg-surface border border-border rounded-[8px] px-3 py-2.5 text-text font-body text-[0.88rem] outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="bg-amber border-none rounded-[8px] px-3.5 py-2.5 cursor-pointer text-base transition-colors hover:bg-[#00e5e4] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-[58px] h-[58px] rounded-full bg-amber border-none flex items-center justify-center cursor-pointer text-[1.4rem] transition-all hover:scale-[1.08]"
                style={{ boxShadow: '0 4px 24px rgba(0,201,200,0.4)' }}
            >
                {isOpen ? <X size={24} className="text-ink" /> : '🤖'}
            </button>
        </div>
    );
}
