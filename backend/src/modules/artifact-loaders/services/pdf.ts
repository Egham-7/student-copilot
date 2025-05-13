import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ArtifactLoader } from "../types";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { NewKnowledgeArtifactChunk } from "@/types/knowledge-artifacts";
import { s3 } from "@/db/s3";

export class PDFArtifactLoader implements ArtifactLoader {
  private readonly batchSize: number;
  private readonly nullCharRegex: RegExp;

  constructor(options?: { batchSize?: number }) {
    this.batchSize = options?.batchSize ?? 15; // Default to 15 if not provided
    this.nullCharRegex = new RegExp(String.fromCharCode(0), "g");
  }

  async loadAndChunk(
    artifactId: number,
    filePath: string,
  ): Promise<NewKnowledgeArtifactChunk[]> {
    const s3File = s3.file(filePath);
    const buffer = await s3File.arrayBuffer();

    const blob = new Blob([buffer], { type: "application/pdf" });
    const loader = new PDFLoader(blob);
    const docs = await loader.load();

    const chunks: NewKnowledgeArtifactChunk[] = [];

    for (let i = 0; i < docs.length; i += this.batchSize) {
      const batch = docs.slice(i, i + this.batchSize);

      // Process this batch
      const batchResults = await Promise.all(
        batch.map(async (d) => {
          const sanitizedContent = d.pageContent.replace(
            this.nullCharRegex,
            "",
          );

          const { embedding } = await embed({
            model: openai.embedding("text-embedding-3-small"),
            value: sanitizedContent,
          });

          return {
            artifactId,
            content: sanitizedContent,
            index: d.metadata.loc.pageNumber,
            embedding,
          };
        }),
      );

      // Append batch results to our chunks array
      chunks.push(...batchResults);
    }

    return chunks;
  }
}
