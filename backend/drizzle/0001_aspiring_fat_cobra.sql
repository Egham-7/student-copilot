CREATE TABLE "notes_to_knowledge_artifacts" (
	"note_id" integer NOT NULL,
	"artifact_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notes_to_knowledge_artifacts" ADD CONSTRAINT "notes_to_knowledge_artifacts_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes_to_knowledge_artifacts" ADD CONSTRAINT "notes_to_knowledge_artifacts_artifact_id_knowledge_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."knowledge_artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_notes_to_knowledge_artifacts_note_id" ON "notes_to_knowledge_artifacts" USING btree ("note_id");--> statement-breakpoint
CREATE INDEX "idx_notes_to_knowledge_artifacts_artifact_id" ON "notes_to_knowledge_artifacts" USING btree ("artifact_id");