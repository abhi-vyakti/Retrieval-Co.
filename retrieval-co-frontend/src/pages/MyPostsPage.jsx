import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton";
import PostReplyModal from "../components/PostReplyModal";
import Badge from "../components/Badge";
import QRReturnModal from "../components/QRReturnModal";
import {
    Award,
    Target,
    Flame,
    PackageSearch,
    LogOut,
    ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { API_BASE } from "../config/api";

export default function MyPostsPage() {
    const { user, logout } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("active");

    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [selectedQRPost, setSelectedQRPost] = useState(null);
    const [replyModalTab, setReplyModalTab] = useState("details");

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

    useEffect(() => {
        const fetchMyPosts = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const headers = token
                    ? { Authorization: `Bearer ${token}` }
                    : {};

                const res = await fetch(`${API_BASE}/api/posts/my-posts`, {
                    headers,
                });
                const data = await res.json();

                if (res.ok) {
                    setPosts(data.posts);
                } else {
                    toast.error("Could not load your posts. Please try again.");
                }
            } catch (error) {
                console.error("Failed to fetch user posts", error);
                toast.error("Network error loading posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyPosts();

        // Listen for creations from chatbot to refresh list instantly
        window.addEventListener("post-created", fetchMyPosts);
        return () => window.removeEventListener("post-created", fetchMyPosts);
    }, []);

    useEffect(() => {
        const handleOpenPostReply = async (e) => {
            const { postId, post } = e.detail || {};
            let postToReply = post;

            // 1. Try finding in current local feed posts
            if (!postToReply && postId && posts.length > 0) {
                postToReply = posts.find(
                    (p) => p._id === postId || p.id === postId,
                );
            }

            // 2. Try finding in client-side mock database (demo mode)
            if (
                !postToReply &&
                postId &&
                localStorage.getItem("demo_mode") === "true"
            ) {
                try {
                    const mockPosts = JSON.parse(
                        localStorage.getItem("mock_posts") || "[]",
                    );
                    postToReply = mockPosts.find(
                        (p) => p._id === postId || p.id === postId,
                    );
                } catch (err) {
                    console.error("Failed to parse mock posts", err);
                }
            }

            // 3. Try finding by fetching all posts from the API (real mode)
            if (!postToReply && postId) {
                try {
                    const token = localStorage.getItem("token");
                    const headers = token
                        ? { Authorization: `Bearer ${token}` }
                        : {};
                    const res = await fetch(`${API_BASE}/api/posts`, {
                        headers,
                    });
                    const data = await res.json();
                    if (res.ok && data.posts) {
                        postToReply = data.posts.find(
                            (p) => p._id === postId || p.id === postId,
                        );
                    }
                } catch (err) {
                    console.error("Failed to fetch posts fallback", err);
                }
            }

            if (postToReply) {
                handleReply(postToReply);
            } else if (postId) {
                toast.error("Post details could not be found.");
            }
        };

        window.addEventListener("open-post-reply", handleOpenPostReply);
        return () =>
            window.removeEventListener("open-post-reply", handleOpenPostReply);
    }, [posts]);

    const handleStatusUpdate = async (postId, status, isUrgent = undefined) => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const payload = {};
            if (status) payload.status = status;
            if (isUrgent !== undefined) payload.isUrgent = isUrgent;

            const res = await fetch(`${API_BASE}/api/posts/${postId}/status`, {
                method: "PUT",
                headers,
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) => {
                        if (post._id === postId) {
                            return {
                                ...post,
                                status: status || post.status,
                                isUrgent:
                                    isUrgent !== undefined
                                        ? isUrgent
                                        : post.isUrgent,
                            };
                        }
                        return post;
                    }),
                );
                if (status) toast.success(`Post marked as ${status}`);
                if (isUrgent !== undefined) toast.success(`Urgency updated!`);
            } else {
                toast.error("Failed to update post status.");
            }
        } catch (error) {
            console.error("API Error updating status:", error);
            toast.error("Network error. Could not update post.");
        }
    };

    const activePosts = posts.filter(
        (p) => !["closed", "returned", "expired"].includes(p.status),
    );
    const historyPosts = posts.filter((p) =>
        ["closed", "returned", "expired"].includes(p.status),
    );

    const userKarma = user?.karma ?? 0;
    const isTrusted = userKarma > 100;

    const getInitials = () => {
        if (!user) return "U";
        if (user.name)
            return user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();
        if (user.code) return user.code.substring(0, 2).toUpperCase();
        return "U";
    };

    return (
        <div className="min-h-screen bg-ink pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="mb-5">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center text-[13px] font-medium text-text-muted hover:text-amber transition-colors no-underline"
                >
                    <ArrowLeft size={14} className="mr-1.5" />
                    Back to Dashboard
                </Link>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Sidebar */}
                <div className="w-full md:w-72 flex-shrink-0">
                    <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 sticky top-24">
                        <div className="flex items-center gap-3 mb-5">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-[15px] font-bold text-ink"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #00c9c8, #008f8e)",
                                }}
                            >
                                {getInitials()}
                            </div>
                            <div>
                                <h2 className="text-[15px] font-display font-bold text-text">
                                    {user?.name || user?.code || "Your Profile"}
                                </h2>
                                {isTrusted && (
                                    <Badge variant="success" className="mt-0.5">
                                        <Target size={10} className="mr-1" />{" "}
                                        Trusted Retriever
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="bg-[rgba(0,201,200,0.08)] rounded-[var(--radius)] p-3 border border-[rgba(0,201,200,0.2)] mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-surface rounded-lg">
                                    <Flame size={16} className="text-amber" />
                                </div>
                                <span className="font-medium text-text text-[13px]">
                                    Total Karma
                                </span>
                            </div>
                            <span className="text-xl font-bold text-amber">
                                {userKarma}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <button
                                onClick={() => setActiveTab("active")}
                                className={`w-full text-left px-3.5 py-2.5 rounded-[var(--radius-sm)] text-[13px] font-medium transition-colors cursor-pointer border-none ${activeTab === "active" ? "bg-surface text-text" : "text-text-muted bg-transparent hover:bg-surface"}`}
                            >
                                Active Posts ({activePosts.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`w-full text-left px-3.5 py-2.5 rounded-[var(--radius-sm)] text-[13px] font-medium transition-colors cursor-pointer border-none ${activeTab === "history" ? "bg-surface text-text" : "text-text-muted bg-transparent hover:bg-surface"}`}
                            >
                                Post History ({historyPosts.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("karma")}
                                className={`w-full text-left px-3.5 py-2.5 rounded-[var(--radius-sm)] text-[13px] font-medium transition-colors cursor-pointer border-none ${activeTab === "karma" ? "bg-surface text-text" : "text-text-muted bg-transparent hover:bg-surface"}`}
                            >
                                Karma Breakdown
                            </button>
                        </div>

                        <div className="mt-6 pt-5 border-t border-border">
                            <button
                                onClick={logout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-[13px] font-medium text-red hover:bg-[rgba(240,82,82,0.1)] transition-colors cursor-pointer border-none bg-transparent"
                            >
                                <LogOut size={14} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow">
                    {activeTab === "karma" ? (
                        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 md:p-8">
                            <h3 className="text-xl font-display font-bold text-text mb-5 flex items-center gap-2">
                                <Award className="text-amber" size={22} />{" "}
                                Recent Karma Activity
                            </h3>

                            <div className="space-y-3">
                                {[
                                    {
                                        date: "Today, 2:00 PM",
                                        action: 'Returned "Scientific Calculator"',
                                        points: "+25",
                                    },
                                    {
                                        date: "Yesterday",
                                        action: 'Posted a Found Item "Keys"',
                                        points: "+10",
                                    },
                                    {
                                        date: "Oct 12",
                                        action: "Reply marked as accepted",
                                        points: "+10",
                                    },
                                ].map((log, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-3.5 bg-surface border border-border rounded-[var(--radius)]"
                                    >
                                        <div>
                                            <p className="font-medium text-text text-[13px]">
                                                {log.action}
                                            </p>
                                            <p className="text-[11px] text-text-muted mt-0.5">
                                                {log.date}
                                            </p>
                                        </div>
                                        <span className="font-bold text-green text-[15px]">
                                            {log.points}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-xl font-display font-bold text-text mb-5">
                                {activeTab === "active"
                                    ? "Active Posts"
                                    : "Post History"}
                            </h3>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <PostCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {activeTab === "active" &&
                                        activePosts.length === 0 && (
                                            <div className="col-span-full py-14 text-center bg-card border border-border border-dashed rounded-[var(--radius-xl)]">
                                                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <PackageSearch
                                                        className="text-text-muted"
                                                        size={28}
                                                    />
                                                </div>
                                                <h3 className="text-lg font-display font-bold text-text mb-1">
                                                    No active posts
                                                </h3>
                                                <p className="max-w-xs mx-auto text-[13px] text-text-muted">
                                                    You haven't posted any
                                                    active requests yet.
                                                </p>
                                            </div>
                                        )}
                                    {activeTab === "history" &&
                                        historyPosts.length === 0 && (
                                            <div className="col-span-full py-14 text-center bg-card border border-border border-dashed rounded-[var(--radius-xl)]">
                                                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Award
                                                        className="text-text-muted"
                                                        size={28}
                                                    />
                                                </div>
                                                <h3 className="text-lg font-display font-bold text-text mb-1">
                                                    Empty History
                                                </h3>
                                                <p className="max-w-xs mx-auto text-[13px] text-text-muted">
                                                    Your successfully resolved
                                                    posts will appear here.
                                                </p>
                                            </div>
                                        )}

                                    {(activeTab === "active"
                                        ? activePosts
                                        : historyPosts
                                    ).map((post) => (
                                        <PostCard
                                            key={post._id}
                                            post={post}
                                            onReply={(p, tab = "details") => {
                                                setSelectedPost(p);
                                                setReplyModalTab(tab);
                                                setIsReplyModalOpen(true);
                                            }}
                                            isAuthor={true}
                                            onStatusUpdate={handleStatusUpdate}
                                            onQRReturn={handleQRReturn}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* QR Return Modal */}
            <QRReturnModal
                isOpen={isQRModalOpen}
                onClose={() => {
                    setIsQRModalOpen(false);
                    setSelectedQRPost(null);
                }}
                post={selectedQRPost}
                isReceiver={
                    selectedQRPost ? selectedQRPost.type === "lost" : false
                }
                onSuccessCallback={() => {
                    setIsQRModalOpen(false);
                    setPosts((prevPosts) =>
                        prevPosts.map((p) => {
                            if (p._id === selectedQRPost._id) {
                                return { ...p, status: "returned" };
                            }
                            return p;
                        }),
                    );
                }}
            />

            {/* Post Reply Modal */}
            <PostReplyModal
                post={selectedPost}
                isOpen={isReplyModalOpen}
                defaultTab={replyModalTab}
                onClose={() => {
                    setIsReplyModalOpen(false);
                    setSelectedPost(null);
                    setIsMinimized(false);
                }}
                isMinimized={isMinimized}
                onToggleMinimize={() => setIsMinimized((prev) => !prev)}
                onQRReturn={handleQRReturn}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    );
}
