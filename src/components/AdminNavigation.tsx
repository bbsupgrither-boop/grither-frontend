import { Home, Trophy, CheckSquare, ShoppingCart, Users, Zap, Gamepad2, Box } from './Icons';

interface AdminNavigationProps {
  currentAdminPage: string;
  onNavigate: (page: string) => void;
}

export function AdminNavigation({ currentAdminPage, onNavigate }: AdminNavigationProps) {
  const adminPages = [
    {
      id: 'dashboard',
      label: 'Главная',
      icon: Home
    },
    {
      id: 'workers',
      label: 'Воркеры',
      icon: Users
    },
    {
      id: 'battles',
      label: 'Баттлы',
      icon: Zap
    },
    {
      id: 'achievements',
      label: 'Достижения', 
      icon: Trophy
    },
    {
      id: 'tasks',
      label: 'Задачи',
      icon: CheckSquare
    },
    {
      id: 'shop',
      label: 'Магазин',
      icon: ShoppingCart
    },
    {
      id: 'games',
      label: 'Игры',
      icon: Gamepad2
    },
    {
      id: 'cases',
      label: 'Кейсы',
      icon: Box
    }
  ];

  return (
    <nav className="glass-card border-t border-border/50 backdrop-blur-xl">
      <div className="grid grid-cols-4 p-3">
        {adminPages.slice(0, 4).map((page) => {
          const Icon = page.icon;
          
          return (
            <button
              key={page.id}
              onClick={() => onNavigate(page.id)}
              className="flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{page.label}</span>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-4 p-3 pt-0">
        {adminPages.slice(4, 8).map((page) => {
          const Icon = page.icon;
          
          return (
            <button
              key={page.id}
              onClick={() => onNavigate(page.id)}
              className="flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{page.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}