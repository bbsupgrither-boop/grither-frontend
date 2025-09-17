import { Star } from './Icons';
import coinImage from 'figma:asset/acaa4cccbfaf8eeee6ecbbe8f29c92d03b701371.png';

interface ModalXPProps {
  isOpen: boolean;
  onClose: () => void;
  level?: number;
  experience?: number;
  maxExperience?: number;
  theme?: 'light' | 'dark';
}

export function ModalXP({ 
  isOpen, 
  onClose, 
  level = 0, 
  experience = 0, 
  maxExperience = 100,
  theme = 'light'
}: ModalXPProps) {
  if (!isOpen) return null;

  const currentXp = 0;
  const currentLevel = 0;
  const xpNeededForNextLevel = 100;
  const nextLevelReward = 0; // G-coins за переход на следующий уровень
  const progressPercentage = 0;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: theme === 'dark' 
          ? 'rgba(0, 0, 0, 0.45)' 
          : 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div 
        className="mx-4"
        style={{
          width: 'auto',
          minWidth: '320px',
          maxWidth: '360px',
          backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)',
          opacity: 1
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - 40px высотой */}
        <div 
          className="flex items-center justify-center"
          style={{ 
            height: '40px',
            minHeight: '40px'
          }}
        >
          {/* Заголовок по центру */}
          <h2 
            className="font-semibold text-center"
            style={{ 
              fontSize: '18px',
              color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
              margin: 0,
              whiteSpace: 'nowrap'
            }}
          >
            Ваш текущий опыт
          </h2>
        </div>

        {/* Body */}
        <div 
          className="flex flex-col"
          style={{ gap: '12px' }}
        >
          {/* a) ProgressSection */}
          <div 
            style={{ 
              height: '48px',
              position: 'relative',
              overflow: 'visible' // Clip content выключен
            }}
          >
            {/* Звезда уровня - absolute позиция */}
            <div 
              style={{
                position: 'absolute',
                left: '-12px',
                top: '35%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Star 
                  className="w-8 h-8 fill-current" 
                  style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                />
                <span 
                  className="absolute font-bold"
                  style={{ 
                    fontSize: '12px',
                    color: '#FFFFFF'
                  }}
                >
                  {currentLevel}
                </span>
              </div>
            </div>

            {/* Прогресс бар по ширине 100%, высота 16, радиус 12 */}
            <div 
              style={{
                width: '100%',
                height: '16px',
                backgroundColor: theme === 'dark' ? '#0F1116' : '#ECEFF3',
                borderRadius: '12px',
                border: `1px solid ${theme === 'dark' ? '#2A2F36' : '#E6E9EF'}`,
                position: 'relative',
                top: '8px' // Центрируем в контейнере 48px
              }}
            >
              <div 
                className="transition-all duration-500"
                style={{ 
                  width: `${progressPercentage}%`,
                  height: '16px',
                  background: theme === 'dark' 
                    ? '#2B82FF'
                    : 'linear-gradient(90deg, #2B82FF 0%, #62A6FF 100%)',
                  borderRadius: '12px'
                }}
              />
            </div>

            {/* Строка значения под полосой */}
            <div 
              className="text-center"
              style={{ 
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0'
              }}
            >
              <span 
                className="font-semibold"
                style={{ 
                  fontSize: '14px',
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                  whiteSpace: 'nowrap'
                }}
              >
                {currentXp.toLocaleString()}/{xpNeededForNextLevel.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Объединенная награда за уровень */}
          <div className="flex justify-center">
            <div 
              className="flex items-center"
              style={{
                height: '40px',
                borderRadius: '999px',
                padding: '0 16px',
                gap: '8px',
                backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8',
                border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'}`
              }}
            >
              <span 
                className="font-semibold"
                style={{ 
                  fontSize: '14px',
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                  whiteSpace: 'nowrap'
                }}
              >
                Награда за уровень:
              </span>

              <span 
                className="font-semibold"
                style={{ 
                  fontSize: '14px',
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {nextLevelReward}
                <img 
                  src={coinImage} 
                  alt="G-coin" 
                  style={{ width: '14px', height: '14px' }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}