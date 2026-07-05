import { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Menu, X, Sun, Moon, LayoutDashboard, PlusSquare, Map, Trophy, User, Info, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function NavBar() {
    const { user, token, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const isAuthenticated = !!token;
    const userKarma = user?.karma || 0;
    const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';

    const location = useLocation();
    const navigate = useNavigate();

    const scrollToFeatures = useCallback((e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            const el = document.getElementById('how-it-works');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }, [location.pathname, navigate]);

    const publicLinks = [
        { name: 'Home', path: '/', icon: LayoutDashboard },
        { name: 'How it Works', path: '#how-it-works', icon: Info, onClick: scrollToFeatures },
        { name: 'Hotspots', path: '/hotspots', icon: Map },
        { name: 'Leaders', path: '/leaderboard', icon: Trophy },
    ];

    const authLinks = [
        { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Post', path: '/create', icon: PlusSquare },
        { name: 'Hotspots', path: '/hotspots', icon: Map },
        { name: 'Leaders', path: '/leaderboard', icon: Trophy },
    ];

    const links = isAuthenticated ? authLinks : publicLinks;

    return (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] px-2 transition-all duration-500 ease-in-out ${isAuthenticated ? 'max-w-7xl' : 'max-w-4xl'}`}>
            <nav className="relative flex items-center justify-between px-6 py-3.5 bg-card/85 backdrop-blur-[12px] border border-border shadow-card rounded-full transition-all duration-200">
                {/* Logo */}
                <Link to="/" className="flex items-center no-underline focus-visible:outline-none" aria-label="Retrieval Co. Homepage">
                    <span className="font-display font-[800] text-[1.25rem] tracking-tight text-primary">
                        Retrieval<span className="text-text">Co.</span>
                    </span>
                </Link>

                {/* Nav Links (Desktop) */}
                <div className={`hidden lg:flex items-center transition-all duration-300 ${isAuthenticated ? 'flex-1 justify-center gap-16 lg:gap-24' : 'gap-6'}`}>
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = !link.onClick && location.pathname === link.path;
                        const className = `text-[0.85rem] font-semibold transition-colors no-underline focus-visible:outline-none flex items-center gap-1.5 ${isActive ? 'text-text' : 'text-text-muted hover:text-text'}`;
                        if (link.onClick) {
                            return (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    onClick={link.onClick}
                                    className={className}
                                >
                                    {Icon && <Icon size={14} />}
                                    <span>{link.name}</span>
                                </a>
                            );
                        }
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={className}
                            >
                                {Icon && <Icon size={14} />}
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Actions Block */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-text-muted hover:text-text hover:bg-zinc-800/10 dark:hover:bg-zinc-100/10 transition-colors cursor-pointer"
                        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {isAuthenticated ? (
                        <div className="hidden lg:flex items-center gap-4">
                            {/* Karma Badge */}
                            <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full px-3 py-1 text-[0.82rem] font-bold">
                                <Zap size={12} /> {userKarma} Karma
                            </div>
                            
                            {/* Avatar Container with Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setProfileDropdownOpen(prev => !prev)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-[0.8rem] text-white cursor-pointer no-underline focus-visible:outline-none border-none hover:scale-105 active:scale-95 transition-all shadow-md"
                                    style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))' }}
                                    title="User Menu"
                                >
                                    {userInitials}
                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute right-0 top-11 w-56 bg-surface border border-border rounded-xl shadow-modal p-2.5 flex flex-col gap-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        {/* User Quick Info */}
                                        <div className="px-3 py-2 flex flex-col">
                                            <span className="text-[12.5px] font-bold text-text truncate">{user?.name || 'Student'}</span>
                                            <span className="text-[10px] text-text-muted truncate mt-0.5">{user?.code || 'Campus ID'}</span>
                                        </div>
                                        
                                        <div className="h-px bg-border/40 my-1"></div>

                                        {/* Menu Links */}
                                        <Link
                                            to="/my-posts"
                                            onClick={() => setProfileDropdownOpen(false)}
                                            className="px-3 py-2 rounded-lg text-[12.5px] font-medium text-text-muted hover:text-text hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors no-underline flex items-center gap-2"
                                        >
                                            <User size={13.5} />
                                            <span>Profile & Activity</span>
                                        </Link>

                                        <button
                                            onClick={() => {
                                                setProfileDropdownOpen(false);
                                                logout();
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg text-[12.5px] font-semibold text-danger hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer bg-transparent border-none flex items-center gap-2"
                                        >
                                            <LogOut size={13.5} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/?login=1')}
                            className="hidden md:block bg-primary text-white border-none rounded-full px-5 py-2 font-display font-bold text-[0.85rem] cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] hover:shadow-hover focus-visible:outline-none"
                        >
                            Get Started
                        </button>
                    )}

                    {/* Hamburger Button (Mobile Only) */}
                    <button
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className="p-2 -mr-1 lg:hidden rounded-full text-text-muted hover:text-text hover:bg-zinc-800/10 dark:hover:bg-zinc-100/10 transition-colors cursor-pointer focus-visible:outline-none"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 p-4 mx-2 bg-card/95 backdrop-blur-[16px] border border-border shadow-modal rounded-2xl flex flex-col gap-3 lg:hidden animate-in fade-in slide-in-from-top-3 duration-200">
                    {links.filter(l => !l.hideOnMobile).map((link) => {
                        const Icon = link.icon;
                        const isActive = !link.onClick && location.pathname === link.path;
                        const className = `px-4 py-2.5 rounded-lg text-[0.92rem] font-medium transition-colors no-underline flex items-center gap-2.5 ${isActive ? 'bg-zinc-500/10 text-text' : 'text-text-muted hover:text-text hover:bg-zinc-500/5'}`;
                        if (link.onClick) {
                            return (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    onClick={(e) => { link.onClick(e); setMobileMenuOpen(false); }}
                                    className={className}
                                >
                                    {Icon && <Icon size={16} />}
                                    <span>{link.name}</span>
                                </a>
                            );
                        }
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={className}
                            >
                                {Icon && <Icon size={16} />}
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                    
                    {isAuthenticated ? (
                        <div className="flex flex-col gap-3 pt-3 mt-1 border-t border-border">
                            <div className="flex items-center justify-between px-4">
                                <span className="text-[0.9rem] text-text-muted">My Karma:</span>
                                <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full px-3 py-1 text-[0.82rem] font-bold">
                                    <Zap size={12} /> {userKarma} Karma
                                </div>
                            </div>
                            <Link
                                to="/my-posts"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 rounded-lg text-[0.95rem] font-medium text-text-muted hover:text-text hover:bg-zinc-500/5 no-underline flex items-center gap-2"
                            >
                                <span className="w-5 h-5 rounded-full flex items-center justify-center font-display font-bold text-[0.65rem] text-white" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))' }}>
                                    {userInitials}
                                </span>
                                Profile & Activity
                            </Link>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    logout();
                                }}
                                className="text-left px-4 py-2.5 rounded-lg text-[0.95rem] font-medium text-danger hover:bg-danger/10 transition-colors cursor-pointer bg-transparent border-none"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                navigate('/?login=1');
                            }}
                            className="w-full bg-primary text-white border-none rounded-xl py-3 font-display font-bold text-[0.92rem] cursor-pointer transition-all hover:scale-[1.01] hover:shadow-hover text-center"
                        >
                            Get Started
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
