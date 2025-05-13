import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

type PresignInput = {
  key: string; // path inside the bucket, e.g., "user-id/filename.pdf"
  bucket: string;
};

export function usePresignUpload() {
  return useMutation({
    mutationFn: async ({ key, bucket }: PresignInput) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUploadUrl(key, {
          upsert: true,
        });

      if (error || !data) {
        throw new Error(
          `Failed to generate presigned upload URL: ${error?.message}`,
        );
      }

      return data; // { signedUrl, path }
    },
  });
}
