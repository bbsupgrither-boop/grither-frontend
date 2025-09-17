import { useState } from 'react';
import { motion } from 'motion/react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { CaseRoulette } from './CaseRoulette';
import { PrizeRoulette } from './PrizeRoulette';
import { Modal } from './Modal';
import { CaseType, UserCase, CaseShopItem, RouletteResult, PrizeRouletteResult, Prize } from '../types/cases';
import { mockCaseTypes, mockUserCases, mockCaseShopItems } from '../data/mockData';
import { Gift, ShoppingBag, Clock, Coins, Gem } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import coinImage from 'figma:asset/acaa4cccbfaf8eeee6ecbbe8f29c92d03b701371.png';

interface CasesPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings: () => void;
  profilePhoto: string | null;
  theme: 'light' | 'dark';
  cases: CaseType[];
  setCases: (cases: CaseType[]) => void;
  userCases: UserCase[];
  setUserCases: (userCases: UserCase[]) => void;
  currentUser?: {
    id: string;
    name: string;
    balance: number;
    level?: number;
    experience?: number;
  };
  onUpdateUserBalance?: (userId: string, amount: number) => void;
  onUpdateUserExperience?: (userId: string, amount: number) => void;
}

export function CasesPage({ 
  onNavigate, 
  currentPage, 
  onOpenSettings, 
  profilePhoto,
  theme,
  cases,
  setCases,
  userCases,
  setUserCases,
  currentUser,
  onUpdateUserBalance,
  onUpdateUserExperience
}: CasesPageProps) {
  const [activeTab, setActiveTab] = useState<'free' | 'shop' | 'inventory'>('free');
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isPrizeRouletteOpen, setIsPrizeRouletteOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [canSpin, setCanSpin] = useState(false);
  const [wonCase, setWonCase] = useState<CaseType | null>(null);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [openingCase, setOpeningCase] = useState<UserCase | null>(null);
  const [caseDetailsOpen, setCaseDetailsOpen] = useState(false);
  const [selectedCaseForDetails, setSelectedCaseForDetails] = useState<CaseType | null>(null);
  const [selectedShopItem, setSelectedShopItem] = useState<CaseShopItem | null>(null);
  // Удалено локальное состояние - теперь используем пропсы
  const [lastFreeCase, setLastFreeCase] = useState<Date | null>(null);

  // Функция для проверки, является ли строка URL
  const isImageUrl = (str: string) => {
    try {
      new URL(str);
      return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:');
    } catch {
      return false;
    }
  };

  // Компонент для отображения изображения или эмодзи
  const ImageOrEmoji = ({ src, className = '', style = {} }: { src: string; className?: string; style?: React.CSSProperties }) => {
    if (isImageUrl(src)) {
      return (
        <ImageWithFallback
          src={src}
          alt="Image"
          className={`${className} object-cover`}
          style={style}
        />
      );
    }
    return (
      <div className={`flex items-center justify-center ${className}`} style={style}>
        <span className="text-xl">{src}</span>
      </div>
    );
  };

  // Проверяем доступность бесплатного кейса (для тестирования всегда доступен)
  const isFreeAvailable = true; // В будущем: !lastFreeCase || Date.now() - lastFreeCase.getTime() > 24 * 60 * 60 * 1000;

  const handleFreeCaseOpen = () => {
    if (isFreeAvailable) {
      setIsRouletteOpen(true);
      setCanSpin(true);
      setHasSpun(false);
      setWonCase(null);
    }
  };

  const handleStartSpin = () => {
    if (canSpin) {
      setIsSpinning(true);
      setCanSpin(false);
    }
  };

  const handleRouletteResult = (result: RouletteResult) => {
    console.log('Получен кейс:', result.selectedCase);
    setWonCase(result.selectedCase);
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
    setHasSpun(true);
  };

  const handleClaimCase = () => {
    if (wonCase) {
      // Добавляем кейс в инвентарь
      const newCase: UserCase = {
        id: `user_case_${Date.now()}`,
        caseTypeId: wonCase.id,
        obtainedAt: new Date(),
        isOpened: false
      };
      
      setUserCases(prev => [...prev, newCase]);
      setLastFreeCase(new Date());
    }
    
    // Закрываем модал и сбрасываем состояние
    setIsRouletteOpen(false);
    setIsSpinning(false);
    setHasSpun(false);
    setCanSpin(false);
    setWonCase(null);
  };

  const handleCloseCaseRoulette = () => {
    // Можно закрыть только если не идет вращение и можно забрать результат
    if (!isSpinning && (!canSpin || hasSpun)) {
      if (hasSpun && wonCase) {
        handleClaimCase();
      } else {
        setIsRouletteOpen(false);
        setIsSpinning(false);
        setHasSpun(false);
        setCanSpin(false);
        setWonCase(null);
      }
    }
  };

  // Обработчики для открытия кейсов
  const handleOpenCase = (userCase: UserCase) => {
    const caseType = cases.find(c => c.id === userCase.caseTypeId);
    if (!caseType) return;

    setOpeningCase(userCase);
    setIsPrizeRouletteOpen(true);
    setCanSpin(true);
    setHasSpun(false);
    setWonPrize(null);
  };

  const handleStartPrizeSpin = () => {
    if (canSpin) {
      setIsSpinning(true);
      setCanSpin(false);
    }
  };

  const handlePrizeRouletteResult = (result: PrizeRouletteResult) => {
    console.log('Получен приз:', result.selectedPrize);
    setWonPrize(result.selectedPrize);
  };

  const handlePrizeSpinComplete = () => {
    setIsSpinning(false);
    setHasSpun(true);
  };

  const handleClaimPrize = () => {
    if (wonPrize && openingCase && currentUser) {
      // Проверяем тип приза и зачисляем соответствующую награду
      if (wonPrize.type === 'coins' && onUpdateUserBalance) {
        onUpdateUserBalance(currentUser.id, wonPrize.value);
        console.log(`Зачислено ${wonPrize.value} монет пользователю ${currentUser.name}`);
      } else if (wonPrize.type === 'experience' && onUpdateUserExperience) {
        onUpdateUserExperience(currentUser.id, wonPrize.value);
        console.log(`Зачислено ${wonPrize.value} опыта пользователю ${currentUser.name}`);
      } else if (!wonPrize.type) {
        // Если тип не указан, определяем по названию приза
        if (wonPrize.name.toLowerCase().includes('монет') || wonPrize.name.toLowerCase().includes('coins') || wonPrize.name.toLowerCase().includes('g-coin')) {
          if (onUpdateUserBalance) {
            onUpdateUserBalance(currentUser.id, wonPrize.value);
            console.log(`Зачислено ${wonPrize.value} монет пользователю ${currentUser.name} (определено по названию)`);
          }
        } else if (wonPrize.name.toLowerCase().includes('опыт') || wonPrize.name.toLowerCase().includes('exp') || wonPrize.name.toLowerCase().includes('experience')) {
          if (onUpdateUserExperience) {
            onUpdateUserExperience(currentUser.id, wonPrize.value);
            console.log(`Зачислено ${wonPrize.value} опыта пользователю ${currentUser.name} (определено по названию)`);
          }
        }
      }
      
      // Удаляем кейс из инвентаря после открытия
      setUserCases(prev => prev.filter(uc => uc.id !== openingCase.id));
    }
    
    // Закрываем модал и сбрасываем состояние
    setIsPrizeRouletteOpen(false);
    setIsSpinning(false);
    setHasSpun(false);
    setCanSpin(false);
    setWonPrize(null);
    setOpeningCase(null);
  };

  const handleClosePrizeRoulette = () => {
    // Можно закрыть только если не идет вращение и можно забрать результат
    if (!isSpinning && (!canSpin || hasSpun)) {
      if (hasSpun && wonPrize) {
        handleClaimPrize();
      } else {
        setIsPrizeRouletteOpen(false);
        setIsSpinning(false);
        setHasSpun(false);
        setCanSpin(false);
        setWonPrize(null);
        setOpeningCase(null);
      }
    }
  };

  // Обработчик показа деталей кейса
  const handleShowCaseDetails = (caseType: CaseType, shopItem: CaseShopItem) => {
    setSelectedCaseForDetails(caseType);
    setSelectedShopItem(shopItem);
    setCaseDetailsOpen(true);
  };

  // Обработчик покупки кейса
  const handleBuyCase = (shopItem: CaseShopItem) => {
    const caseType = mockCaseTypes.find(c => c.id === shopItem.caseTypeId);
    if (!caseType) return;

    // Добавляем купленный кейс в инвентарь
    const newCase: UserCase = {
      id: `user_case_${Date.now()}`,
      caseTypeId: caseType.id,
      obtainedAt: new Date(),
      isOpened: false
    };
    
    setUserCases(prev => [...prev, newCase]);
    
    // Закрываем модал деталей если он открыт
    setCaseDetailsOpen(false);
    
    // Переключаемся на вкладку "Мои кейсы"
    setActiveTab('inventory');
  };

  const renderFreeCase = () => (
    <div className="space-y-6">
      {/* Заголовок для бесплатного кейса */}
      <div className="text-center">
        <h3 
          className="text-2xl font-bold mb-2"
          style={{
            color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
          }}
        >
          БЕСПЛАТНЫЙ КЕЙС
        </h3>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto"></div>
      </div>

      <div 
        className="rounded-2xl p-6 border"
        style={{
          background: theme === 'dark' 
            ? `linear-gradient(145deg, rgba(16, 20, 28, 0.95) 0%, rgba(22, 26, 34, 0.95) 100%)`
            : `linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)`,
          border: theme === 'dark' 
            ? '1px solid rgba(34, 197, 94, 0.4)'
            : '1px solid rgba(34, 197, 94, 0.3)',
          boxShadow: theme === 'dark' 
            ? `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
            : `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
        }}
      >
        <div className="text-center space-y-6">
          <div 
            className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(145deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))`,
              boxShadow: `0 0 30px rgba(34, 197, 94, 0.4), inset 0 0 20px rgba(34, 197, 94, 0.2)`
            }}
          >
            <Gift className="w-16 h-16 text-green-400" style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))' }} />
          </div>
          
          <div>
            <h4 
              className="text-xl font-bold mb-3" 
              style={{ 
                color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                textShadow: theme === 'dark' ? '0 0 10px rgba(34, 197, 94, 0.8)' : '0 0 5px rgba(34, 197, 94, 0.3)'
              }}
            >
              БЕСПЛАТНЫЙ КЕЙС GRITHER
            </h4>
            <p 
              className="text-sm opacity-80"
              style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}
            >
              Получите случа��ный кейс совершенно бесплатно каждые 24 часа!
            </p>
          </div>
          
          {isFreeAvailable ? (
            <button
              onClick={handleFreeCaseOpen}
              className="w-full py-4 px-6 rounded-xl font-bold tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center text-center"
              style={{
                background: `linear-gradient(145deg, #22C55E, #16A34A)`,
                color: '#FFFFFF',
                boxShadow: `0 4px 20px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              ОТКРЫТЬ БЕСПЛАТНЫЙ КЕЙС
            </button>
          ) : (
            <div className="space-y-4">
              <div 
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg"
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-red-300 text-sm font-medium">Следующий кейс через: 18:45:23</span>
              </div>
              <button
                disabled
                className="w-full py-4 px-6 rounded-xl font-bold tracking-wide cursor-not-allowed opacity-50"
                style={{
                  background: `linear-gradient(145deg, #666666, #444444)`,
                  color: '#CCCCCC',
                  boxShadow: `0 4px 15px rgba(0, 0, 0, 0.2)`
                }}
              >
                ОЖИДАНИЕ...
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderShop = () => (
    <div className="space-y-6">
      {/* Заголовок GRITHER */}
      <div className="text-center">
        <h3 
          className="text-2xl font-bold mb-2"
          style={{
            color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
          }}
        >
          GRITHER CASES
        </h3>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {mockCaseShopItems.map((shopItem) => {
          const caseType = cases.find(c => c.id === shopItem.caseTypeId);
          if (!caseType) return null;

          const discountPrice = shopItem.discount 
            ? shopItem.price * (1 - shopItem.discount / 100)
            : shopItem.price;

          // Форматируем цену в стиле G-COIN
          const formattedPrice = (Math.floor(discountPrice) / 1000).toFixed(3).replace('.', '.');

          return (
            <div 
              key={shopItem.id} 
              className="relative rounded-2xl p-3 border transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: theme === 'dark' 
                  ? `linear-gradient(145deg, rgba(16, 20, 28, 0.95) 0%, rgba(22, 26, 34, 0.95) 100%)`
                  : `linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)`,
                border: `1px solid ${caseType.color}${theme === 'dark' ? '40' : '30'}`,
                boxShadow: theme === 'dark' 
                  ? `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
                  : `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
              }}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                {/* Большое изображение кейса с неоновым эффектом */}
                <div 
                  className="relative w-full h-28 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{ 
                    background: `linear-gradient(145deg, ${caseType.glowColor || caseType.color}15, ${caseType.glowColor || caseType.color}05)`,
                    boxShadow: (() => {
                      const glowColor = caseType.glowColor || caseType.color;
                      const intensity = caseType.glowIntensity || 'low';
                      
                      switch (intensity) {
                        case 'low':
                          return `0 0 15px ${glowColor}40, inset 0 0 10px ${glowColor}20`;
                        case 'medium':
                          return `0 0 30px ${glowColor}50, 0 0 60px ${glowColor}20, inset 0 0 20px ${glowColor}30`;
                        case 'high':
                          return `0 0 40px ${glowColor}80, 0 0 80px ${glowColor}40, 0 0 120px ${glowColor}20, inset 0 0 30px ${glowColor}40`;
                        default:
                          return `0 0 30px ${glowColor}40, inset 0 0 20px ${glowColor}20`;
                      }
                    })()
                  }}
                  onClick={() => handleShowCaseDetails(caseType, shopItem)}
                >
                  <ImageOrEmoji
                    src={caseType.image}
                    className="w-full h-full object-cover"
                  />
                  {/* Неоновая рамка */}
                  <div 
                    className="absolute inset-0 rounded-xl border-2 opacity-60"
                    style={{ 
                      border: `2px solid ${caseType.glowColor || caseType.color}`,
                      boxShadow: (() => {
                        const glowColor = caseType.glowColor || caseType.color;
                        const intensity = caseType.glowIntensity || 'low';
                        
                        switch (intensity) {
                          case 'low':
                            return `inset 0 0 15px ${glowColor}30`;
                          case 'medium':
                            return `inset 0 0 25px ${glowColor}40, inset 0 0 50px ${glowColor}20`;
                          case 'high':
                            return `inset 0 0 35px ${glowColor}50, inset 0 0 70px ${glowColor}30, inset 0 0 100px ${glowColor}10`;
                          default:
                            return `inset 0 0 20px ${glowColor}30`;
                        }
                      })()
                    }}
                  />
                  {/* GRITHER логотип на изображении */}
                  <div 
                    className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-bold"
                    style={{
                      background: `linear-gradient(90deg, ${caseType.color}80, ${caseType.color}60)`,
                      color: '#FFFFFF',
                      textShadow: '0 0 8px rgba(0,0,0,0.8)'
                    }}
                  >
                    GRITHER
                  </div>
                </div>
                
                {/* Название кейса */}
                <h4 
                  className="text-lg font-bold tracking-wider"
                  style={{ 
                    color: theme === 'dark' ? '#FFFFFF' : '#0F172A', 
                    textShadow: theme === 'dark' 
                      ? `0 0 10px ${caseType.color}80` 
                      : `0 0 5px ${caseType.color}40`
                  }}
                >
                  {caseType.name}
                </h4>
                
                {/* Цена в G-COIN формате */}
                <div className="space-y-2">
                  <div 
                    className="px-3 py-1 rounded-lg text-sm font-medium"
                    style={{ 
                      background: `linear-gradient(90deg, ${caseType.color}${theme === 'dark' ? '20' : '15'}, transparent)`,
                      border: `1px solid ${caseType.color}${theme === 'dark' ? '40' : '30'}`,
                      color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    {formattedPrice}
                    <img 
                      src={coinImage} 
                      alt="G-coin" 
                      style={{ width: '14px', height: '14px' }}
                    />
                  </div>
                </div>
                
                {/* Кнопка покупки в стиле GRITHER */}
                <button
                  onClick={() => handleBuyCase(shopItem)}
                  className="w-full py-2 px-3 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-center"
                  style={{
                    background: shopItem.isAvailable 
                      ? `linear-gradient(145deg, #FFFFFF, #E0E0E0)` 
                      : `linear-gradient(145deg, #666666, #444444)`,
                    color: shopItem.isAvailable ? '#1A1A1A' : '#CCCCCC',
                    boxShadow: shopItem.isAvailable 
                      ? `0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)` 
                      : `0 4px 15px rgba(0, 0, 0, 0.2)`,
                    textShadow: shopItem.isAvailable ? 'none' : '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                  disabled={!shopItem.isAvailable}
                >
                  {shopItem.isAvailable ? 'КУПИТЬ' : 'НЕДОСТУПНО'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      {/* Заголовок для инвентаря */}
      <div className="text-center">
        <h3 
          className="text-2xl font-bold mb-2"
          style={{
            color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
          }}
        >
          МОИ КЕЙСЫ
        </h3>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
      </div>
      
      {userCases.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-2 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="font-medium mb-2">Пусто</h4>
          <p className="text-sm text-muted-foreground opacity-60">
            Здесь появятся полученные кейсы
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {userCases.map((userCase) => {
            const caseType = cases.find(c => c.id === userCase.caseTypeId);
            if (!caseType) return null;

            return (
              <div 
                key={userCase.id} 
                className="relative rounded-2xl p-4 border transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: theme === 'dark' 
                    ? `linear-gradient(145deg, rgba(16, 20, 28, 0.95) 0%, rgba(22, 26, 34, 0.95) 100%)`
                    : `linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)`,
                  border: `1px solid ${caseType.color}${theme === 'dark' ? '40' : '30'}`,
                  boxShadow: theme === 'dark' 
                    ? `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
                    : `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
                }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Большое изображение кейса с неоновым эффектом */}
                  <div 
                    className="relative w-full h-24 rounded-xl overflow-hidden transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(145deg, ${caseType.glowColor || caseType.color}15, ${caseType.glowColor || caseType.color}05)`,
                      boxShadow: (() => {
                        const glowColor = caseType.glowColor || caseType.color;
                        const intensity = caseType.glowIntensity || 'low';
                        
                        switch (intensity) {
                          case 'low':
                            return `0 0 15px ${glowColor}40, inset 0 0 10px ${glowColor}20`;
                          case 'medium':
                            return `0 0 25px ${glowColor}50, 0 0 50px ${glowColor}20, inset 0 0 15px ${glowColor}30`;
                          case 'high':
                            return `0 0 35px ${glowColor}80, 0 0 70px ${glowColor}40, 0 0 100px ${glowColor}20, inset 0 0 25px ${glowColor}40`;
                          default:
                            return `0 0 25px ${glowColor}40, inset 0 0 15px ${glowColor}20`;
                        }
                      })()
                    }}
                  >
                    <ImageOrEmoji
                      src={caseType.image}
                      className="w-full h-full object-cover"
                    />
                    {/* Неоновая рамка */}
                    <div 
                      className="absolute inset-0 rounded-xl border-2 opacity-60"
                      style={{ 
                        border: `2px solid ${caseType.glowColor || caseType.color}`,
                        boxShadow: (() => {
                          const glowColor = caseType.glowColor || caseType.color;
                          const intensity = caseType.glowIntensity || 'low';
                          
                          switch (intensity) {
                            case 'low':
                              return `inset 0 0 15px ${glowColor}30`;
                            case 'medium':
                              return `inset 0 0 20px ${glowColor}40, inset 0 0 40px ${glowColor}20`;
                            case 'high':
                              return `inset 0 0 30px ${glowColor}50, inset 0 0 60px ${glowColor}30, inset 0 0 90px ${glowColor}10`;
                            default:
                              return `inset 0 0 15px ${glowColor}30`;
                          }
                        })()
                      }}
                    />
                    {/* GRITHER логотип */}
                    <div 
                      className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{
                        background: `linear-gradient(90deg, ${caseType.glowColor || caseType.color}80, ${caseType.glowColor || caseType.color}60)`,
                        color: '#FFFFFF',
                        textShadow: '0 0 6px rgba(0,0,0,0.8)'
                      }}
                    >
                      GRITHER
                    </div>
                  </div>
                  
                  {/* Название кейса */}
                  <h4 
                    className="text-lg font-bold tracking-wider"
                    style={{ 
                      color: theme === 'dark' ? '#FFFFFF' : '#0F172A', 
                      textShadow: theme === 'dark' 
                        ? `0 0 8px ${caseType.color}80` 
                        : `0 0 4px ${caseType.color}40`
                    }}
                  >
                    {caseType.name}
                  </h4>
                  
                  {/* Дата получения */}
                  <p 
                    className="text-xs opacity-70"
                    style={{ color: theme === 'dark' ? '#FFFFFF' : '#6B7280' }}
                  >
                    {userCase.obtainedAt.toLocaleDateString()}
                  </p>
                  
                  {/* Кнопка открытия в стиле GRITHER */}
                  <button
                    onClick={() => handleOpenCase(userCase)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center text-center"
                    style={{
                      background: `linear-gradient(145deg, #FFFFFF, #E0E0E0)`,
                      color: '#1A1A1A',
                      boxShadow: `0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)`
                    }}
                  >
                    ОТКРЫТЬ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="min-h-screen"
      style={{
        background: theme === 'dark' 
          ? `radial-gradient(circle at center top, rgba(16, 20, 28, 1) 0%, rgba(8, 10, 14, 1) 100%)`
          : `linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)`,
        color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
      }}
    >
      <Header 
        profilePhoto={profilePhoto} 
        onOpenSettings={onOpenSettings}
        theme={theme}
      />

      <div className="px-4 pb-24">
        <div className="space-y-6">
          {/* Заголовок убран - теперь он внутри renderShop */}

          {/* Табы в стиле GRITHER */}
          <div 
            className="flex rounded-xl p-1 border"
            style={{
              background: theme === 'dark' 
                ? `linear-gradient(145deg, rgba(8, 10, 14, 0.95) 0%, rgba(16, 20, 28, 0.95) 100%)`
                : `linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)`,
              border: theme === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.06)'
                : '1px solid rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: theme === 'dark'
                ? '0 8px 24px rgba(0, 0, 0, 0.6)'
                : '0 8px 24px rgba(0, 0, 0, 0.10)'
            }}
          >
            <button
              onClick={() => setActiveTab('free')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 text-center text-sm tracking-wide`}
              style={activeTab === 'free' ? {
                background: theme === 'dark' 
                  ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)'
                  : 'linear-gradient(145deg, #0F172A15, #0F172A08)',
                boxShadow: theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  : '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                color: theme === 'dark' ? '#1A1A1A' : '#0F172A',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
              } : {
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                background: 'transparent'
              }}
            >
              ��ЕСПЛАТНЫЙ
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 text-center text-sm tracking-wide`}
              style={activeTab === 'shop' ? {
                background: theme === 'dark' 
                  ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)'
                  : 'linear-gradient(145deg, #0F172A15, #0F172A08)',
                boxShadow: theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  : '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                color: theme === 'dark' ? '#1A1A1A' : '#0F172A',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
              } : {
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                background: 'transparent'
              }}
            >
              МАГАЗИН
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 text-center text-sm tracking-wide`}
              style={activeTab === 'inventory' ? {
                background: theme === 'dark' 
                  ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)'
                  : 'linear-gradient(145deg, #0F172A15, #0F172A08)',
                boxShadow: theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  : '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                color: theme === 'dark' ? '#1A1A1A' : '#0F172A',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
              } : {
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                background: 'transparent'
              }}
            >
              МОИ КЕЙСЫ
            </button>
          </div>

          {/* Контент табов */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'free' && renderFreeCase()}
            {activeTab === 'shop' && renderShop()}
            {activeTab === 'inventory' && renderInventory()}
          </motion.div>
        </div>
      </div>

      <BottomNavigation 
        currentPage={currentPage} 
        onNavigate={onNavigate}
        theme={theme}
      />

      {/* Модал рулетки кейсов */}
      <Modal
        isOpen={isRouletteOpen}
        onClose={handleCloseCaseRoulette}
        title="Открытие кейса"
        theme={theme}
      >
        <div className="space-y-6">
          {canSpin && (
            <p className="text-center text-muted-foreground">
              Нажмите кнопку, чтобы запустить рулетку
            </p>
          )}
          
          {isSpinning && (
            <p className="text-center text-muted-foreground">
              Определяем ваш кейс...
            </p>
          )}
          
          {hasSpun && !isSpinning && wonCase && (
            <div className="text-center space-y-2">
              <p className="text-primary font-semibold">Поздравляем!</p>
              <p className="text-muted-foreground">
                Вы получили: <span className="font-medium text-foreground">{wonCase.name}</span>
              </p>
            </div>
          )}
          
          <CaseRoulette
            cases={cases}
            onResult={handleRouletteResult}
            isSpinning={isSpinning}
            onSpinComplete={handleSpinComplete}
            hasSpun={hasSpun}
          />
          
          <div className="text-center">
            {canSpin && (
              <button
                onClick={handleStartSpin}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-pressed transition-colors"
              >
                Крутить
              </button>
            )}
            
            {hasSpun && !isSpinning && (
              <button
                onClick={handleClaimCase}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-pressed transition-colors"
              >
                Забрать кейс
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Модал рулетки призов */}
      <Modal
        isOpen={isPrizeRouletteOpen}
        onClose={handleClosePrizeRoulette}
        title={openingCase ? `��ткрытие: ${cases.find(c => c.id === openingCase.caseTypeId)?.name}` : "Открытие кейса"}
        theme={theme}
      >
        <div className="space-y-6">
          {canSpin && (
            <p className="text-center text-muted-foreground">
              Нажмите кнопку, чтобы запустить рулетку приз��в
            </p>
          )}
          
          {isSpinning && (
            <p className="text-center text-muted-foreground">
              Определяем ваш приз...
            </p>
          )}
          
          {hasSpun && !isSpinning && wonPrize && (
            <div className="text-center space-y-2">
              <p className="text-primary font-semibold">Поздравляем!</p>
              <p className="text-muted-foreground">
                Вы получили: <span className="font-medium text-foreground">{wonPrize.name}</span>
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded overflow-hidden">
                  <ImageOrEmoji
                    src={wonPrize.image}
                    className="w-full h-full"
                  />
                </div>
                <span 
                  className="text-sm px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: wonPrize.color + '20',
                    color: wonPrize.color 
                  }}
                >
                  {wonPrize.rarity}
                </span>
              </div>
            </div>
          )}
          
          {openingCase && (
            <PrizeRoulette
              prizes={cases.find(c => c.id === openingCase.caseTypeId)?.prizes || []}
              onResult={handlePrizeRouletteResult}
              isSpinning={isSpinning}
              onSpinComplete={handlePrizeSpinComplete}
              hasSpun={hasSpun}
            />
          )}
          
          <div className="text-center">
            {canSpin && (
              <button
                onClick={handleStartPrizeSpin}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-pressed transition-colors"
              >
                Крутить
              </button>
            )}
            
            {hasSpun && !isSpinning && (
              <button
                onClick={handleClaimPrize}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-pressed transition-colors"
              >
                Забрать приз
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Модал деталей кейса */}
      <Modal
        isOpen={caseDetailsOpen}
        onClose={() => setCaseDetailsOpen(false)}
        title={selectedCaseForDetails ? `Детали: ${selectedCaseForDetails.name}` : "Детали кейса"}
        theme={theme}
      >
        {selectedCaseForDetails && selectedShopItem && (
          <div className="space-y-6">
            {/* Изображение кейса */}
            <div className="flex justify-center">
              <div 
                className="w-32 h-32 rounded-2xl border-2 overflow-hidden shadow-lg"
                style={{ 
                  backgroundColor: selectedCaseForDetails.color + '20',
                  border: `2px solid ${selectedCaseForDetails.color}`,
                  boxShadow: `0 12px 24px ${selectedCaseForDetails.color}40`
                }}
              >
                <ImageOrEmoji
                  src={selectedCaseForDetails.image}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Описание и редкость */}
            <div className="text-center space-y-3">
              <div 
                className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: selectedCaseForDetails.color + '20',
                  color: selectedCaseForDetails.color
                }}
              >
                {selectedCaseForDetails.rarity === 'common' && 'Обычный'}
                {selectedCaseForDetails.rarity === 'rare' && 'Редкий'}
                {selectedCaseForDetails.rarity === 'epic' && 'Эпический'}
                {selectedCaseForDetails.rarity === 'legendary' && 'Легендарный'}
                {selectedCaseForDetails.rarity === 'mythic' && 'Мифический'}
              </div>
              <p className="text-muted-foreground">
                {selectedCaseForDetails.description}
              </p>
            </div>

            {/* Содержимое кейса */}
            <div className="space-y-3">
              <h4 className="font-semibold">Возможные призы:</h4>
              <div className="grid gap-2">
                {selectedCaseForDetails.prizes.slice(0, 6).map((prize) => (
                  <div key={prize.id} className="flex items-center gap-3 p-3 glass-card">
                    <div className="w-8 h-8 rounded overflow-hidden">
                      <ImageOrEmoji
                        src={prize.image}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{prize.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Шанс: {prize.dropChance}%
                      </div>
                    </div>
                    <div 
                      className="text-xs px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: prize.color + '20',
                        color: prize.color 
                      }}
                    >
                      {prize.rarity === 'common' && 'Обычный'}
                      {prize.rarity === 'rare' && 'Редкий'}
                      {prize.rarity === 'epic' && 'Эпический'}
                      {prize.rarity === 'legendary' && 'Легендарный'}
                      {prize.rarity === 'mythic' && 'Мифический'}
                    </div>
                  </div>
                ))}
                {selectedCaseForDetails.prizes.length > 6 && (
                  <div className="text-center text-sm text-muted-foreground">
                    и ещё {selectedCaseForDetails.prizes.length - 6} призов...
                  </div>
                )}
              </div>
            </div>

            {/* Цена и кнопка покупки */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 p-4 glass-card">
                {selectedShopItem.discount && (
                  <span className="text-sm text-muted-foreground line-through">
                    {selectedShopItem.price} {selectedShopItem.currency === 'coins' ? '🪙' : '💎'}
                  </span>
                )}
                <span className="text-xl font-semibold flex items-center gap-2">
                  {Math.floor(selectedShopItem.discount 
                    ? selectedShopItem.price * (1 - selectedShopItem.discount / 100)
                    : selectedShopItem.price
                  )}
                  {selectedShopItem.currency === 'coins' ? <Coins className="w-5 h-5" /> : <Gem className="w-5 h-5" />}
                </span>
                {selectedShopItem.discount && (
                  <span className="text-sm bg-destructive text-destructive-foreground px-3 py-1 rounded-full font-medium">
                    -{selectedShopItem.discount}% скидка
                  </span>
                )}
              </div>
              
              <button
                onClick={() => handleBuyCase(selectedShopItem)}
                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-pressed transition-colors text-center"
                disabled={!selectedShopItem.isAvailable}
              >
                {selectedShopItem.isAvailable ? 'Купить кейс' : 'Недо��тупно'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}