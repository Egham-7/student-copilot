import { Outlet, useNavigate } from "@tanstack/react-router";
import { NotesSidebar } from "@/components/notes-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session";
import { useEffect } from "react";
import { Protected } from "./protected-layout";

export function NotesLayout() {
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
        <NotesSidebar />
        <main className="flex-1 overflow-auto bg-background">
          <SidebarTrigger />
          <Outlet />
        </main>
      </div>
    </Protected>
  );
}
