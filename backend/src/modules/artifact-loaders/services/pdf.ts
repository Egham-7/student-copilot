import { join } from 'path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { ArtifactLoader } from '../types';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NewKnowledgeArtifactChunk } from '@/types/knowledge-artifacts';

export class PDFArtifactLoader implements ArtifactLoader {
  constructor() {}

  async loadAndChunk(artifactId: number, filePath: string): Promise<NewKnowledgeArtifactChunk[]> {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error('Failed to fetch PDF from Supabase');

    const buffer = await res.arrayBuffer();
    const tempPath = join('/tmp', `${crypto.randomUUID()}.pdf`);

    const file = Bun.file(filePath);
    file.write(new Uint8Array(buffer));

    const loader = new PDFLoader(tempPath);
    const docs = await loader.load();

    const chunks = await Promise.all(
      docs.map(async (d, i) => {
        const { embedding } = await embed({
          model: openai.embedding('text-embedding-3-small'),
          value: d.pageContent,
        });

        return {
          artifactId,
          content: d.pageContent,
          index: d.metadata?.index ?? i,
          embedding,
        };
      }),
    );

    await file.delete();

    return chunks;
  }
}
