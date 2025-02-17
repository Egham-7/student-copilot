use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create_notes_and_context_tables",
        sql: r#"
            -- Enable vector similarity search
            SELECT load_extension('sqlite-vss');
            
            -- Create notes table with VSS support
            CREATE VIRTUAL TABLE IF NOT EXISTS notes USING vss0(
                embedding(1536),
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            -- Create context table with VSS support
            CREATE VIRTUAL TABLE IF NOT EXISTS context USING vss0(
                embedding(1536),
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                filePath TEXT NOT NULL,
                noteId INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(note_id) REFERENCES notes(rowid)
            );

            -- Create index for faster lookups
            CREATE INDEX IF NOT EXISTS idx_context_note_id ON context(note_id);
        "#,
        kind: MigrationKind::Up,
    }]
}
