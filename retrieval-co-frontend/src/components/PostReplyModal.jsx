import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize2, MapPin, Clock, PackageSearch, PackageCheck, Repeat, MessageSquare, User, QrCode, AlertCircle, Folder } from 'lucide-react';
import Badge from './Badge';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/api';

export default function PostReplyModal({ post, isOpen, onClose, isMinimized, onToggleMinimize, onQRReturn, onStatusUpdate }) {
    const { user: currentUser } = useAuth();
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
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 300);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, isMinimized]);

    if (!post || !isOpen) return null;

    const isAuthor = post.author?.id === currentUser?.id || post.author?._id === currentUser?.id || post.author?.collegeId === currentUser?.code;

    const getTypeIcon = () => {
        switch (post.type) {
            case 'lost': return <PackageSearch size={15} className="text-danger" />;
            case 'found': return <PackageCheck size={15} className="text-success" />;
            case 'borrow': return <Repeat size={15} className="text-primary-dim" />;
            default: return <PackageSearch size={15} />;
        }
    };

    const getTypeBadgeClass = () => {
        switch (post.type) {
            case 'lost': return 'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-danger/10 text-danger border border-danger/15';
            case 'found': return 'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/15';
            case 'borrow': return 'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary-dim/10 text-primary-dim border border-primary-dim/15';
            default: return 'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-text-muted';
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

    // --- Minimized Bottom Floating Chip ---
    if (isMinimized) {
        return (
            <button
                onClick={onToggleMinimize}
                className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 bg-card border border-border hover:border-zinc-500 rounded-full pl-3 pr-4 py-2.5 shadow-lg transition-all duration-200 hover:scale-103 cursor-pointer focus-visible:outline-none"
            >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare size={14} className="text-primary" />
                </div>
                <div className="text-left">
                    <p className="text-[12px] font-medium text-text line-clamp-1 max-w-[140px]">{post.title}</p>
                    <p className="text-[10px] text-text-muted">{localReplies.length} replies</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-1"></div>
            </button>
        );
    }

    // --- Full Chat Modal Popup ---
    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" onClick={onClose}>
            {/* Dark Backdrop overlay */}
            <div className="absolute inset-0 bg-black/25 animate-in fade-in duration-200"></div>

            {/* Main Modal Layout Panel */}
            <div
                className="relative w-full max-w-4xl h-[80vh] md:h-[75vh] bg-surface border border-border rounded-xl shadow-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Title Header */}
                <div className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-surface">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg">
                            {getTypeIcon()}
                        </div>
                        <div>
                            <h2 className="text-[15px] font-display font-extrabold text-text line-clamp-1">{post.title}</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={getTypeBadgeClass()}>
                                    {post.type}
                                </span>
                                <Badge type={post.status || 'open'} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer border-none bg-transparent"
                            title="Close Chat"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>

                {/* Split Responsive Body (Left: Post context summary, Right: Active chat) */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-0">
                    
                    {/* Left Pane: Post Details Summary Context (Hidden on mobile for layout speed) */}
                    <div className="hidden md:flex md:col-span-4 flex-col border-r border-border p-5 overflow-y-auto gap-4 bg-surface">
                        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Item Details</h4>
                        
                        {post.imageUrl && (
                            <div className="w-full h-36 rounded-lg overflow-hidden bg-surface border border-border shrink-0">
                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <p className="text-text-muted text-[13px] leading-relaxed">
                            {post.description}
                        </p>

                        <div className="flex flex-col gap-2 mt-auto border-t border-border pt-4 text-xs text-text-muted">
                            <span className="flex items-center gap-1.5"><MapPin size={13} className="text-text-muted shrink-0" /> {post.location}</span>
                            <span className="flex items-center gap-1.5"><Clock size={13} className="text-text-muted shrink-0" /> {timeAgo}</span>
                            <span className="flex items-center gap-1.5"><Folder size={13} className="text-text-muted shrink-0" /> Category: {post.category || 'Others'}</span>
                        </div>

                        {/* Case Action Buttons */}
                        <div className="flex flex-col gap-2 mt-4 border-t border-border pt-4 shrink-0">
                            {/* Author Actions */}
                            {isAuthor && post.status !== 'closed' && post.status !== 'returned' && post.status !== 'expired' && (
                                <>
                                    <button 
                                        onClick={() => {
                                            if (onQRReturn && post.type !== 'borrow') {
                                                onQRReturn(post);
                                            } else {
                                                onStatusUpdate?.(post._id, 'returned');
                                                onClose();
                                            }
                                        }} 
                                        className="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all bg-primary hover:scale-[1.01] active:scale-[0.98] text-white border border-transparent cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none"
                                    >
                                        {post.type !== 'borrow' && <QrCode size={13} />}
                                        Mark Returned
                                    </button>
                                    <button 
                                        onClick={() => {
                                            onStatusUpdate?.(post._id, 'closed');
                                            onClose();
                                        }} 
                                        className="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all bg-transparent hover:bg-danger/10 text-danger border border-danger/20 hover:border-danger/30 cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none"
                                    >
                                        Close Post
                                    </button>
                                    {!post.isUrgent && post.type === 'borrow' && (
                                        <button 
                                            onClick={() => {
                                                onStatusUpdate?.(post._id, post.status, true);
                                                onClose();
                                            }} 
                                            className="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all bg-transparent hover:bg-danger/5 text-danger border border-danger/20 cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none"
                                        >
                                            <AlertCircle size={13} /> Flag as URGENT
                                        </button>
                                    )}
                                </>
                            )}

                            {/* Finder Actions (Non-Author) */}
                            {!isAuthor && post.status !== 'closed' && post.status !== 'returned' && post.status !== 'expired' && (
                                <>
                                    {onQRReturn && post.type !== 'borrow' && (
                                        <button 
                                            onClick={() => onQRReturn(post)} 
                                            className="w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all bg-primary hover:scale-[1.01] active:scale-[0.98] text-white border border-transparent cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none"
                                        >
                                            <QrCode size={14} /> Return to Owner
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Pane: Chat Window & Input (Full width) */}
                    <div className="col-span-12 md:col-span-8 flex flex-col min-h-0 bg-surface">
                        
                        {/* Messages Thread Feed */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-2">
                                <MessageSquare size={12} /> Discussion Thread ({localReplies.length} Messages)
                            </h3>

                            {localReplies.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-3">
                                        💬
                                    </div>
                                    <p className="text-[13px] text-text-muted">No messages in this chat. Start the conversation!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {localReplies.map((reply, idx) => {
                                        const isCurrentUser = reply.user?._id === currentUser?.id || reply.user?.collegeId === currentUser?.code;
                                        const isPostAuthor = reply.user?._id === post.author?._id || reply.user?.collegeId === post.author?.collegeId;
                                        const initials = reply.user?.name
                                            ? reply.user.name.split(' ')
                                                .map(n => n[0])
                                                .filter(c => /[a-zA-Z]/.test(c))
                                                .slice(0, 2)
                                                .join('')
                                                .toUpperCase()
                                            : 'U';

                                        return (
                                            <div 
                                                key={reply._id || idx} 
                                                className={`flex items-start gap-2.5 ${isCurrentUser ? 'flex-row-reverse' : ''} animate-in fade-in duration-150`}
                                            >
                                                {/* User Avatar */}
                                                {isCurrentUser ? (
                                                    <Link
                                                        to="/my-posts"
                                                        className="w-7 h-7 rounded-full flex items-center justify-center font-display font-extrabold text-[10px] text-white shrink-0 mt-0.5 no-underline hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                                                        style={{ background: isPostAuthor ? 'linear-gradient(135deg, var(--primary), var(--primary-dim))' : 'linear-gradient(135deg, var(--border), var(--text-muted))' }}
                                                        title="My Profile"
                                                    >
                                                        {initials}
                                                    </Link>
                                                ) : (
                                                    <div 
                                                        className="w-7 h-7 rounded-full flex items-center justify-center font-display font-extrabold text-[10px] text-white shrink-0 mt-0.5"
                                                        style={{ background: isPostAuthor ? 'linear-gradient(135deg, var(--primary), var(--primary-dim))' : 'linear-gradient(135deg, var(--border), var(--text-muted))' }}
                                                    >
                                                        {initials}
                                                    </div>
                                                )}

                                                {/* Chat Bubble Box */}
                                                <div className={`max-w-[75%] flex flex-col gap-1 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                                    {/* Sender Row metadata (Only for other users) */}
                                                    {!isCurrentUser && (
                                                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted mb-0.5">
                                                            <span className="font-semibold text-text">{reply.user?.name || 'Classmate'}</span>
                                                            {isPostAuthor && (
                                                                <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 font-bold uppercase text-[8.5px] tracking-wider scale-90">
                                                                    OP
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Actual bubble */}
                                                    <div className={`p-3 rounded-xl border text-[13px] leading-relaxed ${
                                                        isCurrentUser 
                                                            ? 'bg-primary text-white border-primary rounded-tr-none' 
                                                            : 'bg-surface border-border text-text rounded-tl-none'
                                                    }`}>
                                                        {reply.text}
                                                    </div>

                                                    {/* Timestamp Row (Shown below the bubble) */}
                                                    <div className={`text-[9.5px] text-text-muted mt-0.5 px-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                                        {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={repliesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Send Message Input Container */}
                        <div className="p-4 border-t border-border bg-surface shrink-0">
                            <div className="flex gap-2 items-center">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Reply to this thread..."
                                    className="form-input text-xs flex-grow"
                                    disabled={sending}
                                />
                                <button
                                    onClick={handleSendReply}
                                    disabled={!replyText.trim() || sending}
                                    className="p-2.5 bg-primary hover:scale-102 active:scale-98 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white rounded-lg transition-all shrink-0 cursor-pointer border-none focus-visible:outline-none"
                                >
                                    <Send size={14} className={sending ? 'animate-pulse' : ''} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

