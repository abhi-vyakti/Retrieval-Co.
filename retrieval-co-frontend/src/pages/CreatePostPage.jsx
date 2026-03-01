import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { PackageSearch, PackageCheck, Repeat, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';

export default function CreatePostPage() {
    const navigate = useNavigate();
    const [type, setType] = useState('lost');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { token } = useAuth();

    // AI Parsing State
    const [aiPrompt, setAiPrompt] = useState('');
    const [loadingAi, setLoadingAi] = useState(false);
    const [aiError, setAiError] = useState('');

    // Auto-Match Engine State
    const [potentialMatches, setPotentialMatches] = useState([]);
    const [isReviewingMatches, setIsReviewingMatches] = useState(false);
    const [checkingMatches, setCheckingMatches] = useState(false);

    // Image AI Analysis State
    const [analyzingImage, setAnalyzingImage] = useState(false);
    const [imageAnalysis, setImageAnalysis] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        location: '',
        date: '',
        time: '',
        imageUrl: '',
        selectedClass: '',
        isAnonymous: false,
        isUrgent: false
    });

    const categories = ['Electronics', 'Stationery', 'ID Cards', 'Books', 'Clothing', 'Lab Equipment', 'Others'];
    const classOptions = ['Engineering Drawing', 'Chemistry Lab', 'Physics Lab', 'Data Structures (CS201)', 'Workshop (EE305)'];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAiParse = async () => {
        if (!aiPrompt.trim()) return;
        setLoadingAi(true);
        setAiError('');

        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch('http://localhost:5000/api/ai/parse-post', {
                method: 'POST',
                headers,
                body: JSON.stringify({ text: aiPrompt })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to parse text magically');
            }

            const parsed = data.parsed;

            if (['lost', 'found', 'borrow'].includes(parsed.type)) {
                setType(parsed.type);
            }

            let newDate = formData.date;
            let newTime = formData.time;
            if (parsed.datetime) {
                const dtStr = parsed.datetime.substring(0, 16);
                if (dtStr.includes('T')) {
                    const parts = dtStr.split('T');
                    newDate = parts[0];
                    newTime = parts[1];
                }
            }

            setFormData(prev => ({
                ...prev,
                title: parsed.title || prev.title,
                category: parsed.category || prev.category,
                location: parsed.location || prev.location,
                description: parsed.description || prev.description,
                date: newDate || prev.date,
                time: newTime || prev.time
            }));

            setAiPrompt('');
        } catch (err) {
            setAiError(err.message);
        } finally {
            setLoadingAi(false);
        }
    };

    const handleAnalyzeImage = (uploadedUrl) => {
        const runAnalysis = async () => {
            if (!uploadedUrl || !uploadedUrl.trim()) return;

            setAnalyzingImage(true);
            setImageAnalysis(null);

            try {
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch('http://localhost:5000/api/ai/analyze-image', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ imageUrl: uploadedUrl })
                });

                const data = await res.json();

                if (!res.ok) {
                    setImageAnalysis({ error: data.error || 'AI analysis failed. Please try again.' });
                    return;
                }

                if (data.analysis && data.analysis.isAIGenerated !== undefined) {
                    setImageAnalysis({
                        isAIGenerated: Boolean(data.analysis.isAIGenerated),
                        confidence: Number(data.analysis.confidence) || 0,
                        reason: String(data.analysis.reason || '')
                    });
                }
            } catch (err) {
                setImageAnalysis({ error: 'Could not connect to AI service. Proceed manually.' });
            } finally {
                setAnalyzingImage(false);
            }
        };

        runAnalysis().catch(() => {
            setAnalyzingImage(false);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title) {
            setError('Please fill the Item Name.');
            return;
        }

        if (type !== 'borrow' && (!formData.date || !formData.location)) {
            setError('Date and Location are required.');
            return;
        }

        if ((type === 'lost' || type === 'found') && !formData.description) {
            setError('Description is required.');
            return;
        }

        if (type === 'found' && !formData.imageUrl) {
            setError('Image is mandatory for Found items as proof of possession.');
            return;
        }

        if (type === 'borrow') {
            if (!formData.selectedClass) {
                setError('Please select your upcoming class to find a match.');
                return;
            }
        }

        setCheckingMatches(true);
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            };

            const payload = {
                ...formData,
                type
            };

            if (!isReviewingMatches && type !== 'borrow') {
                const matchRes = await fetch('http://localhost:5000/api/ai/find-matches', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                });

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
                const timeToUse = formData.time || '12:00';
                const dateToUse = (type === 'borrow' && !formData.date)
                    ? new Date().toISOString().split('T')[0]
                    : formData.date;
                formattedDatetime = new Date(`${dateToUse}T${timeToUse}`).toISOString();

                if (type === 'borrow') {
                    formattedNeedUntil = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
                }
            } catch (dateErr) {
                setError('Invalid date format provided.');
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

            if (type === 'borrow') {
                payload.location = 'Targeted: Section F';
                payload.description = `Targeted request: Needed for ${formData.selectedClass}`;
                payload.category = 'Others';
            }

            const res = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create post');
            }

            if (type === 'borrow') {
                setSuccessMessage(`Notification sent successfully! Wait for someone to reply or physically meet a student from Section F to get your item.`);
            } else {
                navigate('/dashboard');
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
                    <h2 className="text-2xl font-display font-bold text-text mb-3">Request Sent!</h2>
                    <p className="text-text-muted text-[14px] mb-6 leading-relaxed">
                        {successMessage}
                    </p>
                    <div className="flex gap-3">
                        <Button onClick={() => setSuccessMessage('')} variant="ghost" className="flex-1 py-3">
                            Send Another
                        </Button>
                        <Button onClick={() => navigate('/dashboard')} variant="primary" className="flex-1 py-3">
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
                <Link to="/dashboard" className="inline-flex items-center text-[13px] font-medium text-text-muted hover:text-amber transition-colors no-underline">
                    <ArrowLeft size={14} className="mr-1.5" />
                    Back to Dashboard
                </Link>
            </div>
            <h1 className="text-2xl font-display font-bold text-text mb-1">Create a Post</h1>
            <p className="text-text-muted text-[14px] mb-8">Report something lost, log a found item, or request to borrow equipment.</p>

            {/* AI Magic Fill Section */}
            <div className="bg-[rgba(96,165,250,0.08)] border border-[rgba(96,165,250,0.2)] p-5 rounded-[var(--radius-lg)] mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-blue" />
                    <h3 className="font-display font-bold text-[14px] text-blue">Magic Fill with AI</h3>
                </div>
                <p className="text-[12px] text-text-muted mb-4">
                    Describe what happened in natural language, and we'll automatically fill out the form for you.
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
                        onKeyDown={(e) => e.key === 'Enter' && !loadingAi && handleAiParse()}
                    />
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleAiParse}
                        disabled={loadingAi || !aiPrompt.trim()}
                        className="whitespace-nowrap"
                    >
                        {loadingAi ? 'Extracting...' : '✨ Magic Fill'}
                    </Button>
                </div>
                <div className="mt-3">
                    <ImageUpload
                        onUploadSuccess={(url) => {
                            setFormData(prev => ({ ...prev, imageUrl: url }));
                        }}
                        label="Attach Media"
                    />
                </div>
            </div>

            {/* Type Selector Tabs */}
            <div className="flex gap-2 mb-8">
                <button
                    onClick={() => setType('lost')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] font-display font-bold text-[0.9rem] cursor-pointer transition-all border ${type === 'lost' ? 'bg-[rgba(240,82,82,0.12)] text-red border-[rgba(240,82,82,0.4)]' : 'bg-surface text-text-muted border-border'}`}
                >
                    🔴 I Lost
                </button>
                <button
                    onClick={() => setType('found')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] font-display font-bold text-[0.9rem] cursor-pointer transition-all border ${type === 'found' ? 'bg-[rgba(61,214,140,0.12)] text-green border-[rgba(61,214,140,0.4)]' : 'bg-surface text-text-muted border-border'}`}
                >
                    🟢 I Found
                </button>
                <button
                    onClick={() => setType('borrow')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] font-display font-bold text-[0.9rem] cursor-pointer transition-all border ${type === 'borrow' ? 'bg-[rgba(96,165,250,0.12)] text-blue border-[rgba(96,165,250,0.4)]' : 'bg-surface text-text-muted border-border'}`}
                >
                    🔵 Borrow
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-[var(--radius-lg)] p-6 md:p-8">
                {error && (
                    <div className="mb-5 p-3 bg-[rgba(240,82,82,0.1)] border border-[rgba(240,82,82,0.3)] rounded-[var(--radius)] flex items-center gap-2 text-red text-[13px]">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div className="space-y-5">
                    <Input
                        label="Item Name"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder={type === 'borrow' ? "e.g., Scientific Calculator FX-991ES" : "e.g., Black Puma Backpack"}
                        required
                    />

                    {type !== 'borrow' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="form-label">Category (Optional)</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label={`Location ${type === 'lost' ? 'Lost' : 'Found'} *`}
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Central Library / Canteen"
                                required
                            />
                        </div>
                    )}

                    {type !== 'borrow' && (
                        <div className="grid grid-cols-2 gap-5">
                            <Input
                                type="date"
                                label={`Date ${type === 'lost' ? 'Lost' : type === 'found' ? 'Found' : 'Needed'} *`}
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="time"
                                label="Time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {type === 'borrow' && (
                        <div>
                            <label className="form-label">Upcoming Class Session *</label>
                            <select
                                name="selectedClass"
                                value={formData.selectedClass}
                                onChange={handleChange}
                                className="form-input"
                                required
                            >
                                <option value="">Select your class...</option>
                                {classOptions.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {type === 'borrow' && formData.selectedClass && (
                        <div className="bg-[rgba(96,165,250,0.08)] border border-[rgba(96,165,250,0.2)] rounded-[var(--radius)] p-4">
                            <h4 className="text-blue font-medium text-[13px] flex items-center gap-2 mb-2">
                                <Sparkles size={15} /> Smart Timetable Matcher
                            </h4>
                            <p className="text-[13px] text-text mb-1">
                                🎯 Found Match: <strong className="text-blue">Section F</strong> had {formData.selectedClass} pre-lunch.
                            </p>
                            <p className="text-[11px] text-text-muted">
                                This section just finished using the item you need. Do you want to send a targeted request to them?
                            </p>
                        </div>
                    )}

                    {type !== 'borrow' && (
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

                    {type !== 'borrow' && (
                        <div>
                            <label className="form-label">Photo (Optional)</label>

                            <ImageUpload
                                currentImage={formData.imageUrl}
                                onUploadSuccess={(url) => {
                                    setFormData(prev => ({ ...prev, imageUrl: url }));
                                    setImageAnalysis(null);
                                }}
                                onRemove={() => {
                                    setFormData(prev => ({ ...prev, imageUrl: '' }));
                                    setImageAnalysis(null);
                                }}
                            />

                            {/* Manual AI Detection Button */}
                            {formData.imageUrl && !analyzingImage && !imageAnalysis && (
                                <button
                                    type="button"
                                    onClick={() => handleAnalyzeImage(formData.imageUrl)}
                                    className="mt-2 text-[11px] text-green-dark hover:text-green border border-green/30 hover:border-green rounded-lg px-3 py-1.5 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Sparkles size={11} /> Check if AI-Generated
                                </button>
                            )}

                            {/* Image AI Results Banner */}
                            {imageAnalysis && !imageAnalysis.error && imageAnalysis.isAIGenerated !== undefined && (
                                <div className={`mt-3 p-3 text-[13px] rounded-[var(--radius)] border flex items-start gap-3 ${imageAnalysis.isAIGenerated ? 'bg-danger-bg border-danger/20 text-danger' : 'bg-green-light border-green/20 text-green-dark'}`}>
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold">AI Image Detection</span>
                                        <p className="mt-1 opacity-80 text-[12px]">
                                            {imageAnalysis.isAIGenerated
                                                ? `⚠️ Warning: This image appears to be AI-generated (${imageAnalysis.confidence}% confidence). ${imageAnalysis.reason}`
                                                : `✅ This image appears to be an authentic photograph (${imageAnalysis.confidence}% confidence). ${imageAnalysis.reason}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {analyzingImage && (
                                <p className="text-[11px] text-green-dark mt-2 animate-pulse flex items-center gap-2">🔍 Running AI forensic vision analysis...</p>
                            )}
                            {imageAnalysis && imageAnalysis.error && (
                                <div className="mt-3 p-3 text-[13px] rounded-[var(--radius)] border flex items-start gap-3 bg-danger-bg border-danger/20 text-danger">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold">AI Analysis Failed</span>
                                        <p className="mt-1 opacity-80 text-[12px]">{imageAnalysis.error}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 py-4 border-t border-grey-100">
                        <div className="flex items-center justify-between">
                            <span className="text-text text-[13px] font-medium">Post Anonymously (Hide my name)</span>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={formData.isAnonymous}
                                onClick={() => setFormData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${formData.isAnonymous ? 'bg-green' : 'bg-grey-200'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-surface transition-transform shadow-sm ${formData.isAnonymous ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>

                        {type !== 'found' && (
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isUrgent"
                                    checked={formData.isUrgent}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-grey-300 text-urgent-text focus:ring-urgent-text"
                                />
                                <span className="text-urgent-text font-medium text-[13px] flex items-center gap-1">Mark as URGENT</span>
                            </label>
                        )}
                    </div>

                    {/* Auto Match Review UI */}
                    {isReviewingMatches && potentialMatches.length > 0 && (
                        <div className="bg-green-light border border-green/30 rounded-[var(--radius)] p-5 mb-4">
                            <h3 className="text-green-dark font-display font-bold text-[16px] mb-2 flex items-center gap-2">
                                <Sparkles size={18} /> Wait! We found potential matches!
                            </h3>
                            <p className="text-text-muted text-[13px] mb-4">
                                Before you post, check if someone else has already posted about this item:
                            </p>

                            <div className="space-y-3 mb-5">
                                {potentialMatches.map((match) => (
                                    <div key={match._id} className="bg-surface border border-grey-200 rounded-[var(--radius-sm)] p-3 flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className={`badge ${match.type === 'found' ? 'badge-found' : 'badge-lost'}`}>
                                                    {match.type}
                                                </span>
                                                <h4 className="font-bold text-text text-[13px] mt-1">{match.title}</h4>
                                            </div>
                                            <div className="badge badge-aimatch">
                                                {match.aiMatchData.score}% Match
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-text-muted">"{match.aiMatchData.reason}"</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Cancel & View Matches
                                </Button>
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="flex-1"
                                    onClick={(e) => submitPostData({ ...formData, type }, { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` })}
                                    disabled={loading}
                                >
                                    {loading ? 'Posting...' : 'Not Mine, Post Anyway'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {!isReviewingMatches && (
                        <Button type="submit" variant="primary" className="w-full py-3 text-[14px]" disabled={loading || checkingMatches}>
                            {checkingMatches ? 'Scanning for Matches...' : loading ? 'Submitting...' : type === 'borrow' ? (formData.selectedClass ? 'Send Request to Section F' : 'Select a Class to Send Request') : `Create ${type.charAt(0).toUpperCase() + type.slice(1)} Post`}
                        </Button>
                    )}
                </div>
            </form>

            <div className="mt-5 text-center text-[11px] text-grey-400 flex items-center justify-center gap-1.5">
                <AlertCircle size={12} /> Fake claims or posts can lead to account suspension.
            </div>
        </div>
    );
}
