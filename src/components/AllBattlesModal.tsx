import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Battle, BattleInvitation } from '../types/battles';

interface AllBattlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  battles: Battle[];
  invitations: BattleInvitation[];
  onAcceptInvitation?: (invitationId: string) => void;
  onDeclineInvitation?: (invitationId: string) => void;
  theme?: 'light' | 'dark';
}

export function AllBattlesModal({ 
  isOpen, 
  onClose, 
  battles, 
  invitations, 
  onAcceptInvitation,
  onDeclineInvitation,
  theme = 'light' 
}: AllBattlesModalProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  
  const activeBattles = battles.filter(b => b.status === 'active');
  const completedBattles = battles.filter(b => b.status === 'completed');
  const pendingInvitations = invitations.filter(i => i.status === 'pending');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[90vw] max-w-md max-h-[80vh] overflow-hidden rounded-3xl p-0 [&>button]:hidden flex flex-col"
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
          Все активные баттлы и приглашения
        </DialogTitle>
        <DialogDescription className="sr-only">
          Просмотр всех активных баттлов, приглашений на баттл, истории завершенных баттлов и возможность принять или отклонить входящие вызовы
        </DialogDescription>
        {/* Заголовок */}
        <div 
          className="flex items-center justify-between p-6 border-b shrink-0"
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
            Баттлы
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

        {/* Табы */}
        <div 
          className="flex p-3 gap-2 border-b shrink-0"
          style={{
            borderColor: theme === 'dark' 
              ? 'rgba(255, 255, 255, 0.06)' 
              : 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'current' ? 'tab-button' : ''
            }`}
            style={{
              background: activeTab === 'current' 
                ? (theme === 'dark' 
                  ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                  : '#2B82FF')
                : (theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.03)'),
              color: activeTab === 'current'
                ? (theme === 'dark' ? '#1A1A1A' : '#FFFFFF')
                : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
              border: activeTab === 'current'
                ? (theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.2)' 
                  : '1px solid #2B82FF')
                : '1px solid transparent'
            }}
          >
            Активные ({activeBattles.length + pendingInvitations.length})
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'history' ? 'tab-button' : ''
            }`}
            style={{
              background: activeTab === 'history' 
                ? (theme === 'dark' 
                  ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                  : '#2B82FF')
                : (theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.03)'),
              color: activeTab === 'history'
                ? (theme === 'dark' ? '#1A1A1A' : '#FFFFFF')
                : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
              border: activeTab === 'history'
                ? (theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.2)' 
                  : '1px solid #2B82FF')
                : '1px solid transparent'
            }}
          >
            История ({completedBattles.length})
          </button>
        </div>

        {/* Контент с табами */}
        <div className="flex-1 overflow-y-auto">
          {/* Активные баттлы и приглашения */}
          {activeTab === 'current' && (
            <div className="p-6 space-y-4">
              {/* Ожидающие приглашения */}
              {pendingInvitations.length > 0 && (
                <div className="space-y-3">
                  <h3 
                    className="text-sm font-medium"
                    style={{
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                    }}
                  >
                    Входящие приглашения ({pendingInvitations.length})
                  </h3>
                  
                  {pendingInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="p-4 rounded-2xl border"
                      style={{
                        background: theme === 'dark' 
                          ? 'rgba(255, 159, 10, 0.1)' 
                          : 'rgba(255, 159, 10, 0.05)',
                        borderColor: theme === 'dark' 
                          ? 'rgba(255, 159, 10, 0.2)' 
                          : 'rgba(255, 159, 10, 0.15)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span 
                            className="px-3 py-1 bg-surface-2 rounded-full text-sm font-medium"
                            style={{
                              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                            }}
                          >
                            {invitation.challengerName}
                          </span>
                          <span 
                            className="text-xs"
                            style={{
                              color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                            }}
                          >
                            вызывает вас
                          </span>
                        </div>
                        
                        <div 
                          className="text-sm font-medium"
                          style={{
                            color: '#FF9500'
                          }}
                        >
                          {invitation.stake}g
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => onAcceptInvitation?.(invitation.id)}
                          className="flex-1 py-2 px-3 rounded-xl text-sm font-medium text-white transition-all hover:scale-[0.98]"
                          style={{
                            background: '#34C759'
                          }}
                        >
                          Принять
                        </button>
                        <button
                          onClick={() => onDeclineInvitation?.(invitation.id)}
                          className="flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all hover:scale-[0.98]"
                          style={{
                            background: theme === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.05)',
                            color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                          }}
                        >
                          Отклонить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Активные баттлы */}
              {activeBattles.length > 0 && (
                <div className="space-y-3">
                  <h3 
                    className="text-sm font-medium"
                    style={{
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                    }}
                  >
                    Активные баттлы ({activeBattles.length})
                  </h3>
                  
                  {activeBattles.map((battle) => (
                    <div
                      key={battle.id}
                      className="p-4 rounded-2xl border"
                      style={{
                        background: theme === 'dark' 
                          ? 'rgba(43, 130, 255, 0.1)' 
                          : 'rgba(43, 130, 255, 0.05)',
                        borderColor: theme === 'dark' 
                          ? 'rgba(43, 130, 255, 0.2)' 
                          : 'rgba(43, 130, 255, 0.15)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span 
                            className="px-3 py-1 bg-surface-2 rounded-full text-sm font-medium"
                            style={{
                              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                            }}
                          >
                            {battle.challengerName}
                          </span>
                          <span 
                            className="text-xs"
                            style={{
                              color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                            }}
                          >
                            VS
                          </span>
                          <span 
                            className="px-3 py-1 bg-surface-2 rounded-full text-sm font-medium"
                            style={{
                              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                            }}
                          >
                            {battle.opponentName}
                          </span>
                        </div>
                        
                        <div 
                          className="text-sm font-medium"
                          style={{
                            color: '#2B82FF'
                          }}
                        >
                          {battle.stake}g
                        </div>
                      </div>
                      
                      <div 
                        className="text-xs mt-2"
                        style={{
                          color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                        }}
                      >
                        Начат: {battle.startedAt.toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Пустое состояние для активных */}
              {activeBattles.length === 0 && pendingInvitations.length === 0 && (
                <div className="text-center py-12">
                  <div 
                    className="text-4xl mb-4"
                    style={{
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                    }}
                  >
                    ⚔️
                  </div>
                  <p 
                    className="text-sm"
                    style={{
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                    }}
                  >
                    Нет активных баттлов
                  </p>
                  <p 
                    className="text-xs mt-1"
                    style={{
                      color: theme === 'dark' ? '#6B7280' : '#9CA3AF'
                    }}
                  >
                    Создайте вызов коллеге!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* История баттлов */}
          {activeTab === 'history' && (
            <div className="p-6 space-y-4">
              {completedBattles.length > 0 ? (
                <div className="space-y-3">
                  {completedBattles.map((battle) => (
                    <div
                      key={battle.id}
                      className="p-4 rounded-2xl border"
                      style={{
                        background: theme === 'dark' 
                          ? 'rgba(52, 199, 89, 0.15)' 
                          : 'rgba(52, 199, 89, 0.08)',
                        borderColor: theme === 'dark' 
                          ? 'rgba(52, 199, 89, 0.3)' 
                          : 'rgba(52, 199, 89, 0.2)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span 
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{
                              background: battle.winnerId === battle.challengerId 
                                ? '#30D158'  // Зеленый для победителя
                                : '#FF453A'  // Красный для проигравшего
                            }}
                          >
                            {battle.challengerName}
                          </span>
                          <span 
                            className="text-xs"
                            style={{
                              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                            }}
                          >
                            VS
                          </span>
                          <span 
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{
                              background: battle.winnerId === battle.opponentId 
                                ? '#30D158'  // Зеленый для победителя
                                : '#FF453A'  // Красный для проигравшего
                            }}
                          >
                            {battle.opponentName}
                          </span>
                        </div>
                        
                        <div 
                          className="text-sm font-medium"
                          style={{
                            color: '#30D158'  // Зеленый цвет для суммы
                          }}
                        >
                          {battle.stake}g
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div 
                          className="text-xs"
                          style={{
                            color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                          }}
                        >
                          Завершен: {battle.completedAt?.toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit', 
                            year: 'numeric'
                          }) || 'Недавно'}
                        </div>
                        
                        <div 
                          className="text-xs font-medium"
                          style={{
                            color: '#30D158'  // Зеленый цвет для текста победителя
                          }}
                        >
                          Победитель: {battle.winnerName || (battle.winnerId === battle.challengerId ? battle.challengerName : battle.opponentName)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div 
                    className="text-4xl mb-4"
                    style={{
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                    }}
                  >
                    📖
                  </div>
                  <p 
                    className="text-sm"
                    style={{
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                    }}
                  >
                    История пуста
                  </p>
                  <p 
                    className="text-xs mt-1"
                    style={{
                      color: theme === 'dark' ? '#6B7280' : '#9CA3AF'
                    }}
                  >
                    Завершённые баттлы появятся здесь
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}