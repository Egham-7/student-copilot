import { useQuery } from "@tanstack/react-query";
import { Note } from "@/types/notes";
import { notesService } from "@/services/notes";

export const useNotes = () => {
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      return notesService.getAll();
    },
  });
};
