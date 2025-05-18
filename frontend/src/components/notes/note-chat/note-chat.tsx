import { useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChat } from "@ai-sdk/react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  FiMaximize2,
  FiMinimize2,
  FiUser,
  FiSearch,
  FiSend,
  FiMove,
  FiLock,
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import { Markdown } from "@/components/markdown";
import { NOTES_BASE } from "@/services/notes";

const formSchema = z.object({
  message: z.string().min(1, { message: "Type a message." }),
});

type FormSchema = z.infer<typeof formSchema>;

interface ChatContentProps {
  noteId: number;
  isDocked?: boolean;
  isDraggable?: boolean;
  onDock?: () => void;
  onUndock?: () => void;
  onDraggableChange?: (isDraggable: boolean) => void;
}

export function NoteChat({
  noteId,
  isDocked,
  isDraggable,
  onDock,
  onUndock,
  onDraggableChange,
}: ChatContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: `${NOTES_BASE}/${noteId}/chat`,
    maxSteps: 3,
  });
  const isLoading = status !== "ready" && status !== "error";

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Format timestamp
  const formatTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      className={cn(
        "relative w-full rounded-2xl shadow-lg border border-border bg-card/90 flex flex-col",
        isDocked
          ? "h-full rounded-none border-0 shadow-none bg-transparent"
          : "h-[min(450px,70vh)]",
      )}
    >
      <CardHeader className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <FiSearch className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold">Note Chat</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {isDocked ? (
            <Button
              size="icon"
              variant="ghost"
              onClick={onUndock}
              aria-label="Undock chat"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              title="Undock chat"
            >
              <FiMinimize2 className="w-5 h-5 text-muted-foreground" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={onDock}
              aria-label="Dock chat"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              title="Dock chat"
            >
              <FiMaximize2 className="w-5 h-5 text-muted-foreground" />
            </Button>
          )}
          {!isDocked && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDraggableChange?.(!isDraggable)}
              aria-label={isDraggable ? "Lock position" : "Enable dragging"}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              title={isDraggable ? "Lock position" : "Enable dragging"}
            >
              {isDraggable ? (
                <FiLock className="w-5 h-5 text-muted-foreground" />
              ) : (
                <FiMove className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-6 py-4 overflow-hidden">
        <ScrollArea className="h-full">
          <div
            className="space-y-6"
            role="log"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <LuSparkles className="w-10 h-10 text-primary/50 mb-2" />
                <h3 className="text-lg font-medium">Chat with your note</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Ask questions about this note or request summaries and
                  insights.
                </p>
                <div className="mt-4 text-xs text-muted-foreground/70">
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">
                    /
                  </kbd>{" "}
                  to focus
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {msg.role === "assistant" && (
                  <LuSparkles className="w-5 h-5 text-primary mt-1" />
                )}
                <div
                  className={cn(
                    "rounded-xl px-4 py-3 max-w-[80%] text-base space-y-3",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground border border-border/30",
                  )}
                >
                  {msg.parts ? (
                    msg.parts?.map((part, j) => {
                      if (part.type === "text") {
                        return (
                          <Markdown
                            key={j}
                            content={part.text}
                            id={`msg-${i}-${j}`}
                          />
                        );
                      }

                      if (part.type === "reasoning") {
                        return (
                          <div key={j} className="space-y-2">
                            <Badge variant="outline" className="font-medium">
                              💡 Reasoning
                            </Badge>
                            <p className="text-sm mt-1 leading-relaxed">
                              {part.reasoning}
                            </p>
                            <ul className="text-xs text-muted-foreground list-disc pl-5 mt-1 space-y-1.5">
                              {part.details.map((detail, k) => (
                                <li key={k} className="leading-relaxed">
                                  {detail.type === "text"
                                    ? detail.text
                                    : "[REDACTED]"}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }

                      // ... rest of the message type handlers remain the same
                      return null;
                    })
                  ) : (
                    <Markdown content={msg.content} id={`msg-${i}`} />
                  )}

                  <div className="text-[10px] text-muted-foreground/70 mt-1 text-right">
                    {formatTime()}
                  </div>
                </div>
                {msg.role === "user" && (
                  <FiUser className="w-5 h-5 text-muted-foreground mt-1" />
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <LuSparkles className="w-5 h-5 text-primary mt-1" />
                <div className="rounded-xl px-4 py-3 bg-muted text-muted-foreground border border-border/30">
                  <div className="flex gap-1.5 h-6 items-center">
                    <span
                      className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t border-border px-4 py-3 bg-popover/80">
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="w-full flex items-center gap-2"
          >
            <FormField
              control={form.control}
              name="message"
              render={() => (
                <FormItem className="flex-1 relative">
                  <FormControl>
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Write something... (/ to focus)"
                      autoComplete="off"
                      className="bg-transparent outline-none text-base placeholder:text-muted-foreground focus-within:ring-1 focus-within:ring-primary/30 transition-all pr-10"
                    />
                  </FormControl>
                  <FormMessage />
                  {input.trim() && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">
                      Ctrl+Enter
                    </div>
                  )}
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              disabled={isLoading}
              className={cn(
                "text-muted-foreground hover:text-primary hover:bg-primary/10 active:scale-95 transition-all",
                (!input.trim() || isLoading) &&
                  "opacity-50 pointer-events-none",
              )}
              aria-label="Send message"
            >
              <FiSend className="w-6 h-6" />
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
