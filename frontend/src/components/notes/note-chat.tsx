import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
  FiUser,
  FiSearch,
  FiSend,
  FiMessageCircle,
  FiMove,
  FiLock,
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import { Markdown } from "../markdown";
import { NOTES_BASE } from "@/services/notes";

const formSchema = z.object({
  message: z.string().min(1, { message: "Type a message." }),
});

type FormSchema = z.infer<typeof formSchema>;

export function NoteChat({ noteId }: { noteId: number }) {
  const [isDraggable, setIsDraggable] = useState(true);
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
    <Popover>
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
          <Card className="relative w-full rounded-2xl shadow-lg border border-border bg-card/90 flex flex-col h-[min(450px,70vh)]">
            <CardHeader className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <FiSearch className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg font-semibold">
                  Note Chat
                </CardTitle>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsDraggable((prev) => !prev)}
                aria-label={isDraggable ? "Lock position" : "Unlock position"}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
                title={isDraggable ? "Lock position" : "Enable dragging"}
              >
                {isDraggable ? (
                  <FiLock className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <FiMove className="w-5 h-5 text-muted-foreground" />
                )}
              </Button>
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
                      <h3 className="text-lg font-medium">
                        Chat with your note
                      </h3>
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
                                  <Badge
                                    variant="outline"
                                    className="font-medium"
                                  >
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

                            if (part.type === "tool-invocation") {
                              const toolInvocation = part.toolInvocation;
                              return (
                                <div
                                  key={j}
                                  className="text-sm italic space-y-2 border-l-2 border-muted pl-3 my-2 py-1"
                                >
                                  {toolInvocation.state === "partial-call" && (
                                    <div className="text-yellow-500 flex items-center gap-1.5">
                                      <span className="w-4 h-4 rounded-full bg-yellow-500/20 flex-shrink-0 flex items-center justify-center">
                                        🔄
                                      </span>
                                      <span>
                                        <strong>Preparing Tool:</strong>{" "}
                                        {toolInvocation.toolName}
                                      </span>
                                    </div>
                                  )}

                                  {toolInvocation.state === "call" && (
                                    <div className="text-blue-500 flex items-center gap-1.5">
                                      <span className="w-4 h-4 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center">
                                        🛠
                                      </span>
                                      <span>
                                        <strong>Tool Call:</strong>{" "}
                                        {toolInvocation.toolName}
                                      </span>
                                    </div>
                                  )}

                                  {toolInvocation.state === "result" && (
                                    <div className="text-green-500 space-y-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <span className=" w-4 h-4 rounded-full bg-green-500/20 flex-shrink-0 flex items-center justify-center">
                                          ✅
                                        </span>
                                        <span>
                                          <strong>Finished executing:</strong>{" "}
                                          {toolInvocation.toolName}
                                        </span>
                                      </div>

                                      {toolInvocation.result && (
                                        <div className="text-xs mt-1 pl-6">
                                          <strong>Result:</strong>{" "}
                                          <code className="bg-muted/50 px-1.5 py-0.5 rounded whitespace-pre-wrap block mt-1 p-2 max-h-[150px] overflow-auto">
                                            {typeof toolInvocation.result ===
                                            "object"
                                              ? JSON.stringify(
                                                  toolInvocation.result,
                                                  null,
                                                  2,
                                                )
                                              : String(toolInvocation.result)}
                                          </code>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            if (part.type === "source") {
                              return (
                                <div
                                  key={j}
                                  className="text-sm italic text-muted-foreground flex items-center gap-1.5 mt-2"
                                >
                                  <span className=" w-4 h-4 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                                    🔗
                                  </span>
                                  <span>
                                    Source:{" "}
                                    <a
                                      href={part.source.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline text-primary hover:text-primary/80 transition-colors"
                                    >
                                      {part.source.title}
                                    </a>
                                  </span>
                                </div>
                              );
                            }

                            if (part.type === "file") {
                              return (
                                <div
                                  key={j}
                                  className="text-sm italic text-muted-foreground flex items-center gap-1.5 mt-2"
                                >
                                  <span className=" w-4 h-4 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                                    📎
                                  </span>
                                  <span>
                                    File:{" "}
                                    <a
                                      href={part.data}
                                      download
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline text-primary hover:text-primary/80 transition-colors"
                                    >
                                      Download ({part.mimeType})
                                    </a>
                                  </span>
                                </div>
                              );
                            }

                            if (part.type === "step-start") {
                              return (
                                <div
                                  key={j}
                                  className="text-xs italic text-accent-foreground bg-accent/10 px-2 py-1 rounded"
                                >
                                  🪄 <strong>Step started:</strong> Preparing
                                  the next action...
                                </div>
                              );
                            }

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
                          ></span>
                          <span
                            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></span>
                          <span
                            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="border-t border-border rounded-b-2xl px-4 py-3 bg-popover/80">
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
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
