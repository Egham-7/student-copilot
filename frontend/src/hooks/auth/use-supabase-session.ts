import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type UseSupabaseSessionResult = {
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
};

export function useSupabaseSession(): UseSupabaseSessionResult {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(data.session);
          setError(error ? new Error(error.message) : null);
        }
      } catch (err) {
        if (isMounted) setError(err as Error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, isLoading, error };
}
