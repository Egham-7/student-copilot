import { createFileRoute } from "@tanstack/react-router";
import { NotesLayout } from "@/layouts/notes";

import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_notes")({
  component: NotesLayoutPage,
});

function NotesLayoutPage() {
  return (
    <>
      <SidebarProvider>
        <NotesLayout />
      </SidebarProvider>
    </>
  );
}
