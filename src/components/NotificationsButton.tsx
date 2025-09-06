import { useState } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { Notification } from '../types/notifications';
import { NotificationsPanel } from './NotificationsPanel';

interface NotificationsButtonProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemoveNotification: (id: string) => void;
  onClearAll: () => void;
  theme?: 'light' | 'dark';
}

export function NotificationsButton({ 
  notifications, 
  unreadCount, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onRemoveNotification, 
  onClearAll,
  theme = 'light' 
}: NotificationsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="apple-button transition-all hover:scale-105 relative"
        style={{
          width: '28px',
          height: '28px',
          minWidth: '28px',
          minHeight: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#FFFFFF',
          border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #E6E9EF',
          boxShadow: theme === 'dark' 
            ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
            : '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}
      >
        {unreadCount > 0 ? (
          <BellRing 
            style={{
              width: '16px',
              height: '16px',
              color: theme === 'dark' ? '#1A1A1A' : '#6B7280'
            }}
          />
        ) : (
          <Bell 
            style={{
              width: '16px',
              height: '16px',
              color: theme === 'dark' ? '#1A1A1A' : '#6B7280'
            }}
          />
        )}
        
        {/* Индикатор непрочитанных уведомлений */}
        {unreadCount > 0 && (
          <div
            className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full text-xs font-medium"
            style={{
              background: '#FF3B30',
              color: '#FFFFFF',
              fontSize: '10px',
              padding: unreadCount > 9 ? '0 4px' : '0'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Панель уведомлений */}
      {isOpen && (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onMarkAsRead={onMarkAsRead}
          onMarkAllAsRead={onMarkAllAsRead}
          onRemoveNotification={onRemoveNotification}
          onClearAll={onClearAll}
          theme={theme}
        />
      )}
    </div>
  );
}