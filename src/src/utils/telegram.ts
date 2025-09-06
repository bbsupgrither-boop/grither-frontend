// src/utils/telegram.ts
export type TelegramUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
};

type TG = {
  WebApp?: {
    initData?: string
    initDataUnsafe?: { user?: TelegramUser }
    colorScheme?: 'light' | 'dark'
    platform?: string
    ready?: () => void
    expand?: () => void
    HapticFeedback?: { impactOccurred?: (s: 'light'|'medium'|'heavy'|'rigid'|'soft') => void }
  }
};

export function useTelegram() {
  const wa = (window as any as { Telegram?: TG }).Telegram?.WebApp;

  const isAvailable = !!wa;
  const user = wa?.initDataUnsafe?.user || null;
  const colorScheme = wa?.colorScheme || 'dark';
  const platform = wa?.platform || 'unknown';

  const impactFeedback = (style: 'light'|'medium'|'heavy'|'rigid'|'soft' = 'light') => {
    try { wa?.HapticFeedback?.impactOccurred?.(style); } catch {}
  };

  try { wa?.ready?.(); wa?.expand?.(); } catch {}

  return { isAvailable, user, colorScheme, platform, impactFeedback };
}
