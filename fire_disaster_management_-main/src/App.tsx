import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import { Flame } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './index.css'; // Ensure Tailwind CSS is imported

// Protected route that blocks access until user is authenticated
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Wrapper for Login and Signup views
const AuthWrapper: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isLogin, setIsLogin] = React.useState(true);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Always redirect root path to login
  if (location.pathname === '/') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mr-4">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">FireGuard</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced fire disaster management system for early detection, risk assessment, and community safety
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🔥 Real-time Fire Detection</h3>
              <p className="text-gray-600">
                Report fire incidents with photo uploads and location tracking to alert nearby users instantly.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Risk Assessment</h3>
              <p className="text-gray-600">
                Get accurate fire probability calculations based on weather conditions and location data.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🔔 Smart Notifications</h3>
              <p className="text-gray-600">
                Receive timely alerts about fire risks and incidents in your area for proactive safety measures.
              </p>
            </div>
          </div>

          <div>
            <Routes>
              <Route path="/login" element={<Login onToggleForm={() => setIsLogin(false)} />} />
              <Route path="/signup" element={<Signup onToggleForm={() => setIsLogin(true)} />} />
            </Routes>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌡️</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Weather Integration</h4>
            <p className="text-sm text-gray-600">Real-time weather data analysis for accurate risk assessment</p>
          </div>
          <div className="text-center p-6 bg-orange-100 backdrop-blur-sm rounded-xl">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📍</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Location Tracking</h4>
            <p className="text-sm text-gray-600">Precise GPS coordinates for incident reporting and risk mapping</p>
          </div>
          <div className="text-center p-6 bg-yellow-100 backdrop-blur-sm rounded-xl">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Community Safety</h4>
            <p className="text-sm text-gray-600">Collaborative approach to fire prevention and emergency response</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/*" element={<AuthWrapper />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
