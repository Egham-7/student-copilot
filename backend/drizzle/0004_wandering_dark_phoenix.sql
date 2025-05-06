ALTER TABLE "knowledge_artifacts" ALTER COLUMN "embedding" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "content" SET DATA TYPE text;