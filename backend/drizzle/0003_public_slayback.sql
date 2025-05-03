ALTER TABLE "knowledge_artifacts"
ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;

ALTER TABLE "notes"
ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;

