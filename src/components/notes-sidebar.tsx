import { useState } from "react";
import { Trash2, Plus, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import { Button } from "./ui/button";

interface Note {
  id: string;
  title: string;
}

export function NotesSidebar() {
  const [notes, setNotes] = useState<Note[]>([
    { id: "1", title: "Meeting notes" },
    { id: "2", title: "Ideas for project" },
    { id: "3", title: "Shopping list" },
  ]);

  const createNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: `New Note ${notes.length + 1}`,
    };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <Sidebar className="bg-sidebar border-r border-sidebar-border">
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2 text-sidebar-foreground">
          My Notes
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note.id}
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
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button
          className="w-full justify-start text-sidebar-primary-foreground bg-sidebar-primary hover:bg-sidebar-primary/90"
          onClick={createNote}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Note
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
