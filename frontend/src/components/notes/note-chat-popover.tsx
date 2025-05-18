import { useState } from "react";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FiMessageCircle } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { NoteChat } from "./note-chat/note-chat";

interface NoteChatPopoverProps {
  noteId: number;
  isDocked?: boolean;
  onDock?: () => void;
}

export function NoteChatPopover({
  noteId,
  isDocked,
  onDock,
}: NoteChatPopoverProps) {
  const [isDraggable, setIsDraggable] = useState(!isDocked);
  const [open, setIsOpen] = useState(false);

  const handleDock = () => {
    onDock?.();
    setIsOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Open chat"
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <FiMessageCircle className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={8}
        align="center"
        className="p-0 border-none bg-transparent shadow-none min-w-[450px] max-w-xl w-full"
      >
        <motion.div
          {...(isDraggable ? { drag: true, dragElastic: 0.2 } : {})}
          dragConstraints={{
            top: -1000,
            bottom: 1000,
            left: -1000,
            right: 1000,
          }}
          className={cn(
            "relative",
            isDraggable &&
              'cursor-move before:content-[""] before:absolute before:inset-0 before:bg-primary/5 before:rounded-2xl before:pointer-events-none',
          )}
        >
          <NoteChat
            noteId={noteId}
            isDocked={false}
            isDraggable={isDraggable}
            onDock={handleDock}
            onDraggableChange={setIsDraggable}
          />
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
