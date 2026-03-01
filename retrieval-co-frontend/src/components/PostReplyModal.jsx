import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize2, MapPin, Clock, PackageSearch, PackageCheck, Repeat, MessageSquare, User } from 'lucide-react';
import Badge from './Badge';
import { API_BASE } from '../config/api';

export default function PostReplyModal({ post, isOpen, onClose, isMinimized, onToggleMinimize }) {
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [localReplies, setLocalReplies] = useState([]);
    const repliesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (post?.replies) {
            setLocalReplies(post.replies);
        }
    }, [post]);

    useEffect(() => {
        repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localReplies]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, isMinimized]);

    if (!post || !isOpen) return null;

    const getTypeIcon = () => {
        switch (post.type) {
            case 'lost': return <PackageSearch size={15} className="text-[#9d174d]" />;
            case 'found': return <PackageCheck size={15} className="text-[#15803d]" />;
            case 'borrow': return <Repeat size={15} className="text-blue" />;
            default: return <PackageSearch size={15} />;
        }
    };

    const getTypeBadgeClass = () => {
        switch (post.type) {
            case 'lost': return 'badge badge-lost';
            case 'found': return 'badge badge-found';
            case 'borrow': return 'badge badge-borrow';
            default: return 'badge';
        }
    };

    const timeAgo = new Date(post.createdAt || post.datetime).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    const handleSendReply = async () => {
        if (!replyText.trim() || sending) return;
        setSending(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/api/posts/${post._id}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ text: replyText.trim() })
            });

            const data = await res.json();

            if (res.ok && data.post?.replies) {
                setLocalReplies(data.post.replies);
                setReplyText('');
            }
        } catch (err) {
            console.error('Failed to send reply:', err);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendReply();
        }
    };

    // --- Minimized Chip ---
    if (isMinimized) {
        return (
            <button
                onClick={onToggleMinimize}
                className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 bg-surface border border-grey-200 hover:border-green rounded-full pl-3 pr-4 py-2.5 shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            >
                <div className="w-8 h-8 rounded-full bg-green-light flex items-center justify-center">
                    <MessageSquare size={14} className="text-green-dark" />
                </div>
                <div className="text-left">
                    <p className="text-[12px] font-medium text-text line-clamp-1 max-w-[140px]">{post.title}</p>
                    <p className="text-[10px] text-grey-400">{localReplies.length} replies</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green animate-pulse ml-1"></div>
            </button>
        );
    }

    // --- Full Modal ---
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"></div>

            {/* Modal Panel */}
            <div
                className="relative w-full max-w-2xl max-h-[85vh] bg-surface border border-grey-200 rounded-[var(--radius-xl)] shadow-lg flex flex-col animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-grey-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-grey-50 rounded-lg">
                            {getTypeIcon()}
                        </div>
                        <div>
                            <h2 className="text-[16px] font-display font-bold text-text line-clamp-1">{post.title}</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={getTypeBadgeClass()}>
                                    {post.type.toUpperCase()}
                                </span>
                                <Badge type={post.status || 'open'}>{(post.status || 'open').toUpperCase()}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onToggleMinimize}
                            className="p-2 rounded-lg text-grey-400 hover:text-blue hover:bg-blue-pale transition-colors"
                            title="Minimize"
                        >
                            <Minimize2 size={16} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-grey-400 hover:text-danger hover:bg-danger-bg transition-colors"
                            title="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {/* Post Preview */}
                    <div className="p-5 border-b border-grey-100">
                        {post.imageUrl && (
                            <div className="w-full max-h-72 rounded-[var(--radius)] overflow-hidden bg-grey-50 mb-4 flex items-center justify-center">
                                <img src={post.imageUrl} alt={post.title} className="w-full max-h-72 object-contain" />
                            </div>
                        )}

                        {post.description && (
                            <p className="text-text-muted text-[13px] leading-relaxed mb-4">{post.description}</p>
                        )}

                        <div className="flex flex-wrap gap-2 text-[11px] text-grey-400">
                            {post.location && (
                                <span className="flex items-center gap-1 bg-grey-50 rounded-lg px-2.5 py-1.5 border border-grey-100">
                                    <MapPin size={11} /> {post.location}
                                </span>
                            )}
                            <span className="flex items-center gap-1 bg-grey-50 rounded-lg px-2.5 py-1.5 border border-grey-100">
                                <Clock size={11} /> {timeAgo}
                            </span>
                            {post.category && (
                                <span className="bg-grey-50 rounded-lg px-2.5 py-1.5 border border-grey-100">
                                    {post.category}
                                </span>
                            )}
                        </div>

                        {post.author && !post.isAnonymous && (
                            <div className="mt-3 flex items-center gap-2 text-[11px] text-grey-400">
                                <div className="w-5 h-5 rounded-full bg-blue flex items-center justify-center text-[9px] font-bold text-white">
                                    {(post.author.name || 'U').charAt(0)}
                                </div>
                                Posted by {post.author.name || 'Unknown'}
                            </div>
                        )}
                    </div>

                    {/* Replies Section */}
                    <div className="p-5">
                        <h3 className="text-[12px] font-semibold text-grey-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <MessageSquare size={13} />
                            Replies ({localReplies.length})
                        </h3>

                        {localReplies.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 rounded-full bg-grey-50 flex items-center justify-center mx-auto mb-3">
                                    <MessageSquare size={20} className="text-grey-300" />
                                </div>
                                <p className="text-[13px] text-grey-400">No replies yet. Be the first to respond!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {localReplies.map((reply, idx) => (
                                    <div key={reply._id || idx} className="flex gap-3">
                                        <div className="w-7 h-7 rounded-full bg-blue-pale flex items-center justify-center text-[10px] font-bold text-blue shrink-0 mt-0.5">
                                            {reply.user?.name ? reply.user.name.charAt(0) : <User size={12} />}
                                        </div>
                                        <div className="flex-1 bg-grey-50 rounded-[var(--radius-sm)] rounded-tl-sm p-3 border border-grey-100">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[11px] font-semibold text-text">
                                                    {reply.user?.name || 'Anonymous'}
                                                </span>
                                                <span className="text-[10px] text-grey-400">
                                                    {new Date(reply.createdAt).toLocaleString('en-US', {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-[13px] text-text-muted leading-relaxed">{reply.text}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={repliesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Reply Input */}
                <div className="p-4 border-t border-grey-100 shrink-0 bg-grey-50 rounded-b-[var(--radius-xl)]">
                    <div className="flex items-center gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your reply..."
                            className="form-input flex-1"
                            disabled={sending}
                        />
                        <button
                            onClick={handleSendReply}
                            disabled={!replyText.trim() || sending}
                            className="p-2.5 bg-green hover:opacity-90 disabled:bg-grey-200 disabled:text-grey-400 text-white rounded-[9px] transition-all duration-200 shrink-0 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Send size={15} className={sending ? 'animate-pulse' : ''} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
