import type { User } from '@/interfaces/user.interface'
import { create } from 'zustand'
import { loginAction } from '../actions/login.action'
import { checkAuthAction } from '../actions/check-auth.action';
import { registerAction } from '../actions/register.action';

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

type AuthState = {
  // Properties
  user: User | null;
  token: string | null;
  authStatus: AuthStatus;

  // Getters
  isAdmin: () => boolean;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}
export const useAuthStore = create<AuthState>()((set, get) => ({
  // Implementación del store
  user: null,
  token: null,
  authStatus: 'checking',

  // Getters
  isAdmin: () => {
    const roles = get().user?.roles || [];
    return roles.includes('admin');
  },

  // Actions
  login: async (email: string, password: string) => {
    console.log({ email, password });

    try {
      const data = await loginAction(email, password);

      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, authStatus: 'authenticated' });

      return true;
    } catch (error) {

      localStorage.removeItem('token');
      set({ user: null, token: null, authStatus: 'not-authenticated' });

      return false;
    }
  },

  register: async (fullName: string, email: string, password: string) => {
    console.log({ fullName, email, password });

    try {
      const data = await registerAction(fullName, email, password);

      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, authStatus: 'authenticated' });

      return true;
    } catch (error) {

      localStorage.removeItem('token');
      set({ user: null, token: null, authStatus: 'not-authenticated' });

      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, authStatus: 'not-authenticated' });
  },

  checkAuthStatus: async () => {
    try {
      const { user, token } = await checkAuthAction();
      set({
        user: user,
        token: token,
        authStatus: 'authenticated'
      });
      return true;
    } catch (error) {
      set({
        user: undefined,
        token: undefined,
        authStatus: 'not-authenticated'
      });
      // console.log(error);
      return false;
    }
  }

}))









// El ejemplo inicial era:
/*
type Store = {
  count: number
  inc: () => void
  dec: () => void
  incBy: (value: number) => void
}

export const useCounterStore = create<Store>()((set) => ({
  count: 100,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
  incBy: (value: number) => set((state) => ({ count: state.count + value })),
}))
*/
