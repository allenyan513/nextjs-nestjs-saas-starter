import { api } from '@repo/shared/api-client';
import { createContext, useContext, useEffect, useState } from 'react';
import { UserEntity } from '@repo/shared/types';
import { redirect, useRouter } from 'next/navigation';

interface UserContextProps {
  user: UserEntity | null | undefined;
  googleSignIn: (redirect?: string) => void;
  githubSignIn: (redirect?: string) => void;
  twitterSignIn: (redirect?: string) => void;
  sendMagicLink: (email: string, redirect?: string) => Promise<void>;
  signIn: (callbackUrl?: string) => void;
  signOut: () => void;
  deleteAccount: () => void;
  syncSession: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | null>(null);

export function UserProvider(props: { children: React.ReactNode }) {
  /**
   * Important:
   * undefined is used to indicate that the user state is still being fetched.
   * null indicates that the user is not logged in.
   * not null indicates that the user is logged in.
   */
  const [user, setUser] = useState<UserEntity | null | undefined>(undefined);
  const router = useRouter();

  const signIn = (redirectUrl?: string) => {
    if (!user) {
      const defaultCallbackUrl =
        typeof window !== 'undefined'
          ? window.location.href
          : redirectUrl || '/';
      router.push(
        '/auth/signin?redirect=' + encodeURIComponent(defaultCallbackUrl),
      );
    }
  };

  const googleSignIn = (redirectUrl?: string) => {
    redirect(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google?redirect=${encodeURIComponent(redirectUrl || '')}`,
    );
  };

  const githubSignIn = (redirectUrl?: string) => {
    redirect(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/github?redirect=${encodeURIComponent(redirectUrl || '')}`,
    );
  };
  const twitterSignIn = (redirectUrl?: string) => {
    redirect(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/twitter?redirect=${encodeURIComponent(redirectUrl || '')}`,
    );
  };

  const sendMagicLink = async (email: string, redirectUrl?: string) => {
    try {
      await api.auth.sendMagicLink(email, redirectUrl);
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    redirect('/auth/signin');
  };

  const deleteAccount = async () => {
    if (!user) {
      console.error('No user to delete');
      return;
    }
    try {
      await api.user.deleteAccount();
      localStorage.removeItem('access_token');
      setUser(null);
      redirect('/auth/signin');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const syncSession = async () => {
    try {
      const user = await api.auth.getSession();
      setUser(user);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    syncSession();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        googleSignIn,
        githubSignIn,
        twitterSignIn,
        sendMagicLink,
        signIn,
        signOut,
        deleteAccount,
        syncSession,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

interface UseSessionOptions {
  required?: boolean;
  onUnauthenticated?: (user: UserEntity | null | undefined) => void;
}

export function useSession(options?: UseSessionOptions) {
  const { user } = useUserContext();

  useEffect(() => {
    if (user === undefined) {
      // User state is still being fetched
      return;
    }
    if (user === null && options?.required && options?.onUnauthenticated) {
      // User is not logged in and required authentication and callback is provided
      options.onUnauthenticated(user);
      return;
    }
  }, [user, options]);

  return { user };
}
