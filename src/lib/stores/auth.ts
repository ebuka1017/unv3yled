import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  return {
    subscribe,
    setUser: (user: User | null) => update(state => ({ ...state, user, loading: false })),
    setLoading: (loading: boolean) => update(state => ({ ...state, loading })),
    setError: (error: string | null) => update(state => ({ ...state, error })),
    logout: () => set({ user: null, loading: false, error: null })
  };
}

export const authStore = createAuthStore();