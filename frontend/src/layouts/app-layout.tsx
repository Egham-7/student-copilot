import { Outlet, useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session";
import { useEffect } from "react";
import { Protected } from "./protected-layout";

export function AppLayout() {
  const session = useSupabaseSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session === null) {
      navigate({ to: "/login" });
    }
    // If session is truthy, do nothing (render children)
  }, [session, navigate]);

  if (!session) return null;

  return (
    <Protected>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <main className="relative flex-1 overflow-hidden bg-background">
          <Outlet />
        </main>
      </div>
    </Protected>
  );
}
