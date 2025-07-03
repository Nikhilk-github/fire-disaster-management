import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, AlertTriangle, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as needed

interface OverviewProps {
  userLocation: { latitude: number; longitude: number } | null;
}

const Overview: React.FC<OverviewProps> = ({ userLocation }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Access user from auth context
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState('');
  const hasFetchedWeather = useRef(false);

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' }).format(currentTime);
  const formattedTime = new Intl.DateTimeFormat('en-IN', { timeStyle: 'medium' }).format(currentTime);

  const getRiskLevel = (temp: number, humidity: number, windSpeed: number) => {
    const tempRisk = (temp - 20) * 2;
    const humidityRisk = (100 - humidity) * 1.5;
    const windRisk = windSpeed * 5;
    const overall = (tempRisk + humidityRisk + windRisk) / 3;
    if (overall < 25) return 'Low';
    if (overall < 50) return 'Moderate';
    if (overall < 75) return 'High';
    return 'Extreme';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Extreme': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const apiKey = import.meta.env.VITE_OPEN_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      if (!userLocation || hasFetchedWeather.current) return;
      hasFetchedWeather.current = true;

      try {
        const { latitude, longitude } = userLocation;
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error('❌ Failed to fetch weather:', err);
        setError('Failed to fetch weather data.');
      }
    };

    fetchWeather();
  }, [userLocation]);

  const currentRisk = weather
    ? getRiskLevel(weather.main.temp, weather.main.humidity, weather.wind.speed)
    : 'Loading';

  return (
    <div className="space-y-6">
      {/* Greeting with dynamic username */}
      <div className="animate-fade-in mb-6 flex flex-col md:flex-row md:items-center md:justify-between px-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || 'User'} 👋
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Stay safe and updated.</p>
        </div>
        <div className="mt-2 md:mt-0 text-right text-sm text-gray-700 dark:text-gray-300">
          <div>{formattedDate}</div>
          <div>{formattedTime}</div>
        </div>
      </div>

      {/* Risk, Location, Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Risk</h3>
              <p className={`text-sm font-medium px-2 py-1 rounded ${getRiskColor(currentRisk)}`}>
                {currentRisk} Risk
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Location</h3>
              <p className="text-sm text-gray-600">
                {userLocation ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` : 'Getting location...'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
              <p className="text-sm text-gray-600">2 notifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/dashboard/report')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <Camera className="w-6 h-6 text-red-600 mr-3" />
            <span className="text-gray-900 font-medium">Report Fire Incident</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/risk')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <AlertTriangle className="w-6 h-6 text-blue-600 mr-3" />
            <span className="text-gray-900 font-medium">Check Risk Assessment</span>
          </button>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Information</h3>
        <p className="text-sm text-gray-600 mb-4">
          In case of fire or other disasters, use the numbers below to seek immediate help.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <a href="tel:101" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm text-center hover:bg-red-700">
            🚒 Call Fire Brigade (101)
          </a>
          <a href="tel:108" className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm text-center hover:bg-yellow-700">
            🆘 Disaster Management (108)
          </a>
          <a href="tel:102" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm text-center hover:bg-green-700">
            🚑 Ambulance (102)
          </a>
          <a href="tel:100" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm text-center hover:bg-blue-700">
            🚓 Police (100)
          </a>
          <a href="tel:112" className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm text-center hover:bg-gray-900">
            📞 National Emergency (112)
          </a>
        </div>
      </div>
    </div>
  );
};

export default Overview;
