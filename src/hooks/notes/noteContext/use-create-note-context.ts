import { NoteContext } from "@/lib/models/note-context";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { db } from "@/lib/db";

export const useCreateNoteContext = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      content,
      filePath,
      noteId,
    }: Pick<NoteContext, "title" | "content" | "filePath" | "noteId">) => {
      const now = new Date().toISOString();
      return await db.execute(
        "INSERT INTO note_context (title, content, file_path, note_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
        [title, content, filePath, noteId, now, now],
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["noteContext", variables.noteId],
      });
    },
  });
};
