import { useEffect } from "react";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session"; // adjust as needed
import { useNavigate } from "@tanstack/react-router";

export function Protected({ children }: { children: React.ReactNode }) {
  const session = useSupabaseSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session === null) {
      navigate({ to: "/login" });
    }
  }, [session, navigate]);

  if (!session) return null; // or a loading spinner

  return <>{children}</>;
}
