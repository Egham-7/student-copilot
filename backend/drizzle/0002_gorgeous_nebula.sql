CREATE TABLE "knowledge_artifact_chunks" (
	"id" serial PRIMARY KEY NOT NULL,
	"artifact_id" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"index" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "knowledge_artifacts" ADD COLUMN "file_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge_artifacts" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge_artifact_chunks" ADD CONSTRAINT "knowledge_artifact_chunks_artifact_id_knowledge_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."knowledge_artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_knowledge_artifact_chunks_embedding" ON "knowledge_artifact_chunks" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "idx_knowledge_artifact_chunks_artifact_id" ON "knowledge_artifact_chunks" USING btree ("artifact_id");--> statement-breakpoint
ALTER TABLE "knowledge_artifacts" DROP COLUMN "content";