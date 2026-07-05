import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Zap, ShieldCheck, Award } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function LeaderboardPage() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/karma/leaderboard`);
                const data = await res.json();

                if (res.ok) {
                    const formattedLeaders = data.leaderboard.map((u, i) => ({
                        id: u._id || String(i),
                        name: u.name || 'Anonymous',
                        karmaPoints: u.karma || 0,
                        collegeId: u.collegeId || 'Unknown'
                    }));
                    setLeaders(formattedLeaders.slice(0, 10));
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankColor = (index) => {
        switch (index) {
            case 0: return 'text-yellow-500';
            case 1: return 'text-zinc-400';
            case 2: return 'text-orange-500';
            default: return 'text-text-muted';
        }
    };

    const getRankBadge = (rank) => {
        switch(rank) {
            case 1:
                return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/25 font-bold text-xs">1</span>;
            case 2:
                return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-400/10 text-zinc-400 border border-zinc-400/25 font-bold text-xs">2</span>;
            case 3:
                return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/25 font-bold text-xs">3</span>;
            default:
                return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface text-text-muted border border-border font-bold text-xs">{rank}</span>;
        }
    };

    const getDept = (collegeId) => {
        if (!collegeId) return 'CSE';
        const id = collegeId.toUpperCase();
        if (id.includes('CS') || id.includes('BCE')) return 'CSE';
        if (id.includes('EC')) return 'ECE';
        if (id.includes('EE')) return 'EEE';
        if (id.includes('ME')) return 'MECH';
        if (id.includes('CE')) return 'CIVIL';
        return 'CSE';
    };

    return (
        <div className="min-h-screen bg-background pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto flex flex-col gap-8">
            <div className="text-center border-b border-border pb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-bounce">
                    <Trophy size={24} className="text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-[800] text-text mb-2 tracking-tight">
                    Weekly <span className="text-primary">Karma Leaderboard</span>
                </h1>
                <p className="text-text-muted max-w-xl mx-auto text-[14px]">
                    Celebrating Sreenidhi students who actively report lost items and verify successful returns.
                </p>
            </div>

            {/* Top 3 Spotlight Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                {leaders.slice(0, 3).map((user, index) => {
                    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                    const returnCount = Math.max(1, Math.round(user.karmaPoints / 40));
                    return (
                        <div key={user.id} className="glass-panel p-5 rounded-xl flex items-center gap-4 relative overflow-hidden">
                            <span className="absolute top-2 right-2 opacity-15 text-primary">
                                {index === 0 ? <Trophy size={36} /> : index === 1 ? <Medal size={36} /> : <Award size={36} />}
                            </span>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-display font-extrabold text-white" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))' }}>
                                {initials}
                            </div>
                            <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-text text-sm truncate">{user.name}</h4>
                                <div className="text-[10px] text-text-muted mt-0.5 flex items-center gap-1.5">
                                    <span className="bg-surface px-1.5 py-0.5 rounded text-text border border-border font-medium text-[9px]">{getDept(user.collegeId)}</span>
                                    <span>•</span>
                                    <span className="font-medium text-success">{returnCount} returns</span>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">Karma</span>
                                <span className="text-lg font-display font-extrabold text-primary">{user.karmaPoints}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block glass-panel rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-surface text-[10px] uppercase font-bold text-text-muted tracking-wider">
                                <th className="py-4 px-6 text-center w-16">Rank</th>
                                <th className="py-4 px-6">Student details</th>
                                <th className="py-4 px-6 text-center w-32">Department</th>
                                <th className="py-4 px-6 text-center w-28">Returns</th>
                                <th className="py-4 px-6 text-right w-28">Karma Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-border/40 animate-pulse">
                                        <td className="py-4 px-6 text-center">
                                            <div className="w-6 h-6 bg-surface rounded-full mx-auto"></div>
                                        </td>
                                        <td className="py-4 px-6 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-surface"></div>
                                            <div className="space-y-1.5">
                                                <div className="w-24 h-3 bg-surface rounded"></div>
                                                <div className="w-16 h-2 bg-surface rounded"></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="w-12 h-4 bg-surface rounded mx-auto"></div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="w-8 h-4 bg-surface rounded mx-auto"></div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="w-12 h-6 bg-surface rounded ml-auto"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : leaders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <Trophy size={40} className="text-text-muted mb-3 mx-auto" />
                                        <h3 className="text-base font-display font-bold text-text mb-1">No contributors yet</h3>
                                        <p className="text-xs text-text-muted">Return an item on campus to claim the top spot!</p>
                                    </td>
                                </tr>
                            ) : (
                                leaders.map((user, index) => {
                                    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                                    const returnCount = Math.max(1, Math.round(user.karmaPoints / 40));
                                    return (
                                        <tr 
                                            key={user.id} 
                                            className="border-b border-border/40 hover:bg-surface/50 transition-colors"
                                        >
                                            <td className="py-4 px-6 text-center font-display font-bold text-xs">
                                                {getRankBadge(index + 1)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-[11px] text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))' }}>
                                                        {initials}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-text text-sm truncate">{user.name}</div>
                                                        <div className="text-[10px] text-text-muted truncate">{user.collegeId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="px-2 py-1 rounded bg-surface text-text text-[10px] font-bold border border-border uppercase">
                                                    {getDept(user.collegeId)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center text-xs font-semibold text-text">
                                                {returnCount}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="inline-flex items-center gap-1 bg-primary/10 border border-primary/15 px-2.5 py-1 rounded text-primary font-display font-bold text-sm">
                                                    <Zap size={10} className="fill-current" />
                                                    <span>{user.karmaPoints}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden flex flex-col gap-3">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="glass-panel p-4 rounded-xl flex items-center gap-3 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-surface shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="w-24 h-4 bg-surface rounded"></div>
                                <div className="w-16 h-3 bg-surface rounded"></div>
                            </div>
                            <div className="w-12 h-6 bg-surface rounded shrink-0"></div>
                        </div>
                    ))
                ) : leaders.length === 0 ? (
                    <div className="glass-panel p-8 rounded-xl text-center">
                        <Trophy size={40} className="text-text-muted mb-3 mx-auto" />
                        <h3 className="text-base font-display font-bold text-text mb-1">No contributors yet</h3>
                        <p className="text-xs text-text-muted">Return an item on campus to claim the top spot!</p>
                    </div>
                ) : (
                    leaders.map((user, index) => {
                        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                        const returnCount = Math.max(1, Math.round(user.karmaPoints / 40));
                        return (
                            <div key={user.id} className="glass-panel p-4 rounded-xl flex flex-col gap-3 relative">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="shrink-0">
                                            {getRankBadge(index + 1)}
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-[11px] text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))' }}>
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-text text-sm truncate">{user.name}</div>
                                                <div className="text-[10px] text-text-muted truncate">{user.collegeId}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center gap-1 bg-primary/10 border border-primary/15 px-2 py-1 rounded text-primary font-display font-bold text-xs shrink-0">
                                        <Zap size={10} className="fill-current" />
                                        <span>{user.karmaPoints}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-3 border-t border-border/40">
                                    <span className="px-2 py-1 rounded bg-surface text-text text-[10px] font-bold border border-border uppercase">
                                        {getDept(user.collegeId)}
                                    </span>
                                    <span className="text-[10px] text-text-muted">•</span>
                                    <span className="text-xs font-semibold text-text">{returnCount} returns</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

