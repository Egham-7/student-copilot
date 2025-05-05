import type { KnowledgeArtifact } from '@/types/knowledge-artifacts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Download, Eye, MoreHorizontal, Trash2, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getFileIcon } from '@/utils/file-icons';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

interface ArtifactCardProps {
  artifact: KnowledgeArtifact;
}

export function ArtifactCard({ artifact }: ArtifactCardProps) {
  const fileName = artifact.filePath.split('/').pop() || artifact.title;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between  p-2 rounded-md">
          {getFileIcon(artifact.fileType)}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                <span>View</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Tooltip>
          <TooltipTrigger asChild className="w-full truncate">
            <h3 className="font-medium truncate cursor-help">
              {artifact.title}
            </h3>
          </TooltipTrigger>
          <TooltipContent side="top">{artifact.title}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild className="w-full truncate">
            <p className="text-xs text-muted-foreground truncate cursor-help">
              {fileName}
            </p>
          </TooltipTrigger>
          <TooltipContent side="top">{fileName}</TooltipContent>
        </Tooltip>
      </CardHeader>

      <CardContent className="pb-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <p
              className="text-sm text-muted-foreground line-clamp-2 cursor-help"
              title={artifact.content}
            >
              {artifact.content}
            </p>
          </TooltipTrigger>
          <TooltipContent side="bottom">{artifact.content}</TooltipContent>
        </Tooltip>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Created{' '}
          {formatDistanceToNow(new Date(artifact.createdAt), {
            addSuffix: true,
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
