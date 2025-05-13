import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateNote } from "@/hooks/notes/use-create-note";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session";
import { ErrorState } from "@/components/error-display";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Note title must be at least 2 characters.",
  }),
});

export function CreateNoteForm() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutateAsync: createNote, isPending: isLoading } = useCreateNote();
  const {
    session,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useSupabaseSession();
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to create a note.",
        variant: "destructive",
      });
      return;
    }

    try {
      const noteId = await createNote({
        title: values.title,
        userId: session.user.id,
      });

      if (!noteId) {
        toast({
          title: "Failed to create your note.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Note created successfully",
        description: "Your new note has been created",
      });

      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error: ", error);
      toast({
        title: "Error creating note",
        description: "An error occurred while creating your note",
        variant: "destructive",
      });
    }
  }

  // Loading state for session
  if (isSessionLoading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  // Error state for session
  if (sessionError) {
    return (
      <ErrorState
        message={`Authentication error: ${sessionError.message}`}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Not logged in state
  if (!session) {
    return (
      <ErrorState
        message="You must be logged in to create a note."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Note</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Up New Note</DialogTitle>
          <DialogDescription>
            Provide a title for your new AI-assisted note.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the title of your note"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the main title of your new note.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Creating Note..." : "Create Note"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
