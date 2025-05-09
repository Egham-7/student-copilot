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

    const s3File = s3.file(filePath);
    const buffer = await s3File.arrayBuffer();

    const tempPath = join('/tmp', `${crypto.randomUUID()}.pdf`);
    const file = Bun.file(tempPath);
    await file.write(new Uint8Array(buffer));

    const loader = new PDFLoader(tempPath);
    const docs = await loader.load();

    const chunks = await Promise.all(
      docs.map(async d => {
        const { embedding } = await embed({
          model: openai.embedding('text-embedding-3-small'),
          value: d.pageContent,
        });


        return {
          artifactId,
          content: d.pageContent,
          index: d.metadata.loc.pageNumber,
          embedding,
        };
      })
    );

    await file.delete();

    return chunks;
  }
}
