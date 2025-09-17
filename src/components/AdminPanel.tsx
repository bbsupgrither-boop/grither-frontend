import { useState, useEffect } from 'react';
import { Shield, X } from './Icons';
import { AdminNavigation } from './AdminNavigation';
import { AdminDashboard } from './AdminDashboard';
import { AdminAchievements } from './AdminAchievements_fixed_full';
import { AdminTasksFixed } from './AdminTasksFixed';
import { AdminShopPage } from './AdminShopPage';
import { ShopModerationPage } from './ShopModerationPage';
import { AdminGamesPageNewFixed } from './AdminGamesPageNewFixed';
import { AdminCasesPage } from './AdminCasesPage';
import { WorkersManagement } from './WorkersManagement';
import { BattlesManagement } from './BattlesManagement';
import { AchievementsModeration } from './AchievementsModeration';

import { Achievement } from '../types/achievements';
import { ShopItem, Order } from '../types/shop';
import { Task } from '../types/tasks';
import { CaseType, UserCase } from '../types/cases';
import { Battle, BattleInvitation } from '../types/battles';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  shopItems: ShopItem[];
  setShopItems: (items: ShopItem[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  cases: CaseType[];
  setCases: (cases: CaseType[]) => void;
  userCases: UserCase[];
  setUserCases: (userCases: UserCase[]) => void;
  battles: Battle[];
  setBattles: (battles: Battle[]) => void;
  battleInvitations: BattleInvitation[];
  setBattleInvitations: (invitations: BattleInvitation[]) => void;
  onCompleteBattle: (battleId: string, winnerId: string) => void;
  onToggleDarkMode?: () => void;
  users?: import('../types/battles').User[];
  onUpdateUserBalance?: (userId: string, amount: number) => void;
}

/* ---------- helpers: роль/токен/выход ---------- */

const ADMIN_TOKEN_KEY = 'grither_admin_token';
const ADMIN_ROLE_KEY  = 'grither_admin_role';

function getAdminAuth() {
  const token = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;
  const role  = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_ROLE_KEY)  : null;
  return { token, role };
}

function adminLogout() {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_ROLE_KEY);
    localStorage.removeItem('adminLoginData'); // старый формат фигмы
  } finally {
    window.location.href = '/';
  }
}

/* ---------- старые списки для совместимости (fallback) ---------- */
const ADMIN_USERS = [
  { telegramId: '123456789', username: 'ivan_petrov', role: 'главный_админ' },
  { telegramId: '987654321', username: 'maria_sidorova', role: 'главный_админ' },
  { telegramId: '111222333', username: 'alexey_kozlov', role: 'старший_админ' },
  { telegramId: '444555666', username: 'elena_morozova', role: 'старший_админ' },
  { telegramId: '1609556178', username: 'admin_senior', role: 'старший_админ' },
  { telegramId: '777888999', username: 'dmitry_volkov', role: 'младший_админ' },
  { telegramId: '000111222', username: 'anna_lebedeva', role: 'младший_админ' },
  { telegramId: '333444555', username: 'sergey_orlov', role: 'тимлид', teamNumber: 1 },
  { telegramId: '666777888', username: 'olga_sokolova', role: 'тимлид', teamNumber: 2 },
  { telegramId: '999000111', username: 'mikhail_rybakov', role: 'тимлид', teamNumber: 3 },
];

const SECRET_CODES: Record<string, string> = {
  'df1GE%LwVAAC': 'главный_админ',
  '0caFyNh}w%': 'старший_админ',
  '~3SogEhz': 'младший_админ',
  'SToU{~': 'тимлид'
};

/* --------------------------------------------------------------- */

