use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create_notes_and_context_tables_with_vector",
        sql: r#"
            -- Enable pgvector extension
            CREATE EXTENSION IF NOT EXISTS vector;

            -- Create notes table
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                embedding vector(1536),
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );

            -- Create note_context table
            CREATE TABLE IF NOT EXISTS note_context (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                file_path TEXT NOT NULL,
                note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
                embedding vector(1536),
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );

            -- Create index for faster lookups by note_id
            CREATE INDEX IF NOT EXISTS idx_context_note_id ON note_context(note_id);

            -- Create vector index for note_context embedding similarity search
            CREATE INDEX IF NOT EXISTS idx_context_embedding
                ON note_context
                USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100);

            -- Create vector index for notes embedding similarity search
            CREATE INDEX IF NOT EXISTS idx_notes_embedding
                ON notes
                USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100);
        "#,
        kind: MigrationKind::Up,
    }]
}

