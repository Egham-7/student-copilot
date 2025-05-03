import { useQueryClient, useMutation } from '@tanstack/react-query';
import { notesService } from '@/services/notes';
import { NoteCreate } from '@/types/notes';
import { toast } from 'sonner';

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, userId }: NoteCreate) => {
      const note = await notesService.create({
        title,
        content,
        userId,
      });
      return note.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
