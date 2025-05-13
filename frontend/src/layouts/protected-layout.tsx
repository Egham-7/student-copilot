import { useEffect } from "react";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session";
import { useNavigate } from "@tanstack/react-router";

export function Protected({ children }: { children: React.ReactNode }) {
  const { session, isLoading, error } = useSupabaseSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate({ to: "/login" });
    }
  }, [isLoading, session, navigate]);

  if (isLoading) return <div>Loading...</div>; // or your spinner component
  if (error) return <div>Error: {error.message}</div>;

  // Optionally, you could return null here, but if session is null and not loading,
  // the redirect will happen, so this is safe.
  if (!session) return null;

  return <>{children}</>;
}
