import { useState } from 'react';
import { ModalXP } from './ModalXP';

interface ProgressBarProps {
  level?: number;
  experience?: number;
  maxExperience?: number;
  showStatus?: boolean;
  theme?: 'light' | 'dark';
}

export function ProgressBar({ 
  level = 0, 
  experience = 0, 
  maxExperience = 100,
  showStatus = true,
  theme = 'light'
}: ProgressBarProps) {
  const [isXpDialogOpen, setIsXpDialogOpen] = useState(false);

  return (
    <>
      <div className="glass-card rounded-3xl p-4">
        <div className="flex items-center mb-4 px-1">
          {showStatus && (
            <span className="text-sm flex-1 text-muted-foreground opacity-50">
              Статус: —
            </span>
          )}
          <button 
            onClick={() => setIsXpDialogOpen(true)}
            className="text-sm flex-1 text-center transition-colors cursor-pointer text-muted-foreground opacity-50"
          >
            XP: —
          </button>
          <span 
            className={`text-sm font-medium text-muted-foreground opacity-50 ${showStatus ? 'flex-1 text-right' : 'ml-auto'}`}
          >
            lvl —
          </span>
        </div>
        <div 
          className="w-full rounded-full h-3"
          style={{
            backgroundColor: theme === 'dark' ? '#0F1116' : '#ECEFF3',
            border: `1px solid ${theme === 'dark' ? '#2A2F36' : '#E6E9EF'}`
          }}
        >
          <div 
            className="h-3 rounded-full transition-all duration-500 opacity-50" 
            style={{ 
              width: '0%',
              background: theme === 'dark' 
                ? '#2B82FF'
                : 'linear-gradient(90deg, #2B82FF 0%, #62A6FF 100%)'
            }}
          ></div>
        </div>
      </div>

      <ModalXP 
        isOpen={isXpDialogOpen}
        onClose={() => setIsXpDialogOpen(false)}
        level={level}
        experience={experience}
        maxExperience={maxExperience}
        theme={theme}
      />
    </>
  );
}