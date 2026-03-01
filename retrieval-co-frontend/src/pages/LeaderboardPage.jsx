import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Zap } from 'lucide-react';

export default function LeaderboardPage() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/karma/leaderboard');
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
            case 0: return 'text-[#ffd700]'; // gold
            case 1: return 'text-[#c0c0c0]'; // silver
            case 2: return 'text-[#cd7f32]'; // bronze
            default: return 'text-text-muted';
        }
    };

    return (
        <div className="min-h-screen bg-ink pt-24 pb-16 px-6 max-w-4xl mx-auto">
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(0,201,200,0.12)] mb-5">
                    <Trophy size={28} className="text-amber" />
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-[800] text-text mb-3">
                    Weekly <span className="text-amber">Leaderboard</span>
                </h1>
                <p className="text-text-muted max-w-2xl mx-auto text-[15px]">
                    Recognizing the top contributors who help return lost items to their owners.
                </p>
            </div>

            {/* Leaderboard Strip */}
            <div className="bg-card border border-border rounded-[var(--radius)] p-6 mb-8">
                <h3 className="text-[1rem] font-bold mb-4 flex items-center gap-2">
                    <span className="text-[1.1rem]">🏆</span> Top 5 This Week
                </h3>
                <div className="flex gap-4 overflow-x-auto">
                    {leaders.slice(0, 5).map((user, index) => (
                        <div key={user.id} className="flex items-center gap-2.5 bg-surface rounded-[10px] px-4 py-2.5 whitespace-nowrap">
                            <span className={`font-display font-[800] text-[0.85rem] w-[18px] ${getRankColor(index)}`}>
                                {index + 1}
                            </span>
                            <span className="font-semibold text-[0.88rem]">{user.name}</span>
                            <span className="text-[0.8rem] text-amber font-bold ml-auto">{user.karmaPoints} pts</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Full Table */}
            <div className="bg-card border border-border rounded-[var(--radius-xl)] overflow-hidden">
                <div className="p-4 px-6 bg-surface border-b border-border flex justify-between items-center text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                    <span className="w-14 text-center">Rank</span>
                    <span className="flex-1">Student</span>
                    <span className="w-28 text-right">Karma</span>
                </div>

                {loading ? (
                    <div className="divide-y divide-border">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="p-4 md:p-5 flex items-center animate-pulse">
                                <div className="w-14 flex justify-center items-center">
                                    <div className="w-7 h-7 bg-surface rounded-full"></div>
                                </div>
                                <div className="flex-1 ml-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-surface"></div>
                                    <div className="space-y-1.5 flex-1 max-w-[140px]">
                                        <div className="w-full h-3.5 bg-surface rounded-md"></div>
                                        <div className="w-3/4 h-2.5 bg-surface rounded-md"></div>
                                    </div>
                                </div>
                                <div className="w-28 flex justify-end">
                                    <div className="w-16 h-8 bg-surface rounded-lg"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : leaders.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <Trophy size={40} className="text-text-muted mb-4" />
                        <h3 className="text-lg font-display font-bold text-text mb-1">No Leaders Yet</h3>
                        <p className="text-[13px] text-text-muted">Be the first to return an item and claim the top spot!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {leaders.map((user, index) => (
                            <div
                                key={user.id}
                                className={`p-4 md:p-5 flex items-center hover:bg-surface transition-colors ${index === 0 ? 'bg-[rgba(0,201,200,0.04)]' : ''}`}
                            >
                                <div className="w-14 flex justify-center items-center">
                                    <span className={`font-display font-[800] text-[0.85rem] ${getRankColor(index)}`}>
                                        {index + 1}
                                    </span>
                                </div>

                                <div className="flex-1 ml-3 flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-[14px] text-ink"
                                        style={{ background: 'linear-gradient(135deg, #00c9c8, #008f8e)' }}
                                    >
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-text text-[14px]">{user.name}</div>
                                        <div className="text-[11px] text-text-muted">{user.collegeId}</div>
                                    </div>
                                </div>

                                <div className="w-28 text-right">
                                    <div className="inline-flex items-center gap-1.5 bg-[rgba(0,201,200,0.12)] border border-[rgba(0,201,200,0.2)] px-3 py-1.5 rounded-lg">
                                        <Zap size={12} className="text-amber" />
                                        <span className="font-display font-bold text-amber text-[15px]">
                                            {user.karmaPoints}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
