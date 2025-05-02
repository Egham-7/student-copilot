'use client';

import { useRef, useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FiUser, FiSearch, FiSend, FiMessageCircle } from 'react-icons/fi';
import { LuSparkles } from 'react-icons/lu';

const formSchema = z.object({
  message: z.string().min(1, { message: 'Type a message.' }),
});

type FormSchema = z.infer<typeof formSchema>;

const initialMessages = [
  {
    role: 'user',
    content: 'What is Reverse UI?',
  },
  {
    role: 'assistant',
    content:
      'Reverse UI is a reverse-engineered UI library that enables you to effortlessly integrate trending animated components to your projects, with all the styling and animations handled for you.',
  },
];

export function NoteChat() {
  const [messages, setMessages] = useState(initialMessages);

  // React Hook Form setup
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' },
  });

  function onSubmit(values: FormSchema) {
    setMessages((msgs) => [
      ...msgs,
      { role: 'user', content: values.message },
      {
        role: 'assistant',
        content: 'This is a placeholder response from Reverse UI assistant.',
      },
    ]);
    form.reset();
  }

  // For auto-scroll to bottom
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 z-50 shadow-lg"
          aria-label="Open chat"
        >
          <FiMessageCircle className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'p-0 border-none bg-transparent w-full shadow-none max-w-full',
          ' left-1/2! top-3/4! -translate-x-1/3!  z-60',
        )}
        sideOffset={0}
        align="center"
      >
        <Card className="relative w-full rounded-2xl max-w-xl shadow-lg border border-border bg-card/90 flex flex-col h-[400px]">
          <CardHeader className="flex flex-row items-center gap-3 border-b border-border px-8 py-6">
            <FiSearch className="w-6 h-6 text-muted-foreground" />
            <CardTitle className="text-xl font-semibold">Note Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 px-8 py-6 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div
                    key={i}
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
                        'rounded-xl px-4 py-3 max-w-[80%] text-base',
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {msg.content}
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
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex items-center gap-2"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          className="bg-transparent outline-hidden text-base placeholder:text-muted-foreground"
                          placeholder="Write something..."
                          autoComplete="off"
                          {...field}
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
                  disabled={form.formState.isSubmitting}
                  className={cn(
                    'text-muted-foreground hover:text-primary transition-colors',
                    (!form.watch('message') || form.formState.isSubmitting) &&
                      'opacity-50 pointer-events-none',
                  )}
                >
                  <FiSend className="w-6 h-6" />
                </Button>
              </form>
            </Form>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
