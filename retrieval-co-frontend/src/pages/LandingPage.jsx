import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Zap, QrCode, MapPin, Bell, Sparkles, Brain, PlusSquare, Calendar, Trophy, Map, ShieldCheck, Calculator, CreditCard, PenTool } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';



const featuresData = [
    {
        icon: "🤖",
        title: "AI Matching",
        desc: "Matches lost and found reports instantly."
    },
    {
        icon: "⚡",
        title: "Quick Post",
        desc: "Report lost, found, or borrow items in seconds."
    },
    {
        icon: "📅",
        title: "Schedule Sync",
        desc: "Coordinate borrows based on class schedules."
    },
    {
        icon: "📱",
        title: "QR Handoff",
        desc: "Verifies returns securely with dual-scan QR."
    },
    {
        icon: "🏆",
        title: "Karma Points",
        desc: "Earn karma points and climb the campus ranking."
    },
    {
        icon: "🗺️",
        title: "Loss Hotspots",
        desc: "Visualizes lost items using AI campus heatmaps."
    }
];



export default function LandingPage() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const showLogin = !user && searchParams.get('login') === '1';
    const dashboardLink = user ? '/dashboard' : '/?login=1';

    const [step, setStep] = useState(0);
    const mockupRef = useRef(null);
    const [mockupVisible, setMockupVisible] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prev => (prev + 1) % 4);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Scroll-triggered animation for the mockup preview
    useEffect(() => {
        const el = mockupRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setMockupVisible(true); observer.disconnect(); } },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const closeLogin = () => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('login');
        setSearchParams(nextParams, { replace: true });
    };

    return (
        <div className="min-h-screen bg-background text-text">
            {showLogin && <LoginModal onClose={closeLogin} />}
            {/* HERO SECTION */}
            <section className="min-h-screen pt-32 pb-16 flex flex-col items-center justify-center text-center px-4 relative">
                {/* Subtle mesh background overlays */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
                    style={{
                        background: 'radial-gradient(ellipse 60% 40% at 50% -10%, var(--primary) 0%, transparent 80%), radial-gradient(ellipse 50% 30% at 90% 90%, var(--primary-dim) 0%, transparent 60%)'
                    }}
                />

                {/* 3D Floating Engineering & Campus Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* 1. Calculator Card (Top Left) */}
                    <div className="absolute hidden lg:flex items-center left-[8%] top-[20%] w-36 pointer-events-auto animate-float-3d-1">
                        <img src="/calculator_3d.png" alt="3D Calculator" loading="lazy" decoding="async" className="w-full h-auto object-contain drop-shadow-[0_10px_25px_rgba(56,189,248,0.12)]" />
                    </div>

                    {/* 2. ID Card Card (Top Right) */}
                    <div className="absolute hidden lg:flex items-center right-[8%] top-[23%] w-36 pointer-events-auto animate-float-3d-2">
                        <img src="/id_badge_3d.png" alt="3D Student ID Card" loading="lazy" decoding="async" className="w-full h-auto object-contain drop-shadow-[0_10px_25px_rgba(52,211,153,0.12)]" />
                    </div>

                    {/* 3. Magnifying Scan Card (Bottom Left) */}
                    <div className="absolute hidden lg:flex items-center left-[10%] bottom-[28%] w-36 pointer-events-auto animate-float-3d-3">
                        <img src="/magnifying_glass_3d.png" alt="3D Magnifying Glass" loading="lazy" decoding="async" className="w-full h-auto object-contain drop-shadow-[0_10px_25px_rgba(251,191,36,0.12)]" />
                    </div>

                    {/* 4. Drafting/Pen Tool Card (Bottom Right) */}
                    <div className="absolute hidden lg:flex items-center right-[9%] bottom-[22%] w-36 pointer-events-auto animate-float-3d-4">
                        <img src="/drafter_tool_3d.png" alt="3D Drafting Tool" loading="lazy" decoding="async" className="w-full h-auto object-contain drop-shadow-[0_10px_25px_rgba(244,63,94,0.12)]" />
                    </div>
                </div>

                {/* Hero Title */}
                <h1 className="font-display font-[900] leading-[1.1] tracking-tight z-10 text-5xl sm:text-6xl md:text-[3.2rem] lg:text-8xl max-w-5xl text-text animate-in fade-in duration-500">
                    Lost it.<br />
                    <span className="bg-gradient-to-r from-primary to-primary-dim bg-clip-text text-transparent">Find it.</span><br />
                    Borrow it.
                </h1>

                {/* Subtitle description (1 short sentence) */}
                <p className="max-w-2xl text-base sm:text-lg text-text-muted mx-auto mt-8 mb-14 leading-relaxed z-10 animate-in fade-in duration-700">
                    AI-powered lost & found and a borrowing platform built for modern campuses.
                </p>

                {/* Hero CTA buttons */}
                <div className="flex flex-col items-center gap-4.5 z-10 animate-in fade-in duration-700">
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            to={user ? "/create?type=lost" : "/?login=1"}
                            className="btn-ghost no-underline text-base font-bold flex items-center gap-1.5 px-6 py-2.5"
                        >
                            Report Loss
                        </Link>
                        <Link
                            to={user ? "/create?type=borrow" : "/?login=1"}
                            className="btn-ghost no-underline text-base font-bold flex items-center gap-1.5 px-6 py-2.5"
                        >
                            Borrow An Item
                        </Link>
                    </div>
                    <Link
                        to={dashboardLink}
                        className="btn-primary no-underline text-base font-bold flex items-center gap-1.5 shadow-lg shadow-primary/15 px-10 py-3"
                    >
                        Get Started →
                    </Link>
                </div>
                {/* CSS Dashboard Mockup (Preview Hero) - Parity with real UI */}
                <div
                    id="how-it-works"
                    ref={mockupRef}
                    className={`relative w-full max-w-5xl mx-auto mt-20 px-4 md:px-0 z-10 transition-all duration-1000 ease-out scroll-mt-24 ${mockupVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                >
                    {/* Interactive Step Switcher Tabs */}
                    <div className="flex gap-2 justify-center mb-6 flex-wrap">
                        <button 
                            onClick={() => setStep(0)} 
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-none focus-visible:outline-none ${step === 0 ? 'bg-primary text-white shadow' : 'bg-surface/50 text-text-muted hover:text-text'}`}
                        >
                            Report Loss
                        </button>
                        <button 
                            onClick={() => setStep(1)} 
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-none focus-visible:outline-none ${step === 1 ? 'bg-primary text-white shadow' : 'bg-surface/50 text-text-muted hover:text-text'}`}
                        >
                            Request Borrow
                        </button>
                        <button 
                            onClick={() => setStep(2)} 
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-none focus-visible:outline-none ${step === 2 ? 'bg-primary text-white shadow' : 'bg-surface/50 text-text-muted hover:text-text'}`}
                        >
                            AI Matching
                        </button>
                        <button 
                            onClick={() => setStep(3)} 
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-none focus-visible:outline-none ${step === 3 ? 'bg-primary text-white shadow' : 'bg-surface/50 text-text-muted hover:text-text'}`}
                        >
                            Secure Handoff
                        </button>
                    </div>

                    <div className="relative glass-panel rounded-xl border border-border shadow-2xl p-6 bg-card/40 backdrop-blur-md overflow-hidden flex flex-col gap-6 min-h-[460px]">
                        
                        {/* Mock header row */}
                        <div className="flex justify-between items-center border-b border-border/50 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-danger/50"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-warning/50"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-success/50"></span>
                                <span className="font-display font-[800] text-sm text-primary ml-2">Retrieval<span className="text-text">Co.</span></span>
                            </div>
                            
                            {/* Search Feed mock */}
                            <div className="w-48 sm:w-64 relative">
                                <input
                                    type="text"
                                    placeholder={step === 0 ? "Searching: iPhone..." : "Search items, locations..."}
                                    readOnly
                                    className="form-input !pl-8 text-[10px] py-1 bg-surface border-border/50 pointer-events-none transition-all duration-300"
                                />
                                <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                            </div>

                            {/* Notifications / Initials */}
                            <div className="flex items-center gap-3">
                                <div className="relative p-1 rounded-full text-text-muted">
                                    <Bell size={14} />
                                    <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-danger rounded-full"></span>
                                </div>
                                <div className="w-6 h-6 rounded-full flex items-center justify-center font-display font-bold text-[9px] text-white" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))' }}>
                                    KS
                                </div>
                            </div>
                        </div>



                        {/* Split panel mockup columns */}
                        <div className="grid grid-cols-12 gap-6 text-left items-start relative flex-1">
                            {/* Left Col filters sidebar mockup */}
                            <div className="col-span-4 flex flex-col gap-4 border-r border-border/30 pr-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Quick Filters</span>
                                    <div className="flex gap-1.5 flex-wrap">
                                        <div className="px-2 py-1 rounded-full bg-primary text-white text-[8px] font-semibold">All Items</div>
                                        <div className="px-2 py-1 rounded-full bg-surface border border-border text-text-muted text-[8px]">Today's</div>
                                        <div className="px-2 py-1 rounded-full bg-surface border border-border text-text-muted text-[8px]">Urgent</div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Categories</span>
                                    <div className="w-full text-left px-2 py-1.5 bg-surface border border-border rounded-lg text-[9px] text-text-muted flex justify-between items-center">
                                        <span>All Categories</span>
                                        <span>▾</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Col feed cards mockup */}
                            <div className="col-span-8 flex flex-col gap-4 relative w-full">
                                {/* Card 1: Lost iPhone */}
                                <div className="glass-panel border-l-[3px] border-l-danger rounded-lg p-4 flex flex-col gap-2 relative bg-surface/20">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded bg-danger text-white">Lost</span>
                                            <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded bg-zinc-800 text-text-muted border border-border">Open</span>
                                            <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded bg-danger/10 text-danger border border-danger/25">Urgent</span>
                                        </div>
                                        <span className="text-[8px] text-text-muted">Oct 15</span>
                                    </div>
                                    <h4 className="text-xs font-display font-bold text-text">Lost iPhone 14 Pro</h4>
                                    <p className="text-text-muted text-[10px] leading-relaxed line-clamp-1">Slipped from my pocket near the canteen. Blue color in a black case.</p>
                                    <div className="flex justify-between items-center border-t border-border/40 pt-2 mt-1">
                                        <div className="flex items-center gap-1.5 text-[9px] text-text-muted">
                                            <span className="w-4 h-4 rounded-full flex items-center justify-center font-display font-extrabold text-[6px] text-white" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))' }}>KS</span>
                                            <span>Kiran Sharma</span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <div className="px-2.5 py-1 rounded bg-primary text-white text-[9px] font-bold">Reply</div>
                                            <div className="px-1.5 py-1 rounded bg-surface border border-border text-[9px] text-text flex items-center justify-center"><QrCode size={10} /></div>
                                        </div>
                                    </div>
                                    
                                    {/* AI Match Banner (Rendered dynamically in step 1 & 2) */}
                                    {step >= 1 && (
                                        <div className="bg-primary-dim/10 border border-primary-dim/20 rounded-lg px-2.5 py-2.5 text-[10px] text-primary-dim flex items-center gap-1.5 mt-1.5 animate-in slide-in-from-top duration-300">
                                            <Sparkles size={11} className="text-primary-dim animate-spin" />
                                            <span>Potential match found — <strong>View Match</strong></span>
                                        </div>
                                    )}
                                </div>

                                {/* Card 2: Found Keys */}
                                <div className="glass-panel rounded-lg p-4 flex flex-col gap-2 relative bg-surface/20">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded bg-success text-white">Found</span>
                                            <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded bg-zinc-800 text-text-muted border border-border">Open</span>
                                        </div>
                                        <span className="text-[8px] text-text-muted">Oct 15</span>
                                    </div>
                                    <h4 className="text-xs font-display font-bold text-text">Keys with Keychain</h4>
                                    <p className="text-text-muted text-[10px] leading-relaxed line-clamp-1">Found a set of keys near the library desk. One key has a red rubber cap.</p>
                                    <div className="flex justify-between items-center border-t border-border/40 pt-2 mt-1">
                                        <div className="flex items-center gap-1.5 text-[9px] text-text-muted">
                                            <span className="w-4 h-4 rounded-full flex items-center justify-center font-display font-extrabold text-[6px] text-white" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))' }}>AP</span>
                                            <span>Anonymous Student</span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <div className="px-2.5 py-1 rounded bg-primary text-white text-[9px] font-bold">Reply</div>
                                            <div className="px-1.5 py-1 rounded bg-surface border border-border text-[9px] text-text flex items-center justify-center"><QrCode size={10} /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DYNAMIC OVERLAY ANIMATIONS WITH DEEP BACKDROP BLUR */}

                            {/* Step 0: "Report Loss" overlay */}
                            {step === 0 && (
                                <div className="absolute inset-0 bg-background/70 backdrop-blur-md flex items-center justify-center z-30 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="glass-panel border border-border shadow-modal rounded-xl p-5 bg-card w-80 text-left flex flex-col gap-3">
                                        <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                            <span className="text-xs font-bold text-text">Report Loss</span>
                                            <span className="px-1.5 py-0.5 text-[8px] bg-danger text-white rounded font-bold uppercase">Lost</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-text-muted">Item Title</span>
                                            <div className="text-xs text-text font-bold bg-surface p-2 rounded border border-border mt-1">iPhone 14 Pro</div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-text-muted">Location</span>
                                            <div className="text-xs text-text font-bold bg-surface p-2 rounded border border-border mt-1">Campus Canteen</div>
                                        </div>
                                        <div className="bg-danger text-white text-xs font-bold py-2 rounded text-center shadow-md animate-pulse">
                                            Publishing Lost Report...
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 1: "Borrow Request" overlay */}
                            {step === 1 && (
                                <div className="absolute inset-0 bg-background/70 backdrop-blur-md flex items-center justify-center z-30 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="glass-panel border border-border shadow-modal rounded-xl p-5 bg-card w-80 text-left flex flex-col gap-3">
                                        <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                            <span className="text-xs font-bold text-text">Request to Borrow</span>
                                            <span className="px-1.5 py-0.5 text-[8px] bg-primary text-white rounded font-bold uppercase">Borrow</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-text-muted">Item Requested</span>
                                            <div className="text-xs text-text font-bold bg-surface p-2 rounded border border-border mt-1">Casio Calculator</div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-text-muted">Needed For</span>
                                            <div className="text-xs text-text font-bold bg-surface p-2 rounded border border-border mt-1">Midterm Exam (2 Hours)</div>
                                        </div>
                                        <div className="bg-primary text-white text-xs font-bold py-2 rounded text-center shadow-md animate-pulse">
                                            Publishing Borrow Request...
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: "AI Matching" overlay */}
                            {step === 2 && (
                                <div className="absolute inset-0 bg-background/70 backdrop-blur-md flex items-center justify-center z-30 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="glass-panel border border-border shadow-modal rounded-xl p-5 bg-card w-80 text-center flex flex-col items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Sparkles className="text-primary animate-pulse" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-text">AI Matching Engine</h4>
                                            <p className="text-[10px] text-text-muted mt-1 leading-relaxed px-2">
                                                Our live database successfully matched:
                                            </p>
                                            <div className="flex flex-col gap-2 mt-2 w-64">
                                                <div className="bg-surface border border-border rounded-lg px-3 py-2 text-[10px] text-text flex items-center justify-between gap-1">
                                                    <span className="text-text-muted font-medium">Lost iPhone</span>
                                                    <div className="flex-grow h-[1px] bg-border mx-2 relative overflow-hidden">
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/10 text-primary border border-primary/30 rounded-full px-1 py-0.5 text-[6px] font-extrabold tracking-wider">AI</div>
                                                    </div>
                                                    <span className="text-success font-semibold">Found iPhone</span>
                                                </div>
                                                <div className="bg-surface border border-border rounded-lg px-3 py-2 text-[10px] text-text flex items-center justify-between gap-1">
                                                    <span className="text-text-muted font-medium">Borrow Calc</span>
                                                    <div className="flex-grow h-[1px] bg-border mx-2 relative overflow-hidden">
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/10 text-primary border border-primary/30 rounded-full px-1 py-0.5 text-[6px] font-extrabold tracking-wider">AI</div>
                                                    </div>
                                                    <span className="text-primary font-semibold">Shared Calc</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: "Secure QR Handoff" overlay */}
                            {step === 3 && (
                                <div className="absolute inset-0 bg-background/70 backdrop-blur-md flex items-center justify-center z-30 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="glass-panel border border-border shadow-modal rounded-xl p-5 bg-card w-80 text-center flex flex-col items-center gap-3">
                                        <h4 className="text-xs font-bold text-text flex items-center gap-1.5 justify-center">
                                            <QrCode className="text-success animate-pulse" size={16} /> Secure QR Handoff
                                        </h4>
                                        <div className="bg-white p-3 rounded-lg border border-border mt-1 flex items-center justify-center w-36 h-36">
                                            <QrCode size={120} className="text-zinc-900" />
                                        </div>
                                        <p className="text-[10px] text-text-muted leading-relaxed">
                                            Verification complete! Items successfully returned and handoffs verified. +Karma Points awarded!
                                        </p>
                                        <div className="flex gap-2">
                                            <div className="bg-success/15 border border-success/35 text-success text-[8px] font-bold py-1 px-2.5 rounded-full">
                                                Verified Returned
                                            </div>
                                            <div className="bg-primary/15 border border-primary/35 text-primary text-[8px] font-bold py-1 px-2.5 rounded-full">
                                                Verified Borrowed
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Gradient fade at bottom of hero */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none z-20"></div>
            </section>

            {/* PLATFORM FEATURES (Bento Grid with micro-animations & Lucide icons) */}
            <section id="features" className="py-32 px-4 md:px-8 max-w-6xl mx-auto scroll-mt-24">
                <div className="text-center max-w-xl mx-auto mb-16">
                    <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">Platform Features</span>
                    <h2 className="text-3xl md:text-4xl font-display font-[800] tracking-tight leading-tight">
                        Engineered for active campus communities.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 1. AI Matching (Most Unique, 2 Columns wide) */}
                    <div className="glass-panel p-6 rounded-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500 group md:col-span-2">
                        <span className="absolute top-3.5 right-4 bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full z-10">
                            Core Feature
                        </span>
                        
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-6 items-center h-full">
                            <div className="lg:col-span-3 flex flex-col gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                    <Brain className="text-primary" size={20} />
                                </div>
                                <h3 className="font-display font-bold text-base text-text">AI Matching</h3>
                                <p className="text-text-muted text-[13px] leading-relaxed">
                                    Deep semantic parsing connects lost posts with found log records in real time. We match locations, visual descriptions, and item properties automatically.
                                </p>
                            </div>

                            {/* Interactive Graph Widget - Side Column (No Overlap) */}
                            <div className="lg:col-span-2 flex flex-col gap-2 bg-background/60 p-4 border border-border/60 rounded-xl w-full overflow-hidden shadow-inner">
                                <div className="flex justify-between items-center text-[8px] text-text-muted uppercase font-bold tracking-wider">
                                    <span>Lost Post</span>
                                    <span>Found Log</span>
                                </div>
                                <div className="flex items-center justify-between mt-2 gap-4 relative">
                                    <div className="w-16 py-1 rounded bg-danger/10 border border-danger/30 text-[8px] text-danger font-bold text-center animate-pulse">
                                        Lost iPhone
                                    </div>
                                    <div className="flex-1 h-[2px] bg-border relative overflow-hidden">
                                        <div className="absolute top-0 bottom-0 left-0 bg-primary w-4 animate-shimmer"></div>
                                    </div>
                                    <div className="w-16 py-1 rounded bg-success/10 border border-success/30 text-[8px] text-success font-bold text-center animate-pulse">
                                        Found iPhone
                                    </div>
                                </div>
                                <div className="text-[7.5px] text-center text-primary mt-1.5 font-semibold">
                                    AI Similarity: 98% Match
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Schedule Sync (Highly Unique) */}
                    <div className="glass-panel p-6 rounded-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500 group flex flex-col justify-between min-h-[280px]">
                        <div className="flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Calendar className="text-primary" size={20} />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-base text-text mb-1">Schedule Sync</h3>
                                <p className="text-text-muted text-[13px] leading-relaxed">
                                    Coordinate borrows based on class schedules. Align meetup times effortlessly between classes.
                                </p>
                            </div>
                        </div>

                        {/* Custom Micro Preview - Clean Inline Placement */}
                        <div className="bg-surface/60 border border-border/60 rounded-lg p-2.5 w-full mt-4 flex flex-col gap-2">
                            <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider">Sync Timeline</span>
                            <div className="flex items-center justify-between gap-1">
                                <div className="flex-1 bg-border/40 border border-border rounded py-1 px-1.5 text-[8px] text-center text-text-muted font-medium truncate">
                                    10:00 AM Class
                                </div>
                                <div className="w-2.5 h-[1px] bg-border/80 shrink-0"></div>
                                <div className="bg-primary/10 border border-primary/30 rounded py-1 px-1.5 text-[8px] text-center text-primary font-bold shrink-0">
                                    11:30 AM Synced
                                </div>
                                <div className="w-2.5 h-[1px] bg-border/80 shrink-0"></div>
                                <div className="flex-1 bg-border/40 border border-border rounded py-1 px-1.5 text-[8px] text-center text-text-muted font-medium truncate">
                                    12:30 PM Class
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. QR Handoff (Very Unique) */}
                    <div className="glass-panel p-6 rounded-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500 group flex flex-col justify-between min-h-[280px]">
                        <div className="flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <QrCode className="text-primary" size={20} />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-base text-text mb-1">QR Handoff</h3>
                                <p className="text-text-muted text-[13px] leading-relaxed">
                                    Verifies returns securely with dual-scan QR confirmation, guaranteeing the item goes to the right owner.
                                </p>
                            </div>
                        </div>

                        {/* Custom Micro Preview - Clean Inline Placement */}
                        <div className="bg-surface/60 border border-border/60 rounded-lg p-2 relative overflow-hidden flex items-center justify-center w-full h-16 mt-4">
                            <QrCode size={30} className="text-primary-dim opacity-70" />
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary animate-scan shadow-[0_0_8px_var(--primary)]"></div>
                        </div>
                    </div>

                    {/* 4. Quick Post (Least Unique, 1 Column) */}
                    <div className="glass-panel p-6 rounded-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500 group flex flex-col justify-between min-h-[280px]">
                        <div className="flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <PlusSquare className="text-primary" size={20} />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-base text-text mb-1">Quick Post</h3>
                                <p className="text-text-muted text-[13px] leading-relaxed">
                                    Report lost, found, or borrow items in seconds with visual photo uploads and automated tags.
                                </p>
                            </div>
                        </div>

                        {/* Custom Micro Preview - Clean Inline Placement */}
                        <div className="bg-surface/60 border border-border/60 p-2.5 rounded-lg shadow-inner flex flex-col gap-1.5 w-full mt-4">
                            <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider">Mock Post Creation</span>
                            <div className="h-2 bg-border rounded w-16"></div>
                            <div className="h-5 bg-primary/10 rounded mt-1 flex items-center justify-center text-[8px] text-primary font-bold">
                                ✓ Photo Loaded
                            </div>
                        </div>
                    </div>

                    {/* 5. Karma Points (Unique Gamification) */}
                    <div className="glass-panel p-6 rounded-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500 group flex flex-col justify-between min-h-[280px]">
                        <div className="flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Trophy className="text-primary" size={20} />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-base text-text mb-1">Karma Points</h3>
                                <p className="text-text-muted text-[13px] leading-relaxed">
                                    Earn karma points, claim achievements, and climb the campus leaderboard for helpful behavior.
                                </p>
                            </div>
                        </div>

                        {/* Custom Micro Preview - Clean Inline Placement */}
                        <div className="bg-surface/60 border border-border/60 rounded-lg p-2.5 w-full mt-4 flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-[7px] text-text font-bold">
                                <span>1. Mohit D.</span>
                                <span className="text-primary font-bold">120 XP</span>
                            </div>
                            <div className="h-[3px] bg-border rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full w-4/5"></div>
                            </div>
                            <div className="flex justify-between items-center text-[7px] text-text-muted mt-0.5">
                                <span>2. Kiran S.</span>
                                <span className="text-primary-dim font-bold">90 XP</span>
                            </div>
                        </div>
                    </div>

                    {/* 6. Loss Hotspots (Very Unique - Full Width Banner at bottom) */}
                    <div className="glass-panel p-6 rounded-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500 group md:col-span-3">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                            <div className="lg:col-span-2 flex flex-col gap-3 text-left">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                    <MapPin className="text-primary" size={20} />
                                </div>
                                <h3 className="font-display font-bold text-base text-text">Loss Hotspots</h3>
                                <p className="text-text-muted text-[13px] leading-relaxed">
                                    Visualizes lost items using AI campus heatmaps. Avoid high-loss zones and secure your items.
                                </p>
                            </div>
                            
                            {/* Custom Map / Hotspots Dashboard Preview */}
                            <div className="bg-surface/60 border border-border/60 p-4 rounded-lg shadow-inner flex flex-col gap-3 w-full">
                                <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider">Live Analytics Map</span>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-[9px] bg-danger/10 border border-danger/20 rounded p-1 px-2 text-danger">
                                        <span>Campus Canteen</span>
                                        <span className="font-bold">High Risk (85%)</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] bg-warning/10 border border-warning/20 rounded p-1 px-2 text-warning">
                                        <span>Central Library</span>
                                        <span className="font-bold">Medium Risk (42%)</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] bg-success/10 border border-success/20 rounded p-1 px-2 text-success">
                                        <span>Sports Complex</span>
                                        <span className="font-bold">Low Risk (12%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}
