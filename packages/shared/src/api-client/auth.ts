import { authFetch } from './auth-fetch';
import { UserEntity } from '../types';

export const auth = {
  getSession: async (): Promise<UserEntity | null> => {
    try {
      return await authFetch('/api/users/profile', 'GET', {});
    } catch (error) {
      return null;
    }
  },
  googleSignIn: async (): Promise<UserEntity | null> => {
    return await authFetch('/api/auth/google', 'GET');
  },

  sendMagicLink: async (email: string, redirect?: string): Promise<void> => {
    try {
      await authFetch('/api/auth/send-magic-link', 'POST', {
        email: email,
        redirect: redirect || '',
      });
    } catch (error) {
      console.error(error);
    }
  },
};
