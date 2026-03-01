import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreatePostPage from './pages/CreatePostPage';
import MyPostsPage from './pages/MyPostsPage';
import HotspotsMapPage from './pages/HotspotsMapPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NavBar from './components/NavBar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { RefreshCw } from 'lucide-react';
import RequestlyBot from './components/RequestlyBot';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <RefreshCw className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppLayout() {
  const location = useLocation();
  const hideNavBar = location.pathname === '/login';

  return (
    <>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/hotspots" element={<HotspotsMapPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/create" element={
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        } />
        <Route path="/my-posts" element={
          <ProtectedRoute>
            <MyPostsPage />
          </ProtectedRoute>
        } />
      </Routes>
      <RequestlyBot />
      <Toaster position="bottom-center" />
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
