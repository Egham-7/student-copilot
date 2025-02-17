import { useQueryClient, useMutation } from "@tanstack/react-query";
import { db } from "@/lib/db";

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      content,
      embedding,
    }: {
      title: string;
      content: string;
      embedding: number[];
    }) => {
      const now = new Date().toISOString();
      const result = await db.execute(
        "INSERT INTO notes (title, content, embedding, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [title, content, embedding, now, now],
      );

      return result.lastInsertId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
