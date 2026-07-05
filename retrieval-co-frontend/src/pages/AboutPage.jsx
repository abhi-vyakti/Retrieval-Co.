import { Heart, Users, Zap, Target, Sparkles, Github, Linkedin } from 'lucide-react';

const values = [
    {
        icon: Heart,
        title: 'Community First',
        desc: 'Built by students, for students. Every feature is designed to strengthen campus bonds and foster mutual trust.',
    },
    {
        icon: Zap,
        title: 'Speed Matters',
        desc: 'Lost items have a ticking clock. Our AI matching and instant notifications ensure the fastest possible recovery.',
    },
    {
        icon: Users,
        title: 'Collaborative Spirit',
        desc: 'From lending a calculator before exams to returning a lost ID card — small acts create big impact.',
    },
    {
        icon: Target,
        title: 'Smart by Design',
        desc: 'Heatmaps, karma systems, and QR handoffs aren\'t gimmicks — they\'re tools that make the process seamless.',
    },
];

const stats = [
    { value: 'AI-Powered', label: 'Matching Engine' },
    { value: 'Real-time', label: 'Notifications' },
    { value: 'QR-Based', label: 'Secure Handoffs' },
    { value: 'Karma', label: 'Reward System' },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-background">
            <div className="max-w-4xl mx-auto">

                {/* Hero */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
                        <Sparkles className="text-primary" size={28} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-display font-[800] tracking-tight mb-5 leading-tight">
                        About <span className="text-primary">Retrieval</span>Co.
                    </h1>
                    <p className="text-text-muted text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        RetrievalCo. is a smart campus platform that helps students recover lost items, borrow resources,
                        and build a more connected community — all powered by AI matching and a trust-based karma system.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="glass-panel rounded-xl border border-border p-5 text-center hover:border-primary/30 transition-all duration-300 group"
                        >
                            <div className="text-lg md:text-xl font-display font-[800] text-primary mb-1 group-hover:scale-105 transition-transform duration-300">
                                {stat.value}
                            </div>
                            <div className="text-[11px] text-text-muted font-medium tracking-wide uppercase">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Our Story */}
                <div className="mb-20">
                    <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block text-center">Our Story</span>
                    <h2 className="text-2xl md:text-3xl font-display font-[800] tracking-tight text-center mb-8">
                        Why we built this
                    </h2>
                    <div className="glass-panel rounded-xl border border-border p-8 md:p-10">
                        <div className="flex flex-col gap-5 text-[14px] text-text-muted leading-relaxed">
                            <p>
                                It started with a lost calculator right before a midterm exam. The campus had no centralized system — just
                                scattered WhatsApp groups and notice boards that nobody checked. Items were lost, time was wasted, and
                                the stress kept piling up.
                            </p>
                            <p>
                                <span className="text-text font-semibold">RetrievalCo.</span> was born from that frustration. We wanted to
                                create something that wasn't just a digital lost-and-found board, but an intelligent platform that actively
                                helps match items, coordinates handoffs securely, and rewards the people who make campus life better.
                            </p>
                            <p>
                                With AI-powered matching, real-time notifications, QR-verified handoffs, and a karma-based reputation system,
                                RetrievalCo. transforms how campuses handle lost items and resource sharing. Because on a campus of thousands,
                                no one should feel alone when they lose something important.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-20">
                    <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block text-center">Our Values</span>
                    <h2 className="text-2xl md:text-3xl font-display font-[800] tracking-tight text-center mb-10">
                        What drives us
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {values.map((value, i) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={i}
                                    className="glass-panel p-6 rounded-xl border border-border hover:border-primary/30 transition-all duration-300 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Icon className="text-primary" size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-display font-bold mb-1.5 text-text">
                                                {value.title}
                                            </h3>
                                            <p className="text-[13px] text-text-muted leading-relaxed">
                                                {value.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Creator */}
                <div className="text-center">
                    <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3 block">The Creator</span>
                    <h2 className="text-2xl md:text-3xl font-display font-[800] tracking-tight mb-8">
                        Built with 🤍 by Abhijeet
                    </h2>
                    <div className="glass-panel rounded-xl border border-border p-8 max-w-md mx-auto hover:border-primary/30 transition-all duration-300">
                        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center font-display font-bold text-xl text-white" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))' }}>
                            AB
                        </div>
                        <h3 className="font-display font-bold text-lg text-text mb-1">Abhijeet Barik</h3>
                        <p className="text-[13px] text-text-muted mb-4">Developer & Designer</p>
                        <div className="flex justify-center gap-3">
                            <a
                                href="https://www.linkedin.com/in/abhijeet-barik"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors no-underline"
                            >
                                <Linkedin size={14} /> LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
