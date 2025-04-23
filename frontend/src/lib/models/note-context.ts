export interface NoteContext {
  rowid: number;
  id: number;
  title: string;
  content: string;
  embedding: number[];
  filePath: string;
  noteId: number;
  created_at: string;
  updated_at: string;
}
