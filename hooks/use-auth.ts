import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, UserProfile } from '@/lib/auth';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setAuthState({
            user,
            profile,
            loading: false,
            error: null,
          });
        } catch (error) {
          setAuthState({
            user,
            profile: null,
            loading: false,
            error: 'Failed to load user profile',
          });
        }
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
};
