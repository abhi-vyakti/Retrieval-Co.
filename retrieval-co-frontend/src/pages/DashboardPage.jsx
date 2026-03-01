import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import PostCardSkeleton from '../components/PostCardSkeleton';
import PostReplyModal from '../components/PostReplyModal';
import Button from '../components/Button';
import QRReturnModal from '../components/QRReturnModal';
import { Search, Filter, AlertCircle, PackageSearch, Plus, UserSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('lost_found');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [selectedQRPost, setSelectedQRPost] = useState(null);

    // Reply Modal State
    const [selectedPost, setSelectedPost] = useState(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const handleQRReturn = (post) => {
        setSelectedQRPost(post);
        setIsQRModalOpen(true);
    };

    const handleReply = (post) => {
        setSelectedPost(post);
        setIsReplyModalOpen(true);
        setIsMinimized(false);
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            let url = `http://localhost:5000/api/posts?`;

            if (activeTab === 'borrow') {
                url += `type=borrow&`;
            }
            if (categoryFilter !== 'All') url += `category=${categoryFilter}&`;
            if (searchTerm) url += `search=${searchTerm}&`;

            const res = await fetch(url, { headers });
            const data = await res.json();

            if (res.ok) {
                let fetchedPosts = data.posts;
                if (activeTab === 'lost_found') {
                    fetchedPosts = fetchedPosts.filter(p => p.type === 'lost' || p.type === 'found');
                }
                setPosts(fetchedPosts);
            } else {
                toast.error('Could not load campus posts. Please try again.');
            }
        } catch (error) {
            console.error('Failed to fetch posts', error);
            toast.error('Network error loading posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [activeTab, categoryFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPosts();
    };

    const categories = ['All', 'Electronics', 'Stationery', 'ID Cards', 'Books', 'Clothing', 'Lab Equipment', 'Others'];

    return (
        <div className="min-h-screen bg-ink pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-text mb-1">Campus Dashboard</h1>
                    <p className="text-text-muted text-[14px]">Find what you lost, return what you found, or borrow what you need.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link to="/my-posts" className="btn-ghost flex items-center gap-2 no-underline">
                        <UserSquare size={16} />
                        <span className="hidden sm:inline">My Posts</span>
                    </Link>
                    <Link to="/create" className="bg-amber text-ink border-none rounded-[10px] px-6 py-3 font-display font-bold text-[0.95rem] cursor-pointer transition-all hover:bg-[#00e5e4] hover:-translate-y-[1px] flex items-center gap-2 no-underline">
                        ＋ New Post
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-card rounded-[10px] mb-6 w-fit">
                <button
                    onClick={() => setActiveTab('lost_found')}
                    className={`px-5 py-2 rounded-[8px] text-[0.9rem] font-semibold transition-all cursor-pointer border-none ${activeTab === 'lost_found' ? 'bg-surface text-text' : 'text-text-muted bg-transparent hover:text-text'}`}
                >
                    🔴 Lost & Found
                </button>
                <button
                    onClick={() => setActiveTab('borrow')}
                    className={`px-5 py-2 rounded-[8px] text-[0.9rem] font-semibold transition-all cursor-pointer border-none ${activeTab === 'borrow' ? 'bg-surface text-text' : 'text-text-muted bg-transparent hover:text-text'}`}
                >
                    🔵 Borrow
                </button>
                <Link to="/hotspots" className="px-5 py-2 rounded-[8px] text-[0.9rem] flex items-center gap-1.5 font-semibold text-text-muted hover:text-text transition-colors no-underline">
                    📍 Hotspots
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-3 mb-7 flex-wrap items-center">
                <div className="relative flex-1 min-w-[220px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-base pointer-events-none">🔍</span>
                    <input
                        type="text"
                        placeholder="Search items, locations…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchPosts()}
                        className="form-input !pl-[38px]"
                    />
                </div>
                <select
                    className="bg-card border border-border rounded-[8px] px-3.5 py-2.5 text-text font-body text-[0.9rem] cursor-pointer outline-none"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                    ))}
                </select>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <PostCardSkeleton key={i} />
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card rounded-[var(--radius-xl)] border border-border border-dashed text-center">
                    <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-5">
                        <PackageSearch className="text-text-muted" size={36} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-text mb-2">No items found</h3>
                    <p className="text-text-muted text-[13px] max-w-sm mb-6">We couldn't find any posts matching your filters. Try adjusting them or create a new post.</p>
                    <Button variant="ghost" onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}>Clear Filters</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {posts.map(post => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onReply={handleReply}
                            onQRReturn={handleQRReturn}
                        />
                    ))}
                </div>
            )}

            {/* QR Return Modal */}
            <QRReturnModal
                isOpen={isQRModalOpen}
                onClose={() => {
                    setIsQRModalOpen(false);
                    setSelectedQRPost(null);
                }}
                post={selectedQRPost}
                isOwner={false}
                onSuccessCallback={() => {
                    setIsQRModalOpen(false);
                    fetchPosts();
                }}
            />

            {/* Post Reply Modal */}
            <PostReplyModal
                post={selectedPost}
                isOpen={isReplyModalOpen}
                onClose={() => {
                    setIsReplyModalOpen(false);
                    setSelectedPost(null);
                    setIsMinimized(false);
                }}
                isMinimized={isMinimized}
                onToggleMinimize={() => setIsMinimized(prev => !prev)}
            />
        </div>
    );
}
