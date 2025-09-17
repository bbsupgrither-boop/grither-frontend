import { useState } from 'react';
import { ArrowLeft, Plus, ChevronDown, Edit, Trash2, X, Upload, Home, Users, Zap, Trophy, CheckSquare, ShoppingBag, Gamepad2, Box, RotateCcw, User } from './Icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

interface Worker {
  id: string;
  name: string;
  team: string;
  role: string;
  level: number;
  telegramId?: string;
  avatar?: string;
  dateOfBirth?: string;
  position?: string;
  experience?: string;
  teamLead?: string;
  registrationDate?: string;
  isActive: boolean;
  fireReason?: string;
  fireDate?: string;
  fireComment?: string;
}

interface WorkersManagementProps {
  onBack: () => void;
  onNavigateToSection: (section: string) => void;
}

// Mock функция для получения аватарки из Telegram
const getTelegramUserAvatar = async (telegramId: string): Promise<string | null> => {
  // В реальном приложении здесь будет запрос к Telegram Bot API
  // Для демонстрации используем детерминированные изображения из Unsplash
  try {
    // Симулируем задержку API
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Набор готовых профессиональных аватарок
    const avatars = [
      'https://images.unsplash.com/photo-1629507208649-70919ca33793?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop&crop=face'
    ];
    
    // Детерминированный выбор аватара на основе Telegram ID
    const avatarIndex = parseInt(telegramId.slice(-3)) % avatars.length;
    const selectedAvatar = avatars[avatarIndex];
    
    console.log(`🔍 Получена аватарка для Telegram ID @${telegramId}:`, selectedAvatar);
    
    return selectedAvatar;
  } catch (error) {
    console.error('Ошибка получения аватарки:', error);
    return null;
  }
};

