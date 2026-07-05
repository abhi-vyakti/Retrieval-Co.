import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton";
import PostReplyModal from "../components/PostReplyModal";
import Button from "../components/Button";
import QRReturnModal from "../components/QRReturnModal";
import { useAuth } from "../context/AuthContext";
import {
    Search,
    Filter,
    AlertCircle,
    PackageSearch,
    Plus,
    UserSquare,
    Bell,
    TrendingUp,
    CheckCircle,
    MessageSquare,
    MapPin,
    Flame,
    Award,
    Calendar,
    Grid,
    Laptop,
    Pencil,
    CreditCard,
    BookOpen,
    Shirt,
    Beaker,
    MoreHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE } from "../config/api";

export default function DashboardPage() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(
        searchParams.get("tab") === "borrow" ? "borrow" : "lost_found",
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [activeChipFilter, setActiveChipFilter] = useState("all");

    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [selectedQRPost, setSelectedQRPost] = useState(null);

    // Reply Modal State
    const [selectedPost, setSelectedPost] = useState(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    // Sync tab from URL search params (for footer deep-links)
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "borrow" || tab === "lost_found") {
            setActiveTab(tab);
            setActiveChipFilter("all");
            window.scrollTo(0, 0);
        }
    }, [searchParams]);

    const handleQRReturn = (post) => {
        setSelectedQRPost(post);
        setIsQRModalOpen(true);
    };

    const handleReply = (post) => {
        setSelectedPost(post);
        setIsReplyModalOpen(true);
        setIsMinimized(false);
    };

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
                    prevPosts.map((p) => {
                        if (p._id === postId) {
                            return {
                                ...p,
                                status: status || p.status,
                                isUrgent:
                                    isUrgent !== undefined
                                        ? isUrgent
                                        : p.isUrgent,
                            };
                        }
                        return p;
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

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            let url = `${API_BASE}/api/posts?`;

            if (activeTab === "borrow") {
                url += `type=borrow&`;
            }
            if (categoryFilter !== "All") url += `category=${categoryFilter}&`;
            if (searchTerm) url += `search=${searchTerm}&`;

            const res = await fetch(url, { headers });
            const data = await res.json();

            if (res.ok) {
                let fetchedPosts = data.posts;
                if (activeTab === "lost_found") {
                    fetchedPosts = fetchedPosts.filter(
                        (p) => p.type === "lost" || p.type === "found",
                    );
                }
                setPosts(fetchedPosts);
            } else {
                toast.error("Could not load campus posts. Please try again.");
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
            toast.error("Network error loading posts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();

        window.addEventListener("post-created", fetchPosts);
        return () => window.removeEventListener("post-created", fetchPosts);
    }, [activeTab, categoryFilter]);

    useEffect(() => {
        const openPostId = searchParams.get("openPost");
        if (openPostId) {
            const timer = setTimeout(() => {
                window.dispatchEvent(
                    new CustomEvent("open-post-reply", {
                        detail: { postId: openPostId },
                    }),
                );
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("openPost");
                setSearchParams(newParams, { replace: true });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [searchParams, setSearchParams]);

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
                // If post is not in lost_found / borrow feed tab, switch to it first
                if (postToReply.type === "borrow" && activeTab !== "borrow") {
                    setActiveTab("borrow");
                } else if (
                    postToReply.type !== "borrow" &&
                    activeTab !== "lost_found"
                ) {
                    setActiveTab("lost_found");
                }
                handleReply(postToReply);
            } else if (postId) {
                toast.error("Post details could not be found.");
            }
        };
        window.addEventListener("open-post-reply", handleOpenPostReply);
        return () =>
            window.removeEventListener("open-post-reply", handleOpenPostReply);
    }, [posts, activeTab]);

    // Split first name and hour-based greeting
    const firstName = user?.name ? user.name.split(" ")[0] : "Student";
    const timeGreeting = (() => {
        const hr = new Date().getHours();
        if (hr < 12) return "Good Morning";
        if (hr < 17) return "Good Afternoon";
        return "Good Evening";
    })();

    // Dynamic Metrics
    const myPosts = posts.filter(
        (p) => p.author?._id === user?.id || p.author?.collegeId === user?.code,
    );

    // Dynamic Notifications Center activity list
    const notifications = [];
    posts.forEach((post) => {
        if (
            post.author?._id === user?.id ||
            post.author?.collegeId === user?.code
        ) {
            if (post.aiMatch || (post.matchIds && post.matchIds.length > 0)) {
                notifications.push({
                    id: `ai-${post._id}`,
                    text: `AI found a possible match for "${post.title}"`,
                    type: "match",
                });
            }
            if (post.replies && post.replies.length > 0) {
                const lastReply = post.replies[post.replies.length - 1];
                notifications.push({
                    id: `reply-${post._id}`,
                    text: `${lastReply.user?.name || "A student"} replied to "${post.title}"`,
                    type: "reply",
                });
            }
        }
        if (post.isUrgent && post.status === "open") {
            notifications.push({
                id: `urgent-${post._id}`,
                text: `Urgent: "${post.title}" was lost in ${post.location}`,
                type: "urgent",
            });
        }
    });

    // Quick Chips Filters (Clean without emojis)
    const quickChips = [
        { label: "All Items", value: "all" },
        { label: "Lost", value: "lost" },
        { label: "Found", value: "found" },
        { label: "Today's", value: "today" },
        { label: "Urgent", value: "urgent" },
        { label: "My Posts", value: "my_posts" },
    ];

    // Local filter mapping on fetched list
    const filteredPosts = posts.filter((post) => {
        if (activeChipFilter === "today") {
            const postDate = new Date(
                post.createdAt || post.datetime,
            ).toDateString();
            const todayDate = new Date().toDateString();
            if (postDate !== todayDate) return false;
        }
        if (activeChipFilter === "urgent" && !post.isUrgent) return false;
        if (activeChipFilter === "nearby") {
            const loc = post.location?.toLowerCase() || "";
            const isNearby =
                loc.includes("canteen") ||
                loc.includes("library") ||
                loc.includes("block") ||
                loc.includes("lab") ||
                loc.includes("hall");
            if (!isNearby) return false;
        }
        if (activeChipFilter === "my_posts") {
            if (
                post.author?._id !== user?.id &&
                post.author?.collegeId !== user?.code
            )
                return false;
        }
        if (activeChipFilter === "borrow" && post.type !== "borrow")
            return false;
        if (activeChipFilter === "lost" && post.type !== "lost") return false;
        if (activeChipFilter === "found" && post.type !== "found") return false;

        // Search term local fallback filter if not resolved in API
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchTitle = post.title?.toLowerCase().includes(term);
            const matchDesc = post.description?.toLowerCase().includes(term);
            const matchLoc = post.location?.toLowerCase().includes(term);
            if (!matchTitle && !matchDesc && !matchLoc) return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-background pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-8">
            {/* Header Greeting Workspace */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-b border-border">
                <div>
                    <h1 className="text-3xl font-display font-[800] text-text mb-1 tracking-tight">
                        {timeGreeting}, {firstName}
                    </h1>
                    <p className="text-text-muted text-[14px]">
                        Explore lost, found, and borrowable items on campus.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link
                        to="/my-posts"
                        className="btn-ghost flex items-center gap-2 no-underline text-xs"
                    >
                        <UserSquare size={15} />
                        <span>My Posts</span>
                    </Link>
                </div>
            </div>

            {/* Main Tabs Container */}
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="relative flex p-1 bg-surface border border-border rounded-full w-[260px] overflow-hidden">
                    {/* Sliding Background Pill */}
                    <div
                        className="absolute top-1 bottom-1 left-1 rounded-full bg-primary transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        style={{
                            width: "calc(50% - 4px)",
                            transform:
                                activeTab === "lost_found"
                                    ? "translateX(0)"
                                    : "translateX(100%)",
                        }}
                    />

                    <button
                        onClick={() => {
                            setActiveTab("lost_found");
                            setActiveChipFilter("all");
                        }}
                        className={`flex-1 relative z-10 py-2 rounded-full text-[0.85rem] font-bold transition-all cursor-pointer border-none bg-transparent ${activeTab === "lost_found" ? "text-white" : "text-text-muted hover:text-text"}`}
                    >
                        Lost & Found
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("borrow");
                            setActiveChipFilter("all");
                        }}
                        className={`flex-1 relative z-10 py-2 rounded-full text-[0.85rem] font-bold transition-all cursor-pointer border-none bg-transparent ${activeTab === "borrow" ? "text-white" : "text-text-muted hover:text-text"}`}
                    >
                        Borrow
                    </button>
                </div>
                <Link
                    to="/hotspots"
                    className="btn-ghost !rounded-full text-xs"
                >
                    View Hotspots
                </Link>
            </div>

            {/* Two-Column Responsive Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column (Sticky Sidebar) */}
                <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
                    {/* 1. Search */}
                    <div className="glass-panel p-5 rounded-xl flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                            <Search size={14} className="text-primary" /> Search
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search items, locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && fetchPosts()
                                }
                                className="form-input !pl-10 text-[0.88rem]"
                            />
                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                            />
                        </div>
                    </div>

                    {/* 2. Quick Filters */}
                    <div className="glass-panel p-5 rounded-xl flex flex-col gap-3">
                        <h3 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                            <Filter size={14} className="text-primary" /> Quick
                            Filters
                        </h3>
                        <div className="flex flex-wrap gap-2 pb-2">
                            {quickChips.map((chip) => {
                                const isActive =
                                    activeChipFilter === chip.value;
                                return (
                                    <button
                                        key={chip.value}
                                        onClick={() =>
                                            setActiveChipFilter(
                                                isActive ? "all" : chip.value,
                                            )
                                        }
                                        className={`px-3.5 py-2 rounded-full text-xs font-semibold cursor-pointer border transition-all flex items-center gap-1.5 min-h-[44px] ${
                                            isActive
                                                ? "bg-primary border-primary text-white shadow-sm hover:brightness-110"
                                                : "bg-surface border-border text-text-muted hover:text-text hover:border-zinc-500"
                                        }`}
                                    >
                                        <span>{chip.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Categories */}
                    <div className="glass-panel p-5 rounded-xl flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5 mb-1">
                            <PackageSearch size={14} className="text-primary" />{" "}
                            Categories
                        </h3>
                        <div className="flex flex-col gap-1.5">
                            {[
                                {
                                    name: "All",
                                    label: "All Categories",
                                    icon: Grid,
                                },
                                {
                                    name: "Electronics",
                                    label: "Electronics",
                                    icon: Laptop,
                                },
                                {
                                    name: "Stationery",
                                    label: "Stationery",
                                    icon: Pencil,
                                },
                                {
                                    name: "ID Cards",
                                    label: "ID Cards",
                                    icon: CreditCard,
                                },
                                {
                                    name: "Books",
                                    label: "Books",
                                    icon: BookOpen,
                                },
                                {
                                    name: "Clothing",
                                    label: "Clothing",
                                    icon: Shirt,
                                },
                                {
                                    name: "Lab Equipment",
                                    label: "Lab Equipment",
                                    icon: Beaker,
                                },
                                {
                                    name: "Others",
                                    label: "Others",
                                    icon: MoreHorizontal,
                                },
                            ].map((item) => {
                                const Icon = item.icon;
                                const isSelected = categoryFilter === item.name;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            setCategoryFilter(item.name);
                                            window.scrollTo({
                                                top: 0,
                                                behavior: "smooth",
                                            });
                                        }}
                                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-[0.88rem] font-medium transition-all duration-200 border-none cursor-pointer ${
                                            isSelected
                                                ? "bg-primary text-white shadow-md"
                                                : "text-text-muted bg-transparent hover:bg-surface hover:text-text"
                                        }`}
                                    >
                                        <Icon
                                            size={16}
                                            className={
                                                isSelected
                                                    ? "text-white"
                                                    : "text-text-muted/70"
                                            }
                                        />
                                        <span className="flex-1">
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column (Item Feed List) */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <PostCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-card rounded-2xl border border-border border-dashed text-center p-8">
                            <PackageSearch
                                className="text-text-muted mb-5"
                                size={32}
                            />
                            <h3 className="text-xl font-display font-bold text-text mb-2">
                                No items reported
                            </h3>
                            <p className="text-text-muted text-[13px] max-w-sm mb-6 leading-relaxed">
                                Start by posting a lost item, a found object, or
                                a borrow request.
                            </p>
                            <Link
                                to="/create"
                                className="btn-primary no-underline text-xs"
                            >
                                Create Post
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-300">
                            {filteredPosts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    onReply={handleReply}
                                    isAuthor={
                                        post.author?._id === user?.id ||
                                        post.author?.collegeId === user?.code
                                    }
                                    onStatusUpdate={handleStatusUpdate}
                                    onQRReturn={handleQRReturn}
                                />
                            ))}
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
                isOwner={
                    selectedQRPost
                        ? selectedQRPost.author?._id === user?.id ||
                          selectedQRPost.author?.collegeId === user?.code
                        : false
                }
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
                onToggleMinimize={() => setIsMinimized((prev) => !prev)}
                onQRReturn={handleQRReturn}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    );
}
