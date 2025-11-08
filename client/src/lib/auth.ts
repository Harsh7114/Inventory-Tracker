import { User } from '@/types';

const AUTH_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const saveAuth = (user: User, rememberMe: boolean = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(AUTH_KEY, user.token);
  storage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAuth = (): { token: string; user: User } | null => {
  let token = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
  let userData = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  
  if (token && userData) {
    return {
      token,
      user: JSON.parse(userData),
    };
  }
  return null;
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return getAuth() !== null;
};
