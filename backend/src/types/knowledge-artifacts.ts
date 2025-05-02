import { knowledgeArtifacts } from '@/db/schema';

// Types for `knowledge_artifacts` table
export type KnowledgeArtifact = typeof knowledgeArtifacts.$inferSelect;
export type NewKnowledgeArtifact = typeof knowledgeArtifacts.$inferInsert;
export type UpdateKnowledgeArtifact = Partial<NewKnowledgeArtifact>;
