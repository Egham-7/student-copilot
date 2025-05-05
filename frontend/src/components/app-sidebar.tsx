import { FileText, Loader2, Trash2, Plus, Book } from 'lucide-react';
import { Link, useRouter, useNavigate } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useNotes } from '@/hooks/notes/use-notes';
import { SkeletonItem } from './skeleton-item';
import { ErrorState } from './error-display';
import { useDeleteNote } from '@/hooks/notes/use-delete-note';
import { useCreateNote } from '@/hooks/notes/use-create-note';
import { useSupabaseSession } from '@/hooks/auth/use-supabase-session';

export function AppSidebar() {
  const { data: notes, isLoading, isError, refetch } = useNotes();
  const { mutateAsync: deleteNote } = useDeleteNote();
  const { mutateAsync: createNote, isPending: isCreating } = useCreateNote();
  const { session } = useSupabaseSession();
  const userId = session?.user.id;
  const router = useRouter();
  const navigate = useNavigate();
  const currentPath = router.state.location.pathname;
  const isNavigating = router.state.status === 'pending';

  const handleDeleteNote = async (noteId: number) => {
    if (!notes?.length) return;
    const currentIndex = notes.findIndex((note) => note.id === noteId);
    const nextNote = notes[currentIndex + 1] || notes[currentIndex - 1];

    await deleteNote(noteId);

    if (nextNote) {
      navigate({ to: '/$noteId', params: { noteId: nextNote.id.toString() } });
    } else {
      navigate({ to: '/create' });
    }
  };

  const handleCreateNote = async () => {
    if (!userId) return;

    try {
      const newNoteId = await createNote({
        title: 'Untitled',
        userId,
      });

      if (newNoteId) {
        navigate({ to: '/$noteId', params: { noteId: newNoteId.toString() } });
      }
    } catch {
      // toast handled inside hook
    }
  };

  return (
    <Sidebar className="bg-background border-r border-border">
      <SidebarHeader>
        <h2 className="text-title px-2 py-2 text-sm font-semibold">
          App Navigation
        </h2>
      </SidebarHeader>

      <SidebarContent>
        {isLoading && <SkeletonItem count={5} />}
        {isError && (
          <ErrorState
            message="Failed to load notes"
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && (
          <>
            {/* Notes Group */}
            <SidebarGroup>
              <SidebarGroupLabel>Notes</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {notes?.map((note) => {
                    const isActive = currentPath === `/${note.id.toString()}`;

                    return (
                      <SidebarMenuItem key={note.id}>
                        <Link
                          to="/$noteId"
                          params={{ noteId: note.id.toString() }}
                        >
                          <SidebarMenuButton isActive={isActive}>
                            {isActive && isNavigating ? (
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                              <FileText className="h-4 w-4 text-primary" />
                            )}
                            <span className="text-sm">{note.title}</span>
                          </SidebarMenuButton>
                        </Link>

                        <SidebarMenuAction
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </SidebarMenuAction>
                      </SidebarMenuItem>
                    );
                  })}

                  <SidebarMenuItem>
                    <Button
                      variant="ghost"
                      onClick={handleCreateNote}
                      disabled={isCreating || !userId}
                      className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      {isCreating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      <span className="text-sm">New Note</span>
                    </Button>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Knowledge Artifacts</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentPath === '/artifacts'}>
                      <Book className="h-4 w-4 text-primary" />
                      <span className="text-sm">Coming Soon</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
