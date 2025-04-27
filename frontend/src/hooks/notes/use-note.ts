import { useQuery } from "@tanstack/react-query";
import { Note } from "@/types/notes";
import { notesService } from "@/services/notes";

export const useNote = (id: number) => {
  return useQuery<Note>({
    queryKey: ["notes", id],
    queryFn: async () => {
      if (!id) throw new Error("No note id provided");
      return notesService.getById(id);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
};
