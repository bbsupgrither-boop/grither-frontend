import { Achievement } from '../types/achievements';
import { ShopItem, Order } from '../types/shop';
import { Task } from '../types/tasks';
import { CaseType, UserCase, CaseShopItem, Prize } from '../types/cases';
import { Notification } from '../types/notifications';
import { LeaderboardEntry, User } from '../types/global';

// Простые мок-данные для достижений
export const mockAchievements: Achievement[] = [
  {
    id: 'ach1',
    title: 'Первые шаги',
    description: 'Выполните первую задачу',
    category: 'general',
    rarity: 'common',
    requirements: {
      type: 'tasks_completed',
      target: 1,
      current: 0
    },
    reward: {
      type: 'coins',
      amount: 100
    },
    status: 'available',
    isActive: true,
    conditions: ['Выполнить любую задачу']
  },
  {
    id: 'ach2',
    title: 'Трудолюбивый',
    description: 'Выполните 10 задач',
    category: 'tasks',
    rarity: 'rare',
    requirements: {
      type: 'tasks_completed',
      target: 10,
      current: 0
    },
    reward: {
      type: 'experience',
      amount: 500
    },
    status: 'locked',
    isActive: true,
    conditions: ['Выполнить 10 задач любой сложности']
  }
];

// Простые мок-данные для товаров в магазине
export const mockShopItems: ShopItem[] = [
  {
    id: 'shop1',
    name: 'Бонус опыта 2x',
    price: 500,
    description: 'Удваивает получаемый опыт на 24 часа',
    category: 'bonus',
    isActive: true,
    stock: 50,
    emoji: '⚡'
  },
  {
    id: 'shop2',
    name: 'VIP статус',
    price: 2000,
    description: 'Расширенные привилегии на месяц',
    category: 'privilege',
    isActive: true,
    stock: 10,
    emoji: '👑'
  }
];

// Простые мок-данные для заказов
export const mockOrders: Order[] = [];

// Простые мок-данные для задач
export const mockTasks: Task[] = [
  {
    id: 'task1',
    title: 'Создать новый компонент',
    description: 'Разработать переиспользуемый компонент для интерфейса',
    reward: 300,
    rewardType: 'coins',
    deadline: '2024-01-25T18:00:00Z',
    category: 'individual',
    status: 'active',
    assignedTo: 'current_user',
    createdBy: 'admin',
    createdAt: '2024-01-20T09:00:00Z',
    isPublished: true
  }
];

// Мок-данные для призов
export const mockPrizes: Prize[] = [
  // Базовые призы
  { id: 'prize1', name: '50 монет', image: '🪙', rarity: 'common', color: '#94A3B8', value: 50, dropChance: 40, description: 'Небольшое количество монет', type: 'coins' },
  { id: 'prize2', name: '100 опыта', image: '⭐', rarity: 'common', color: '#94A3B8', value: 100, dropChance: 30, description: 'Немного опыта для прогресса', type: 'experience' },
  { id: 'prize3', name: 'Базовый усилитель', image: '🔋', rarity: 'common', color: '#94A3B8', value: 75, dropChance: 20, description: 'Простой усилитель характеристик', type: 'item' },
  
  // Редкие призы
  { id: 'prize4', name: '200 монет', image: '💰', rarity: 'rare', color: '#3B82F6', value: 200, dropChance: 25, description: 'Хорошее количество монет', type: 'coins' },
  { id: 'prize5', name: '300 опыта', image: '✨', rarity: 'rare', color: '#3B82F6', value: 300, dropChance: 20, description: 'Заметное количество опыта', type: 'experience' },
  { id: 'prize6', name: 'Редкий артефакт', image: '🔮', rarity: 'rare', color: '#3B82F6', value: 250, dropChance: 15, description: 'Ценный артефакт с особыми свойствами', type: 'item' },
  
  // Эпические призы
  { id: 'prize7', name: '500 монет', image: '💎', rarity: 'epic', color: '#8B5CF6', value: 500, dropChance: 15, description: 'Внушительная сумма монет', type: 'coins' },
  { id: 'prize8', name: '750 опыта', image: '🌟', rarity: 'epic', color: '#8B5CF6', value: 750, dropChance: 10, description: 'Большое количество опыта', type: 'experience' },
  { id: 'prize9', name: 'Эпический амулет', image: '🏺', rarity: 'epic', color: '#8B5CF6', value: 600, dropChance: 8, description: 'Мощный амулет с уникальными способностями', type: 'item' },
  
  // Легендарные призы
  { id: 'prize10', name: '1000 монет', image: '👑', rarity: 'legendary', color: '#F59E0B', value: 1000, dropChance: 4, description: 'Огромная сумма монет', type: 'coins' },
  { id: 'prize11', name: '1500 опыта', image: '💫', rarity: 'legendary', color: '#F59E0B', value: 1500, dropChance: 3, description: 'Колоссальное количество опыта', type: 'experience' },
  { id: 'prize12', name: 'Легендарное оружие', image: '⚔️', rarity: 'legendary', color: '#F59E0B', value: 1200, dropChance: 2, description: 'Легендарное оружие невероятной силы', type: 'item' },
  
  // Мифические призы
  { id: 'prize13', name: '2500 монет', image: '🏆', rarity: 'mythic', color: '#EF4444', value: 2500, dropChance: 0.8, description: 'Мифическое богатство', type: 'coins' },
  { id: 'prize14', name: '3000 опыта', image: '🔥', rarity: 'mythic', color: '#EF4444', value: 3000, dropChance: 0.5, description: 'Божественное количество опыта', type: 'experience' },
  { id: 'prize15', name: 'Мифический артефакт', image: '🗿', rarity: 'mythic', color: '#EF4444', value: 2000, dropChance: 0.2, description: 'Артефакт древних богов', type: 'item' }
];

