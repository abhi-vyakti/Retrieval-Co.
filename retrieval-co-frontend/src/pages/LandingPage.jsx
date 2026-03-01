import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, Calendar, QrCode, Star, MapPin } from 'lucide-react';

const statsData = [
    { label: "Items Recovered", value: 847 },
    { label: "Active Students", value: 2340 },
    { label: "Borrows Fulfilled", value: 612 },
    { label: "Karma Points Awarded", value: 18940 }
];

const featuresData = [
    {
        icon: "🤖",
        title: "Smart Matching",
        desc: "AI instantly cross-references lost and found reports using text + image similarity. Top matches surface in seconds."
    },
    {
        icon: "⚡",
        title: "Quick Post",
        desc: "Report lost, found, or borrow in under 60 seconds. Structured forms mean no more buried WhatsApp messages."
    },
    {
        icon: "📅",
        title: "Schedule Sync",
        desc: "Smart timetable integration identifies which sections just finished a relevant class — so you borrow from the right people."
    },
    {
        icon: "📱",
        title: "QR Confirmation",
        desc: "Dual-scan QR-based handoff confirmation. Every return is verified, every transaction is trusted."
    },
    {
        icon: "🏆",
        title: "Karma & Leaderboard",
        desc: "Earn karma points for every good deed. Climb the weekly leaderboard and unlock the Trusted Retriever badge."
    },
    {
        icon: "🗺️",
        title: "Loss Hotspots",
        desc: "AI-generated heatmap of where items go missing most on campus. Helps you search smarter, not harder."
    }
];

function AnimatedCounter({ endValue, duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const start = performance.now();
                    const animate = (currentTime) => {
                        const elapsed = currentTime - start;
                        const progress = Math.min(elapsed / duration, 1);
                        setCount(Math.floor(progress * endValue));
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [endValue, duration]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-ink">
            {/* ─── HERO ─── */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[120px] pb-[80px] relative overflow-hidden">
                {/* Radial gradient bg */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse 80% 60% at 50% 10%, rgba(0,201,200,0.1) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,143,142,0.07) 0%, transparent 60%)'
                    }}
                />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }}
                />

                {/* Badge */}
                <div
                    className="inline-flex items-center gap-2 bg-[rgba(0,201,200,0.12)] border border-[rgba(0,201,200,0.3)] text-amber rounded-full px-4 py-1.5 text-[0.8rem] font-semibold tracking-wider uppercase mb-7 z-10"
                    style={{ animation: 'fadeUp 0.6s ease both' }}
                >
                    <span className="text-[0.5rem]" style={{ animation: 'pulse 1.5s infinite' }}>●</span>
                    AI-Powered Campus Platform
                </div>

                {/* Hero Title */}
                <h1
                    className="font-display font-[800] leading-[0.95] tracking-[-0.04em] z-10"
                    style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', animation: 'fadeUp 0.7s ease 0.1s both' }}
                >
                    Lost it.<br />
                    <em className="not-italic text-amber">Find it.</em><br />
                    Borrow it.
                </h1>

                {/* Subtitle */}
                <p
                    className="max-w-[560px] text-[1.15rem] text-text-muted mx-auto mt-6 mb-10 leading-[1.7] z-10"
                    style={{ animation: 'fadeUp 0.7s ease 0.2s both' }}
                >
                    The intelligent campus system that reunites students with lost items and connects borrowers with lenders — in minutes, not days.
                </p>

                {/* Hero Buttons */}
                <div
                    className="flex gap-3.5 justify-center flex-wrap z-10"
                    style={{ animation: 'fadeUp 0.7s ease 0.3s both' }}
                >
                    <Link
                        to="/login"
                        className="bg-amber text-ink border-none rounded-[10px] px-8 py-3.5 font-display font-bold text-base cursor-pointer transition-all hover:bg-[#00e5e4] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,201,200,0.3)] no-underline"
                    >
                        Launch Dashboard →
                    </Link>
                    <button className="bg-transparent text-text border border-border rounded-[10px] px-8 py-3.5 font-display font-semibold text-base cursor-pointer transition-all hover:border-text-muted hover:-translate-y-0.5">
                        Watch Demo ▷
                    </button>
                </div>

                {/* Stats */}
                <div
                    className="flex gap-12 justify-center mt-[72px] flex-wrap z-10"
                    style={{ animation: 'fadeUp 0.7s ease 0.4s both' }}
                >
                    {statsData.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="font-display text-[2.2rem] font-[800] text-amber">
                                <AnimatedCounter endValue={stat.value} />
                            </div>
                            <div className="text-[0.8rem] text-text-muted uppercase tracking-wider mt-0.5">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── STATS BAR ─── */}
            <section className="bg-card border-t border-b border-border py-16 px-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-[900px] mx-auto text-center">
                    <div>
                        <div className="font-display text-[3rem] font-[800] text-amber">94%</div>
                        <div className="text-text-muted text-[0.85rem] mt-1">Recovery Rate</div>
                    </div>
                    <div>
                        <div className="font-display text-[3rem] font-[800] text-amber">&lt;8m</div>
                        <div className="text-text-muted text-[0.85rem] mt-1">Avg. Match Time</div>
                    </div>
                    <div>
                        <div className="font-display text-[3rem] font-[800] text-amber">12</div>
                        <div className="text-text-muted text-[0.85rem] mt-1">Campuses Onboarded</div>
                    </div>
                    <div>
                        <div className="font-display text-[3rem] font-[800] text-amber">4.9★</div>
                        <div className="text-text-muted text-[0.85rem] mt-1">Student Rating</div>
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section className="py-[100px] px-12 max-w-[1200px] mx-auto">
                <div className="text-[0.75rem] font-bold tracking-[0.12em] uppercase text-amber mb-4">
                    Platform Features
                </div>
                <h2 className="font-[800] tracking-[-0.03em] leading-[1.1]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                    Everything campus<br />
                    <span className="text-amber">lost & found needs.</span>
                </h2>
                <p className="text-text-muted mt-3 text-base max-w-[480px] leading-[1.6]">
                    Six powerful features built specifically for how college life works.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
                    {featuresData.map((feat) => (
                        <div
                            key={feat.title}
                            className="bg-card border border-border rounded-[var(--radius)] p-7 relative overflow-hidden transition-all duration-200 hover:border-[rgba(0,201,200,0.4)] hover:-translate-y-1 group"
                        >
                            {/* Hover glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,201,200,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-[44px] h-[44px] rounded-[10px] bg-[rgba(0,201,200,0.12)] flex items-center justify-center text-[1.3rem] mb-[18px]">
                                    {feat.icon}
                                </div>
                                <div className="font-display font-bold text-[1.05rem] mb-2">{feat.title}</div>
                                <div className="text-text-muted text-[0.9rem] leading-[1.6]">{feat.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
