import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  vector,
  index,
  jsonb,
} from "drizzle-orm/pg-core";

// Notes table
export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: jsonb("content"),
    embedding: vector("embedding", { dimensions: 1536 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_notes_embedding").on(table.embedding)],
);

// Knowledge Artifacts table (no noteId)
export const knowledgeArtifacts = pgTable(
  "knowledge_artifacts",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    filePath: text("file_path").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_knowledge_artifacts_embedding").on(table.embedding)],
);
