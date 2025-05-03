import {
  AiOutlineFilePdf,
  AiOutlineFileImage,
  AiOutlineFileWord,
  AiOutlineFileExcel,
  AiOutlineFileText,
  AiOutlineFile,
} from 'react-icons/ai';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { KnowledgeArtifact } from '@/types/knowledge-artifacts';

function getFileIcon(type: string) {
  if (type.includes('pdf'))
    return <AiOutlineFilePdf className="w-4 h-4 text-red-500" />;
  if (type.includes('image'))
    return <AiOutlineFileImage className="w-4 h-4 text-blue-400" />;
  if (type.includes('word'))
    return <AiOutlineFileWord className="w-4 h-4 text-blue-600" />;
  if (type.includes('excel'))
    return <AiOutlineFileExcel className="w-4 h-4 text-green-600" />;
  if (type.includes('text'))
    return <AiOutlineFileText className="w-4 h-4 text-gray-500" />;
  return <AiOutlineFile className="w-4 h-4 text-muted-foreground" />;
}

export function ArtifactList({
  artifacts,
}: {
  artifacts: KnowledgeArtifact[];
}) {
  if (artifacts.length === 0) return null;

  return (
    <div className="w-full px-4 py-2 border-b border-border bg-muted/20">
      <div className="text-xs font-medium mb-2 text-muted-foreground">
        Knowledge Artifacts
      </div>
      <div className="flex flex-wrap gap-2">
        {artifacts.map((artifact) => (
          <TooltipProvider key={artifact.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="group flex items-center gap-2 px-3 py-2 rounded-md border bg-card text-card-foreground text-sm max-w-[180px] truncate cursor-default hover:bg-accent">
                  {getFileIcon(artifact.fileType)}
                  <span className="truncate">{artifact.title}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs">{artifact.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
