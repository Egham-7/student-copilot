import React from "react";
import { BiBot } from "react-icons/bi";

import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Dock, DockIcon } from "../magicui/dock";
import { NoteChat } from "./note-chat";

export function NoteDock() {
  const [isAgentOpen, setAgentOpen] = React.useState(false);

  return (
    <>
      {/* Fixed Bottom Dock */}
      <div className="fixed bottom-0 left-1/2 z-50 -translate-x-1/2 pb-4">
        <TooltipProvider>
          <Dock direction="middle">
            {/* Chat Icon */}
            <DockIcon>
              <Tooltip>
                <NoteChat noteId={10} />
              </Tooltip>
            </DockIcon>

            {/* Agent Icon */}
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setAgentOpen(true)}
                    aria-label="Agent"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full bg-secondary text-secondary-foreground shadow-md hover:bg-accent hover:text-accent-foreground transition-colors",
                    )}
                  >
                    <BiBot className="size-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Agent</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            {/* Theme Toggle */}
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ModeToggle />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Theme</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          </Dock>
        </TooltipProvider>
      </div>

      {/* Agent Modal */}
      {isAgentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-card text-card-foreground p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold">Agent Modal</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This is your agent modal content.
            </p>
            <button
              onClick={() => setAgentOpen(false)}
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
