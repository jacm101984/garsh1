import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const NotificationToast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "fixed bottom-4 right-4 flex items-center gap-3 p-4 rounded-lg shadow-lg transition-all duration-300";
    const visibilityStyles = isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2";

    switch (type) {
      case 'success':
        return `${baseStyles} ${visibilityStyles} bg-green-50 border border-green-200`;
      case 'warning':
        return `${baseStyles} ${visibilityStyles} bg-yellow-50 border border-yellow-200`;
      case 'error':
        return `${baseStyles} ${visibilityStyles} bg-red-50 border border-red-200`;
      default:
        return `${baseStyles} ${visibilityStyles} bg-blue-50 border border-blue-200`;
    }
  };

  return (
    <div className={getStyles()}>
      {getIcon()}
      <p className="text-gray-700">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const NotificationBell = ({ count }) => {
  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-gray-600" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  );
};

const NotificationCenter = ({ notifications, onMarkAsRead }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Notificaciones</h3>
          {notifications.length > 0 && (
            <button
              onClick={() => onMarkAsRead(notifications.map(n => n.id))}
              className="text-sm text-orange-500 hover:text-orange-600"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No tienes notificaciones
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors
                ${notification.read ? 'bg-white' : 'bg-orange-50'}`}
            >
              <div className="flex gap-3">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead([notification.id])}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Helper functions
const getIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w