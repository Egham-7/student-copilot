import { join } from 'path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { ArtifactLoader } from '../types';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NewKnowledgeArtifactChunk } from '@/types/knowledge-artifacts';
import { s3 } from '@/db/s3';

export class PDFArtifactLoader implements ArtifactLoader {
  constructor() {}

  async loadAndChunk(artifactId: number, filePath: string): Promise<NewKnowledgeArtifactChunk[]> {
    console.log(`[PDFArtifactLoader] Start loading file: ${filePath}`);

    const s3File = s3.file(filePath);
    const buffer = await s3File.arrayBuffer();
    console.log(`[PDFArtifactLoader] Fetched file from S3 (size: ${buffer.byteLength} bytes)`);

    const tempPath = join('/tmp', `${crypto.randomUUID()}.pdf`);
    const file = Bun.file(tempPath);
    await file.write(new Uint8Array(buffer));
    console.log(`[PDFArtifactLoader] Written to temp file: ${tempPath}`);

    const loader = new PDFLoader(tempPath);
    const docs = await loader.load();
    console.log(`[PDFArtifactLoader] Loaded ${docs.length} document(s) from PDF`);

    const chunks = await Promise.all(
      docs.map(async (d, index) => {
        const { embedding } = await embed({
          model: openai.embedding('text-embedding-3-small'),
          value: d.pageContent,
        });

        console.log(`[PDFArtifactLoader] Embedded chunk ${index + 1}/${docs.length}`);

        return {
          artifactId,
          content: d.pageContent,
          index: d.metadata.loc.pageNumber,
          embedding,
        };
      })
    );

    await file.delete();
    console.log(`[PDFArtifactLoader] Temp file deleted: ${tempPath}`);
    console.log(`[PDFArtifactLoader] Finished processing ${chunks.length} chunks.`);

    return chunks;
  }
}

