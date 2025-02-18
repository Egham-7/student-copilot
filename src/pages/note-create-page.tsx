import { CreateNoteForm } from "@/components/notes/note-create-form";
import { PlusCircle } from "lucide-react";

export default function NoteCreatePage() {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Notes</h1>
        <p className="text-muted-foreground mb-8">
          You don't have any notes yet. Create your first note to get started!
        </p>
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <PlusCircle className="h-6 w-6" />
            Create Your First Note
          </h2>
          <CreateNoteForm />
        </div>
      </div>
    </main>
  );
}
