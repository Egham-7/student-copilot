mod db;
use db::migrations;
use lopdf::Document;
use serde::Serialize;
use std::fs::read;

#[derive(Serialize)]
pub struct PdfResponse {
    content: String,
    file_path: String,
    page_count: usize,
}

#[derive(Debug, thiserror::Error)]
pub enum PdfError {
    #[error("Failed to read file: {0}")]
    FileReadError(#[from] std::io::Error),
    #[error("Failed to parse PDF: {0}")]
    PdfParseError(#[from] lopdf::Error),
    #[error("Failed to extract text from PDF")]
    TextExtractionError,
}

pub struct PdfLoader {
    file_path: String,
}

impl PdfLoader {
    pub fn new(file_path: String) -> Self {
        PdfLoader { file_path }
    }

    fn extract_text(&self, bytes: Vec<u8>) -> Result<PdfResponse, PdfError> {
        let doc = Document::load_mem(&bytes)?;
        let page_count = doc.get_pages().len();
        let mut text = String::new();

        for page_num in 1..=page_count {
            let page_number: u32 = page_num.try_into().unwrap_or(1);
            match doc.extract_text(&[page_number]) {
                Ok(page_text) => {
                    text.push_str(&page_text);
                    text.push('\n');
                }
                Err(_) => return Err(PdfError::TextExtractionError),
            }
        }

        Ok(PdfResponse {
            content: text,
            file_path: self.file_path.clone(),
            page_count,
        })
    }

    fn read_file(&self) -> Result<Vec<u8>, PdfError> {
        read(&self.file_path).map_err(PdfError::FileReadError)
    }

    pub async fn process(&self) -> Result<PdfResponse, PdfError> {
        let bytes = self.read_file()?;
        self.extract_text(bytes)
    }
}

#[tauri::command]
async fn process_file(file_path: String) -> Result<PdfResponse, String> {
    let loader = PdfLoader::new(file_path);
    loader.process().await.map_err(|e| e.to_string())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:student_copilot.db", migrations::get_migrations())
                .build(),
        )
        .invoke_handler(tauri::generate_handler![process_file])
        .run(tauri::generate_context!())
        .unwrap()
}

