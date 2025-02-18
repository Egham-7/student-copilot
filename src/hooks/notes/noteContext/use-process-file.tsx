import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

interface ProcessFileResult {
  content: string;
  embeddings: number[];
}

export function useProcessFile() {
  return useMutation({
    mutationFn: async (filePath: string) => {
      return invoke<ProcessFileResult>("process_file", {
        filePath,
      });
    },
  });
}
