/**
 * mockFetch.js - Client-Side Mock Backend Interceptor
 * Intercepts window.fetch calls to '/api/...' when demo_mode is active.
 * Uses localStorage to persist created posts, replies, status updates, and karma points.
 */

const DEFAULT_USERS = [
    {
        _id: "user_kiransharma",
        collegeId: "22BCE1234",
        name: "Kiran Sharma",
        karma: 312,
        role: "student",
    },
    {
        _id: "user_priyanair",
        collegeId: "23ECE4321",
        name: "Priya Nair",
        karma: 247,
        role: "student",
    },
    {
        _id: "user_rahulverma",
        collegeId: "21MEC5678",
        name: "Rahul Verma",
        karma: 189,
        role: "student",
    },
    {
        _id: "user_ananyasingh",
        collegeId: "24CIV8765",
        name: "Ananya Singh",
        karma: 134,
        role: "student",
    },
];

const DEFAULT_POSTS = [
    {
        _id: "post_1",
        type: "lost",
        title: "Student ID Card",
        category: "ID Cards",
        description: "Lost my ID card near the canteen. It has a blue lanyard.",
        location: "Canteen",
        datetime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: "open",
        isUrgent: true,
        author: {
            _id: "user_ananyasingh",
            name: "Ananya Singh",
            collegeId: "24CIV8765",
            karma: 134,
        },
        replies: [],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: "post_2",
        type: "found",
        title: "Scientific Calculator (Casio FX-991ES)",
        category: "Electronics",
        description: "Found on the 3rd bench in Physics Lab.",
        location: "Department Lab",
        datetime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: "open",
        imageUrl:
            "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&h=500&fit=crop",
        author: {
            _id: "user_rahulverma",
            name: "Rahul Verma",
            collegeId: "21MEC5678",
            karma: 189,
        },
        replies: [],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: "post_3",
        type: "borrow",
        title: "Engineering Drafter",
        category: "Stationery",
        description: "Need a drafter for my EG class in 30 mins!",
        location: "1st Year Block",
        datetime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        needUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        status: "open",
        isUrgent: true,
        author: {
            _id: "user_priyanair",
            name: "Priya Nair",
            collegeId: "23ECE4321",
            karma: 247,
        },
        replies: [],
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
        _id: "post_4",
        type: "lost",
        title: "Blue Water Bottle (Milton)",
        category: "Others",
        description:
            "Left a blue Milton stainless steel water bottle in Seminar Hall 2.",
        location: "Seminar Hall 2",
        datetime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: "open",
        isUrgent: false,
        author: {
            _id: "user_kiransharma",
            name: "Kiran Sharma",
            collegeId: "22BCE1234",
            karma: 312,
        },
        replies: [],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
];

// Helper to load posts from localStorage
function getPosts() {
    const stored = localStorage.getItem("mock_posts");
    if (!stored) {
        localStorage.setItem("mock_posts", JSON.stringify(DEFAULT_POSTS));
        return DEFAULT_POSTS;
    }
    return JSON.parse(stored);
}

// Helper to save posts
function savePosts(posts) {
    localStorage.setItem("mock_posts", JSON.stringify(posts));
}

// Helper to load users from localStorage
function getUsers() {
    const stored = localStorage.getItem("mock_users");
    if (!stored) {
        localStorage.setItem("mock_users", JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
    }
    return JSON.parse(stored);
}

// Helper to save users
function saveUsers(users) {
    localStorage.setItem("mock_users", JSON.stringify(users));
}

// Helper to get active user
function getActiveUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return DEFAULT_USERS[0];
        }
    }
    return DEFAULT_USERS[0];
}

// Helper to save active user
function saveActiveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

// Override window.fetch
const originalFetch = window.fetch;

