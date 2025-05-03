export interface BaseKnowledgeArtifact {
  title: string;
  filePath: string;
  fileType: string;
}

export interface KnowledgeArtifact extends BaseKnowledgeArtifact {
  id: number;
  content: string;
  embedding: number[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface KnowledgeArtifactCreate extends BaseKnowledgeArtifact {
  userId: string;
}

export interface KnowledgeArtifactUpdate extends BaseKnowledgeArtifact {
  id: number;
}
