import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import {
    PackageSearch,
    PackageCheck,
    Repeat,
    AlertCircle,
    ArrowLeft,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Loader2,
    ShieldCheck,
    ShieldAlert,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ImageUpload from "../components/ImageUpload";
import { API_BASE } from "../config/api";

export default function CreatePostPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [type, setType] = useState(() => {
        const t = searchParams.get("type");
        if (t === "borrow" || t === "found" || t === "lost") return t;
        return "lost";
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { token } = useAuth();

    // AI Parsing State
    const [aiPrompt, setAiPrompt] = useState("");
    const [loadingAi, setLoadingAi] = useState(false);
    const [aiError, setAiError] = useState("");

    // Auto-Match Engine State
    const [potentialMatches, setPotentialMatches] = useState([]);
    const [isReviewingMatches, setIsReviewingMatches] = useState(false);
    const [checkingMatches, setCheckingMatches] = useState(false);

    // Image AI Analysis State
    const [analyzingImage, setAnalyzingImage] = useState(false);
    const [imageAnalysis, setImageAnalysis] = useState(null);
    const [isSuspended, setIsSuspended] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Timetable Matcher State
    const [matchingTimetable, setMatchingTimetable] = useState(false);
    const [matchedClass, setMatchedClass] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        location: "",
        date: "",
        time: "",
        imageUrl: "",
        selectedClass: "",
        isAnonymous: false,
        isUrgent: false,
    });

    const categories = [
        "Electronics",
        "Stationery",
        "ID Cards",
        "Books",
        "Clothing",
        "Lab Equipment",
        "Others",
    ];
    const classOptions = [
        "Engineering Drawing",
        "Chemistry Lab",
        "Physics Lab",
        "Data Structures (CS201)",
        "Workshop (EE305)",
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleClassChange = (e) => {
        const val = e.target.value;
        setFormData((prev) => ({ ...prev, selectedClass: val }));

        if (!val) {
            setMatchedClass("");
            setMatchingTimetable(false);
            return;
        }

        setMatchingTimetable(true);
        setMatchedClass("");

        setTimeout(() => {
            setMatchingTimetable(false);
            setMatchedClass(val);
        }, 1500);
    };

    React.useEffect(() => {
        setMatchedClass("");
        setMatchingTimetable(false);
        setImageAnalysis(null);
    }, [type]);

    const handleAiParse = async () => {
        if (!aiPrompt.trim()) return;
        setLoadingAi(true);
        setAiError("");

        try {
            const headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const res = await fetch(`${API_BASE}/api/ai/parse-post`, {
                method: "POST",
                headers,
                body: JSON.stringify({ text: aiPrompt }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to parse text magically");
            }

            const parsed = data.parsed;

            if (["lost", "found", "borrow"].includes(parsed.type)) {
                setType(parsed.type);
            }

            let newDate = formData.date;
            let newTime = formData.time;
            if (parsed.datetime) {
                const dtStr = parsed.datetime.substring(0, 16);
                if (dtStr.includes("T")) {
                    const parts = dtStr.split("T");
                    newDate = parts[0];
                    newTime = parts[1];
                }
            }

            setFormData((prev) => ({
                ...prev,
                title: parsed.title || prev.title,
                category: parsed.category || prev.category,
                location: parsed.location || prev.location,
                description: parsed.description || prev.description,
                date: newDate || prev.date,
                time: newTime || prev.time,
            }));

            setAiPrompt("");
        } catch (err) {
            setAiError(err.message);
        } finally {
            setLoadingAi(false);
        }
    };

    const handleAnalyzeFoundImage = async (uploadedUrl) => {
        if (!uploadedUrl || !uploadedUrl.trim()) return;

        setAnalyzingImage(true);
        setImageAnalysis(null);

        try {
            const headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const res = await fetch(`${API_BASE}/api/ai/analyze-image`, {
                method: "POST",
                headers,
                body: JSON.stringify({ imageUrl: uploadedUrl, type: "found" }),
            });

            const data = await res.json();

            if (data.isSuspended) {
                setIsSuspended(true);
                setAnalyzingImage(false);
                return;
            }

            if (!res.ok) {
                setImageAnalysis({
                    error:
                        data.error ||
                        "AI analysis failed. Please try again.",
                });
                return;
            }

            if (data.analysis && data.analysis.isAIGenerated !== undefined) {
                setImageAnalysis({
                    isAIGenerated: Boolean(data.analysis.isAIGenerated),
                    confidence: Number(data.analysis.confidence) || 0,
                    reason: String(data.analysis.reason || ""),
                    matches: data.analysis.matches || [],
                });
            }
        } catch (err) {
            setImageAnalysis({
                error: "Could not connect to AI service. Proceed manually.",
            });
        } finally {
            setAnalyzingImage(false);
        }
    };

    const handleAnalyzeLostImage = async (uploadedUrl, currentFormData) => {
        if (!uploadedUrl || !uploadedUrl.trim()) return;

        setAnalyzingImage(true);
        setImageAnalysis(null);

        try {
            const headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const res = await fetch(`${API_BASE}/api/ai/find-image-matches`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    imageUrl: uploadedUrl,
                    title: currentFormData?.title || "",
                    description: currentFormData?.description || "",
                }),
            });

            const data = await res.json();

            if (data.matches && data.matches.length > 0) {
                setImageAnalysis({
                    matches: data.matches,
                });
            }
        } catch (err) {
            console.error("Failed to find image matches:", err);
        } finally {
            setAnalyzingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const showError = (msg) => {
            setError(msg);
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        if (isSuspended) {
            showError("Your account is currently suspended from making posts due to repeated terms of service violations (AI image spam).");
            return;
        }

        if (!formData.title) {
            showError("Please fill the Item Name.");
            return;
        }

        if (type !== "borrow" && (!formData.date || !formData.location)) {
            showError("Date and Location are required.");
            return;
        }

        if ((type === "lost" || type === "found") && !formData.description) {
            showError("Description is required.");
            return;
        }

        if (type === "found" && !formData.imageUrl) {
            showError(
                "Image is mandatory for Found items as proof of possession.",
            );
            return;
        }

        if (type === "borrow") {
            if (!formData.selectedClass) {
                showError("Please select your upcoming class to find a match.");
                return;
            }
        }

        setCheckingMatches(true);
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const payload = {
                ...formData,
                type,
            };

            if (!isReviewingMatches && type !== "borrow") {
                const matchRes = await fetch(
                    `${API_BASE}/api/ai/find-matches`,
                    {
                        method: "POST",
                        headers,
                        body: JSON.stringify(payload),
                    },
                );

                if (matchRes.ok) {
                    const matchData = await matchRes.json();
                    if (matchData.matches && matchData.matches.length > 0) {
                        setPotentialMatches(matchData.matches);
                        setIsReviewingMatches(true);
                        setCheckingMatches(false);
                        return;
                    }
                }
            }

            await submitPostData(payload, headers);
        } catch (err) {
            setError(err.message);
            setCheckingMatches(false);
        }
    };

    const submitPostData = async (payload, headers) => {
        setLoading(true);
        try {
            let formattedDatetime;
            let formattedNeedUntil = undefined;

            try {
                const timeToUse = formData.time || "12:00";
                const dateToUse =
                    type === "borrow" && !formData.date
                        ? new Date().toISOString().split("T")[0]
                        : formData.date;
                formattedDatetime = new Date(
                    `${dateToUse}T${timeToUse}`,
                ).toISOString();

                if (type === "borrow") {
                    formattedNeedUntil = new Date(
                        Date.now() + 2 * 60 * 60 * 1000,
                    ).toISOString();
                }
            } catch (dateErr) {
                setError("Invalid date format provided.");
                setLoading(false);
                return;
            }

            payload.datetime = formattedDatetime;
            delete payload.date;
            delete payload.time;

            if (formattedNeedUntil) {
                payload.needUntil = formattedNeedUntil;
            }
            delete payload.selectedClass;

            if (!payload.category) payload.category = null;
            if (!payload.description) payload.description = null;

            if (type === "borrow") {
                payload.location = "Targeted: Section F";
                payload.description = `Targeted request: Needed for ${formData.selectedClass}`;
                payload.category = "Others";
            }

            const res = await fetch(`${API_BASE}/api/posts`, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create post");
            }

            if (type === "borrow") {
                setSuccessMessage(
                    `Notification sent successfully! Wait for someone to reply or physically meet a student from Section F to get your item.`,
                );
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setCheckingMatches(false);
        }
    };

    if (successMessage) {
        return (
            <div className="min-h-screen bg-ink pt-24 pb-20 px-4 md:px-8 max-w-3xl mx-auto flex flex-col items-center justify-center text-center">
                <div className="bg-[rgba(61,214,140,0.08)] border border-[rgba(61,214,140,0.2)] p-8 rounded-[var(--radius-xl)] max-w-lg w-full mb-8">
                    <div className="w-16 h-16 bg-[rgba(61,214,140,0.1)] rounded-full flex items-center justify-center mx-auto mb-5">
                        <PackageCheck size={32} className="text-green" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-text mb-3">
                        Request Sent!
                    </h2>
                    <p className="text-text-muted text-[14px] mb-6 leading-relaxed">
                        {successMessage}
                    </p>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setSuccessMessage("")}
                            variant="ghost"
                            className="flex-1 py-3"
                        >
                            Send Another
                        </Button>
                        <Button
                            onClick={() => navigate("/dashboard")}
                            variant="primary"
                            className="flex-1 py-3"
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ink pt-24 pb-20 px-4 md:px-8 max-w-3xl mx-auto">
            <div className="mb-5">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center text-[13px] font-medium text-text-muted hover:text-amber transition-colors no-underline"
                >
                    <ArrowLeft size={14} className="mr-1.5" />
                    Back to Dashboard
                </Link>
            </div>
            <h1 className="text-2xl font-display font-bold text-text mb-1">
                Create a Post
            </h1>
            <p className="text-text-muted text-[14px] mb-8">
                Report something lost, log a found item, or request to borrow
                equipment.
            </p>

            {/* AI Magic Fill Section */}
            <div className="bg-[rgba(96,165,250,0.08)] border border-[rgba(96,165,250,0.2)] p-5 rounded-[var(--radius-lg)] mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-blue" />
                    <h3 className="font-display font-bold text-[14px] text-blue">
                        Magic Fill with AI
                    </h3>
                </div>
                <p className="text-[12px] text-text-muted mb-4">
                    Describe what happened in natural language, and we'll
                    automatically fill out the form for you.
                </p>

                {aiError && (
                    <div className="mb-3 p-2.5 bg-[rgba(240,82,82,0.1)] border border-[rgba(240,82,82,0.3)] rounded-[var(--radius-sm)] text-red text-[11px] flex items-center gap-2">
                        <AlertCircle size={13} /> {aiError}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., I lost my red hydroflask near the basketball court today at 3pm."
                        className="form-input flex-1"
                        onKeyDown={(e) =>
                            e.key === "Enter" && !loadingAi && handleAiParse()
                        }
                    />
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleAiParse}
                        disabled={loadingAi || !aiPrompt.trim()}
                        className="whitespace-nowrap"
                    >
                        {loadingAi ? "Extracting..." : "✨ Magic Fill"}
                    </Button>
                </div>

            </div>

            {/* Type Selector Tabs */}
            <div className="flex gap-2 mb-8">
                <button
                    onClick={() => setType("lost")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] font-display font-bold text-[0.9rem] cursor-pointer transition-all border ${type === "lost" ? "bg-[rgba(240,82,82,0.12)] text-red border-[rgba(240,82,82,0.4)]" : "bg-surface text-text-muted border-border"}`}
                >
                    <PackageSearch size={18} /> I Lost
                </button>
                <button
                    onClick={() => setType("found")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] font-display font-bold text-[0.9rem] cursor-pointer transition-all border ${type === "found" ? "bg-[rgba(61,214,140,0.12)] text-green border-[rgba(61,214,140,0.4)]" : "bg-surface text-text-muted border-border"}`}
                >
                    <PackageCheck size={18} /> I Found
                </button>
                <button
                    onClick={() => setType("borrow")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] font-display font-bold text-[0.9rem] cursor-pointer transition-all border ${type === "borrow" ? "bg-[rgba(96,165,250,0.12)] text-blue border-[rgba(96,165,250,0.4)]" : "bg-surface text-text-muted border-border"}`}
                >
                    <Repeat size={18} /> Borrow
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-card border border-border rounded-[var(--radius-lg)] p-6 md:p-8"
            >
                {error && (
                    <div className="mb-5 p-3 bg-[rgba(240,82,82,0.1)] border border-[rgba(240,82,82,0.3)] rounded-[var(--radius)] flex items-center gap-2 text-red text-[13px]">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {isSuspended && (
                    <div className="mb-5 p-5 bg-danger-bg border border-danger/40 rounded-xl flex flex-col items-center justify-center text-center text-danger text-[14px]">
                        <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-3">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="font-bold text-[16px] mb-1">Account Suspended</h3>
                        <p className="opacity-90">
                            Your account has been temporarily suspended from making posts due to repeated uploads of AI-generated fake images.
                        </p>
                    </div>
                )}

                <div className="space-y-5">
                    <Input
                        label="Item Name"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder={
                            type === "borrow"
                                ? "e.g., Scientific Calculator FX-991ES"
                                : "e.g., Black Puma Backpack"
                        }
                        required
                    />

                    {type !== "borrow" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="form-label">
                                    Category (Optional)
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label={`Location ${type === "lost" ? "Lost" : "Found"}`}
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Central Library / Canteen"
                                required
                            />
                        </div>
                    )}

                    {type !== "borrow" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input
                                type="date"
                                label={`Date ${type === "lost" ? "Lost" : type === "found" ? "Found" : "Needed"}`}
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="time"
                                label={
                                    type === "lost"
                                        ? "Time Lost (Approx.)"
                                        : type === "found"
                                          ? "Time Found"
                                          : "Time"
                                }
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {type === "borrow" && (
                        <div>
                            <label className="form-label">
                                Upcoming Class Session{" "}
                                <span className="text-primary">*</span>
                            </label>
                            <select
                                name="selectedClass"
                                value={formData.selectedClass}
                                onChange={handleClassChange}
                                className="form-input"
                                required
                            >
                                <option value="">Select your class...</option>
                                {classOptions.map((cls) => (
                                    <option key={cls} value={cls}>
                                        {cls}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {type === "borrow" && matchingTimetable && (
                        <div className="bg-[rgba(96,165,250,0.04)] border border-[rgba(96,165,250,0.15)] rounded-[var(--radius)] p-4 flex items-center gap-3">
                            <Loader2
                                className="animate-spin text-primary shrink-0"
                                size={15}
                            />
                            <span className="text-[13px] text-text-muted font-medium">
                                Checking timetable database matching...
                            </span>
                        </div>
                    )}

                    {type === "borrow" && matchedClass && (
                        <div className="bg-[rgba(96,165,250,0.08)] border border-[rgba(96,165,250,0.2)] rounded-[var(--radius)] p-4 animate-in fade-in slide-in-from-top-1 duration-200">
                            <h4 className="text-blue font-medium text-[13px] flex items-center gap-2 mb-2">
                                <Sparkles size={15} /> Smart Timetable Matcher
                            </h4>
                            <p className="text-[13px] text-text mb-1">
                                🎯 Found Match:{" "}
                                <strong className="text-blue">Section F</strong>{" "}
                                had {matchedClass} pre-lunch.
                            </p>
                            <p className="text-[11px] text-text-muted">
                                This section just finished using the item you
                                need. Do you want to send a targeted request to
                                them?
                            </p>
                        </div>
                    )}

                    {type !== "borrow" && (
                        <div>
                            <label className="form-label">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="form-input"
                                placeholder="Provide details like color, brand, recognizable marks..."
                                required
                            ></textarea>
                        </div>
                    )}

                    {type !== "borrow" && (
                        <div>
                            <label className="form-label">
                                Photo{" "}
                                {type === "found" ? (
                                    <span className="text-primary">*</span>
                                ) : (
                                    "(Optional)"
                                )}
                            </label>

                            <ImageUpload
                                currentImage={formData.imageUrl}
                                onUploadSuccess={(url) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        imageUrl: url,
                                    }));
                                    setImageAnalysis(null);
                                    if (type === "found") {
                                        handleAnalyzeFoundImage(url);
                                    } else if (type === "lost") {
                                        handleAnalyzeLostImage(url, formData);
                                    }
                                }}
                                onRemove={() => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        imageUrl: "",
                                    }));
                                    setImageAnalysis(null);
                                }}
                            />

                            {/* Image AI Results Banner */}
                            {imageAnalysis &&
                                !imageAnalysis.error &&
                                (imageAnalysis.isAIGenerated !== undefined || (imageAnalysis.matches && imageAnalysis.matches.length > 0)) && (
                                    <div className="space-y-3 mt-3">
                                        {imageAnalysis.isAIGenerated !== undefined && (
                                            <div className={`rounded-xl border overflow-hidden shadow-sm transition-all duration-300 ${imageAnalysis.isAIGenerated ? 'border-danger/30 shadow-[0_4px_20px_-10px_rgba(240,82,82,0.3)]' : 'border-green/30 shadow-[0_4px_20px_-10px_rgba(34,197,94,0.3)]'}`}>
                                                <div className={`px-4 py-3 border-b flex items-center justify-between ${imageAnalysis.isAIGenerated ? "bg-[rgba(240,82,82,0.08)] border-danger/20" : "bg-[rgba(34,197,94,0.08)] border-green/20"}`}>
                                                    <div className="flex items-center gap-2">
                                                        {imageAnalysis.isAIGenerated ? (
                                                            <ShieldAlert size={18} className="text-danger" />
                                                        ) : (
                                                            <ShieldCheck size={18} className="text-green" />
                                                        )}
                                                        <span className={`font-semibold text-[14px] ${imageAnalysis.isAIGenerated ? "text-danger" : "text-green"}`}>
                                                            {imageAnalysis.isAIGenerated ? "AI Generated Content Detected" : "Authentic Photograph Verified"}
                                                        </span>
                                                    </div>
                                                    <div className={`text-[12px] font-bold ${imageAnalysis.isAIGenerated ? "text-danger/90" : "text-green/90"}`}>
                                                        {imageAnalysis.confidence}% Confidence
                                                    </div>
                                                </div>
                                                <div className="px-4 py-3 bg-surface/30">
                                                    {/* Progress bar */}
                                                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mb-3">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-1000 ${imageAnalysis.isAIGenerated ? "bg-danger" : "bg-green"}`}
                                                            style={{ width: `${imageAnalysis.confidence}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-[13px] opacity-90 leading-relaxed text-text">
                                                        {imageAnalysis.reason.replace(/⚠️|✅/g, '').trim()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Image Match Detection Results */}
                                        {imageAnalysis.matches &&
                                            imageAnalysis.matches.length >
                                                0 && (
                                                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-text flex flex-col gap-3">
                                                    <h4 className="text-[12px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                                        <Sparkles size={14} />{" "}
                                                        Potential Matches Found
                                                        on Campus
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {imageAnalysis.matches.map(
                                                            (m) => (
                                                                <div
                                                                    key={m._id}
                                                                    className="p-3 rounded-lg bg-surface border border-border flex justify-between items-start gap-2 hover:border-primary/40 transition-colors"
                                                                >
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span
                                                                                className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${m.type === "found" ? "bg-green/10 text-green border border-green/15" : "bg-danger/10 text-red border border-danger/15"}`}
                                                                            >
                                                                                {
                                                                                    m.type
                                                                                }
                                                                            </span>
                                                                            <span className="font-semibold text-[13px] text-text">
                                                                                {
                                                                                    m.title
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-[11px] text-text-muted leading-relaxed">
                                                                            "
                                                                            {
                                                                                m.reason
                                                                            }
                                                                            "
                                                                        </p>
                                                                        {m.location && (
                                                                            <span className="text-[10px] text-text-muted">
                                                                                📍{" "}
                                                                                {
                                                                                    m.location
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/15 px-2 py-0.5 rounded">
                                                                        {
                                                                            m.confidenceScore
                                                                        }
                                                                        % Match
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                        <div className="flex gap-3 mt-4 pt-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => navigate(`/post/${imageAnalysis.matches[0]._id}`)}
                                                                className="flex-1 bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors text-[13px]"
                                                            >
                                                                View Matched Item
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setImageAnalysis(null)}
                                                                className="flex-1 bg-white border border-border text-text-light py-2 rounded-lg font-medium hover:bg-bg transition-colors text-[13px]"
                                                            >
                                                                Not Mine, Continue
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                )}
                            {analyzingImage && (
                                <p className="text-[11px] text-green-dark mt-2 flex items-center gap-2">
                                    <Loader2
                                        className="animate-spin text-green"
                                        size={13}
                                    />
                                    Running AI forensic vision analysis...
                                </p>
                            )}
                            {imageAnalysis && imageAnalysis.error && (
                                <div className="mt-3 p-3 text-[13px] rounded-[var(--radius)] border flex items-start gap-3 bg-danger-bg border-danger/20 text-danger">
                                    <AlertCircle
                                        size={16}
                                        className="shrink-0 mt-0.5"
                                    />
                                    <div>
                                        <span className="font-bold">
                                            AI Analysis Failed
                                        </span>
                                        <p className="mt-1 opacity-80 text-[12px]">
                                            {imageAnalysis.error}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Advanced Options Accordion */}
                    <div className="py-4">
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center justify-between w-full text-left text-text text-[13.5px] font-semibold hover:text-primary transition-colors cursor-pointer focus:outline-none"
                        >
                            <span className="flex items-center gap-2">
                                Advanced Options
                            </span>
                            {showAdvanced ? (
                                <ChevronUp
                                    size={16}
                                    className="text-text-muted"
                                />
                            ) : (
                                <ChevronDown
                                    size={16}
                                    className="text-text-muted"
                                />
                            )}
                        </button>

                        {showAdvanced && (
                            <div className="mt-4 pl-1 flex flex-col gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-text-muted text-[13px] font-medium">
                                        Post Anonymously (Hide my name)
                                    </span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={formData.isAnonymous}
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                isAnonymous: !prev.isAnonymous,
                                            }))
                                        }
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${formData.isAnonymous ? "bg-success" : "bg-border"}`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${formData.isAnonymous ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>

                                {type === "borrow" && (
                                    <div className="flex items-center justify-between pt-2 border-t border-border/10">
                                        <span className="text-text-muted text-[13px] font-medium">
                                            Mark as Urgent
                                        </span>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={formData.isUrgent}
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    isUrgent: !prev.isUrgent,
                                                }))
                                            }
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${formData.isUrgent ? "bg-success" : "bg-border"}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${formData.isUrgent ? "translate-x-6" : "translate-x-1"}`}
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Auto Match Review UI */}
                    {isReviewingMatches && potentialMatches.length > 0 && (
                        <div className="bg-green-light border border-green/30 rounded-[var(--radius)] p-5 mb-4">
                            <h3 className="text-green-dark font-display font-bold text-[16px] mb-2 flex items-center gap-2">
                                <Sparkles size={18} /> Wait! We found potential
                                matches!
                            </h3>
                            <p className="text-text-muted text-[13px] mb-4">
                                Before you post, check if someone else has
                                already posted about this item:
                            </p>

                            <div className="space-y-3 mb-5">
                                {potentialMatches.map((match) => (
                                    <div
                                        key={match._id}
                                        className="bg-surface border border-grey-200 rounded-[var(--radius-sm)] p-3 flex flex-col gap-2"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span
                                                    className={`badge ${match.type === "found" ? "badge-found" : "badge-lost"}`}
                                                >
                                                    {match.type}
                                                </span>
                                                <h4 className="font-bold text-text text-[13px] mt-1">
                                                    {match.title}
                                                </h4>
                                            </div>
                                            <div className="badge badge-aimatch">
                                                {match.aiMatchData.score}% Match
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-text-muted">
                                            "{match.aiMatchData.reason}"
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Cancel & View Matches
                                </Button>
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="flex-1"
                                    onClick={(e) =>
                                        submitPostData(
                                            { ...formData, type },
                                            {
                                                "Content-Type":
                                                    "application/json",
                                                Authorization: `Bearer ${token}`,
                                            },
                                        )
                                    }
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Posting..."
                                        : "Not Mine, Post Anyway"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {!isReviewingMatches && (
                        <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-40 md:static mt-6">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-3.5 md:py-3 text-[15px] font-bold shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:shadow-none bg-primary hover:bg-primary-dim transition-all"
                                disabled={loading || checkingMatches}
                            >
                                {checkingMatches
                                    ? "Scanning for Matches..."
                                    : loading
                                      ? "Submitting..."
                                      : type === "borrow"
                                        ? "Send request"
                                        : `Create ${type.charAt(0).toUpperCase() + type.slice(1)} Post`}
                            </Button>
                        </div>
                    )}
                </div>
            </form>

            <div className="mt-5 text-center text-[11px] text-grey-400 flex items-center justify-center gap-1.5">
                <AlertCircle size={12} /> Fake claims or posts can lead to
                account suspension.
            </div>
        </div>
    );
}
