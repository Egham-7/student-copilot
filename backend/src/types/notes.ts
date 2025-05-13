import { notes, notesToKnowledgeArtifacts } from "@/db/schema";

// Types for `notes` table
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type UpdateNote = Partial<NewNote>;

// Types for join table
export type NoteToKnowledgeArtifact =
  typeof notesToKnowledgeArtifacts.$inferSelect;
export type NewNoteToKnowledgeArtifact =
  typeof notesToKnowledgeArtifacts.$inferInsert;
export type UpdateNoteToKnowledgeArtifact = Partial<NewNoteToKnowledgeArtifact>;
