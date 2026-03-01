import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { GraduationCap, Lock, Info, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!code || !password) {
            setError('Please enter College ID and Password');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, password })
            });

            const data = await res.json();

            if (res.ok) {
                login(data.user, data.token);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to server. Ensure backend is running.');
            console.error('Login Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-ink flex items-center justify-center relative overflow-hidden">
            {/* Background effects */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% 10%, rgba(0,201,200,0.08) 0%, transparent 70%)'
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Auth Card */}
            <div
                className="bg-card border border-border rounded-[20px] p-12 w-[420px] max-w-[90vw] relative z-10"
                style={{ animation: 'fadeUp 0.3s ease' }}
            >
                {/* Logo */}
                <Link to="/" className="inline-block mb-8 no-underline">
                    <span className="font-display font-[800] text-[1.35rem] text-amber">
                        Retrieval<span className="text-text">Co.</span>
                    </span>
                </Link>

                <h2 className="text-[1.8rem] font-[800] mb-1.5">Welcome back 👋</h2>
                <p className="text-text-muted text-[0.9rem] mb-8">Sign in with your college ID to continue.</p>

                <form className="flex flex-col gap-[18px]" onSubmit={handleLogin}>
                    {error && (
                        <div className="p-3 bg-[rgba(240,82,82,0.1)] border border-[rgba(240,82,82,0.3)] rounded-[8px] flex items-center gap-2 text-red text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <Input
                        label="College Email / Roll Number"
                        icon={GraduationCap}
                        placeholder="e.g. 22BCE1234@university.edu"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />

                    <Input
                        label="Password"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full mt-2" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In →'}
                    </Button>
                </form>

                <div className="text-center text-text-muted text-[0.85rem] mt-4">
                    Demo mode — any credentials work
                </div>
            </div>
        </div>
    );
}
