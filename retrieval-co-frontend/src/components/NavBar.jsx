import { Link, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
    const { user, token, logout } = useAuth();
    const isAuthenticated = !!token;
    const userKarma = user?.karma || 0;
    const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';

    const location = useLocation();

    const publicLinks = [
        { name: 'Features', path: '/' },
        { name: 'How it works', path: '/' },
        { name: 'Hotspots', path: '/hotspots' },
        { name: 'Leaderboard', path: '/leaderboard' },
    ];

    const authLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Create Post', path: '/create' },
        { name: 'My Posts', path: '/my-posts' },
        { name: 'Hotspots', path: '/hotspots' },
        { name: 'Leaderboard', path: '/leaderboard' },
    ];

    const links = isAuthenticated ? authLinks : publicLinks;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[48px] py-[18px] bg-[rgba(13,13,15,0.85)] backdrop-blur-[16px] border-b border-border">
            {/* Logo */}
            <Link to="/" className="flex items-center">
                <span className="font-display font-[800] text-[1.35rem] tracking-[-0.02em] text-amber">
                    Retrieval<span className="text-text">Co.</span>
                </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-[32px]">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`text-[0.9rem] font-medium transition-colors no-underline ${location.pathname === link.path
                                ? 'text-text'
                                : 'text-text-muted hover:text-text'
                            }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-[16px]">
                {isAuthenticated ? (
                    <>
                        {/* Karma Badge */}
                        <div className="flex items-center gap-[6px] bg-[rgba(0,201,200,0.12)] border border-[rgba(0,201,200,0.25)] text-amber rounded-full px-[14px] py-[6px] text-[0.85rem] font-bold">
                            <Zap size={14} /> {userKarma} Karma
                        </div>
                        {/* Avatar */}
                        <div
                            className="w-[36px] h-[36px] rounded-full flex items-center justify-center font-display font-[800] text-[0.85rem] text-ink cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #00c9c8, #008f8e)' }}
                            title="My Posts"
                        >
                            {userInitials}
                        </div>
                        <button onClick={logout} className="text-text-muted hover:text-red text-sm font-medium transition-colors cursor-pointer">
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-amber text-ink border-none rounded-[8px] px-[22px] py-[10px] font-display font-bold text-[0.9rem] cursor-pointer transition-all hover:bg-[#00e5e4] hover:-translate-y-[1px]"
                    >
                        Get Started →
                    </button>
                )}
            </div>
        </nav>
    );
}
