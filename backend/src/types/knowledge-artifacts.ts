import { knowledgeArtifacts, knowledgeArtifactChunks } from '@/db/schema';

export type KnowledgeArtifact = typeof knowledgeArtifacts.$inferSelect;
export type NewKnowledgeArtifact = typeof knowledgeArtifacts.$inferInsert;
export type UpdateKnowledgeArtifact = Partial<NewKnowledgeArtifact>;

export type KnowledgeArtifactChunk = typeof knowledgeArtifactChunks.$inferSelect;
export type NewKnowledgeArtifactChunk = typeof knowledgeArtifactChunks.$inferInsert;
export type UpdateKnowledgeArtifactChunk = Partial<NewKnowledgeArtifactChunk>;
