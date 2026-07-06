import { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
    Link,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import CreatePostPage from "./pages/CreatePostPage";
import MyPostsPage from "./pages/MyPostsPage";
import HotspotsMapPage from "./pages/HotspotsMapPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import PrivacyPage from "./pages/PrivacyPage";
import AboutPage from "./pages/AboutPage";
import NavBar from "./components/NavBar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { RefreshCw, Plus } from "lucide-react";
import RequestlyBot from "./components/RequestlyBot";
import { Toaster } from "react-hot-toast";

import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const ProtectedRoute = ({ children }) => {
    const { user, loadingAuth } = useAuth();

    if (loadingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <RefreshCw
                    className="animate-spin text-primary-500"
                    size={32}
                />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/?login=1" replace />;
    }

    return children;
};

function FloatingPostButton() {
    const { user } = useAuth();
    const location = useLocation();
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem("dashboard_active_tab") || "lost_found");

    useEffect(() => {
        const handleBotToggle = (e) => setIsBotOpen(e.detail.isOpen);
        const handleTabChange = (e) => setActiveTab(e.detail.tab);
        
        window.addEventListener("bot-toggled", handleBotToggle);
        window.addEventListener("dashboard-tab-changed", handleTabChange);
        
        return () => {
            window.removeEventListener("bot-toggled", handleBotToggle);
            window.removeEventListener("dashboard-tab-changed", handleTabChange);
        };
    }, []);

    if (!user || location.pathname === "/create") {
        return null;
    }

    return (
        <div 
            className={`fixed z-[500] group flex items-center transition-all duration-300 ease-in-out ${
                isBotOpen 
                    ? "bottom-4 md:bottom-8 right-[82px] md:right-[98px]" 
                    : "bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-4 md:bottom-[6.5rem] md:right-8"
            }`}
        >
            <span className={`hidden md:block bg-card border border-border text-text text-xs px-2.5 py-1.5 rounded-lg shadow transition-all duration-200 pointer-events-none select-none font-bold mr-2 ${isBotOpen ? "opacity-0" : "opacity-0 scale-90 translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0"}`}>
                Create a Post
            </span>
            <Link
                to={`/create?type=${activeTab === "borrow" ? "borrow" : "lost"}`}
                className={`flex items-center justify-center h-14 bg-primary text-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-none no-underline focus-visible:outline-none ${
                    isBotOpen ? "rounded-full px-5 gap-2" : "w-14 rounded-full"
                }`}
                aria-label="Create new post"
            >
                <Plus size={24} className={!isBotOpen ? "group-hover:rotate-90 transition-transform duration-200" : ""} />
                <span className={`font-bold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isBotOpen ? "max-w-[150px] opacity-100 ml-1" : "max-w-0 opacity-0 m-0"}`}>
                    Create Post
                </span>
            </Link>
        </div>
    );
}

function AppLayout() {
    return (
        <>
            <ScrollToTop />
            <NavBar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    element={<Navigate to="/?login=1" replace />}
                />
                <Route path="/hotspots" element={<HotspotsMapPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create"
                    element={
                        <ProtectedRoute>
                            <CreatePostPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-posts"
                    element={
                        <ProtectedRoute>
                            <MyPostsPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <FloatingPostButton />
            <RequestlyBot />
            <Toaster position="bottom-center" />
            <Footer />
        </>
    );
}

function App() {
    return (
        <ThemeProvider>
            <Router>
                <AuthProvider>
                    <AppLayout />
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
