import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { db } from "@/lib/db";

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      embedding,
    }: {
      id: number;
      title: string;
      content: string;
      embedding: number[];
    }) => {
      const now = new Date().toISOString();
      return await db.execute(
        "UPDATE notes SET title = $1, content = $2, embedding = $3, updated_at = $4 WHERE rowid = $5",
        [title, content, embedding, now, id],
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", variables.id] });
    },
  });
};
