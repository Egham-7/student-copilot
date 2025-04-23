import { Trash2, FileText, Loader2 } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CreateNoteForm } from "./notes/note-create-form";
import { useNotes } from "@/hooks/notes/use-notes";
import { SkeletonItem } from "./skeleton-item";
import { ErrorState } from "./error-display";
import { useDeleteNote } from "@/hooks/notes/use-delete-note";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

export function NotesSidebar() {
  const { data: notes, isLoading, isError, refetch } = useNotes();
  const { mutateAsync: deleteNote } = useDeleteNote();
  const router = useRouter();
  const currentPath = router.state.location.pathname;
  const navigate = useNavigate();
  const isNavigating = router.state.status === "pending";

  const handleDeleteNote = async (noteId: number) => {
    if (!notes?.length) return;
    const currentIndex = notes?.findIndex((note) => note.id === noteId);
    const nextNote = notes?.[currentIndex + 1] || notes?.[currentIndex - 1];

    await deleteNote(noteId);

    if (nextNote) {
      navigate({ to: "/$noteId", params: { noteId: nextNote.id.toString() } });
    } else {
      navigate({ to: "/create" });
    }
  };

  return (
    <Sidebar className="bg-sidebar border-r border-sidebar-border">
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2 text-sidebar-foreground">
          My Notes
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
          <ul className="space-y-2">
            {notes?.map((note) => {
              const isActive = currentPath === `/${note.id.toString()}`;

              return (
                <li key={note.id}>
                  <Link
                    to="/$noteId"
                    params={{ noteId: note.id.toString() }}
                    className={cn(
                      "flex items-center justify-between px-4 py-2 hover:bg-sidebar-accent transition-colors",
                      "group relative",
                      isActive && "bg-sidebar-accent",
                    )}
                  >
                    <div className="flex items-center text-sidebar-foreground">
                      {isActive && isNavigating ? (
                        <Loader2 className="mr-2 h-4 w-4 text-sidebar-primary animate-spin" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4 text-sidebar-primary" />
                      )}
                      <span className="text-sm">{note.title}</span>
                    </div>
                    <DeleteConfirmation
                      title="Delete Note"
                      description={`Are you sure you want to delete "${note.title}"? This action cannot be undone.`}
                      onDelete={() => handleDeleteNote(note.id)}
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 text-sidebar-primary hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-sidebar-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <CreateNoteForm />
      </SidebarFooter>
    </Sidebar>
  );
}
