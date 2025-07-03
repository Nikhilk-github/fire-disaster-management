import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Upload, AlertCircle, CheckCircle } from 'lucide-react';

const FireReporting: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setSelectedImage(null);
        setDescription('');
        setSeverity('moderate');
      }, 3000);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Report Submitted Successfully</h3>
        <p className="text-gray-600 mb-4">
          Thank you for reporting this fire incident. Emergency services and nearby users have been notified.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Report ID:</strong> FR-{Date.now().toString().slice(-6)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Report Fire Incident</h2>
            <p className="text-gray-600">Help us respond quickly by providing incident details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Current Location</h3>
            </div>
            {location ? (
              <p className="text-sm text-gray-600">
                Latitude: {location.latitude.toFixed(6)}, Longitude: {location.longitude.toFixed(6)}
              </p>
            ) : (
              <p className="text-sm text-yellow-600">Getting your location...</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo of Fire Incident *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors relative">
              {selectedImage ? (
                <div className="space-y-3">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected fire incident"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-gray-600">{selectedImage.name}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600 text-sm">Click below to upload</p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="block mx-auto text-sm"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Severity Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fire Severity Level *
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="low">Low - Small fire, contained</option>
              <option value="moderate">Moderate - Spreading fire</option>
              <option value="high">High - Large fire, immediate danger</option>
              <option value="extreme">Extreme - Emergency evacuation needed</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Describe what you observed, estimated size, direction of spread, potential causes, etc."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  If this is an emergency requiring immediate assistance, please call emergency services (911) immediately.
                  This report is for documentation and community notification purposes.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedImage || !location}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting Report...' : 'Submit Fire Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FireReporting;
