import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { KnowledgeArtifact } from "@/types/knowledge-artifacts";
import { getFileIcon } from "@/utils/file-icons";

export function ArtifactList({
  artifacts,
}: {
  artifacts: KnowledgeArtifact[];
}) {
  if (artifacts.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-2 py-1">
      {artifacts.map((artifact) => (
        <TooltipProvider key={artifact.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-8 h-8 flex items-center justify-center rounded-full border bg-muted text-muted-foreground hover:bg-accent cursor-default">
                {getFileIcon(artifact.fileType)}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="max-w-xs text-sm font-medium">{artifact.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
