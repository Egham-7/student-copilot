import type { KnowledgeArtifact } from '@/types/knowledge-artifacts';
import { ArtifactCard } from './artifact-card';
import { ArtifactTable } from './artifact-table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ArtifactListProps {
  artifacts: KnowledgeArtifact[];
  isLoading: boolean;
  error?: string;
  viewMode: 'grid' | 'table';
}

export function ArtifactGrid({
  artifacts,
  isLoading,
  error,
  viewMode,
}: ArtifactListProps) {
  if (isLoading) {
    return (
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : ''
        }
      >
        {viewMode === 'grid' ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (artifacts.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <h3 className="font-medium text-lg mb-2">No artifacts found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return viewMode === 'grid' ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {artifacts.map((artifact) => (
        <ArtifactCard key={artifact.id} artifact={artifact} />
      ))}
    </div>
  ) : (
    <ArtifactTable artifacts={artifacts} />
  );
}
