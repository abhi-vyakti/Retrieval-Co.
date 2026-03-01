import React from 'react';
import { MapPin, Clock, MessageSquare, AlertCircle, PackageSearch, PackageCheck, Repeat, QrCode } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';

export default function PostCard({ post, onReply, isAuthor = false, onStatusUpdate, onQRReturn }) {
    if (!post) return null;

    const getTypeIcon = () => {
        switch (post.type) {
            case 'lost': return <PackageSearch size={15} className="text-red" />;
            case 'found': return <PackageCheck size={15} className="text-green" />;
            case 'borrow': return <Repeat size={15} className="text-blue" />;
            default: return <PackageSearch size={15} />;
        }
    };

    const timeAgo = new Date(post.createdAt || post.datetime).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric'
    });

    return (
        <div className={`bg-card border ${post.isUrgent ? 'border-l-[3px] border-l-red border-border' : 'border-border'} rounded-[var(--radius)] p-[22px] transition-all duration-200 hover:border-[rgba(0,201,200,0.3)] hover:-translate-y-0.5 flex flex-col h-full relative overflow-hidden group`}>

            {/* Header */}
            <div className="flex justify-between items-start mb-3.5">
                <div className="flex gap-1.5 flex-wrap">
                    <Badge type={post.type} />
                    <Badge type={post.status || 'open'} />
                    {post.isUrgent && <Badge type="urgent" />}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-[1.05rem] font-bold mb-1.5 line-clamp-1">{post.title}</h3>

            {/* Meta */}
            <div className="flex gap-3.5 text-text-muted text-[0.82rem] mb-3">
                <span className="flex items-center gap-1">📍 {post.location}</span>
                <span className="flex items-center gap-1">🕐 {timeAgo}</span>
                <span className="flex items-center gap-1">💬 {post.replies?.length || 0}</span>
            </div>

            {/* Image */}
            {post.imageUrl && (
                <div className="w-full h-36 mb-3 rounded-lg overflow-hidden bg-surface">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
            )}

            {/* Description */}
            <p className="text-text-muted text-[0.88rem] line-clamp-2 mb-4 flex-grow leading-[1.6]">
                {post.description}
            </p>

            {/* AI Match Banner */}
            {post.aiMatch && (
                <div className="bg-[rgba(96,165,250,0.1)] border border-[rgba(96,165,250,0.2)] rounded-[8px] px-3 py-2 text-[0.8rem] text-blue mb-3.5 flex items-center gap-2">
                    🤖 AI found a potential match — <strong>view match</strong>
                </div>
            )}

            {/* Default User Actions */}
            {!isAuthor && (
                <div className="flex gap-2 mt-auto">
                    <button
                        className="flex-1 py-[9px] rounded-[8px] text-[0.85rem] font-semibold cursor-pointer border-none transition-all bg-[rgba(0,201,200,0.12)] text-amber hover:bg-[rgba(0,201,200,0.2)]"
                        onClick={() => onReply?.(post)}
                    >
                        Reply
                    </button>
                    {onQRReturn && (
                        <button
                            className="flex-1 py-[9px] rounded-[8px] text-[0.85rem] font-semibold cursor-pointer transition-all bg-surface text-text border border-border hover:border-text-muted"
                            onClick={() => onQRReturn(post)}
                        >
                            <QrCode size={14} className="inline mr-1" /> QR
                        </button>
                    )}
                    <button
                        className="flex-1 py-[9px] rounded-[8px] text-[0.85rem] font-semibold cursor-pointer transition-all bg-surface text-text border border-border hover:border-text-muted"
                        onClick={() => { }}
                    >
                        Contact
                    </button>
                </div>
            )}

            {/* Author Lifecycle Actions */}
            {isAuthor && post.status !== 'closed' && post.status !== 'returned' && post.status !== 'expired' && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
                    {onQRReturn && (
                        <Button variant="ghost" onClick={() => onQRReturn(post)} className="flex-1 !text-[11px] !px-2 !py-1.5">
                            <QrCode size={13} className="mr-1 inline" /> Secure QR
                        </Button>
                    )}
                    <Button variant="primary" onClick={() => onStatusUpdate?.(post._id, 'returned')} className="flex-1 !text-[11px] !px-2 !py-1.5">
                        Manual Mark
                    </Button>
                    <Button variant="ghost" onClick={() => onStatusUpdate?.(post._id, 'closed')} className="flex-1 !text-[11px] !px-2 !py-1.5 !text-red hover:!border-red">
                        Close Post
                    </Button>
                    {!post.isUrgent && post.type !== 'found' && (
                        <Button variant="ghost" onClick={() => onStatusUpdate?.(post._id, post.status, true)} className="w-full mt-1 !text-[11px] !px-2 !py-1.5 !text-red !border-[rgba(240,82,82,0.3)]">
                            <AlertCircle size={13} className="mr-1 inline" /> Re-mark as URGENT
                        </Button>
                    )}
                </div>
            )}

            {/* View Replies for closed posts */}
            {isAuthor && ['closed', 'returned', 'expired'].includes(post.status) && (
                <div className="flex justify-end mt-3 pt-3 border-t border-border">
                    <Button variant="ghost" onClick={() => onReply?.(post)} className="!px-3 !py-1.5 text-[11px]">
                        <MessageSquare size={13} className="mr-1" /> View Replies
                    </Button>
                </div>
            )}
        </div>
    );
}
