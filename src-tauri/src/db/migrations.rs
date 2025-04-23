use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "hybrid_search_notes_and_context",
        sql: r#"
            CREATE EXTENSION IF NOT EXISTS vector;
            CREATE EXTENSION IF NOT EXISTS pg_trgm;

            -- Notes table
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                embedding vector(1536),
                fts tsvector GENERATED ALWAYS AS (
                    setweight(to_tsvector('english', title), 'A') ||
                    setweight(to_tsvector('english', content), 'B')
                ) STORED,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );

            -- Note context table
            CREATE TABLE IF NOT EXISTS note_context (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                file_path TEXT NOT NULL,
                note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
                embedding vector(1536),
                fts tsvector GENERATED ALWAYS AS (
                    setweight(to_tsvector('english', title), 'A') ||
                    setweight(to_tsvector('english', content), 'B')
                ) STORED,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );

            -- Indexes
            CREATE INDEX IF NOT EXISTS idx_note_context_note_id ON note_context(note_id);
            CREATE INDEX IF NOT EXISTS idx_notes_embedding ON notes USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
            CREATE INDEX IF NOT EXISTS idx_note_context_embedding ON note_context USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
            CREATE INDEX IF NOT EXISTS idx_notes_fts ON notes USING GIN (fts);
            CREATE INDEX IF NOT EXISTS idx_note_context_fts ON note_context USING GIN (fts);
        "#,
        kind: MigrationKind::Up,
    }]
}
