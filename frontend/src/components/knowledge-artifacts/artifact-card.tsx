import type { KnowledgeArtifact } from '@/types/knowledge-artifacts';
import { Badge } from '@/components/ui/badge';
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

interface ArtifactCardProps {
  artifact: KnowledgeArtifact;
}

export function ArtifactCard({ artifact }: ArtifactCardProps) {
  const fileName = artifact.filePath.split('/').pop() || artifact.title;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-muted p-2 rounded-md">
              {getFileIcon(artifact.fileType)}
            </div>
            <div className="truncate">
              <h3 className="font-medium truncate" title={artifact.title}>
                {artifact.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {fileName} • {artifact.fileType.toUpperCase()}
              </p>
            </div>
          </div>
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
      </CardHeader>
      <CardContent className="pb-2">
        <p
          className="text-sm text-muted-foreground line-clamp-2"
          title={artifact.content}
        >
          {artifact.content}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Created{' '}
          {formatDistanceToNow(new Date(artifact.createdAt), {
            addSuffix: true,
          })}
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            ID: {artifact.id}
          </Badge>
          <Badge variant="outline" className="text-xs ml-2">
            User: {artifact.userId.substring(0, 8)}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
