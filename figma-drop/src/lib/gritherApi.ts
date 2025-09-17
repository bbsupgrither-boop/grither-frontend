export const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

const ADMIN_TOKEN_KEY = 'grither_admin_token';
const ADMIN_ROLE_KEY  = 'grither_admin_role';

export function getAdminAuth() {
  if (typeof window === 'undefined') return { token: null, role: null };
  return {
    token: localStorage.getItem(ADMIN_TOKEN_KEY),
    role:  localStorage.getItem(ADMIN_ROLE_KEY),
  };
}

export function setAdminAuth(token: string, role: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_ROLE_KEY, role);
}

export async function apiAdmin(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const { token } = getAdminAuth();
  if (token) headers.set('Authorization', Bearer );

  const res = await fetch(${API_BASE}, { ...init, headers });
  return res;
}
