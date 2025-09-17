import { useState, useEffect, useRef } from 'react';
import { Menu, User, ArrowLeft, Clock, Plus, Info, ArrowRight, Calendar, ChevronDown, X, Check, Paperclip, TrendingUp, TrendingDown, Minus } from './Icons';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { LeaderboardEntry, Battle } from '../types/global';

type SortType = 'level' | 'achievements' | 'balance';

interface UserData {
  id: number;
  name: string;
  team: string;
  level: number;
  balance: string;
  achievements: number;
  avatar?: string;
}

interface BattleData {
  id: number;
  challenger: string;
  opponent: string;
  status: 'active' | 'finished';
  winner?: 'challenger' | 'opponent';
}

interface BattleHistoryData {
  id: number;
  challenger: string;
  opponent: string;
  winner: 'challenger' | 'opponent';
  date: string;
  stake: {
    amount: string;
  };
}

interface ActiveBattle {
  id: number;
  challenger: string;
  opponent: string;
  stake: string;
  date: string;
  status: 'pending' | 'accepted' | 'completed';
  challengerEvidence?: string;
  opponentEvidence?: string;
}

interface WeeklyHistory {
  weekStart: string; // Дата начала недели (воскресенье)
  weekEnd: string;   // Дата конца недели (суббота) 
  battles: BattleHistoryData[];
}

interface AllTimeHistory {
  battles: BattleHistoryData[];
}

interface Employee {
  id: number;
  name: string;
  team: number;
  avatar?: string;
}

interface Team {
  id: number;
  name: string;
}

interface BattleLeaderboardProps {
  leaderboard?: LeaderboardEntry[];
  activeBattles?: Battle[];
  onNavigate?: (page: string) => void;
  personalBattles?: any[];
  setPersonalBattles?: (battles: any[]) => void;
  theme?: 'light' | 'dark';
}

