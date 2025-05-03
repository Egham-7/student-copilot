import { useMutation } from '@tanstack/react-query';
import { knowledgeArtifactsService } from '@/services/knowledge-artifacts';

type PresignInput = {
  key: string;
  contentType: string;
};

export function usePresignUpload() {
  return useMutation({
    mutationFn: (data: PresignInput) =>
      knowledgeArtifactsService.presignUploadUrl(data),
  });
}
