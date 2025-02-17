import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

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
import { useCreateNoteContext } from "@/hooks/notes/noteContext/use-create-note-context";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Note title must be at least 2 characters.",
  }),
});

export function CreateNoteForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutateAsync: createNote } = useCreateNote();

  const { mutateAsync: createNoteContext } = useCreateNoteContext();

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { title } = values;

    const filePaths = await open({
      multiple: true,
      filters: [
        {
          name: "PDF",
          extensions: ["pdf"],
        },
      ],
    });

    if (filePaths) {
      const results = await Promise.all(
        (filePaths as string[]).map((filePath: string) =>
          invoke<{ content: string; embeddings: number[] }>("process_file", {
            filePath,
          }),
        ),
      );

      // Create the main note first
      const noteId = await createNote({
        title: title,
        content: "",
        embedding: [],
      });

      if (!noteId) {
        toast({
          title: "Failed to create your note.",
        });
        return;
      }
      // Create note contexts for each processed file
      await Promise.all(
        results.map((result, index) =>
          createNoteContext({
            title: title,
            content: result.content,
            embedding: result.embeddings,
            filePath: filePaths[index],
            noteId: noteId,
          }),
        ),
      );
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Note</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Up New Note</DialogTitle>
          <DialogDescription>
            Provide a title and select PDF files for your new AI-assisted note.
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
              <Button type="submit">Select PDFs and Create Note</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
