import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/layouts/app-layout';

import { SidebarProvider } from '@/components/ui/sidebar';

export const Route = createFileRoute('/_app')({
  component: NotesLayoutPage,
});

function NotesLayoutPage() {
  return (
    <>
      <SidebarProvider>
        <AppLayout />
      </SidebarProvider>
    </>
  );
}