export function WorkersManagement({ onBack, onNavigateToSection }: WorkersManagementProps) {
  const [selectedTeam, setSelectedTeam] = useState('Все команды');
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showEditWorker, setShowEditWorker] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showFiredWorkers, setShowFiredWorkers] = useState(false);
  const [showFiredWorkerDetails, setShowFiredWorkerDetails] = useState(false);
  const [firedSortBy, setFiredSortBy] = useState<'date' | 'team' | 'name'>('date');
  const [showFiredSortDropdown, setShowFiredSortDropdown] = useState(false);

  // Пустые данные сотрудников - администраторы добавят их самостоятельно
  const [workers, setWorkers] = useState<Worker[]>([]);

  const teams = ['Все команды', 'Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5', 'Team 6', 'Саппорт', 'Руководство'];
  
  const roles = ['GRITHER', 'GLEB', 'SUPPORT', 'TEAMLEAD', 'WORKER'];
  
  const teamLeads: string[] = [];
  
  const supports: string[] = [];

  // Функция для получения номера команды для сортировки
  const getTeamNumber = (team: string) => {
    if (team.startsWith('Team ')) {
      return parseInt(team.split(' ')[1]) || 999;
    }
    return 999; // Для команд типа "Саппорт", "Руководство" и др.
  };

  // Фильтрация активных сотрудников
  const activeWorkers = workers
    .filter(worker => {
      if (!worker.isActive) return false;
      if (selectedTeam === 'Все команды') return true;
      return worker.team === selectedTeam;
    })
    .sort((a, b) => {
      // Сортировка по командам: Team 1, Team 2, Team 3, и т.д.
      const teamA = getTeamNumber(a.team);
      const teamB = getTeamNumber(b.team);
      return teamA - teamB;
    });

  // Фильтрация уволенных сотрудников с сортировкой
  const firedWorkers = workers
    .filter(worker => !worker.isActive)
    .sort((a, b) => {
      switch (firedSortBy) {
        case 'date':
          if (a.fireDate && b.fireDate) {
            return new Date(b.fireDate).getTime() - new Date(a.fireDate).getTime();
          }
          return 0;
        case 'team':
          return a.team.localeCompare(b.team);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleEditWorker = (worker: Worker) => {
    setSelectedWorker(worker);
    if (worker.isActive) {
      setShowEditWorker(true);
    } else {
      setShowFiredWorkerDetails(true);
    }
  };

  const handleRestoreWorker = (worker: Worker) => {
    setWorkers(prev => prev.map(w => 
      w.id === worker.id 
        ? { ...w, isActive: true, fireReason: undefined, fireDate: undefined, fireComment: undefined }
        : w
    ));
    setShowFiredWorkerDetails(false);
    setSelectedWorker(null);
  };

  const navigationItems = [
    { icon: Home, label: 'Главная', section: 'dashboard' },
    { icon: Users, label: 'Сотрудники', section: 'workers' },
    { icon: Zap, label: 'Баттлы', section: 'battles' },
    { icon: Trophy, label: 'Достижения', section: 'achievements' },
    { icon: CheckSquare, label: 'Задачи', section: 'tasks' },
    { icon: ShoppingBag, label: 'Товары', section: 'shop' },
    { icon: Gamepad2, label: 'Игры', section: 'games' },
    { icon: Box, label: 'Кейсы', section: 'cases' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Заголовок страницы */}
      <div className="p-6 text-center">
        <h1 className="text-lg font-medium text-foreground">Панель управления</h1>
      </div>

      {/* Управление */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAddWorker(true)}
            className="px-4 py-2 glass-card rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground"
          >
            Доб. сотрудника
          </button>
          <button
            onClick={() => setShowFiredWorkers(true)}
            className="px-4 py-2 glass-card rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground"
          >
            Уволены
          </button>
        </div>
      </div>

      {/* Содержимое */}
      <div className="p-6 space-y-6 pb-60">
        {/* Секция сотрудников */}
        <div className="glass-card rounded-2xl apple-shadow p-4">
          {/* Заголовок с кнопкой фильтра */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground text-center flex-1">Сотрудники</h2>
            <div className="relative">
              <button
                onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                className="flex items-center gap-2 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                title="Фильтр по командам"
              >
                <span>⋮</span>
              </button>
              {showTeamDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 glass-card rounded-xl apple-shadow z-10">
                  {teams.map((team) => (
                    <button
                      key={team}
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowTeamDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedTeam === team ? 'bg-primary text-primary-foreground' : 'hover:bg-black/5 text-foreground'
                      }`}
                    >
                      {team}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Список сотрудников */}
          <div className="space-y-3">
            {activeWorkers.map((worker) => (
              <div key={worker.id} className="flex items-center justify-between p-3 border border-border/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center overflow-hidden">
                    {worker.avatar ? (
                      <img 
                        src={worker.avatar} 
                        alt={`Аватарка ${worker.name}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'block';
                        }}
                      />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                    {worker.avatar && (
                      <User className="w-5 h-5 text-muted-foreground" style={{ display: 'none' }} />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{worker.name}, {worker.team}</div>
                    <div className="text-xs text-muted-foreground">
                      {worker.role} {worker.telegramId && `• @${worker.telegramId}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleEditWorker(worker)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-primary" />
                </button>
              </div>
            ))}
            {activeWorkers.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Сотрудники не найдены
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно уволенных сотрудников */}
      <Dialog open={showFiredWorkers} onOpenChange={setShowFiredWorkers}>
        <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
          <DialogTitle className="text-lg font-medium text-foreground text-center">Список уволенных</DialogTitle>
          <DialogDescription className="sr-only">
            Список уволенных сотрудников с возможностью восстановления
          </DialogDescription>
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <button
                    onClick={() => setShowFiredSortDropdown(!showFiredSortDropdown)}
                    className="flex items-center gap-2 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                    title="Сортировка"
                  >
                    <span>⋮</span>
                  </button>
                  {showFiredSortDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 glass-card rounded-xl apple-shadow z-10">
                      {[
                        { key: 'date', label: 'По дате увольнения' },
                        { key: 'team', label: 'По команде' },
                        { key: 'name', label: 'По имени' }
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => {
                            setFiredSortBy(option.key as 'date' | 'team' | 'name');
                            setShowFiredSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                            firedSortBy === option.key ? 'bg-primary text-primary-foreground' : 'hover:bg-black/5 text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1"></div>
                <button
                  onClick={() => setShowFiredWorkers(false)}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground/70" />
                </button>
              </div>
            </DialogHeader>

            {/* Список уволенных */}
            <div className="overflow-y-auto max-h-[calc(80vh-200px)] space-y-3">
              {firedWorkers.map((worker) => (
                <div 
                  key={worker.id} 
                  className="flex items-center justify-between p-3 border border-border/20 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  onClick={() => handleEditWorker(worker)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{worker.name}, {worker.team}</div>
                      <div className="text-xs text-muted-foreground">
                        Статус: уволен
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestoreWorker(worker);
                    }}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                    title="Восстановить"
                  >
                    <RotateCcw className="w-4 h-4 text-primary" />
                  </button>
                </div>
              ))}
              {firedWorkers.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Уволенных сотрудников нет
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно добавления воркера */}
      {showAddWorker && (
        <WorkerModal
          isEdit={false}
          worker={null}
          onClose={() => setShowAddWorker(false)}
          onSave={(workerData) => {
            // Логика добавления нового сотрудника
            const newWorker: Worker = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              name: workerData.name || '',
              telegramId: workerData.telegramId,
              avatar: workerData.avatar,
              team: workerData.team || '',
              role: workerData.role || 'WORKER',
              level: workerData.level || 1,
              dateOfBirth: workerData.dateOfBirth,
              position: workerData.position,
              experience: workerData.experience,
              teamLead: workerData.teamLead,
              registrationDate: workerData.registrationDate || new Date().toISOString().split('T')[0],
              isActive: true
            };
            
            setWorkers(prev => [...prev, newWorker]);
            setShowAddWorker(false);
            console.log('Добавлен новый сотрудник:', newWorker);
          }}
          teamLeads={teamLeads}
          supports={supports}
          roles={roles}
          teams={teams.slice(1)} // Убираем "Все команды"
        />
      )}

      {/* Модальное окно редактирования воркера */}
      {showEditWorker && selectedWorker && (
        <WorkerModal
          isEdit={true}
          worker={selectedWorker}
          onClose={() => {
            setShowEditWorker(false);
            setSelectedWorker(null);
          }}
          onSave={(workerData) => {
            // Логика обновления сотрудника
            if (selectedWorker) {
              setWorkers(prev => prev.map(worker => 
                worker.id === selectedWorker.id 
                  ? { 
                      ...worker,
                      name: workerData.name || worker.name,
                      telegramId: workerData.telegramId || worker.telegramId,
                      avatar: workerData.avatar || worker.avatar,
                      team: workerData.team || worker.team,
                      role: workerData.role || worker.role,
                      level: workerData.level || worker.level,
                      dateOfBirth: workerData.dateOfBirth || worker.dateOfBirth,
                      position: workerData.position || worker.position,
                      experience: workerData.experience || worker.experience,
                      teamLead: workerData.teamLead || worker.teamLead,
                      registrationDate: workerData.registrationDate || worker.registrationDate
                    }
                  : worker
              ));
              console.log('Обновлен сотрудник:', selectedWorker.id, workerData);
            }
            setShowEditWorker(false);
            setSelectedWorker(null);
          }}
          onFire={(reason, comment, file) => {
            // Логика увольнения сотрудника
            if (selectedWorker) {
              setWorkers(prev => prev.map(worker => 
                worker.id === selectedWorker.id 
                  ? { 
                      ...worker,
                      isActive: false,
                      fireReason: reason,
                      fireDate: new Date().toISOString().split('T')[0],
                      fireComment: comment
                    }
                  : worker
              ));
              console.log('Уволен сотрудник:', selectedWorker.id, reason, comment);
            }
            setShowEditWorker(false);
            setSelectedWorker(null);
          }}
          teamLeads={teamLeads}
          supports={supports}
          roles={roles}
          teams={teams.slice(1)}
        />
      )}

      {/* Модальное окно анкеты уволенного сотрудника */}
      <Dialog open={showFiredWorkerDetails && selectedWorker && !selectedWorker.isActive} onOpenChange={(open) => {
        if (!open) {
          setShowFiredWorkerDetails(false);
          setSelectedWorker(null);
        }
      }}>
        <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
          <DialogTitle className="text-lg font-medium text-foreground text-center">Анкета</DialogTitle>
          <DialogDescription className="sr-only">
            Подробная информация об уволенном сотруднике с возможностью восстановления
          </DialogDescription>
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1"></div>
                <button
                  onClick={() => {
                    setShowFiredWorkerDetails(false);
                    setSelectedWorker(null);
                  }}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-destructive" />
                </button>
              </div>
            </DialogHeader>

            {/* Содержимое */}
            <div className="overflow-y-auto max-h-[calc(80vh-200px)] space-y-4">
              {selectedWorker && (
                <>
                  {/* Информация о сотруднике */}
                  <div className="bg-secondary p-4 rounded-2xl apple-shadow space-y-2">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-2 overflow-hidden">
                        {selectedWorker.avatar ? (
                          <img 
                            src={selectedWorker.avatar} 
                            alt={`Аватарка ${selectedWorker.name}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling!.style.display = 'block';
                            }}
                          />
                        ) : (
                          <User className="w-8 h-8 text-muted-foreground" />
                        )}
                        {selectedWorker.avatar && (
                          <User className="w-8 h-8 text-muted-foreground" style={{ display: 'none' }} />
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-foreground">{selectedWorker.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedWorker.team}</p>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span className="text-muted-foreground">Id:</span>
                        <span className="text-foreground">{selectedWorker.id}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span className="text-muted-foreground">Имя:</span>
                        <span className="text-foreground">{selectedWorker.name}</span>
                      </div>
                      {selectedWorker.telegramId && (
                        <div className="flex justify-between border-b border-border/50 pb-1">
                          <span className="text-muted-foreground">Telegram:</span>
                          <span className="text-foreground">@{selectedWorker.telegramId}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span className="text-muted-foreground">ДР:</span>
                        <span className="text-foreground">{selectedWorker.dateOfBirth || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span className="text-muted-foreground">Должность:</span>
                        <span className="text-foreground">{selectedWorker.position || selectedWorker.role}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span className="text-muted-foreground">Команда:</span>
                        <span className="text-foreground">{selectedWorker.team}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span className="text-muted-foreground">Стаж:</span>
                        <span className="text-foreground">{selectedWorker.experience || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span className="text-muted-foreground">Тимлид:</span>
                        <span className="text-foreground">{selectedWorker.teamLead || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Регистрация:</span>
                        <span className="text-foreground">{selectedWorker.registrationDate || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Дополнительная информация */}
                  <div className="bg-secondary p-4 rounded-2xl apple-shadow">
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="text-muted-foreground">Причина увольнения:</span>
                        <p className="text-foreground mt-1">{selectedWorker.fireReason || 'Не указана'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Дата увольнения:</span>
                        <p className="text-destructive mt-1">{selectedWorker.fireDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Комментарий:</span>
                        <p className="text-foreground mt-1">{selectedWorker.fireComment || 'Комментарий отсутствует'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pt-4 border-t border-border/20 mt-4">
              <Button
                onClick={() => selectedWorker && handleRestoreWorker(selectedWorker)}
                className="flex-1 bg-primary text-primary-foreground text-sm px-4 py-2"
              >
                Отменить
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowFiredWorkerDetails(false);
                  setSelectedWorker(null);
                }}
                className="flex-1 text-sm px-4 py-2"
              >
                Применить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Быстрая навигация */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/20">
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-4">
            {navigationItems.slice(0, 4).map((item, index) => {
              const Icon = item.icon;
              const isActive = item.section === 'workers';
              return (
                <button 
                  key={index} 
                  className="flex flex-col items-center text-center"
                  onClick={() => item.section === 'dashboard' ? onBack() : onNavigateToSection(item.section)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 apple-shadow ${
                    isActive ? 'bg-primary' : 'glass-card'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isActive ? 'text-white' : 'text-foreground/70'
                    }`} />
                  </div>
                  <span className={`text-xs ${
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {navigationItems.slice(4, 8).map((item, index) => {
              const Icon = item.icon;
              return (
                <button 
                  key={index} 
                  className="flex flex-col items-center text-center"
                  onClick={() => onNavigateToSection(item.section)}
                >
                  <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center mb-2 apple-shadow">
                    <Icon className="w-6 h-6 text-foreground/70" />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface WorkerModalProps {
  isEdit: boolean;
  worker: Worker | null;
  onClose: () => void;
  onSave: (workerData: Partial<Worker>) => void;
  onFire?: (reason: string, comment: string, file?: File) => void;
  teamLeads: string[];
  supports: string[];
  roles: string[];
  teams: string[];
}

function WorkerModal({ isEdit, worker, onClose, onSave, onFire, teamLeads, supports, roles, teams }: WorkerModalProps) {
  const [formData, setFormData] = useState({
    id: worker?.id || '',
    name: worker?.name || '',
    telegramId: worker?.telegramId || '',
    avatar: worker?.avatar || '',
    dateOfBirth: worker?.dateOfBirth || '',
    position: worker?.position || '',
    team: worker?.team || '',
    experience: worker?.experience || '',
    teamLead: worker?.teamLead || '',
    registrationDate: worker?.registrationDate || '',
    role: worker?.role || 'WORKER',
    level: worker?.level || 1
  });

  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFireConfirm, setShowFireConfirm] = useState(false);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTelegramIdChange = async (telegramId: string) => {
    setFormData(prev => ({ ...prev, telegramId }));
    
    // Если введен Telegram ID, пытаемся получить аватарку
    if (telegramId.trim() && telegramId.length >= 5) {
      setIsLoadingAvatar(true);
      try {
        const avatar = await getTelegramUserAvatar(telegramId);
        if (avatar) {
          setFormData(prev => ({ ...prev, avatar }));
        }
      } catch (error) {
        console.error('Ошибка получения аватарки:', error);
      } finally {
        setIsLoadingAvatar(false);
      }
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleFire = () => {
    if (!comment.trim()) {
      alert('Комментарий обязателен для увольнения');
      return;
    }
    onFire?.(comment, comment, selectedFile || undefined);
    setShowFireConfirm(false);
  };

  if (showFireConfirm) {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && setShowFireConfirm(false)}>
        <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden rounded-3xl">
          <DialogTitle className="text-lg font-medium text-foreground text-center">Подтверждение увольнения</DialogTitle>
          <DialogDescription className="sr-only">
            Модальное окно для подтверждения увольнения сотрудника с указанием причины
          </DialogDescription>
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-center text-foreground">Вы уверены, что хотите уволить сотрудника?</p>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Причина увольнения (обязательно)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Укажите причину увольнения..."
                  className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm resize-none min-h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Прикрепить документ (необязательно)
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFireConfirm(false)}
                  className="flex-1"
                >
                  Отменить
                </Button>
                <Button
                  onClick={handleFire}
                  className="flex-1 bg-destructive text-destructive-foreground"
                  disabled={!comment.trim()}
                >
                  Уволить
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
        <DialogTitle className="text-lg font-medium text-foreground text-center">
          {isEdit ? 'Анкета' : 'Добавить сотрудника'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {isEdit ? 'Форма для редактирования данных сотрудника' : 'Форма для добав��ения нового сотрудника'}
        </DialogDescription>
        <div className="p-6">
          <DialogHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground/70" />
                </button>
                <div className="flex-1"></div>
              </div>
              {isEdit && (
                <button
                  onClick={() => setShowFireConfirm(true)}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-destructive" />
                </button>
              )}
            </div>
          </DialogHeader>

          {/* Форма */}
          <div className="overflow-y-auto max-h-[calc(80vh-200px)] space-y-4">
            <div className="bg-secondary p-4 rounded-2xl apple-shadow space-y-3 text-sm">
              <div>
                <label className="text-muted-foreground">Id:</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  className="w-full mt-1 bg-transparent border-none outline-none text-foreground"
                />
              </div>
              
              <div>
                <label className="text-muted-foreground">Имя:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full mt-1 bg-transparent border-none outline-none text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground">Telegram ID:</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={formData.telegramId}
                    onChange={(e) => handleTelegramIdChange(e.target.value)}
                    placeholder="Введите ID пользователя Telegram"
                    className="flex-1 bg-transparent border-none outline-none text-foreground"
                  />
                  {isLoadingAvatar && (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>

              {/* Аватарка */}
              {formData.avatar && (
                <div>
                  <label className="text-muted-foreground">Аватарка:</label>
                  <div className="flex items-center gap-3 mt-1">
                    <img 
                      src={formData.avatar} 
                      alt="Аватарка пользователя" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-sm text-muted-foreground">Загружено из Telegram</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-muted-foreground">Дата рождения:</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full mt-1 bg-transparent border-none outline-none text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground">Должность:</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full mt-1 bg-transparent border-none outline-none text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground">Команда:</label>
                <select
                  value={formData.team}
                  onChange={(e) => handleInputChange('team', e.target.value)}
                  className="w-full mt-1 bg-transparent border-none outline-none text-foreground"
                >
                  <option value="">Выберите команду</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-muted-foreground">Стаж:</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full mt-1 bg-transparent border-none outline-none text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground">Роль:</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full mt-1 bg-transparent border-none outline-none text-foreground"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Отменить
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-primary text-primary-foreground"
              >
                {isEdit ? 'Сохранить' : 'Добавить'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}