import Database from "@tauri-apps/plugin-sql";

export const db = await Database.load(import.meta.env.VITE_DATABASE_URL);
