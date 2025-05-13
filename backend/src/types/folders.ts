import { folders } from "@/db/schema";

// Types for `folders` table
export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;
export type UpdateFolder = Partial<NewFolder>;

export interface FolderWithChildren extends Folder {
  children: FolderWithChildren[];
}
