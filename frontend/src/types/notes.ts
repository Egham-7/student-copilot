import type { PartialBlock } from "@blocknote/core";

export type Note = {
  id: number;
  title: string;
  content?: PartialBlock[];
  embedding?: number[] | null;
  createdAt: string;
  updatedAt: string;
};

export type NoteForm = {
  title: string;
  content?: PartialBlock[];
  embedding?: number[] | null;
};
