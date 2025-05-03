import {
  pgTable,
  serial,
  text,
  timestamp,
  vector,
  index,
  jsonb,
  integer,
} from 'drizzle-orm/pg-core';

export const notes = pgTable(
  'notes',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: jsonb('content'),
    embedding: vector('embedding', { dimensions: 1536 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => [index('idx_notes_embedding').using('hnsw', table.embedding.op('vector_cosine_ops'))],
);

export const knowledgeArtifacts = pgTable(
  'knowledge_artifacts',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    filePath: text('file_path').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    fileType: text('file_type').notNull(),
  },
  table => [
    index('idx_knowledge_artifacts_embedding').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
);

export const knowledgeArtifactChunks = pgTable(
  'knowledge_artifact_chunks',
  {
    id: serial('id').primaryKey(),
    artifactId: integer('artifact_id')
      .notNull()
      .references(() => knowledgeArtifacts.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    index: integer('index').notNull(), // to keep chunks ordered
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => [
    index('idx_knowledge_artifact_chunks_embedding').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
    index('idx_knowledge_artifact_chunks_artifact_id').on(table.artifactId),
  ],
);

export const notesToKnowledgeArtifacts = pgTable(
  'notes_to_knowledge_artifacts',
  {
    noteId: integer('note_id')
      .notNull()
      .references(() => notes.id, { onDelete: 'cascade' }),
    artifactId: integer('artifact_id')
      .notNull()
      .references(() => knowledgeArtifacts.id, { onDelete: 'cascade' }),
  },
  table => [
    index('idx_notes_to_knowledge_artifacts_note_id').on(table.noteId),
    index('idx_notes_to_knowledge_artifacts_artifact_id').on(table.artifactId),
  ],
);
