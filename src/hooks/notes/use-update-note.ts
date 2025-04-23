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
    }: {
      id: number;
      title: string;
      content: string;
    }) => {
      const now = new Date().toISOString();
      return await db.execute(
        "UPDATE notes SET title = $1, content = $2,  updated_at = $3 WHERE id = $4",
        [title, content, now, id],
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", variables.id] });
    },
  });
};
