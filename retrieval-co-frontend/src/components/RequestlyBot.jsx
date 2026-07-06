import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config/api";

const MessageFormatter = ({ text }) => {
    if (!text) return null;
    const lines = text.split('\n');

    return (
        <div className="flex flex-col gap-1.5">
            {lines.map((line, i) => {
                const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
                let content = line;
                if (isBullet) {
                    content = line.trim().substring(2);
                }
                
                const parts = content.split(/(\*\*.*?\*\*|\*.*?\*)/g);
                const formattedContent = parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                    } else if (part.startsWith('*') && part.endsWith('*')) {
                        return <em key={j}>{part.slice(1, -1)}</em>;
                    }
                    return <span key={j}>{part}</span>;
                });

                if (isBullet) {
                    return (
                        <div key={i} className="flex gap-2 pl-1">
                            <span className="text-amber mt-[2px] leading-none">•</span>
                            <span className="flex-1">{formattedContent}</span>
                        </div>
                    );
                }

                return (
                    <div key={i} className="min-h-[1em]">
                        {formattedContent.length > 0 ? formattedContent : <br />}
                    </div>
                );
            })}
        </div>
    );
};

export default function RequestlyBot() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        window.dispatchEvent(new CustomEvent("bot-toggled", { detail: { isOpen } }));
    }, [isOpen]);

    const initialMessages = [
        {
            role: "model",
            content:
                "Hey! I'm your campus AI assistant. I can help you find lost items, suggest lenders, or check current matches. What do you need?",
        },
    ];

    const [messages, setMessages] = useState(() => {
        try {
            const stored = localStorage.getItem("bot_chat_history");
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse chat history", e);
        }
        return initialMessages;
    });
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    
    // Placeholder Animation State
    const placeholderPhrases = [
        "Report a lost item...",
        "Found something...",
        "Want to borrow something...",
        "Check my matches...",
        "Ask me anything..."
    ];
    const [placeholderText, setPlaceholderText] = useState("");
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    
    useEffect(() => {
        let timer;
        const currentPhrase = placeholderPhrases[phraseIndex];
        
        if (isDeleting) {
            timer = setTimeout(() => {
                setPlaceholderText(currentPhrase.substring(0, placeholderText.length - 1));
                if (placeholderText.length <= 1) {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % placeholderPhrases.length);
                }
            }, 40);
        } else {
            if (placeholderText.length < currentPhrase.length) {
                timer = setTimeout(() => {
                    setPlaceholderText(currentPhrase.substring(0, placeholderText.length + 1));
                }, 80);
            } else {
                timer = setTimeout(() => {
                    setIsDeleting(true);
                }, 2000);
            }
        }
        return () => clearTimeout(timer);
    }, [placeholderText, isDeleting, phraseIndex]);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const isDemo = localStorage.getItem("demo_mode") === "true";
            if (isDemo) {
                try {
                    const stored = localStorage.getItem("mock_posts");
                    if (stored) setPosts(JSON.parse(stored));
                } catch (e) {}
            } else {
                const token = localStorage.getItem("token");
                const headers = token
                    ? { Authorization: `Bearer ${token}` }
                    : {};
                fetch(`${API_BASE}/api/posts`, { headers })
                    .then((r) => r.json())
                    .then((data) => {
                        if (data && data.posts) setPosts(data.posts);
                    })
                    .catch(() => {});
            }
        }
    }, [isOpen]);

    const parseMessageContent = (content) => {
        const match = content.match(/\[\[postId:([a-zA-Z0-9_-]+)\]\]/);
        let cleanText = content
            .replace(/\[\[postId:[a-zA-Z0-9_-]+\]\]/g, "")
            .trim();
        let postId = match ? match[1] : null;
        return { cleanText, postId };
    };

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        localStorage.setItem("bot_chat_history", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        // Small timeout to allow content layout sizing to complete before scrolling
        const timer = setTimeout(scrollToBottom, 50);
        return () => clearTimeout(timer);
    }, [messages, isOpen, isLoading]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: "user", content: input.trim() };
        const newMessages = [...messages, userMsg];

        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const isDemo = localStorage.getItem("demo_mode") === "true";
            let demoPosts = [];
            if (isDemo) {
                try {
                    const storedPosts = localStorage.getItem("mock_posts");
                    if (storedPosts) {
                        demoPosts = JSON.parse(storedPosts);
                    }
                } catch (e) {
                    console.error("Failed to parse mock_posts", e);
                }
            }

            const context = {
                userName: user?.name || "Guest",
                userKarma: user?.karma || 0,
                isDemoMode: isDemo,
                demoPosts: demoPosts,
            };

            const res = await fetch(`${API_BASE}/api/ai/chat`, {
                method: "POST",
                headers,
                body: JSON.stringify({ messages: newMessages, context }),
            });

            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Failed to get response");

            let replyText = data.reply || "";
            const createMatch = replyText.match(
                /\[\[CREATE_POST:(\{.*?\})\]\]/,
            );
            if (createMatch) {
                try {
                    const postParams = JSON.parse(createMatch[1]);
                    // Normalize fields
                    if (!postParams.datetime)
                        postParams.datetime = new Date().toISOString();
                    if (!postParams.location)
                        postParams.location = "Campus Canteen";
                    if (!postParams.description)
                        postParams.description = "Created via AI Assistant";
                    if (!postParams.category) postParams.category = "Others";

                    if (postParams.type === "found" && !postParams.imageUrl) {
                        postParams.imageUrl =
                            "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&h=500&fit=crop";
                    }

                    const postHeaders = {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    };

                    const postRes = await fetch(`${API_BASE}/api/posts`, {
                        method: "POST",
                        headers: postHeaders,
                        body: JSON.stringify(postParams),
                    });
                    const postData = await postRes.json();

                    if (postRes.ok && (postData.post || postData.newPost)) {
                        const newPost = postData.post || postData.newPost;
                        const createdId = newPost._id || newPost.id;
                        replyText = replyText.replace(
                            /\[\[CREATE_POST:\{.*?\}\]\]/g,
                            `[[postId:${createdId}]]`,
                        );
                        // Update local posts array so the details button can find the post and render its title
                        setPosts((prev) => [...prev, newPost]);
                        // Dispatch event to refresh posts lists dynamically
                        window.dispatchEvent(
                            new CustomEvent("post-created", {
                                detail: newPost,
                            }),
                        );
                    } else {
                        replyText = replyText
                            .replace(/\[\[CREATE_POST:\{.*?\}\]\]/g, "")
                            .trim();
                        console.error(
                            "Failed to auto-create post:",
                            postData.error,
                        );
                    }
                } catch (e) {
                    replyText = replyText
                        .replace(/\[\[CREATE_POST:\{.*?\}\]\]/g, "")
                        .trim();
                    console.error("Error auto-creating post from chat:", e);
                }
            }

            setMessages((prev) => [
                ...prev,
                { role: "model", content: replyText },
            ]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    content:
                        error.message ||
                        "I'm having trouble connecting right now. Please try again in a moment.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[400] flex flex-col items-end"
            style={{
                paddingBottom: "env(safe-area-inset-bottom)",
                paddingRight: "env(safe-area-inset-right)",
            }}
        >
            {/* Chat Window */}
            {isOpen && (
                <div
                    className="w-[calc(100vw-2rem)] md:w-[360px] h-[75vh] md:h-[500px] max-h-[600px] bg-surface border border-border rounded-[18px] overflow-hidden mb-4 flex flex-col"
                    style={{
                        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
                        animation: "fadeUp 0.3s ease",
                    }}
                >
                    {/* Header */}
                    <div className="px-5 py-4 bg-surface border-b border-border flex items-center gap-3">
                        <img
                            src="/bot-icon.png"
                            alt="AI Bot"
                            className="w-[34px] h-[34px] rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <h4 className="text-[0.9rem] font-bold">
                                Requestly
                            </h4>
                            <p className="text-[0.75rem] text-green">
                                ● Online
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-text-muted hover:text-text transition-colors cursor-pointer bg-transparent border-none"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 min-h-0 p-4 flex flex-col gap-3 overflow-y-auto"
                    >
                        {messages.map((msg, idx) => {
                            const isUser = msg.role === "user";
                            const { cleanText, postId } = parseMessageContent(
                                msg.content,
                            );
                            const matchedPost = postId
                                ? posts.find((p) => p._id === postId)
                                : null;
                            return (
                                <div
                                    key={idx}
                                    className={`flex flex-col gap-1.5 w-full ${isUser ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] text-[0.875rem] leading-[1.5] px-3.5 py-2.5 ${
                                            isUser
                                                ? "bg-[rgba(0,201,200,0.15)] rounded-[14px_4px_14px_14px] text-amber"
                                                : "bg-background rounded-[4px_14px_14px_14px] text-text"
                                        }`}
                                    >
                                        <MessageFormatter text={cleanText} />
                                    </div>
                                    {(matchedPost || postId) && (
                                        <button
                                            onClick={() => {
                                                const currentPath =
                                                    window.location.pathname;
                                                if (
                                                    currentPath ===
                                                        "/dashboard" ||
                                                    currentPath === "/my-posts"
                                                ) {
                                                    window.dispatchEvent(
                                                        new CustomEvent(
                                                            "open-post-reply",
                                                            {
                                                                detail: {
                                                                    postId,
                                                                    post: matchedPost,
                                                                },
                                                            },
                                                        ),
                                                    );
                                                } else {
                                                    navigate(
                                                        `/dashboard?openPost=${postId}`,
                                                    );
                                                }
                                            }}
                                            className="px-3 py-1.5 rounded-lg border border-primary/30 hover:border-primary bg-primary/5 text-primary text-[11px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-start gap-1.5 ml-1 self-start max-w-[95%] text-left whitespace-normal break-words"
                                        >
                                            <span className="mt-0.5 shrink-0">
                                                📂
                                            </span>
                                            <span>
                                                Open Post:{" "}
                                                {matchedPost
                                                    ? matchedPost.title
                                                    : "Details"}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        {isLoading && (
                            <div className="bg-background rounded-[4px_14px_14px_14px] self-start px-3.5 py-2.5 flex items-center gap-2">
                                <Loader2
                                    size={14}
                                    className="animate-spin text-amber"
                                />
                                <span className="text-xs text-text-muted">
                                    Typing...
                                </span>
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
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSend(e)
                            }
                            placeholder={placeholderText || " "}
                            className="flex-1 bg-background border border-border rounded-[8px] px-3 py-2.5 text-text font-body text-[0.88rem] outline-none"
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

            {/* Bot FAB */}
            <div className="group flex items-center gap-2">
                {!isOpen && (
                    <span className="bg-card border border-border text-text text-xs px-2.5 py-1.5 rounded-lg shadow opacity-0 scale-90 translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none select-none font-bold">
                        AI Assistant
                    </span>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-[58px] h-[58px] rounded-full border-none flex items-center justify-center cursor-pointer transition-all hover:scale-[1.08] shrink-0 p-0 relative ${
                        isOpen
                            ? "bg-primary text-white shadow-lg"
                            : "bg-transparent"
                    }`}
                    style={{
                        boxShadow: isOpen
                            ? "0 4px 24px var(--primary)"
                            : "0 4px 24px rgba(168,85,247,0.35)",
                    }}
                >
                    {isOpen ? (
                        <X size={24} />
                    ) : (
                        <img
                            src="/bot-icon.png"
                            alt="AI Assistant"
                            className="w-full h-full object-cover rounded-full"
                        />
                    )}
                </button>
            </div>
        </div>
    );
}
