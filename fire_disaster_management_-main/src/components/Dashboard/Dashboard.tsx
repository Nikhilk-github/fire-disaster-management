import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Flame, Camera, AlertTriangle, LogOut, Bell, TrendingUp, Moon, Sun
} from 'lucide-react';
import FireReporting from './FireReporting';
import RiskAssessment from './RiskAssessment';
import Notifications from './Notifications';
import Overview from './Overview';

const Dashboard: React.FC = () => {
  const { user, logout, updateLocation } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const locationFetched = useRef(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (navigator.geolocation && !locationFetched.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          updateLocation(latitude, longitude);
          locationFetched.current = true;
        },
        (error) => console.error('❌ Error getting location:', error)
      );
    }
  }, [updateLocation]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp, path: '/dashboard' },
    { id: 'report', label: 'Report Fire', icon: Camera, path: '/dashboard/report' },
    { id: 'risk', label: 'Risk Assessment', icon: AlertTriangle, path: '/dashboard/risk' },
    { id: 'notifications', label: 'Alerts', icon: Bell, path: '/dashboard/notifications' },
  ];

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') return 'overview';
    if (path.includes('/report')) return 'report';
    if (path.includes('/risk')) return 'risk';
    if (path.includes('/notifications')) return 'notifications';
    return 'overview';
  };

  const currentTab = getCurrentTab();

  const handleLogout = () => {
    try {
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div
        className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white relative"
        onMouseMove={(e) => {
          if (e.clientX < 40) setSidebarOpen(true);
          else if (e.clientX > 240) setSidebarOpen(false);
        }}
      >
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-30 h-full bg-white dark:bg-gray-800 shadow-md w-64 transition-transform duration-300 delay-100 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center mr-2">
                <Flame className="text-white w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">Fire Dashboard</h2>
            </div>

            <nav className="space-y-2">
              {tabs.map(({ id, label, icon: Icon, path }) => (
                <button
                  key={id}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                    currentTab === id
                      ? 'bg-red-100 text-red-600 dark:bg-red-700 dark:text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </button>
              ))}
            </nav>

            <div className="mt-8">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center space-x-2 text-sm hover:text-yellow-400"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 flex items-center text-sm text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main
          className={`flex-1 transition-[margin] duration-300 ease-in-out ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          } p-6`}
        >
          <Routes>
            <Route path="/" element={<Overview userLocation={userLocation} />} />
            <Route path="/report" element={<FireReporting />} />
            <Route path="/risk" element={<RiskAssessment />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
