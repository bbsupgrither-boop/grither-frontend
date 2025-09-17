import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Home, Trophy, CheckSquare, ShoppingCart, Gift } from './Icons';

interface BottomNavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  theme?: 'light' | 'dark';
}

export function BottomNavigation({ onNavigate, currentPage, theme = 'light' }: BottomNavigationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const navItems = [
    { icon: Home, page: 'home' },
    { icon: Trophy, page: 'achievements' },
    { icon: CheckSquare, page: 'tasks' },
    { icon: Gift, page: 'cases' },
    { icon: ShoppingCart, page: 'shop' },
  ];

  const navigationContent = (
    <div 
      style={{ 
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        // Изолируем от влияния родительских элементов
        isolation: 'isolate'
      }}
    >
      <div 
        className="flex items-center gap-2"
        style={{
          backgroundColor: theme === 'dark' ? '#12151B' : '#F3F5F8',
          borderRadius: '24px',
          padding: '8px'
        }}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          return (
            <button 
              key={index}
              onClick={() => onNavigate(item.page)}
              className="relative flex items-center justify-center transition-all duration-200"
              style={{ 
                minWidth: '44px', 
                minHeight: '44px',
                borderRadius: '50%'
              }}
            >
              {isActive && (
                <div 
                  className="absolute rounded-full"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: theme === 'dark' 
                      ? 'rgba(43, 130, 255, 0.12)' 
                      : 'rgba(43, 130, 255, 0.10)'
                  }}
                />
              )}
              <Icon 
                className="relative z-10 transition-colors duration-200"
                style={{
                  width: '26px',
                  height: '26px',
                  color: isActive 
                    ? '#2B82FF' 
                    : theme === 'dark' ? '#A7B0BD' : '#6B7280'
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );

  // Рендерим через портал для избежания влияния родительских контекстов
  return mounted ? createPortal(navigationContent, document.body) : null;
}