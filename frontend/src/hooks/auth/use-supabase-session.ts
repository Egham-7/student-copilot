// hooks/useSupabaseSession.ts
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Use async/await for initial session fetch
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) setSession(data.session);
    })();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setSession(session);
    });

    // Cleanup on unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return session;
}
