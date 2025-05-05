import KnowledgeArtifactsPage from '@/pages/knowledge-artifacts-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/artifacts/')({
  component: KnowledgeArtifactsPage,
});
