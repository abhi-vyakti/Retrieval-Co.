import React from 'react';
import { MapPin, Clock, MessageSquare, AlertCircle, PackageSearch, PackageCheck, Repeat, QrCode, Sparkles } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';

export default function PostCard({ post, onReply, isAuthor = false, onStatusUpdate, onQRReturn }) {
    if (!post) return null;

    const timeAgo = new Date(post.createdAt || post.datetime).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric'
    });

    // Unread replies tracking logic via localStorage
    const readKey = `read_replies_${post._id}`;
    const readCount = Number(localStorage.getItem(readKey) || 0);
    const repliesLength = post.replies?.length || 0;
    const hasUnread = repliesLength > readCount;

    const handleReplyClick = () => {
        if (post.replies) {
            localStorage.setItem(readKey, repliesLength.toString());
        }
        onReply?.(post);
    };

    // Solid badge class based on type
    const getTypeBadge = () => {
        switch (post.type) {
            case 'lost':
                return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-danger text-white">Lost</span>;
            case 'found':
                return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-success text-white">Found</span>;
            case 'borrow':
                return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-primary-dim text-white">Borrow</span>;
            default:
                return null;
        }
    };

    // Author Initials
    const authorInitials = post.author?.name
        ? post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';

    return (
        <div 
            onClick={handleReplyClick}
            className={`glass-panel rounded-lg p-5 flex flex-col h-full relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-hover group cursor-pointer ${
                post.isUrgent && post.status === 'open' && post.type === 'borrow' ? 'border-l-[3px] border-l-danger' : ''
            }`}
        >
            {/* Top Status & Badge Line */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {getTypeBadge()}
                    <Badge type={post.status || 'open'} />
                    {post.isUrgent && post.type === 'borrow' && <Badge type="urgent" />}
                </div>

                {/* Unread dot notification badge */}
                {hasUnread && !isAuthor && (
                    <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="text-[1.08rem] font-display font-bold text-text mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {post.title}
            </h3>

            {/* Image (if present) */}
            {post.imageUrl && (
                <div className="w-full h-40 mb-3.5 rounded-lg overflow-hidden bg-surface border border-border">
                    <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" 
                    />
                </div>
            )}

            {/* Description */}
            <p className="text-text-muted text-[0.88rem] leading-relaxed line-clamp-2 mb-4 flex-grow">
                {post.description}
            </p>

            {/* Meta details footer: Location • Time ago */}
            <div className="flex items-center gap-2 text-[11px] text-text-muted mb-4 border-t border-border/40 pt-3 flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={11} /> {post.location}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo}</span>
                {post.replies?.length > 0 && (
                    <>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-primary-dim"><MessageSquare size={11} /> {repliesLength} replies</span>
                    </>
                )}
            </div>

            {/* Author Profile section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center font-display font-extrabold text-[0.68rem] text-white" 
                        style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))' }}
                    >
                        {authorInitials}
                    </div>
                    <span className="text-[11px] text-text-muted font-medium">
                        {post.isAnonymous ? 'Anonymous Student' : (post.author?.name || 'Unknown User')}
                    </span>
                </div>
            </div>

            {/* AI Match Banner (if present) */}
            {post.aiMatch && (
                <div className="bg-primary-dim/5 border border-primary-dim/15 rounded-lg px-3 py-2 text-[0.8rem] text-primary-dim mt-4 flex items-center gap-1.5 animate-pulse">
                    <Sparkles size={11} className="text-primary-dim shrink-0" />
                    <span>Potential match found — <strong>View Match</strong></span>
                </div>
            )}
        </div>
    );
}

