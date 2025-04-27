import { db } from "@/db";
import { knowledgeArtifacts } from "@/db/schema";
import { eq } from "drizzle-orm";

export class KnowledgeArtifactsRepository {
  async findAll() {
    return db.select().from(knowledgeArtifacts);
  }
  async findById(id: number) {
    return db
      .select()
      .from(knowledgeArtifacts)
      .where(eq(knowledgeArtifacts.id, id));
  }
  async create(data: any) {
    return db.insert(knowledgeArtifacts).values(data).returning();
  }
  async update(id: number, data: any) {
    return db
      .update(knowledgeArtifacts)
      .set(data)
      .where(eq(knowledgeArtifacts.id, id))
      .returning();
  }
  async delete(id: number) {
    return db
      .delete(knowledgeArtifacts)
      .where(eq(knowledgeArtifacts.id, id))
      .returning();
  }
}
