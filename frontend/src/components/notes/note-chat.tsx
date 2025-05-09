
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useChat } from '@ai-sdk/react';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  FiUser,
  FiSearch,
  FiSend,
  FiMessageCircle,
  FiMove,
  FiLock,
} from 'react-icons/fi';
import { LuSparkles } from 'react-icons/lu';
import { Markdown } from '../markdown';
import { NOTES_BASE } from '@/services/notes';

const formSchema = z.object({
  message: z.string().min(1, { message: 'Type a message.' }),
});

type FormSchema = z.infer<typeof formSchema>;

export function NoteChat({ noteId }: { noteId: number }) {
  const [isDraggable, setIsDraggable] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: `${NOTES_BASE}/${noteId}/chat`,
    maxSteps: 3
  });
  const isLoading = status !== 'ready' && status !== 'error';

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open chat">
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
          className={cn(isDraggable && 'cursor-move')}
        >
          <Card className="relative w-full rounded-2xl shadow-lg border border-border bg-card/90 flex flex-col h-[450px]">
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
                aria-label={isDraggable ? 'Lock position' : 'Unlock position'}
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
                <div className="space-y-6">
                    {messages.map((msg, i) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex items-start gap-3',
                          msg.role === 'user' ? 'justify-end' : 'justify-start',
                        )}
                      >
                        {msg.role === 'assistant' && (
                          <LuSparkles className="w-5 h-5 text-primary mt-1" />
                        )}
                        <div
                          className={cn(
                            'rounded-xl px-4 py-3 max-w-[80%] text-base space-y-3',
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          {msg.parts ? (
                            msg.parts?.map((part, j) => {
                              if (part.type === 'text') {
                                return (
                                  <Markdown
                                    key={j}
                                    content={part.text}
                                    id={`msg-${i}-${j}`}
                                  />
                                );
                              }

                              if (part.type === 'reasoning') {
                                return (
                                  <div key={j}>
                                    <Badge variant="outline">💡 Reasoning</Badge>
                                    <p className="text-sm mt-1">{part.reasoning}</p>
                                    <ul className="text-xs text-muted-foreground list-disc pl-5 mt-1 space-y-1">
                                      {part.details.map((detail, k) => (
                                        <li key={k}>
                                          {detail.type === 'text'
                                            ? detail.text
                                            : '[REDACTED]'}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              }

                              if (part.type === 'tool-invocation') {
                                return (
                                  <div
                                    key={j}
                                    className="text-sm italic text-muted-foreground"
                                  >
                                    🛠 <strong>Calling:</strong>{' '}
                                    {part.toolInvocation.toolName}
                                  </div>
                                );
                              }

                              if (part.type === 'source') {
                                return (
                                  <div
                                    key={j}
                                    className="text-sm italic text-muted-foreground"
                                  >
                                    🔗 Source:{' '}
                                    <a
                                      href={part.source.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline text-primary hover:text-primary/80"
                                    >
                                      {part.source.title}
                                    </a>
                                  </div>
                                );
                              }

                              if (part.type === 'file') {
                                return (
                                  <div
                                    key={j}
                                    className="text-sm italic text-muted-foreground"
                                  >
                                    📎 File:{' '}
                                    <a
                                      href={part.data}
                                      download
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline text-primary hover:text-primary/80"
                                    >
                                      Download ({part.mimeType})
                                    </a>
                                  </div>
                                );
                              }

                              if (part.type === 'step-start') {
                                return (
                                  <div
                                    key={j}
                                    className="text-xs italic text-accent-foreground"
                                  >
                                    🪄 <strong>Step started:</strong> Preparing the
                                    next action...
                                  </div>
                                );
                              }

                              return null;
                            })
                          ) : (
                            <Markdown
                              content={msg.content}
                              id={`msg-${i}`}
                            />
                          )}
                        </div>
                        {msg.role === 'user' && (
                          <FiUser className="w-5 h-5 text-muted-foreground mt-1" />
                        )}
                      </div>
                    ))}

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
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Write something..."
                            autoComplete="off"
                            className="bg-transparent outline-none text-base placeholder:text-muted-foreground"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    disabled={isLoading}
                    className={cn(
                      'text-muted-foreground hover:text-primary transition-colors',
                      (!input.trim() || isLoading) &&
                        'opacity-50 pointer-events-none',
                    )}
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
