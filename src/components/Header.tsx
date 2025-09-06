import { Settings } from './Icons';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from '../types/global';
import { NotificationsButton } from './NotificationsButton';
import { Notification } from '../types/notifications';
import coinIcon from 'figma:asset/29d513144bb95c08c031f3604ac2dd2e7bee6450.png';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
  hideUserIcon?: boolean;
  onOpenSettings?: () => void;
  user?: User;
  profilePhoto?: string | null;
  title?: string;
  theme?: 'light' | 'dark';
  notifications?: Notification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  onRemoveNotification?: (id: string) => void;
  onClearAllNotifications?: () => void;
}

export function Header({ 
  onNavigate, 
  currentPage, 
  hideUserIcon = false, 
  onOpenSettings, 
  user, 
  profilePhoto, 
  title, 
  theme = 'light',
  notifications = [],
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onRemoveNotification,
  onClearAllNotifications
}: HeaderProps) {
  const handleUserClick = () => {
    if (onNavigate && currentPage !== 'profile') {
      onNavigate('profile');
    }
  };

  const userInitials = user ? user.name.split(' ').map(n => n[0]).join('') : 'U';
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative z-50">
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        {!hideUserIcon && !title && (
          <button 
            onClick={handleUserClick}
            className="flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <div className="relative">
              <Avatar 
                className="w-10 h-10"
                style={{
                  boxShadow: theme === 'dark' 
                    ? '0 2px 8px rgba(0, 0, 0, 0.6)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.06)',
                  border: theme === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.06)' 
                    : '1px solid #E6E9EF'
                }}
              >
                {(profilePhoto || user?.avatar) && <AvatarImage src={profilePhoto || user?.avatar} alt={user?.name || 'Профиль'} />}
                <AvatarFallback 
                  style={{
                    background: 'linear-gradient(135deg, #2B82FF 0%, #1E40AF 100%)',
                    color: '#FFFFFF'
                  }}
                >
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              {user?.isOnline && (
                <div 
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                  style={{ 
                    border: theme === 'dark' 
                      ? '2px solid #0B0D10' 
                      : '2px solid #FFFFFF' 
                  }}
                ></div>
              )}
            </div>
            <div className="flex flex-col items-start">
              <span 
                className="text-sm font-medium"
                style={{ 
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A' 
                }}
              >
                {user?.name || 'Пользователь'}
              </span>
              {user && 'balance' in user && (
                <div className="flex items-center gap-1">
                  <span 
                    className="text-xs"
                    style={{ 
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                    }}
                  >
{(() => {
                      // Определяем роль на основе ID пользователя или уровня
                      // Иерархия: 1.GRITHER → 2.GLEB → 3.SUPPORT → 4.TEAMLEAD → 5.WORKER
                      if (user.id === 'current-user') return 'GRITHER';
                      if (user.level >= 20) return 'GLEB';
                      if (user.level >= 15) return 'SUPPORT';
                      if (user.level >= 12) return 'TEAMLEAD';
                      return 'WORKER';
                    })()}
                  </span>

                </div>
              )}
            </div>
          </button>
        )}
        
        {title && (
          <div className="flex-1 text-center">
            <h1 
              className="text-lg font-medium"
              style={{ 
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A' 
              }}
            >
              {title}
            </h1>
          </div>
        )}
        
        {(hideUserIcon || title) && !title && <div />}
        
        <div className="flex items-center gap-2">
          {/* Кнопка уведомлений */}
          <NotificationsButton
            notifications={notifications}
            unreadCount={unreadNotificationsCount}
            onMarkAsRead={onMarkNotificationAsRead || (() => {})}
            onMarkAllAsRead={onMarkAllNotificationsAsRead || (() => {})}
            onRemoveNotification={onRemoveNotification || (() => {})}
            onClearAll={onClearAllNotifications || (() => {})}
            theme={theme}
          />
          
          {/* Кнопка настроек */}
          <button 
            onClick={onOpenSettings}
            className="apple-button transition-all hover:scale-105"
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
            <Settings 
              style={{
                width: '16px',
                height: '16px',
                color: theme === 'dark' ? '#1A1A1A' : '#6B7280'
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}