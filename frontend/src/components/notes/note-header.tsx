'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MoreHorizontal, MessageCircle, Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { SidebarTrigger } from '../ui/sidebar';
import { AddArtifactDialog } from './note-header/add-artifact-dialog';

interface NoteHeaderProps {
  title: string;
  lastEdited: Date;
}

export function NoteHeader({ title, lastEdited }: NoteHeaderProps) {
  const timeAgo = formatDistanceToNow(lastEdited, { addSuffix: true });
  const fullDate = format(lastEdited, 'PPpp');

  return (
    <div className="w-full flex items-center justify-between px-4 py-2 border-b bg-background text-foreground border-border">
      <div className="text-sm font-medium flex items-center gap-x-2">
        <SidebarTrigger />
        <span>{title}</span>
      </div>

      <div className="flex items-center space-x-4 text-muted-foreground text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-default">
                <Clock className="w-4 h-4" />
                <span>Edited {timeAgo}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{fullDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AddArtifactDialog />

        <Button variant="ghost" size="icon" className="hover:text-foreground">
          <MessageCircle className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:text-foreground">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
