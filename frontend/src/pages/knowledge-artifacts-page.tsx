import { KnowledgeArtifactsManager } from '@/components/knowledge-artifacts/knowledge-artifacts-manager';

export default function KnowledgeArtifactsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Knowledge Artifacts</h1>
      <KnowledgeArtifactsManager />
    </main>
  );
}
