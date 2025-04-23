import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export function useProcessFile() {
  return useMutation({
    mutationFn: async (filePath: string) => {
      return invoke<string>("process_file", {
        filePath,
      });
    },
  });
}
