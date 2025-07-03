import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Droplets, MapPin, Thermometer, Wind } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon not showing
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  conditions: string;
}

interface RiskFactors {
  temperature: number;
  humidity: number;
  windSpeed: number;
  vegetation: number;
  overall: number;
}

const RiskAssessment: React.FC = () => {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [risk, setRisk] = useState<RiskFactors | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const apiKey = import.meta.env.VITE_OPEN_API_KEY;
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
      );
      const data = await res.json();

      const mappedWeather: WeatherData = {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        conditions: data.weather[0].main,
      };

      setWeather(mappedWeather);
      calculateRisk(mappedWeather);
    } catch (err) {
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateRisk = (weather: WeatherData) => {
    const tempRisk = Math.max(0, Math.min(100, (weather.temperature - 60) * 2));
    const humidityRisk = Math.max(0, Math.min(100, (100 - weather.humidity) * 1.5));
    const windRisk = Math.max(0, Math.min(100, weather.windSpeed * 5));
    const vegetationRisk = Math.max(0, Math.min(100, (100 - weather.humidity) * 1.2));
    const overall = (tempRisk + humidityRisk + windRisk + vegetationRisk) / 4;

    setRisk({
      temperature: Math.round(tempRisk),
      humidity: Math.round(humidityRisk),
      windSpeed: Math.round(windRisk),
      vegetation: Math.round(vegetationRisk),
      overall: Math.round(overall),
    });
  };

  const RiskLevelBar = ({ score }: { score: number }) => {
    const level = getRiskLevel(score);
    const barColor = {
      Low: 'bg-green-500',
      Moderate: 'bg-yellow-500',
      High: 'bg-orange-500',
      Extreme: 'bg-red-500',
    }[level.level];

    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${barColor} h-2 rounded-full`} style={{ width: `${score}%` }} />
      </div>
    );
  };

  const getRiskLevel = (score: number) => {
    if (score < 25) return { level: 'Low', color: 'text-green-600 bg-green-100' };
    if (score < 50) return { level: 'Moderate', color: 'text-yellow-600 bg-yellow-100' };
    if (score < 75) return { level: 'High', color: 'text-orange-600 bg-orange-100' };
    return { level: 'Extreme', color: 'text-red-600 bg-red-100' };
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker({ lat, lng });
        fetchWeather(lat, lng);
      },
    });
    return marker ? <Marker position={[marker.lat, marker.lng]} /> : null;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">🗺️ Pin a Location to Assess Fire Risk</h2>

      <MapContainer center={[20, 78]} zoom={4} style={{ height: '400px', borderRadius: '12px' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>

      {loading && <p>Loading weather data...</p>}

      {weather && risk && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">📊 Fire Risk Level</h3>
            <div className={`px-4 py-2 rounded-full inline-block font-bold ${getRiskLevel(risk.overall).color}`}>
              <AlertTriangle className="inline w-5 h-5 mr-2" />
              {getRiskLevel(risk.overall).level} ({risk.overall}%)
            </div>
            <div className="mt-3"><RiskLevelBar score={risk.overall} /></div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">🌦️ Weather Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
              <div className="flex items-center space-x-2">
                <Thermometer /> <span>{weather.temperature}°F</span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets /> <span>{weather.humidity}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wind /> <span>{weather.windSpeed} mph</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin /> <span>{weather.conditions}</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">🔥 Risk Breakdown</h3>
            <div className="space-y-3">
              {['temperature', 'humidity', 'windSpeed', 'vegetation'].map((k) => (
                <div key={k}>
                  <div className="flex justify-between">
                    <span className="capitalize">{k} Risk</span>
                    <span>{(risk as any)[k]}%</span>
                  </div>
                  <RiskLevelBar score={(risk as any)[k]} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