window.fetch = async function (url, options = {}) {
    const isDemoMode = localStorage.getItem("demo_mode") === "true";
    const urlString = typeof url === "string" ? url : url.url || "";

    // Check if we need to intercept
    if (
        isDemoMode &&
        (urlString.includes("/api/") || urlString.startsWith("/api/"))
    ) {
        // Parse path and query
        const urlObj = new URL(urlString, window.location.origin);
        const path = urlObj.pathname;
        const method = (options.method || "GET").toUpperCase();
        let body = null;
        if (options.body) {
            try {
                body = JSON.parse(options.body);
            } catch (e) {
                // Not JSON
            }
        }

        // Define route handlers
        try {
            // ─── AUTH ───
            if (path === "/api/auth/login") {
                const { code } = body || {};
                const users = getUsers();
                // Find user or create mock user
                let user = users.find(
                    (u) => u.collegeId === code || u._id === code,
                );
                if (!user) {
                    user = {
                        _id:
                            "user_" +
                            Math.random().toString(36).substring(2, 9),
                        collegeId: code || "22BCE1234",
                        name: "Hackathon User",
                        karma: 0,
                        role: "student",
                    };
                    users.push(user);
                    saveUsers(users);
                }

                // Update active user in localStorage
                saveActiveUser(user);

                return new Response(
                    JSON.stringify({
                        message: "Login successful",
                        token: "mock_jwt_token_for_" + user._id,
                        user: {
                            id: user._id,
                            code: user.collegeId,
                            name: user.name,
                            role: user.role,
                            karma: user.karma,
                        },
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            // ─── POSTS ───
            if (path === "/api/posts" && method === "GET") {
                const type = urlObj.searchParams.get("type");
                const category = urlObj.searchParams.get("category");
                const search = urlObj.searchParams.get("search");

                let posts = getPosts();

                if (type) {
                    posts = posts.filter((p) => p.type === type);
                }
                if (category && category !== "All") {
                    posts = posts.filter((p) => p.category === category);
                }
                if (search) {
                    const searchLower = search.toLowerCase();
                    posts = posts.filter(
                        (p) =>
                            p.title.toLowerCase().includes(searchLower) ||
                            p.description.toLowerCase().includes(searchLower) ||
                            p.location.toLowerCase().includes(searchLower),
                    );
                }

                // Sort by urgency, then newest
                posts.sort((a, b) => {
                    if (a.isUrgent && !b.isUrgent) return -1;
                    if (!a.isUrgent && b.isUrgent) return 1;
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                });

                return new Response(
                    JSON.stringify({
                        message: "Posts fetched successfully",
                        posts,
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            if (path === "/api/posts" && method === "POST") {
                const posts = getPosts();
                const activeUser = getActiveUser();

                const newPost = {
                    _id: "post_" + Math.random().toString(36).substring(2, 9),
                    type: body.type || "lost",
                    title: body.title || "Untitled Post",
                    category: body.category || "Others",
                    description: body.description || "",
                    location: body.location || "",
                    datetime: body.datetime || new Date().toISOString(),
                    imageUrl: body.imageUrl || "",
                    isAnonymous: body.isAnonymous || false,
                    isUrgent: body.isUrgent || false,
                    needUntil: body.needUntil || null,
                    status: "open",
                    author: {
                        _id: activeUser._id || activeUser.id,
                        name: body.isAnonymous
                            ? "Anonymous Student"
                            : activeUser.name,
                        collegeId: body.isAnonymous
                            ? "Hidden"
                            : activeUser.collegeId,
                        karma: activeUser.karma || 0,
                    },
                    replies: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                posts.push(newPost);
                savePosts(posts);

                return new Response(
                    JSON.stringify({
                        message: "Post created successfully",
                        post: newPost,
                    }),
                    {
                        status: 201,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            if (path === "/api/posts/my-posts" && method === "GET") {
                const posts = getPosts();
                const activeUser = getActiveUser();
                const activeUserId = activeUser._id || activeUser.id;

                const myPosts = posts.filter((p) => {
                    const authorId = p.author._id || p.author;
                    return authorId === activeUserId;
                });

                return new Response(
                    JSON.stringify({
                        message: "User posts fetched",
                        posts: myPosts,
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            // GET single post status update or reply
            const replyMatch = path.match(/^\/api\/posts\/([^\/]+)\/replies$/);
            if (replyMatch && method === "POST") {
                const postId = replyMatch[1];
                const posts = getPosts();
                const post = posts.find((p) => p._id === postId);

                if (!post) {
                    return new Response(
                        JSON.stringify({ error: "Post not found" }),
                        { status: 404 },
                    );
                }

                const activeUser = getActiveUser();
                const newReply = {
                    _id: "reply_" + Math.random().toString(36).substring(2, 9),
                    user: {
                        _id: activeUser._id || activeUser.id,
                        name: activeUser.name,
                        collegeId: activeUser.collegeId,
                    },
                    text: body.text || "",
                    createdAt: new Date().toISOString(),
                };

                post.replies = post.replies || [];
                post.replies.push(newReply);
                savePosts(posts);

                return new Response(
                    JSON.stringify({
                        message: "Reply added",
                        post,
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            const statusMatch = path.match(/^\/api\/posts\/([^\/]+)\/status$/);
            if (statusMatch && (method === "PUT" || method === "PATCH")) {
                const postId = statusMatch[1];
                const posts = getPosts();
                const post = posts.find((p) => p._id === postId);

                if (!post) {
                    return new Response(
                        JSON.stringify({ error: "Post not found" }),
                        { status: 404 },
                    );
                }

                if (body.status) post.status = body.status;
                if (typeof body.isUrgent !== "undefined")
                    post.isUrgent = body.isUrgent;

                savePosts(posts);

                return new Response(
                    JSON.stringify({
                        message: "Post updated successfully",
                        post,
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            // ─── KARMA ───
            if (path === "/api/karma/leaderboard" && method === "GET") {
                const users = getUsers();
                // Sort by karma descending
                const leaderboard = [...users].sort(
                    (a, b) => (b.karma || 0) - (a.karma || 0),
                );
                return new Response(
                    JSON.stringify({
                        message: "Leaderboard fetched successfully",
                        leaderboard,
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            // ─── HANDOFF / QR ───
            const qrGenMatch = path.match(
                /^\/api\/return\/([^\/]+)\/generate-qr$/,
            );
            if (qrGenMatch && method === "POST") {
                const postId = qrGenMatch[1];
                const activeUser = getActiveUser();

                return new Response(
                    JSON.stringify({
                        message: "QR Token generated",
                        qrData: {
                            postId: postId,
                            ownerId: activeUser._id || activeUser.id,
                            token: "mock_secure_qr_token_for_" + postId,
                        },
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            if (path === "/api/return/confirm-qr" && method === "POST") {
                const { postId, ownerId } = body || {};
                const posts = getPosts();
                const post = posts.find((p) => p._id === postId);

                if (!post) {
                    return new Response(
                        JSON.stringify({ error: "Post not found" }),
                        { status: 404 },
                    );
                }

                // Update post status
                post.status = "returned";
                post.returnConfirmedAt = new Date().toISOString();
                post.returnMethod = "qr";
                savePosts(posts);

                // Award Karma to Finder (current logged in user, if they are not the owner)
                const activeUser = getActiveUser();
                const activeUserId = activeUser._id || activeUser.id;

                if (activeUserId !== ownerId) {
                    const users = getUsers();
                    const userIndex = users.findIndex(
                        (u) => u._id === activeUserId,
                    );
                    if (userIndex >= 0) {
                        users[userIndex].karma =
                            (users[userIndex].karma || 0) + 50;
                        saveUsers(users);
                        // Save in current session too
                        activeUser.karma = users[userIndex].karma;
                        saveActiveUser(activeUser);
                    }
                }

                return new Response(
                    JSON.stringify({
                        message:
                            "Return confirmed successfully and Karma awarded!",
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            // ─── AI HELPERS ───
            if (path === "/api/ai/parse-post" && method === "POST") {
                const { text } = body || {};

                // Simple heuristic parsing on client side
                const textLower = (text || "").toLowerCase();
                let type = "lost";
                if (
                    textLower.includes("found") ||
                    textLower.includes("discovered")
                )
                    type = "found";
                else if (
                    textLower.includes("borrow") ||
                    textLower.includes("lend") ||
                    textLower.includes("need")
                )
                    type = "borrow";

                let category = "Others";
                if (
                    textLower.includes("phone") ||
                    textLower.includes("laptop") ||
                    textLower.includes("charger") ||
                    textLower.includes("calculator") ||
                    textLower.includes("casio") ||
                    textLower.includes("earpod") ||
                    textLower.includes("earphone") ||
                    textLower.includes("headphone")
                ) {
                    category = "Electronics";
                } else if (
                    textLower.includes("pen") ||
                    textLower.includes("pencil") ||
                    textLower.includes("drafter") ||
                    textLower.includes("ruler")
                ) {
                    category = "Stationery";
                } else if (
                    textLower.includes("id") ||
                    textLower.includes("card") ||
                    textLower.includes("lanyard")
                ) {
                    category = "ID Cards";
                } else if (
                    textLower.includes("book") ||
                    textLower.includes("textbook") ||
                    textLower.includes("notebook")
                ) {
                    category = "Books";
                } else if (
                    textLower.includes("jacket") ||
                    textLower.includes("bottle") ||
                    textLower.includes("umbrella")
                ) {
                    category = "Clothing";
                }

                // Extract title using regex
                let title = "Smart Post";
                const titleMatch = text.match(/(?:lost my|found a|found an|lost a) (.{3,25}?)(?: in | at | during | today|,|\.|$)/i);
                if (titleMatch && titleMatch[1]) {
                    title = titleMatch[1].charAt(0).toUpperCase() + titleMatch[1].slice(1);
                } else {
                    const words = (text || "").split(" ");
                    if (words.length > 2) {
                        title = words.slice(0, 3).join(" ") + "...";
                    }
                }
                
                // Extract location
                let location = "Campus Area";
                const locMatchAny = text.match(/(?:in the|at the|in|at|near) (.{3,20}?)(?: during| today| at|,|\.|$)/i);
                if (locMatchAny && locMatchAny[1]) {
                    location = locMatchAny[1].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                }

                // Extract datetime
                let parsedDate = new Date();
                const timeMatch = text.match(/(\d{1,2}:\d{2})\s*(AM|PM|am|pm)?/i);
                if (timeMatch) {
                    const [_, timePart, modifier] = timeMatch;
                    let [hours, minutes] = timePart.split(':').map(Number);
                    if (modifier && modifier.toLowerCase() === 'pm' && hours !== 12) {
                        hours += 12;
                    }
                    if (modifier && modifier.toLowerCase() === 'am' && hours === 12) {
                        hours = 0;
                    }
                    parsedDate.setHours(hours, minutes, 0, 0);
                }

                const pad = (n) => n.toString().padStart(2, '0');
                const localDatetime = `${parsedDate.getFullYear()}-${pad(parsedDate.getMonth() + 1)}-${pad(parsedDate.getDate())}T${pad(parsedDate.getHours())}:${pad(parsedDate.getMinutes())}:00.000Z`;

                return new Response(
                    JSON.stringify({
                        message: "Successfully parsed text",
                        parsed: {
                            type,
                            title,
                            category,
                            location: location,
                            description: text || "",
                            datetime: localDatetime,
                            isUrgent:
                                textLower.includes("urgent") ||
                                textLower.includes("fast") ||
                                textLower.includes("immediately"),
                        },
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            if (path === "/api/ai/analyze-image" && method === "POST") {
                // Simulate realistic processing delay
                await new Promise((resolve) =>
                    setTimeout(resolve, 1500 + Math.random() * 1000),
                );

                const activeUser = getActiveUser();
                const users = getUsers();
                const userIndex = users.findIndex((u) => u._id === (activeUser._id || activeUser.id));
                const user = userIndex >= 0 ? users[userIndex] : activeUser;

                if (user.isSuspended) {
                    return new Response(JSON.stringify({ isSuspended: true }), { status: 200, headers: { "Content-Type": "application/json" } });
                }

                // 30% chance for an image to be flagged as AI generated for demonstration purposes
                const isAIGenerated = Math.random() > 0.7;

                if (isAIGenerated) {
                    user.aiWarnings = (user.aiWarnings || 0) + 1;
                    if (user.aiWarnings >= 3) {
                        user.isSuspended = true;
                    }
                    if (userIndex >= 0) saveUsers(users);
                    saveActiveUser(user);

                    if (user.isSuspended) {
                        return new Response(JSON.stringify({ isSuspended: true }), { status: 200, headers: { "Content-Type": "application/json" } });
                    }

                    return new Response(
                        JSON.stringify({
                            message: "Image analysis completed",
                            analysis: {
                                isAIGenerated: true,
                                confidence: Math.floor(Math.random() * 8) + 91,
                                reason: `Warning ${user.aiWarnings}/3: Image exhibits characteristics of AI generation (artifacts in shadows/textures).`,
                            },
                        }),
                        { status: 200, headers: { "Content-Type": "application/json" } }
                    );
                } else {
                    return new Response(
                        JSON.stringify({
                            message: "Image analysis completed",
                            analysis: {
                                isAIGenerated: false,
                                confidence: Math.floor(Math.random() * 8) + 91,
                                reason: "Image accepted. For best results, ensure the photo is clear and shows the actual item.",
                            },
                        }),
                        {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                        },
                    );
                }
            }

            if (path === "/api/ai/find-image-matches" && method === "POST") {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                const posts = getPosts();
                
                // For demo purposes, pick a couple found posts to simulate image matching
                const foundPosts = posts.filter(p => p.type === "found" && p.status === "open");
                const matches = foundPosts.slice(0, 2).map(c => ({
                    ...c,
                    confidenceScore: Math.floor(Math.random() * 15) + 70,
                    reason: "Visual similarity detected in shape and color."
                }));

                return new Response(JSON.stringify({ matches }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            }

            if (path === "/api/ai/find-matches" && method === "POST") {
                const { type, title, description, category } = body || {};
                const posts = getPosts();
                const oppositeType = type === "lost" ? "found" : "lost";

                // Find candidate matches in local storage
                const candidates = posts.filter(
                    (p) =>
                        p.type === oppositeType &&
                        p.category === category &&
                        p.status === "open",
                );

                // Score them based on simple overlap
                const scored = candidates
                    .map((c) => {
                        let score = 20; // Base score
                        const searchWords = ((title || "") + " " + (description || ""))
                            .toLowerCase()
                            .split(/\s+/);
                        const cText = (
                            c.title +
                            " " +
                            (c.description || "")
                        ).toLowerCase();
                        let overlap = 0;
                        searchWords.forEach((w) => {
                            if (w.length > 3 && cText.includes(w)) {
                                overlap++;
                                score += 35;
                            }
                        });
                        return {
                            ...c,
                            aiMatchData: {
                                score: Math.min(score, 98),
                                reason: overlap > 0 ? `Category match with keyword overlap.` : `Category match.`,
                            },
                        };
                    })
                    .filter((c) => c.aiMatchData.score >= 70); // Require at least some keyword overlap to match

                return new Response(JSON.stringify({ matches: scored }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            }

            if (path === "/api/upload" && method === "POST") {
                // Extract the actual file from FormData and create a local blob URL
                let imageUrl = "";
                if (options.body instanceof FormData) {
                    const file = options.body.get("image");
                    if (file && file instanceof Blob) {
                        imageUrl = URL.createObjectURL(file);
                    }
                }

                // Simulate a brief upload delay
                await new Promise((resolve) =>
                    setTimeout(resolve, 400 + Math.random() * 300),
                );

                return new Response(
                    JSON.stringify({
                        message: "Image uploaded successfully (Mock)",
                        imageUrl: imageUrl,
                    }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }
        } catch (error) {
            console.error("[MOCK API INTERCEPT ERROR]", error);
            return new Response(
                JSON.stringify({
                    error: "Mock Server Error: " + error.message,
                }),
                { status: 500 },
            );
        }
    }

    // Call real fetch
    return originalFetch.apply(this, arguments);
};
