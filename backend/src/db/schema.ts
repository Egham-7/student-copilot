import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  vector,
  index,
  varchar,
} from "drizzle-orm/pg-core";

// Notes table
export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
    // For FTS, you can add a tsvector column, but generated columns must be handled in migrations
    fts: text("fts"), // Use text for now; set as generated in migration
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_notes_embedding").on(table.embedding)],
);

// Note context table
export const noteContext = pgTable(
  "note_context",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    filePath: text("file_path").notNull(),
    noteId: integer("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    embedding: vector("embedding", { dimensions: 1536 }),
    fts: text("fts"), // Use text for now; set as generated in migration
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_note_context_note_id").on(table.noteId)],
);
