import { useEffect, useRef, useState } from "react";
import { AlertCircle, GraduationCap, Lock, X } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config/api";

export default function LoginModal({ onClose }) {
    const { login } = useAuth();
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const dialogRef = useRef(null);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialogRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const handleDemoLogin = (event) => {
        event.preventDefault();
        localStorage.setItem("demo_mode", "true");

        // Generate a fresh demo user
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const randomId = `user_demo_${randomNum}`;
        const randomCode = `22BCE${randomNum}`;

        const demoUser = {
            id: randomId,
            code: randomCode,
            name: `Demo User ${randomNum}`,
            role: "student",
            karma: 0,
        };

        const defaultUsersList = [
            {
                _id: "user_kiransharma",
                collegeId: "22BCE1234",
                name: "Kiran Sharma",
                karma: 312,
                role: "student",
            },
            {
                _id: "user_priyanair",
                collegeId: "23ECE4321",
                name: "Priya Nair",
                karma: 247,
                role: "student",
            },
            {
                _id: "user_rahulverma",
                collegeId: "21MEC5678",
                name: "Rahul Verma",
                karma: 189,
                role: "student",
            },
            {
                _id: "user_ananyasingh",
                collegeId: "24CIV8765",
                name: "Ananya Singh",
                karma: 134,
                role: "student",
            },
        ];

        const storedUsers = localStorage.getItem("mock_users");
        let mockUsers = storedUsers
            ? JSON.parse(storedUsers)
            : defaultUsersList;

        mockUsers.push({
            _id: randomId,
            collegeId: randomCode,
            name: `Demo User ${randomNum}`,
            karma: 0,
            role: "student",
        });

        localStorage.setItem("mock_users", JSON.stringify(mockUsers));

        login(demoUser, "mock_jwt_token");
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");

        if (!code || !password) {
            setError("Please enter College ID and Password");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("demo_mode", "false");
                login(data.user, data.token);
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Failed to connect to server. Ensure backend is running.");
            console.error("Login Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[500] flex items-center justify-center bg-background/70 px-4 backdrop-blur-md"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            role="presentation"
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-title"
                tabIndex={-1}
                className="relative w-full max-w-[400px] rounded-[20px] border border-border bg-card p-7 shadow-modal sm:p-10"
                style={{ animation: "fadeUp 0.25s ease" }}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close login"
                    className="absolute right-4 top-4 rounded-full p-2 text-text-muted transition-colors hover:bg-border hover:text-text"
                >
                    <X size={19} />
                </button>

                <div className="mb-8 pr-8">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
                        RetrievalCo.
                    </span>
                    <h2 id="login-title" className="text-[1.8rem] font-[800]">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-text-muted">
                        Sign in to find, report, and return items.
                    </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                    {error && (
                        <div
                            className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
                            role="alert"
                        >
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <Input
                        label="Email"
                        icon={GraduationCap}
                        placeholder="22BCE1234@university.edu"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        autoFocus
                        required
                    />

                    <Input
                        label="Password"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In →"}
                    </Button>
                </form>

                <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-border" />
                    <span className="mx-4 flex-shrink text-xs font-bold uppercase tracking-wider text-text-muted">
                        Or
                    </span>
                    <div className="flex-grow border-t border-border" />
                </div>

                <Button
                    type="button"
                    variant="blue"
                    className="w-full cursor-pointer"
                    onClick={handleDemoLogin}
                >
                    ⚡ Continue as Demo User
                </Button>
            </div>
        </div>
    );
}
