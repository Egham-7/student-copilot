import { useQueryClient, useMutation } from '@tanstack/react-query';
import { notesService } from '@/services/notes';
import { NoteUpdate } from '@/types/notes';

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      embedding,
      userId,
    }: NoteUpdate) => {
      // Call the service to update the note
      return await notesService.update(id, {
        title,
        content,
        embedding,
        userId,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', variables.id] });
    },
  });
};
