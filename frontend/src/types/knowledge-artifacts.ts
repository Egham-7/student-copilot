export type KnowledgeArtifact = {
  id: number;
  title: string;
  content: string;
  filePath: string;
  embedding?: number[] | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  noteId?: string;
};

// For creating a new artifact
export type KnowledgeArtifactCreate = Omit<
  KnowledgeArtifact,
  'id' | 'createdAt' | 'updatedAt'
>;

// For updating an artifact (full update, all fields except created/updated/userId required)
export type KnowledgeArtifactUpdate = Omit<
  KnowledgeArtifact,
  'createdAt' | 'updatedAt' | 'userId'
>;
