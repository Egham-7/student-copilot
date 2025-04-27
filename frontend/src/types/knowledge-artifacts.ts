export type KnowledgeArtifact = {
  id: number;
  title: string;
  content: string;
  filePath: string;
  embedding?: number[] | null;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeArtifactForm = {
  title: string;
  content: string;
  filePath: string;
  embedding?: number[] | null;
};
