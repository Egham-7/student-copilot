import { Trash2, FileText } from "lucide-react";
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

export function NotesSidebar() {
  const { data: notes, isLoading, isError, refetch } = useNotes();

  const { mutateAsync: deleteNote } = useDeleteNote();

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
            {notes?.map((note) => (
              <li
                key={note.rowid}
                className="flex items-center justify-between px-4 py-2 hover:bg-sidebar-accent group transition-colors"
              >
                <div className="flex items-center text-sidebar-foreground">
                  <FileText className="mr-2 h-4 w-4 text-sidebar-primary" />
                  <span className="text-sm">{note.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 text-sidebar-primary hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    deleteNote(note.rowid);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <CreateNoteForm />
      </SidebarFooter>
    </Sidebar>
  );
}
