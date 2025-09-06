import { useState } from 'react';
import { CheckCircle, Info, CheckSquare, Trophy, Shield, X, Home, Users, Zap, ShoppingBag, Gamepad2, Box, ArrowLeft, Clock, Bell } from './Icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { NotificationsModal } from './NotificationsModal';

interface AdminDashboardProps {
  onClose?: () => void;
  onToggleDarkMode?: () => void;
  onNavigateToWorkers?: () => void;
  onNavigateToAchievementsModeration?: () => void;
  onNavigateToGames?: () => void;
  onNavigateToCases?: () => void;
  onNavigateToBattles?: () => void;
}

interface Complaint {
  id: string;
  user: string;
  description: string;
  file?: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

export function AdminDashboard({ onClose, onToggleDarkMode, onNavigateToWorkers, onNavigateToAchievementsModeration, onNavigateToGames, onNavigateToCases, onNavigateToBattles }: AdminDashboardProps) {
  const [showComplaints, setShowComplaints] = useState(false);
  const [complaintsTab, setComplaintsTab] = useState<'active' | 'resolved'>('active');
  const [showHistory, setShowHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Моковые данные жалоб
  const complaints: Complaint[] = [];

  const activeComplaints = complaints.filter(c => c.status === 'active');
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved');

  const stats = [
    {
      title: 'Уведомления',
      value: '0',
      icon: Bell,
      hasAction: true,
      action: () => setShowNotifications(true)
    },
    {
      title: 'Сообщения о проблемах',
      value: '0',
      icon: Info,
      hasAction: true,
      action: () => setShowComplaints(true)
    },
    {
      title: 'Кол-во выполненных задач',
      value: '0',
      icon: CheckSquare
    },
    {
      title: 'Достижений получено',
      value: '0',
      icon: Trophy
    }
  ];

  const recentActivity: any[] = [];

  const navigationItems = [
    { icon: Home, label: 'Главная', action: null },
    { icon: Users, label: 'Сотрудники', action: onNavigateToWorkers },
    { icon: Zap, label: 'Баттлы', action: onNavigateToBattles },
    { icon: Trophy, label: 'Достижения', action: null },
    { icon: CheckSquare, label: 'Задачи', action: null },
    { icon: ShoppingBag, label: 'Товары', action: null },
    { icon: Gamepad2, label: 'Игры', action: onNavigateToGames },
    { icon: Box, label: 'Кейсы', action: onNavigateToCases }
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Содержимое */}
      <div className="p-6 space-y-6 pb-60">
        {/* Заголовок Главная */}
        <h2 className="text-lg font-medium text-foreground text-center">Главная</h2>
        
        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="glass-card p-4 rounded-2xl apple-shadow cursor-pointer"
                onClick={stat.hasAction ? stat.action : undefined}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      {stat.title}
                    </div>
                  </div>
                  <div className="text-2xl font-medium text-foreground">
                    {stat.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Быстрые действия 
            TODO: В будущем добавить динамические пункты в зависимости от роли админа/тимлида:
            - Тимлид: модерация задач своих воркеров, статистика команды
            - мл. Админ: создание задач для всех, модерация достижений, загрузка картинок, проверка баттлов  
            - ст. Админ: все возможности мл. Админа + управление магазином и балансом пользователей
            - гл. Админ: все возможности + управление настройками системы и ролями пользователей
        */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground text-center">Быстрые действия</h3>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden apple-shadow">
            <div className="p-4 text-center text-muted-foreground text-sm">
              Нет уведомлений для проверки
            </div>
          </div>
        </div>

        {/* Последняя активность */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground text-center">Последняя активность</h3>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden apple-shadow relative">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground relative">
                Активных пользователей нет
                <button 
                  onClick={() => setShowHistory(true)}
                  className="absolute top-4 right-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                  title="История активности"
                >
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className={`p-4 flex items-center justify-between ${index !== recentActivity.length - 1 ? 'border-b border-border/20' : ''}`}>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{activity.user}</div>
                    <div className="text-sm text-muted-foreground mt-1">{activity.action}</div>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">{activity.time}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Быстрая навигация */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/20">
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-4">
            {navigationItems.slice(0, 4).map((item, index) => {
              const Icon = item.icon;
              const isActive = item.label === 'Главная';
              return (
                <button 
                  key={index} 
                  className="flex flex-col items-center text-center"
                  onClick={item.action || undefined}
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
                  onClick={item.action || undefined}
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

      {/* Модальное окно жалоб */}
      {showComplaints && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-3xl w-full max-w-sm max-h-[80vh] overflow-hidden apple-shadow border border-border/20">
            {/* Заголовок модального окна */}
            <div className="flex items-center justify-between p-6 border-b border-border/20">
              <h2 className="text-lg font-medium text-foreground text-center flex-1">Сообщения о проблемах</h2>
              <button
                onClick={() => setShowComplaints(false)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>

            {/* Вкладки */}
            <div className="flex border-b border-border/20">
              <button
                onClick={() => setComplaintsTab('active')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors text-center ${
                  complaintsTab === 'active'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Активные ({activeComplaints.length})
              </button>
              <button
                onClick={() => setComplaintsTab('resolved')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors text-center ${
                  complaintsTab === 'resolved'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Решены ({resolvedComplaints.length})
              </button>
            </div>

            {/* Список жалоб */}
            <div className="overflow-y-auto max-h-96 p-6">
              {(complaintsTab === 'active' ? activeComplaints : resolvedComplaints).map((complaint) => (
                <div key={complaint.id} className="mb-4 p-4 bg-secondary rounded-2xl apple-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{complaint.user}</span>
                    <span className="text-xs text-muted-foreground">{complaint.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                  {complaint.file && (
                    <div className="text-xs text-primary">📎 {complaint.file}</div>
                  )}
                  {complaintsTab === 'active' && (
                    <button className="mt-3 px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary/90 transition-colors">
                      Решить
                    </button>
                  )}
                </div>
              ))}
              {(complaintsTab === 'active' ? activeComplaints : resolvedComplaints).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  {complaintsTab === 'active' ? 'Активных обращений нет' : 'Решенных обращений нет'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно истории активности */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="glass-card border-none max-w-sm p-0 [&>button]:hidden">
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground/70" />
                </button>
                <DialogTitle className="text-lg font-medium text-foreground text-center flex-1">История действий</DialogTitle>
              </div>
              <DialogDescription className="sr-only">
                История действий пользователей
              </DialogDescription>
            </DialogHeader>

            <div className="text-center text-muted-foreground py-8">
              История активности отсутствует
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно уведомлений */}
      <NotificationsModal 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}