// Создаем кейсы без circular reference
const createCaseTypes = (): CaseType[] => {
  const commonPrizes = mockPrizes.filter(p => p.rarity === 'common');
  const rarePrizes = mockPrizes.filter(p => p.rarity === 'common' || p.rarity === 'rare');
  const epicPrizes = mockPrizes.filter(p => p.rarity === 'rare' || p.rarity === 'epic');
  const legendaryPrizes = mockPrizes.filter(p => p.rarity === 'epic' || p.rarity === 'legendary');
  const mythicPrizes = mockPrizes.filter(p => p.rarity === 'legendary' || p.rarity === 'mythic');

  return [
    {
      id: 'case1',
      name: 'CLASSIC',
      image: 'https://images.unsplash.com/photo-1662348317573-594daeff9ce1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwYmxhY2slMjB0ZWNoJTIwY2FzZSUyMGJveHxlbnwxfHx8fDE3NTcwNzcxNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rarity: 'common',
      color: '#FF4444',
      description: 'Обычный кейс с базовыми предметами',
      contents: ['Монеты x100', 'Опыт x50', 'Базовый предмет'],
      prizes: commonPrizes,
      isActive: true,
      glowColor: '#FF4444',
      glowIntensity: 'low'
    },
    {
      id: 'case2',
      name: 'PRO',
      image: 'https://images.unsplash.com/photo-1546728684-0c649e299b0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMG5lb24lMjBjeWJlcnB1bmslMjB0ZWNoJTIwY2FzZXxlbnwxfHx8fDE3NTcwNzcxNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rarity: 'rare',
      color: '#00FF44',
      description: 'Редкий кейс с ценными предметами',
      contents: ['Монеты x300', 'Опыт x150', 'Редкий предм��т'],
      prizes: rarePrizes,
      isActive: true,
      glowColor: '#00FF44',
      glowIntensity: 'medium'
    },
    {
      id: 'case3',
      name: 'ULTRA',
      image: 'https://images.unsplash.com/photo-1754302003140-8aae275f1a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwZ2xvd2luZyUyMHRlY2glMjBjb250YWluZXIlMjBjYXNlfGVufDF8fHx8MTc1NzA3NzE3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rarity: 'epic',
      color: '#4488FF',
      description: 'Эпический кейс с мощными предметами',
      contents: ['Монеты x500', 'Опыт x300', 'Эпический предмет'],
      prizes: epicPrizes,
      isActive: true,
      glowColor: '#4488FF',
      glowIntensity: 'high'
    },
    {
      id: 'case4',
      name: 'LEGEND',
      image: 'https://images.unsplash.com/photo-1664849328797-d94d3831a793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBsdXh1cnklMjB0ZWNoJTIwY29udGFpbmVyJTIwY2FzZXxlbnwxfHx8fDE3NTcwODA0NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rarity: 'legendary',
      color: '#F59E0B',
      description: 'Легендарный кейс с уникальными предметами',
      contents: ['Монеты x1000', 'Опыт x500', 'Легендарный предмет'],
      prizes: legendaryPrizes,
      isActive: true,
      glowColor: '#F59E0B',
      glowIntensity: 'high'
    },
    {
      id: 'case5',
      name: 'MYTHIC',
      image: 'https://images.unsplash.com/photo-1609323170129-bf4d7d4d7dbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBnbG93aW5nJTIwZnV0dXJpc3RpYyUyMHRlY2glMjBjYXNlfGVufDF8fHx8MTc1NzA4MDQ3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rarity: 'mythic',
      color: '#EF4444',
      description: 'Мифический кейс с самыми редкими предметами',
      contents: ['Монеты x2000', 'Опыт x1000', 'Мифический предмет'],
      prizes: mythicPrizes,
      isActive: true,
      glowColor: '#EF4444',
      glowIntensity: 'high'
    }
  ];
};

// Мок-данные для типов кейсов
export const mockCaseTypes: CaseType[] = createCaseTypes();

// Мок-данные для пользовательс��их кейсов
export const mockUserCases: UserCase[] = [];

