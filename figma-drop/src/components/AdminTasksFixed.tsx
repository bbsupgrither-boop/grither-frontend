import { useState } from 'react';
import { Plus, X, Paperclip, ChevronDown, Menu, Home, Users, Zap, Trophy, CheckSquare, ShoppingBag, Gamepad2, Box, History, ArrowLeft, Calendar, User } from './Icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

interface Subtask {
  id: string;
  description: string;
  requiresAttachment: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  subtasks: Subtask[];
  assignedTo: string[];
  assignedBy: string;
  dateAssigned: string;
  deadline?: string;
  reward: {
    type: 'XP' | 'G-coin';
    amount: number;
  };
  difficulty: 'легкое' | 'среднее' | 'тяжелое';
  status: 'pending' | 'completed' | 'overdue' | 'rejected' | 'needs_revision';
  completedDate?: string;
  attachments?: string[];
  rejectionReason?: string;
  hasUnreadFeedback?: boolean;
}

interface Employee {
  id: string;
  name: string;
  team: string;
  avatar?: string;
}

interface AdminTasksProps {
  currentAdminPage?: string;
  setCurrentAdminPage?: (page: string) => void;
  tasks: any[];
  setTasks: (tasks: any[]) => void;
}

export function AdminTasksFixed({ currentAdminPage = 'tasks', setCurrentAdminPage, tasks, setTasks }: AdminTasksProps) {
  // Список сотрудников для выбора
  const employees: Employee[] = [
    { id: '1', name: 'Александр Петров', team: 'Команда А' },
    { id: '2', name: 'Мария Иванова', team: 'Команда Б' },
    { id: '3', name: 'Дмитрий Сидоров', team: 'Команда А' },
    { id: '4', name: 'Елена Козлова', team: 'Команда В' },
    { id: '5', name: 'Андрей Морозов', team: 'Команда Б' },
    { id: '6', name: 'Ольга Волкова', team: 'Команда А' },
  ];

  // Навигационные элементы панели администратора
  const navigationItems = [
    { icon: Home, label: 'Главная', section: 'dashboard' },
    { icon: Users, label: 'Воркеры', section: 'workers' },
    { icon: Zap, label: 'Баттлы', section: 'battles' },
    { icon: Trophy, label: 'Достижения', section: 'achievements' },
    { icon: CheckSquare, label: 'Задачи', section: 'tasks' },
    { icon: ShoppingBag, label: 'Товары', section: 'shop' },
    { icon: Gamepad2, label: 'Игры', section: 'games' },
    { icon: Box, label: 'Кейсы', section: 'cases' }
  ];

  // Преобразуем глобальные задачи в локальный формат
  const activeTasks = tasks.filter(task => task.status === 'active').map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    subtasks: [],
    assignedTo: [task.assignedTo || 'user1'],
    assignedBy: 'Админ',
    dateAssigned: task.createdAt || new Date().toISOString().split('T')[0],
    deadline: task.deadline,
    reward: {
      type: task.rewardType === 'coins' ? 'G-coin' as const : 'XP' as const,
      amount: task.reward
    },
    difficulty: 'среднее' as const,
    status: 'pending' as const
  }));
  
  const completedTasks = tasks.filter(task => task.status === 'completed').map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    subtasks: [],
    assignedTo: [task.assignedTo || 'user1'],
    assignedBy: 'Админ',
    dateAssigned: task.createdAt || new Date().toISOString().split('T')[0],
    deadline: task.deadline,
    reward: {
      type: task.rewardType === 'coins' ? 'G-coin' as const : 'XP' as const,
      amount: task.reward
    },
    difficulty: 'среднее' as const,
    status: 'completed' as const,
    completedDate: task.completedAt
  }));

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [employeeSelectModalOpen, setEmployeeSelectModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [sortBy, setSortBy] = useState<'team' | 'employee' | 'date'>('date');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [historySortBy, setHistorySortBy] = useState<'team' | 'employee' | 'date'>('date');
  const [showHistorySortDropdown, setShowHistorySortDropdown] = useState(false);
  
  // Данные формы создания задачи
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subtasks: [{ id: '1', description: '', requiresAttachment: false }] as Subtask[],
    assignedTo: [] as string[],
    deadline: '',
    reward: { type: 'XP' as 'XP' | 'G-coin', amount: 100 },
    difficulty: 'среднее' as 'легкое' | 'среднее' | 'тяжелое'
  });

  const [tempReward, setTempReward] = useState({ type: 'XP' as 'XP' | 'G-coin', amount: 100 });

  // Функции обработки задач
  const handleCreateTask = () => {
    if (!formData.title || !formData.description) return;
    
    const newTask = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      reward: formData.reward.amount,
      rewardType: formData.reward.type === 'XP' ? 'xp' as const : 'coins' as const,
      deadline: formData.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
      category: 'individual' as const,
      status: 'active' as const,
      assignedTo: formData.assignedTo[0] || 'user1',
      createdBy: 'admin',
      createdAt: new Date().toLocaleDateString('ru-RU'),
      isPublished: true
    };
    
    setTasks([...tasks, newTask]);
    setFormData({
      title: '',
      description: '',
      subtasks: [{ id: '1', description: '', requiresAttachment: false }],
      assignedTo: [],
      deadline: '',
      reward: { type: 'XP', amount: 100 },
      difficulty: 'среднее'
    });
    setCreateModalOpen(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailModalOpen(true);
  };

  const handleRewardClick = () => {
    setTempReward(formData.reward);
    setRewardModalOpen(true);
  };

  const handleEmployeeSelect = () => {
    setEmployeeSelectModalOpen(true);
  };

  const sortedActiveTasks = [...activeTasks];
  const sortedCompletedTasks = [...completedTasks];

  return (
    <>
      <div className="min-h-screen bg-background pb-40">
        <div className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-foreground">Панель управления</h2>
          </div>

          <div className="px-6 pb-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2 glass-card rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground"
              >
                Доб. задачу
              </button>
            </div>
          </div>

          <div className="px-6">
            <div className="glass-card rounded-2xl apple-shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setHistoryModalOpen(true)}
                  className="glass-card p-3 rounded-xl transition-colors hover:bg-accent/50"
                  title="История задач"
                >
                  <History size={16} className="text-foreground/70" />
                </button>
                <h3 className="text-lg font-medium text-foreground">Активные задачи</h3>
                <div className="glass-card p-3 rounded-xl">
                  <Menu size={16} className="text-foreground/70" />
                </div>
              </div>

              <div className="space-y-3">
                {activeTasks.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Активных задач нет
                  </div>
                ) : (
                  activeTasks.map((task) => (
                    <div key={task.id} className="glass-card rounded-2xl p-4 cursor-pointer" onClick={() => handleTaskClick(task)}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-foreground text-sm mb-1">
                            {task.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Награда: {task.reward.amount} {task.reward.type}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {task.dateAssigned}
                        </div>
                      </div>
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
                  const isActive = item.section === currentAdminPage;
                  return (
                    <button 
                      key={index} 
                      className="flex flex-col items-center text-center"
                      onClick={() => setCurrentAdminPage?.(item.section)}
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
                  const isActive = item.section === currentAdminPage;
                  return (
                    <button 
                      key={index} 
                      className="flex flex-col items-center text-center"
                      onClick={() => setCurrentAdminPage?.(item.section)}
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
            </div>
          </div>
        </div>
      </div>

      {/* ИСПРАВЛЕННЫЕ МОДАЛЬНЫЕ ОКНА С DialogDescription */}
      
      {/* Модальное окно истории задач */}
      <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
        <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
          <DialogTitle className="sr-only">История задач</DialogTitle>
          <DialogDescription className="sr-only">
            Модальное окно со списком выполненных задач
          </DialogDescription>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">История задач</h3>
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>
            
            <div className="space-y-3">
              {completedTasks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Выполненных задач нет
                </div>
              ) : (
                completedTasks.map((task) => (
                  <div key={task.id} className="glass-card rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-foreground text-sm mb-1">
                          {task.title}
                        </div>
                        <div className="text-xs text-green-600">
                          Выполнено: {task.completedDate}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Награда: {task.reward.amount} {task.reward.type}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно создания задачи */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
          <DialogTitle className="sr-only">Создание задачи</DialogTitle>
          <DialogDescription className="sr-only">
            Модальное окно для создания новой задачи с подзадачами, выбором сотрудников и настройкой награды
          </DialogDescription>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground/70" />
              </button>
              <Input
                placeholder="Название задачи"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="flex-1 mx-4 bg-transparent border border-border rounded-lg text-center font-medium"
              />
              <button 
                onClick={handleEmployeeSelect}
                className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              >
                <User className="w-5 h-5 text-foreground/70" />
              </button>
            </div>

            <div className="glass-card rounded-2xl p-4 mb-6">
              <Textarea
                placeholder="Описание того, что нужно сделать для выполнения задачи"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-transparent border-none resize-none min-h-16 text-sm focus:outline-none p-0"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="flex-1 py-3 px-4 bg-secondary text-secondary-foreground rounded-full text-sm font-medium transition-colors hover:bg-secondary/80"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!formData.title || !formData.description}
                className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Создать
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно деталей задачи */}
      <Dialog open={taskDetailModalOpen} onOpenChange={setTaskDetailModalOpen}>
        <DialogContent className="bg-background border-none max-w-md p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
          <DialogTitle className="sr-only">
            {selectedTask ? selectedTask.title : 'Детали задачи'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Модальное окно с подробной информацией о задаче, включая описание, подзадачи и возможность одобрения или отклонения
          </DialogDescription>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">Детали задачи</h3>
              <button
                onClick={() => setTaskDetailModalOpen(false)}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>
            
            {selectedTask && (
              <div>
                <h4 className="text-base font-medium text-foreground mb-2">{selectedTask.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{selectedTask.description}</p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setTaskDetailModalOpen(false)}
                    className="flex-1 py-3 px-4 bg-secondary text-secondary-foreground rounded-full text-sm font-medium transition-colors hover:bg-secondary/80"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно настройки награды */}
      <Dialog open={rewardModalOpen} onOpenChange={setRewardModalOpen}>
        <DialogContent className="bg-background border-none max-w-sm p-6 rounded-3xl">
          <DialogTitle className="text-lg font-medium text-foreground text-center mb-4">
            Настройка награды
          </DialogTitle>
          <DialogDescription className="sr-only">
            Модальное окно для настройки типа и количества награды за выполнение задачи
          </DialogDescription>
          
          <div className="flex gap-3">
            <button
              onClick={() => setRewardModalOpen(false)}
              className="flex-1 py-3 px-4 bg-secondary text-secondary-foreground rounded-full text-sm font-medium transition-colors hover:bg-secondary/80"
            >
              Отмена
            </button>
            <button
              onClick={() => setRewardModalOpen(false)}
              className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors hover:bg-primary/90"
            >
              Сохранить
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно выбора сотрудников */}
      <Dialog open={employeeSelectModalOpen} onOpenChange={setEmployeeSelectModalOpen}>
        <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[80vh] overflow-hidden rounded-3xl">
          <DialogTitle className="sr-only">Выбор сотрудников</DialogTitle>
          <DialogDescription className="sr-only">
            Модальное окно для выбора сотрудников, которым будет назначена задача
          </DialogDescription>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">Выбор сотрудников</h3>
              <button
                onClick={() => setEmployeeSelectModalOpen(false)}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>
            
            <div className="space-y-2 mb-4">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded-lg">
                  <input type="checkbox" className="rounded" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{employee.name}</div>
                    <div className="text-xs text-muted-foreground">{employee.team}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setEmployeeSelectModalOpen(false)}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors hover:bg-primary/90"
            >
              Готово
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно отклонения задачи */}
      <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
        <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden rounded-3xl">
          <DialogTitle className="sr-only">Отклонение задачи</DialogTitle>
          <DialogDescription className="sr-only">
            Модальное окно для ввода причины отклонения задачи с текстовым полем
          </DialogDescription>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">Причина отклонения</h3>
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>
            
            <Textarea
              placeholder="Укажите, что выполнено неправильно..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mb-4 min-h-[100px]"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="flex-1 py-3 px-4 bg-secondary text-secondary-foreground rounded-full text-sm font-medium transition-colors hover:bg-secondary/80"
              >
                Отмена
              </button>
              <button
                onClick={() => setRejectionModalOpen(false)}
                disabled={!rejectionReason.trim()}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-full text-sm font-medium transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отправить
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}