import { Outlet } from "@tanstack/react-router";
import { NotesSidebar } from "@/components/notes-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function NotesLayout() {
  return (
    <div className="flex h-screen">
      <NotesSidebar />
      <main className="flex-1 overflow-auto bg-background">
        <SidebarTrigger />
        <Outlet />
      </main>
    </div>
  );
}