export function BattleLeaderboard({ leaderboard = [], activeBattles = [], onNavigate, personalBattles = [], setPersonalBattles, theme = 'light' }: BattleLeaderboardProps) {
  const [sortType, setSortType] = useState<SortType>('level');
  const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
  const [dialogSortType, setDialogSortType] = useState<SortType>('level');
  const [isBattleHistoryOpen, setIsBattleHistoryOpen] = useState(false);
  const [isBattleDetailsOpen, setIsBattleDetailsOpen] = useState(false);
  const [isAllTimeHistoryOpen, setIsAllTimeHistoryOpen] = useState(false);
  const [isCreateBattleOpen, setIsCreateBattleOpen] = useState(false);
  const [isBattleConfirmOpen, setIsBattleConfirmOpen] = useState(false);
  const [isTeamFilterOpen, setIsTeamFilterOpen] = useState(false);
  const [selectedBattle, setSelectedBattle] = useState<BattleHistoryData | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<number | null>(null);
  const [createBattleTab, setCreateBattleTab] = useState<'employees' | 'battles'>('employees');
  const [battleStake, setBattleStake] = useState('');
  const [isCancelBattleOpen, setIsCancelBattleOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceComment, setEvidenceComment] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  
  // Ref для выпадающего меню команд
  const teamFilterRef = useRef<HTMLDivElement>(null);

  // Преобразуем данные лидерборда в placeholder формат или используем тестовые данные
  const users: UserData[] = leaderboard.length > 0 
    ? leaderboard.map((entry, index) => ({
        id: index + 1,
        name: entry.user.name || 'Placeholder',
        team: `Team ${Math.floor(Math.random() * 6) + 1}`,
        level: entry.score || Math.floor(Math.random() * 20) + 1,
        balance: `${Math.floor(Math.random() * 10000) + 1000}g`,
        achievements: Math.floor(Math.random() * 50) + 1,
        avatar: entry.user.avatar || ''
      }))
    : [
        // Тестовые данные для демонстрации сортировки
        { id: 1, name: 'Анна Иванова', team: 'Team 1', level: 15, balance: '5400g', achievements: 32, avatar: '' },
        { id: 2, name: 'Петр Петров', team: 'Team 2', level: 12, balance: '8200g', achievements: 28, avatar: '' },
        { id: 3, name: 'Мария Сидорова', team: 'Team 3', level: 18, balance: '3600g', achievements: 45, avatar: '' }
      ];

  // Функция для получения даты начала недели (воскресенье)
  const getWeekStart = (date: Date = new Date()): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Функция для получения даты конца недели (суббота)
  const getWeekEnd = (weekStart: Date): Date => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  };

  // Функция для форматирования даты
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  };

  // Получаем текущую неделю
  const currentWeekStart = getWeekStart();
  const currentWeekEnd = getWeekEnd(currentWeekStart);

  // Placeholder данные для истории баттлов (пока пустые)
  const weeklyHistory: WeeklyHistory = {
    weekStart: formatDate(currentWeekStart),
    weekEnd: formatDate(currentWeekEnd),
    battles: []
  };

  // Placeholder данные для истории за все время (пока пустые)
  const allTimeHistory: AllTimeHistory = {
    battles: []
  };

  // Mock данные сотрудников с командами (только 1-6 команды могут баттлиться)
  const allEmployees: Employee[] = [
    { id: 1, name: 'Анна Иванова', team: 1, avatar: undefined },
    { id: 2, name: 'Петр Петров', team: 1, avatar: undefined },
    { id: 3, name: 'Мария Сидорова', team: 2, avatar: undefined },
    { id: 4, name: 'Алексей Козлов', team: 2, avatar: undefined },
    { id: 5, name: 'Елена Морозова', team: 3, avatar: undefined },
    { id: 6, name: 'Дмитрий Волков', team: 3, avatar: undefined },
    { id: 7, name: 'Ольга Соколова', team: 4, avatar: undefined },
    { id: 8, name: 'Сергей Орлов', team: 4, avatar: undefined },
    { id: 9, name: 'Михаил Рыбаков', team: 5, avatar: undefined },
    { id: 10, name: 'Татьяна Белова', team: 5, avatar: undefined },
    { id: 11, name: 'Владимир Новиков', team: 6, avatar: undefined },
    { id: 12, name: 'Екатерина Попова', team: 6, avatar: undefined },
  ];

  // Фильтрация сотрудников по команде (только команды 1-6)
  const filteredEmployees = selectedTeamFilter 
    ? allEmployees.filter(emp => emp.team === selectedTeamFilter)
    : allEmployees.filter(emp => emp.team >= 1 && emp.team <= 6);

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleSortClick = () => {
    // Визуальный эффект нажатия
    setIsButtonClicked(true);
    setTimeout(() => setIsButtonClicked(false), 200);

    // Переключение типа сортировки по кругу
    const sortTypes: SortType[] = ['level', 'achievements', 'balance'];
    const currentIndex = sortTypes.indexOf(sortType);
    const nextIndex = (currentIndex + 1) % sortTypes.length;
    const newSortType = sortTypes[nextIndex];
    setSortType(newSortType);
    
    // Отладка для проверки работы кнопки
    console.log(`Сортировка изменена с "${getSortTypeText(sortType)}" на "${getSortTypeText(newSortType)}"`);
  };

  const handleDialogSortClick = () => {
    // Переключение типа сортировки в диалоге
    const sortTypes: SortType[] = ['level', 'achievements', 'balance'];
    const currentIndex = sortTypes.indexOf(dialogSortType);
    const nextIndex = (currentIndex + 1) % sortTypes.length;
    setDialogSortType(sortTypes[nextIndex]);
  };

  const handleUsersClick = () => {
    setIsUsersDialogOpen(true);
  };

  const handleUserClick = (userId: number) => {
    // В будущем здесь будет открытие профиля пользователя
    console.log(`Открыть профиль пользователя ${userId}`);
  };

  const handleBattleHistoryClick = () => {
    setIsBattleHistoryOpen(true);
  };

  const handleCreateBattleClick = () => {
    setIsCreateBattleOpen(true);
  };

  const handleBattleDetailsClick = (battle: BattleHistoryData) => {
    setSelectedBattle(battle);
    setIsBattleDetailsOpen(true);
  };

  const handleAllTimeHistoryClick = () => {
    setIsAllTimeHistoryOpen(true);
  };

  const handleEmployeeChallengeClick = (employee: Employee) => {
    if (personalBattles.length > 0) return; // Блокируем если уже есть активный баттл
    
    setSelectedEmployee(employee);
    setIsBattleConfirmOpen(true);
  };

  const handleConfirmBattle = () => {
    if (selectedEmployee && battleStake.trim() && setPersonalBattles) {
      // Создаем активный баттл
      const newBattle = {
        id: Date.now().toString(),
        challenger: {
          id: 'current-user',
          name: 'Вы',
          team: 1,
          level: 5,
          avatar: null,
          role: 'Сотрудник',
          achievements: 10,
          completedTasks: 25
        },
        opponent: {
          id: selectedEmployee.id.toString(),
          name: selectedEmployee.name,
          team: selectedEmployee.team,
          level: Math.floor(Math.random() * 20) + 1,
          avatar: null,
          status: 'available' as const,
          role: 'Сотрудник',
          achievements: Math.floor(Math.random() * 50) + 1,
          completedTasks: Math.floor(Math.random() * 100) + 1
        },
        status: 'active' as const,
        prize: parseInt(battleStake),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 дней
        created: new Date()
      };
      
      // Добавляем к глобальному состоянию
      setPersonalBattles([...personalBattles, newBattle]);
      console.log(`Баттл создан с ${selectedEmployee.name} на сумму ${battleStake} коинов`);
      
      // Очищаем состояние
      setIsBattleConfirmOpen(false);
      setIsCreateBattleOpen(false);
      setSelectedEmployee(null);
      setBattleStake('');
    }
  };

  const handleTeamFilterClick = (teamId: number | null) => {
    setSelectedTeamFilter(teamId);
    setIsTeamFilterOpen(false);
  };

  const handleCancelBattleConfirm = () => {
    setIsBattleConfirmOpen(false);
    setSelectedEmployee(null);
    setBattleStake('');
  };

  const getSortTypeText = (type: SortType) => {
    switch (type) {
      case 'level':
        return 'По уровню';
      case 'achievements':
        return 'По ачивкам';
      case 'balance':
        return 'По балансу';
      default:
        return 'По уровню';
    }
  };

  const sortUsers = (users: UserData[], sortType: SortType): UserData[] => {
    return [...users].sort((a, b) => {
      switch (sortType) {
        case 'level':
          return b.level - a.level;
        case 'achievements':
          return b.achievements - a.achievements;
        case 'balance':
          // Парсим числовое значение из строки баланса для правильной сортировки
          const balanceA = parseFloat(a.balance.replace(/[^\d.-]/g, '')) || 0;
          const balanceB = parseFloat(b.balance.replace(/[^\d.-]/g, '')) || 0;
          return balanceB - balanceA;
        default:
          return b.level - a.level;
      }
    });
  };

  const sortedUsers = sortUsers(users, dialogSortType);

  // Обработчик клика вне выпадающего меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (teamFilterRef.current && !teamFilterRef.current.contains(event.target as Node)) {
        setIsTeamFilterOpen(false);
      }
    };

    if (isTeamFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTeamFilterOpen]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {/* Баттл секция */}
        <div 
          className={`${theme === 'dark' ? 'dark' : ''}`}
          style={{
            backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
            borderRadius: '20px',
            border: theme === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.06)' 
              : '1px solid #E6E9EF',
            boxShadow: theme === 'dark' 
              ? '0 8px 24px rgba(0, 0, 0, 0.6)' 
              : '0 8px 24px rgba(0, 0, 0, 0.10)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-0">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('HISTORY BUTTON CLICKED!');
                handleBattleHistoryClick();
              }}
              className="p-2 rounded-full transition-all hover:scale-105"
              style={{
                background: theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#FFFFFF',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#1A1A1A' : '#0F172A',
                boxShadow: theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.06)',
                position: 'relative',
                zIndex: 60,
                cursor: 'pointer'
              }}
              title="История баттлов"
            >
              <Clock className="w-4 h-4" />
            </button>
            <h3 
              className="font-medium text-center flex-1"
              style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
            >
              Баттлы
            </h3>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('CREATE BATTLE BUTTON CLICKED!');
                handleCreateBattleClick();
              }}
              className="p-2 rounded-full transition-all hover:scale-105"
              style={{
                background: theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#FFFFFF',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#1A1A1A' : '#0F172A',
                boxShadow: theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.06)',
                position: 'relative',
                zIndex: 60,
                cursor: 'pointer'
              }}
              title="Создать баттл"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 pt-3">
            <div className="flex items-center justify-center min-h-[50px]">
              {personalBattles.length > 0 ? (
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2 justify-center">
                  <span 
                    className="text-xs font-medium truncate"
                    style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                  >
                    Баттл с {personalBattles[0].opponent.name}
                  </span>
                </div>
                <div 
                  className="text-xs text-center"
                  style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                >
                  Ставка: {personalBattles[0].prize}g
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('VICTORY BUTTON CLICKED!', personalBattles[0]);
                      
                      // Логика победы в баттле
                      if (setPersonalBattles) {
                        const updatedBattles = personalBattles.filter((_, index) => index !== 0);
                        setPersonalBattles(updatedBattles);
                        console.log('Баттл завершен победой!');
                      }
                    }}
                    className="flex-1 py-2 text-xs font-medium hover:scale-[0.98] transition-transform"
                    style={{
                      background: '#34C759',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      height: '28px',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      zIndex: 50
                    }}
                  >
                    Выиграл
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('CANCEL BUTTON CLICKED!', personalBattles[0]);
                      
                      // Логика отмены баттла
                      if (setPersonalBattles) {
                        const updatedBattles = personalBattles.filter((_, index) => index !== 0);
                        setPersonalBattles(updatedBattles);
                        console.log('Баттл отменен!');
                      }
                    }}
                    className="py-2 px-3 text-xs font-medium hover:scale-[0.98] transition-transform"
                    style={{
                      background: '#FF3B30',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      height: '28px',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      zIndex: 50
                    }}
                  >
                    Отменить
                  </button>
                </div>
              </div>
            ) : (
              <p 
                className="text-sm text-center opacity-70"
                style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
              >
                Нет активных баттлов
              </p>
            )}
            </div>
          </div>
        </div>

        {/* Лидерборд секция */}
        <div 
          className={`${theme === 'dark' ? 'dark' : ''}`}
          style={{
            backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
            borderRadius: '20px',
            border: theme === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.06)' 
              : '1px solid #E6E9EF',
            boxShadow: theme === 'dark' 
              ? '0 8px 24px rgba(0, 0, 0, 0.6)' 
              : '0 8px 24px rgba(0, 0, 0, 0.10)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-0">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('SORT BUTTON CLICKED!');
                handleSortClick();
              }}
              className={`p-2 rounded-full transition-all hover:scale-105 active:scale-95 ${isButtonClicked ? 'animate-pulse' : ''}`}
              style={{
                background: theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#FFFFFF',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#1A1A1A' : '#0F172A',
                boxShadow: theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.06)',
                animation: isButtonClicked ? 'pulse 0.2s ease-in-out' : 'none',
                position: 'relative',
                zIndex: 60,
                cursor: 'pointer'
              }}
              title={`Сортировка: ${getSortTypeText(sortType)} (нажмите для изменения)`}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center">
              <h3 
                className="font-medium"
                style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
              >
                Лидерборд
              </h3>
              <p 
                className="text-xs opacity-60 mt-1"
                style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
              >
                {getSortTypeText(sortType)}
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('USERS BUTTON CLICKED!');
                handleUsersClick();
              }}
              className="p-2 rounded-full transition-all hover:scale-105"
              style={{
                background: theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#FFFFFF',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#1A1A1A' : '#0F172A',
                boxShadow: theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.06)',
                position: 'relative',
                zIndex: 60,
                cursor: 'pointer'
              }}
              title="Все пользователи"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 pt-3">
            <div className="flex items-center justify-center min-h-[50px]">
              {users.length > 0 ? (
              <div className="w-full space-y-1">
                {sortUsers(users, sortType).slice(0, 3).map((user, index) => (
                  <div 
                    key={`${user.id}-${sortType}`} 
                    className="flex items-center gap-2 text-xs transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      animation: 'fadeIn 0.3s ease-in-out'
                    }}
                  >
                    <span 
                      className="font-medium w-4"
                      style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                    >
                      {index + 1}.
                    </span>
                    <span 
                      className="truncate flex-1"
                      style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                    >
                      {user.name}
                    </span>
                    <span 
                      className="text-xs font-medium"
                      style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                    >
                      {sortType === 'level' && `Ур.${user.level}`}
                      {sortType === 'achievements' && `${user.achievements}★`}
                      {sortType === 'balance' && user.balance}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p 
                className="text-sm text-center opacity-70"
                style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
              >
                Список лидеров отсутствует
              </p>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* История баттлов */}
      <Dialog open={isBattleHistoryOpen} onOpenChange={setIsBattleHistoryOpen}>
        <DialogContent 
          className="sm:max-w-md mx-auto"
          style={{
            background: theme === 'dark' ? '#1C2029' : '#FFFFFF',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
            boxShadow: theme === 'dark' 
              ? '0 16px 48px rgba(0, 0, 0, 0.6)' 
              : '0 16px 48px rgba(0, 0, 0, 0.12)'
          }}
        >
          <DialogTitle style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
            История баттлов
          </DialogTitle>
          <DialogDescription style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
            Ваши прошлые баттлы за эту неделю ({weeklyHistory.weekStart} - {weeklyHistory.weekEnd})
          </DialogDescription>
          
          <div className="space-y-3">
            {weeklyHistory.battles.length > 0 ? (
              weeklyHistory.battles.map((battle) => (
                <div 
                  key={battle.id}
                  className="p-3 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: theme === 'dark' ? '#161A22' : '#F8F9FA',
                    border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
                  }}
                  onClick={() => handleBattleDetailsClick(battle)}
                >
                  <div className="flex justify-between items-center">
                    <span style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                      {battle.challenger} vs {battle.opponent}
                    </span>
                    <span style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                      {battle.date}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                  На этой неделе баттлов не было
                </p>
                <button 
                  onClick={handleAllTimeHistoryClick}
                  className="mt-2 text-blue-500 hover:text-blue-600"
                >
                  Посмотреть историю за все время
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Создание баттла */}
      <Dialog open={isCreateBattleOpen} onOpenChange={setIsCreateBattleOpen}>
        <DialogContent 
          className="sm:max-w-lg mx-auto"
          style={{
            background: theme === 'dark' ? '#1C2029' : '#FFFFFF',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
            boxShadow: theme === 'dark' 
              ? '0 16px 48px rgba(0, 0, 0, 0.6)' 
              : '0 16px 48px rgba(0, 0, 0, 0.12)'
          }}
        >
          <DialogTitle style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
            Создать баттл
          </DialogTitle>
          <DialogDescription style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
            Выберите соперника для баттла
          </DialogDescription>
          
          <div className="space-y-4">
            {/* Фильтр по командам */}
            <div className="relative" ref={teamFilterRef}>
              <button
                onClick={() => setIsTeamFilterOpen(!isTeamFilterOpen)}
                className="w-full p-2 text-left rounded-lg border flex justify-between items-center"
                style={{
                  background: theme === 'dark' ? '#161A22' : '#F8F9FA',
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              >
                {selectedTeamFilter ? `Команда ${selectedTeamFilter}` : 'Все команды'}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isTeamFilterOpen && (
                <div 
                  className="absolute top-full left-0 right-0 mt-1 border rounded-lg z-50 max-h-48 overflow-y-auto"
                  style={{
                    background: theme === 'dark' ? '#161A22' : '#FFFFFF',
                    border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
                    boxShadow: theme === 'dark' ? '0 8px 24px rgba(0, 0, 0, 0.6)' : '0 8px 24px rgba(0, 0, 0, 0.10)'
                  }}
                >
                  <button
                    onClick={() => handleTeamFilterClick(null)}
                    className="w-full p-2 text-left hover:bg-opacity-50"
                    style={{
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                      backgroundColor: !selectedTeamFilter ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)') : 'transparent'
                    }}
                  >
                    Все команды
                  </button>
                  {[1, 2, 3, 4, 5, 6].map(teamId => (
                    <button
                      key={teamId}
                      onClick={() => handleTeamFilterClick(teamId)}
                      className="w-full p-2 text-left hover:bg-opacity-50"
                      style={{
                        color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                        backgroundColor: selectedTeamFilter === teamId ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)') : 'transparent'
                      }}
                    >
                      Команда {teamId}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Список сотрудников */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: theme === 'dark' ? '#161A22' : '#F8F9FA',
                    border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
                  }}
                  onClick={() => handleEmployeeChallengeClick(employee)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback style={{
                        background: theme === 'dark' ? '#2A3340' : '#E6E9EF',
                        color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                      }}>
                        {employee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                        {employee.name}
                      </div>
                      <div style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} className="text-sm">
                        Команда {employee.team}
                      </div>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg transition-colors"
                    style={{
                      background: personalBattles.length > 0 ? (theme === 'dark' ? '#2A3340' : '#E6E9EF') : '#2B82FF',
                      color: personalBattles.length > 0 ? (theme === 'dark' ? '#6B7280' : '#9CA3AF') : '#FFFFFF'
                    }}
                    disabled={personalBattles.length > 0}
                  >
                    {personalBattles.length > 0 ? 'Блокировано' : 'Вызвать'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Подтверждение создания баттла */}
      <Dialog open={isBattleConfirmOpen} onOpenChange={setIsBattleConfirmOpen}>
        <DialogContent 
          className="sm:max-w-md mx-auto"
          style={{
            background: theme === 'dark' ? '#1C2029' : '#FFFFFF',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
            boxShadow: theme === 'dark' 
              ? '0 16px 48px rgba(0, 0, 0, 0.6)' 
              : '0 16px 48px rgba(0, 0, 0, 0.12)'
          }}
        >
          <DialogTitle style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
            Подтверждение баттла
          </DialogTitle>
          <DialogDescription style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
            Вызвать на баттл {selectedEmployee?.name}?
          </DialogDescription>
          
          <div className="space-y-4">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
              >
                Ставка (коины)
              </label>
              <input
                type="number"
                value={battleStake}
                onChange={(e) => setBattleStake(e.target.value)}
                placeholder="100"
                className="w-full p-2 border rounded-lg"
                style={{
                  background: theme === 'dark' ? '#161A22' : '#FFFFFF',
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleConfirmBattle}
                disabled={!battleStake.trim()}
                className="flex-1 py-2 px-4 rounded-lg transition-colors"
                style={{
                  background: !battleStake.trim() ? (theme === 'dark' ? '#2A3340' : '#E6E9EF') : '#2B82FF',
                  color: !battleStake.trim() ? (theme === 'dark' ? '#6B7280' : '#9CA3AF') : '#FFFFFF'
                }}
              >
                Подтвердить
              </button>
              <button
                onClick={handleCancelBattleConfirm}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  background: theme === 'dark' ? '#2A3340' : '#E6E9EF',
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Все пользователи */}
      <Dialog open={isUsersDialogOpen} onOpenChange={setIsUsersDialogOpen}>
        <DialogContent 
          className="sm:max-w-md mx-auto"
          style={{
            background: theme === 'dark' ? '#1C2029' : '#FFFFFF',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
            boxShadow: theme === 'dark' 
              ? '0 16px 48px rgba(0, 0, 0, 0.6)' 
              : '0 16px 48px rgba(0, 0, 0, 0.12)'
          }}
        >
          <DialogTitle style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
            Все пользователи
          </DialogTitle>
          <DialogDescription style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
            Полный список участников - {getSortTypeText(dialogSortType)}
          </DialogDescription>
          
          <div className="flex justify-between items-center mb-4">
            <span style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
              Сортировка: {getSortTypeText(dialogSortType)}
            </span>
            <button
              onClick={handleDialogSortClick}
              className="p-2 rounded-lg transition-colors"
              style={{
                background: theme === 'dark' ? '#161A22' : '#F8F9FA',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {sortedUsers.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors"
                style={{
                  background: theme === 'dark' ? '#161A22' : '#F8F9FA',
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
                }}
                onClick={() => handleUserClick(user.id)}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                    #{index + 1}
                  </span>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback style={{
                      background: theme === 'dark' ? '#2A3340' : '#E6E9EF',
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                    }}>
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                      {user.name}
                    </div>
                    <div style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} className="text-sm">
                      {user.team}
                    </div>
                  </div>
                </div>
                <div style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                  {dialogSortType === 'level' && `Ур.${user.level}`}
                  {dialogSortType === 'achievements' && `${user.achievements}★`}
                  {dialogSortType === 'balance' && user.balance}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}