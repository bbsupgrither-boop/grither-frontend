import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { User, BattleInvitation } from '../types/battles';

interface CreateBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUserId: string;
  onCreateInvitation: (invitation: Omit<BattleInvitation, 'id' | 'createdAt' | 'expiresAt' | 'status'>) => void;
  theme?: 'light' | 'dark';
}

export function CreateBattleModal({ 
  isOpen, 
  onClose, 
  users, 
  currentUserId, 
  onCreateInvitation, 
  theme = 'light' 
}: CreateBattleModalProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [stake, setStake] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтруем пользователей (исключаем текущего пользователя)
  const availableUsers = users.filter(user => 
    user.id !== currentUserId && 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBattle = () => {
    if (!selectedUser || !stake.trim()) return;

    const stakeAmount = parseInt(stake);
    if (isNaN(stakeAmount) || stakeAmount <= 0) return;

    // Находим имя текущего пользователя
    const currentUser = users.find(u => u.id === currentUserId);
    const currentUserName = currentUser?.name || 'Неизвестный пользователь';

    onCreateInvitation({
      challengerId: currentUserId,
      challengerName: currentUserName,
      opponentId: selectedUser.id,
      opponentName: selectedUser.name,
      stake: stakeAmount,
      message: `${currentUserName} вызывает вас на баттл на ${stakeAmount} коинов!`
    });

    // Сбрасываем форму и закрываем модалку
    setSelectedUser(null);
    setStake('');
    setSearchQuery('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[90vw] max-w-md max-h-[80vh] overflow-hidden rounded-3xl p-0 [&>button]:hidden"
        style={{
          background: theme === 'dark' 
            ? 'linear-gradient(145deg, rgba(8, 10, 14, 0.98) 0%, rgba(16, 20, 28, 0.98) 100%)'
            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
          border: theme === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.06)' 
            : '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: theme === 'dark' 
            ? '0 16px 48px rgba(0, 0, 0, 0.8)'
            : '0 16px 48px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        {/* Accessibility elements */}
        <DialogTitle className="sr-only">
          Создать вызов на баттл
        </DialogTitle>
        <DialogDescription className="sr-only">
          Выберите соперника для баттла, установите ставку и отправьте приглашение на соревнование
        </DialogDescription>
        {/* Заголовок */}
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{
            borderColor: theme === 'dark' 
              ? 'rgba(255, 255, 255, 0.06)' 
              : 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 
            className="text-lg font-medium"
            style={{
              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
            }}
          >
            Создать вызов
          </h2>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105"
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
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Поиск пользователей */}
          <div className="space-y-2">
            <label 
              className="text-sm font-medium"
              style={{
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Выберите соперника
            </label>
            
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                }}
              />
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border text-sm"
                style={{
                  background: theme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : '#FFFFFF',
                  borderColor: theme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : '#E6E9EF',
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              />
            </div>
          </div>

          {/* Список пользователей */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 rounded-2xl border text-left transition-all hover:scale-[0.98] ${
                  selectedUser?.id === user.id ? 'ring-2' : ''
                }`}
                style={{
                  background: selectedUser?.id === user.id 
                    ? (theme === 'dark' 
                        ? 'rgba(43, 130, 255, 0.15)' 
                        : 'rgba(43, 130, 255, 0.1)')
                    : (theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : '#FFFFFF'),
                  borderColor: selectedUser?.id === user.id 
                    ? '#2B82FF' 
                    : (theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : '#E6E9EF'),
                  ringColor: '#2B82FF'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{
                        background: 'linear-gradient(135deg, #2B82FF 0%, #1E40AF 100%)',
                        color: '#FFFFFF'
                      }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    
                    <div>
                      <div 
                        className="text-sm font-medium"
                        style={{
                          color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                        }}
                      >
                        {user.name}
                      </div>
                      <div 
                        className="text-xs"
                        style={{
                          color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                        }}
                      >
                        Уровень {user.level} • Рейтинг {user.rating}
                      </div>
                    </div>
                  </div>
                  
                  {user.isOnline && (
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#34C759' }}
                    />
                  )}
                </div>
              </button>
            ))}
            
            {availableUsers.length === 0 && (
              <div 
                className="text-center py-8 text-sm"
                style={{
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                }}
              >
                {searchQuery ? 'Пользователи не найдены' : 'Нет доступных пользователей'}
              </div>
            )}
          </div>

          {/* Ставка */}
          <div className="space-y-2">
            <label 
              className="text-sm font-medium"
              style={{
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Ставка (коины)
            </label>
            
            <input
              type="number"
              placeholder="500"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              min="1"
              className="w-full px-4 py-3 rounded-2xl border text-sm"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : '#FFFFFF',
                borderColor: theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : '#E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl text-sm font-medium transition-all hover:scale-[0.98]"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Отменить
            </button>
            
            <button
              onClick={handleCreateBattle}
              disabled={!selectedUser || !stake.trim() || parseInt(stake) <= 0}
              className="flex-1 py-3 px-4 rounded-2xl text-sm font-medium text-white transition-all hover:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: selectedUser && stake.trim() && parseInt(stake) > 0 
                  ? '#2B82FF' 
                  : '#9CA3AF'
              }}
            >
              Вызвать на баттл
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}