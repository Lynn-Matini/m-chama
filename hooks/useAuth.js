import { useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export function useAuth() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, !!session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, redirecting...');
        window.location.href = '../app/dashboard';
      }
    });

    return () => subscription.unsubscribe();
  }, []);
}