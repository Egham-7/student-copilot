mod db;
use async_openai::{config::Config, types::CreateEmbeddingRequestArgs, Client};
use db::migrations;
use serde::{Deserialize, Serialize};
use std::fs::read;

#[derive(Serialize, Deserialize)]
pub struct PdfResult {
    content: String,
    embeddings: Vec<f32>,
}

pub struct PdfLoader<C: Config> {
    file_path: String,
    client: Client<C>,
}

impl<C: Config> PdfLoader<C> {
    pub fn new(file_path: String, client: Client<C>) -> Self {
        PdfLoader { file_path, client }
    }

    async fn create_embeddings(&self, content: &str) -> Result<Vec<f32>, String> {
        let request = CreateEmbeddingRequestArgs::default()
            .model("text-embedding-3-small")
            .input(content)
            .build()
            .unwrap();

        let response = self
            .client
            .embeddings()
            .create(request)
            .await
            .map_err(|e| e.to_string())?;

        Ok(response.data[0].embedding.clone())
    }

    fn extract_text(&self, bytes: Vec<u8>) -> Result<String, String> {
        pdf_extract::extract_text_from_mem(&bytes).map_err(|e| e.to_string())
    }

    fn read_file(&self) -> Result<Vec<u8>, String> {
        read(&self.file_path).map_err(|e| e.to_string())
    }

    pub async fn process(&self) -> Result<PdfResult, String> {
        let bytes = self.read_file()?;
        let content = self.extract_text(bytes)?;
        let embeddings = self.create_embeddings(&content).await?;

        Ok(PdfResult {
            content,
            embeddings,
        })
    }
}

#[tauri::command]
async fn process_file(file_path: String) -> Result<PdfResult, String> {
    let client = Client::new();
    let loader = PdfLoader::new(file_path, client);
    loader.process().await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![process_file])
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:../student_copilot.db", migrations::get_migrations())
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
