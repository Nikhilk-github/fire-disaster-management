import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, MapPin, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success';
  title: string;
  message: string;
  location?: string;
  timestamp: Date;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'alerts'>('all');

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'alert',
        title: 'High Fire Risk Alert',
        message: 'Fire risk has increased to HIGH in your area due to hot, dry conditions and strong winds.',
        location: 'Within 5 miles of your location',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
      },
      {
        id: '2',
        type: 'info',
        title: 'Fire Incident Reported',
        message: 'A small brush fire has been reported 2.3 miles northeast of your location. Emergency services are responding.',
        location: '2.3 miles NE',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
      },
      {
        id: '3',
        type: 'success',
        title: 'Fire Contained',
        message: 'The brush fire near Highway 101 has been successfully contained by emergency services.',
        location: '3.1 miles SW',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        read: true,
      },
      {
        id: '4',
        type: 'info',
        title: 'Weather Update',
        message: 'Red flag warning issued for your area. Extreme fire weather conditions expected through tomorrow.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        read: true,
      },
      {
        id: '5',
        type: 'alert',
        title: 'Evacuation Advisory',
        message: 'Precautionary evacuation advisory issued for residents in Canyon Heights area.',
        location: '7.2 miles N',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        read: true,
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notif => {
      if (filter === 'unread') return !notif.read;
      if (filter === 'alerts') return notif.type === 'alert';
      return true;
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    const opacity = read ? 'bg-opacity-30' : 'bg-opacity-60';
    switch (type) {
      case 'alert':
        return `bg-red-50 border-red-200 ${opacity}`;
      case 'success':
        return `bg-green-50 border-green-200 ${opacity}`;
      default:
        return `bg-blue-50 border-blue-200 ${opacity}`;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              <p className="text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications read'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'alerts', label: 'Alerts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.id === 'unread' && unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${getNotificationBg(
                  notification.type,
                  notification.read
                )} ${!notification.read ? 'border-l-4' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(notification.timestamp)}
                      </div>
                      {notification.location && (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {notification.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900">Emergency Services</h4>
            <p className="text-red-700 text-lg font-bold">911</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-900">Local Fire Department</h4>
            <p className="text-orange-700 text-lg font-bold">(555) 123-4567</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900">Red Cross Emergency</h4>
            <p className="text-blue-700 text-lg font-bold">(555) 987-6543</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900">Non-Emergency Line</h4>
            <p className="text-green-700 text-lg font-bold">(555) 456-7890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;