// Мок-данные для магазина кейсов
export const mockCaseShopItems: CaseShopItem[] = [
  {
    id: 'shop_case1',
    caseTypeId: 'case1',
    price: 5000,
    currency: 'coins',
    isAvailable: true
  },
  {
    id: 'shop_case2',
    caseTypeId: 'case2',
    price: 12000,
    currency: 'coins',
    isAvailable: true
  },
  {
    id: 'shop_case3',
    caseTypeId: 'case3',
    price: 25000,
    currency: 'coins',
    isAvailable: true
  },
  {
    id: 'shop_case4',
    caseTypeId: 'case4',
    price: 50000,
    currency: 'coins',
    isAvailable: true
  },
  {
    id: 'shop_case5',
    caseTypeId: 'case5',
    price: 100000,
    currency: 'coins',
    isAvailable: true
  }
];

// Примеры уведомлений для демонстрации
export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'system',
    title: 'Добро пожаловать!',
    message: 'Добро пожаловать в GRITHER! Здесь вы будете получать все важные уведомления.',
    timestamp: new Date(Date.now() - 60000), // 1 минута назад
    read: false,
    priority: 'medium'
  },
  {
    id: 'notif_2',
    type: 'achievement',
    title: 'Первое достижение!',
    message: 'Поздравляем! Вы получили своё первое достижение "Новичок".',
    timestamp: new Date(Date.now() - 180000), // 3 минуты назад
    read: true,
    priority: 'medium',
    data: { achievementId: 'newcomer', reward: 100 }
  }
];

// Mock данные для пользователей
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Анна Иванова',
    username: '@anna_ivanova',
    avatar: '',
    role: 'worker',
    level: 15,
    experience: 2250,
    maxExperience: 3000,
    balance: 8500,
    rating: 1250,
    completedTasks: 45,
    achievementsCount: 32,
    battlesWon: 12,
    battlesLost: 3,
    teamId: 'team1',
    isOnline: true,
    lastSeen: new Date(),
    joinedDate: new Date('2023-06-15')
  },
  {
    id: '2',
    name: 'Петр Петров',
    username: '@petr_petrov',
    avatar: '',
    role: 'teamlead',
    level: 18,
    experience: 1800,
    maxExperience: 4000,
    balance: 12000,
    rating: 1450,
    completedTasks: 62,
    achievementsCount: 45,
    battlesWon: 18,
    battlesLost: 4,
    teamId: 'team2',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1800000), // 30 минут назад
    joinedDate: new Date('2023-03-20')
  },
  {
    id: '3',
    name: 'Мария Сидорова',
    username: '@maria_sidorova',
    avatar: '',
    role: 'worker',
    level: 12,
    experience: 1200,
    maxExperience: 2500,
    balance: 5600,
    rating: 980,
    completedTasks: 28,
    achievementsCount: 23,
    battlesWon: 7,
    battlesLost: 5,
    teamId: 'team1',
    isOnline: true,
    lastSeen: new Date(),
    joinedDate: new Date('2023-08-10')
  },
  {
    id: '4',
    name: 'Алексей Козлов',
    username: '@alexey_kozlov',
    avatar: '',
    role: 'worker',
    level: 14,
    experience: 2100,
    maxExperience: 2800,
    balance: 7300,
    rating: 1120,
    completedTasks: 38,
    achievementsCount: 29,
    battlesWon: 10,
    battlesLost: 6,
    teamId: 'team3',
    isOnline: true,
    lastSeen: new Date(),
    joinedDate: new Date('2023-05-05')
  },
  {
    id: '5',
    name: 'Елена Морозова',
    username: '@elena_morozova',
    avatar: '',
    role: 'junior_admin',
    level: 16,
    experience: 2400,
    maxExperience: 3200,
    balance: 9800,
    rating: 1380,
    completedTasks: 51,
    achievementsCount: 38,
    battlesWon: 15,
    battlesLost: 2,
    teamId: 'team2',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000), // 1 час назад
    joinedDate: new Date('2023-01-12')
  }
];

// Mock данные для лидерборда
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: mockUsers.find(u => u.id === '2')!,
    change: 0, // без изменений
    score: mockUsers.find(u => u.id === '2')?.rating || 0
  },
  {
    rank: 2,
    user: mockUsers.find(u => u.id === '5')!,
    change: 1, // поднялся на 1 позицию
    score: mockUsers.find(u => u.id === '5')?.rating || 0
  },
  {
    rank: 3,
    user: mockUsers.find(u => u.id === '1')!,
    change: -1, // опустился на 1 позицию
    score: mockUsers.find(u => u.id === '1')?.rating || 0
  },
  {
    rank: 4,
    user: mockUsers.find(u => u.id === '4')!,
    change: 0,
    score: mockUsers.find(u => u.id === '4')?.rating || 0
  },
  {
    rank: 5,
    user: mockUsers.find(u => u.id === '3')!,
    change: 0,
    score: mockUsers.find(u => u.id === '3')?.rating || 0
  }
];