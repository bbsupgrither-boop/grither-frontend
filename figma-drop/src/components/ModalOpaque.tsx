import React, { useEffect } from 'react';
import { X } from './Icons';

interface BackdropProps {
  isVisible: boolean;
  onClick?: () => void;
  theme?: 'light' | 'dark';
}

// Отдельный компонент Backdrop
function Backdrop({ isVisible, onClick, theme = 'light' }: BackdropProps) {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-40"
      style={{
        background: theme === 'light' ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      onClick={onClick || (() => {})}
    />
  );
}

interface ModalOpaqueProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  theme?: 'light' | 'dark';
  size?: 'auto';
}

export function ModalOpaque({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions, 
  theme = 'light',
  size = 'auto'
}: ModalOpaqueProps) {
  // Обработка Escape и блокировка скролла
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - размывает фон */}
      <Backdrop 
        isVisible={isOpen} 
        onClick={onClose} 
        theme={theme}
      />
      
      {/* Modal Container */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose || (() => {})}
      >
        <div 
          className="relative w-full max-w-[90%]"
          onClick={(e) => e.stopPropagation()}
          style={{
            // Полностью непрозрачный контейнер
            backgroundColor: theme === 'light' ? '#FFFFFF' : '#161A22',
            opacity: '1', // 100% непрозрачность
            borderRadius: '16px',
            border: `1px solid ${theme === 'light' ? '#E6E9EF' : 'rgba(255, 255, 255, 0.06)'}`,
            boxShadow: theme === 'light' 
              ? '0 16px 48px rgba(0, 0, 0, 0.25)' 
              : '0 16px 48px rgba(0, 0, 0, 0.6)',
            padding: '16px',
            minWidth: '280px',
            maxHeight: '80vh',
            overflow: 'hidden',
            // Убираем все эффекты размытия и прозрачности
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none'
          }}
        >
          {/* Header */}
          {title && (
            <div 
              className="flex items-center justify-between"
              style={{ marginBottom: '12px' }}
            >
              <h3 
                className="font-medium flex-1 text-center"
                style={{ 
                  color: theme === 'light' ? '#0F172A' : '#E8ECF2',
                  fontSize: '18px',
                  lineHeight: '24px'
                }}
              >
                {title}
              </h3>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105 ml-2"
                  style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                      : '#FFFFFF',
                    border: theme === 'dark' 
                      ? '1px solid rgba(255, 255, 255, 0.2)' 
                      : '1px solid #E6E9EF',
                    boxShadow: theme === 'dark' 
                      ? '0 4px 15px rgba(255, 255, 255, 0.2)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <X 
                    style={{
                      width: '16px',
                      height: '16px',
                      color: theme === 'dark' ? '#1A1A1A' : '#6B7280'
                    }}
                  />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div 
            style={{ 
              marginBottom: actions ? '12px' : '0',
              maxHeight: title ? 'calc(80vh - 100px)' : 'calc(80vh - 60px)',
              overflow: 'auto'
            }}
          >
            {children}
          </div>
          
          {/* Actions */}
          {actions && (
            <div className="flex justify-end gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Экспортируем также Backdrop для использования в других компонентах если нужно
export { Backdrop };