export function AdminPanel({
  onNavigate,
  achievements,
  setAchievements,
  shopItems,
  setShopItems,
  orders,
  setOrders,
  tasks,
  setTasks,
  cases,
  setCases,
  userCases,
  setUserCases,
  battles,
  setBattles,
  battleInvitations,
  setBattleInvitations,
  onCompleteBattle,
  onToggleDarkMode,
  users = [],
  onUpdateUserBalance
}: AdminPanelProps) {
  const [currentAdminPage, setCurrentAdminPage] = useState('dashboard');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // 1) пробуем взять роль, выданную бэкендом
    const { role } = getAdminAuth();
    if (role) {
      setUserRole(role);
      return;
    }
    // 2) fallback на старую логику фигмы (adminLoginData)
    const adminLoginData = localStorage.getItem('adminLoginData');
    if (adminLoginData) {
      try {
        const { telegramId, accessCode } = JSON.parse(adminLoginData);
        const r = SECRET_CODES[accessCode as string];
        if (r) {
          const user = ADMIN_USERS.find(u => u.telegramId === String(telegramId) && u.role === r);
          if (user) {
            setUserRole(user.role);
            setUserName(user.username);
          }
        }
      } catch {}
    }
  }, []);

  const handleAdminNavigate = (page: string) => setCurrentAdminPage(page);
  const handleBackToMain = () => onNavigate('home');

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'owner':
      case 'главный_админ': return 'Главный админ';
      case 'admin':
      case 'старший_админ': return 'Старший админ';
      case 'editor':
      case 'младший_админ': return 'Младший админ';
      case 'viewer':
      case 'тимлид':       return 'Тимлид';
      default:             return role || '—';
    }
  };

  const renderCurrentAdminPage = () => {
    switch (currentAdminPage) {
      case 'achievements':
        return (
          <AdminAchievements
            achievements={achievements}
            setAchievements={setAchievements}
            currentAdminPage={currentAdminPage}
            setCurrentAdminPage={setCurrentAdminPage}
          />
        );
      case 'achievements-moderation':
        return (
          <AchievementsModeration
            currentAdminPage={currentAdminPage}
            setCurrentAdminPage={setCurrentAdminPage}
          />
        );
      case 'tasks':
        return (
          <AdminTasksFixed
            currentAdminPage={currentAdminPage}
            setCurrentAdminPage={setCurrentAdminPage}
            tasks={tasks}
            setTasks={setTasks}
          />
        );
      case 'shop':
        return (
          <AdminShopPage
            onBack={() => setCurrentAdminPage('dashboard')}
            onNavigateToSection={(section) => setCurrentAdminPage(section)}
            onNavigateToModeration={() => setCurrentAdminPage('shop-moderation')}
            shopItems={shopItems}
            setShopItems={setShopItems}
          />
        );
      case 'shop-moderation':
        return (
          <ShopModerationPage
            onBack={() => setCurrentAdminPage('shop')}
            orders={orders}
            setOrders={setOrders}
            onUpdateUserBalance={onUpdateUserBalance}
          />
        );
      case 'workers':
        return (
          <WorkersManagement
            onBack={() => setCurrentAdminPage('dashboard')}
            onNavigateToSection={(section) => setCurrentAdminPage(section)}
          />
        );
      case 'battles':
        return (
          <BattlesManagement
            battles={battles}
            setBattles={setBattles}
            battleInvitations={battleInvitations}
            setBattleInvitations={setBattleInvitations}
            onCompleteBattle={onCompleteBattle}
            currentUserBalance={users.find(u => u.id === 'current-user')?.balance || 0}
          />
        );
      case 'games':
        return (
          <AdminGamesPageNewFixed
            onBack={() => setCurrentAdminPage('dashboard')}
            onNavigateToSection={(section) => setCurrentAdminPage(section)}
          />
        );
      case 'cases':
        return (
          <AdminCasesPage
            theme="dark"
            cases={cases}
            setCases={setCases}
          />
        );
      case 'dashboard':
      default:
        return (
          <AdminDashboard
            onClose={handleBackToMain}
            onToggleDarkMode={onToggleDarkMode}
            onNavigateToWorkers={() => setCurrentAdminPage('workers')}
            onNavigateToAchievementsModeration={() => setCurrentAdminPage('achievements-moderation')}
            onNavigateToGames={() => setCurrentAdminPage('games')}
            onNavigateToCases={() => setCurrentAdminPage('cases')}
            onNavigateToBattles={() => setCurrentAdminPage('battles')}
          />
        );
    }
  };

  return (
    <div className="admin-shell">
      {/* ШАПКА */}
      <header className="admin-header">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield
                className="w-6 h-6 text-primary cursor-pointer transition-transform hover:scale-110"
                onDoubleClick={onToggleDarkMode}
                title="Двойной клик для смены темы"
              />
            </div>
            <div>
              <h1 className="text-lg font-medium text-foreground">Панель управления</h1>
              <p className="text-sm text-muted-foreground">
                {getRoleDisplayName(userRole || '')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded-full border border-border/30 text-foreground/80">
              Роль: {getRoleDisplayName(userRole || '')}
            </span>
            <button
              onClick={adminLogout}
              className="px-3 py-1 rounded-md border text-sm hover:bg-black/5"
              title="Выйти из админки"
            >
              Выйти
            </button>
            <button
              onClick={handleBackToMain}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              title="Закрыть админку"
            >
              <X className="w-5 h-5 text-foreground/70" />
            </button>
          </div>
        </div>
        {/* Если у тебя есть AdminNavigation — можно вывести его тут под шапкой */}
        {/* <AdminNavigation current={currentAdminPage} onNavigate={setCurrentAdminPage} /> */}
      </header>

      {/* КОНТЕНТ */}
      <main className="admin-content">
        {renderCurrentAdminPage()}
      </main>
    </div>
  );
}
