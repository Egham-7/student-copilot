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
import { useState } from "react";
import { X, FileText, Loader2 } from "lucide-react";
import { convertFileSrc } from "@tauri-apps/api/core";

interface FilePreview {
  path: string;
  name: string;
  previewUrl?: string;
  content?: string;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Note title must be at least 2 characters.",
  }),
});

export function CreateNoteForm() {
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutateAsync: createNote } = useCreateNote();
  const { mutateAsync: createNoteContext } = useCreateNoteContext();
  const { toast } = useToast();

  async function handleFileSelect() {
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
      const newFiles = (filePaths as string[]).map((path) => ({
        path,
        name: path.split(/[\\/]/).pop() || "",
        previewUrl: encodeURI(convertFileSrc(path)),
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedFiles.length === 0) {
      toast({
        title: "Please select at least one PDF file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const results = await Promise.all(
        selectedFiles.map((file) =>
          invoke<string>("process_file", {
            filePath: file.path,
          }),
        ),
      );

      const noteId = await createNote({
        title: values.title,
        content: "",
      });

      if (!noteId) {
        toast({
          title: "Failed to create your note.",
          variant: "destructive",
        });
        return;
      }

      await Promise.all(
        results.map((result, index) =>
          createNoteContext({
            title: values.title,
            content: result,
            filePath: selectedFiles[index].path,
            noteId: noteId,
          }),
        ),
      );

      toast({
        title: "Note created successfully",
        description: "Your new note has been created with the selected PDFs",
      });

      setSelectedFiles([]);
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error creating note",
        description: "An error occurred while creating your note",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Note</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
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
            <div className="space-y-4">
              <Button
                type="button"
                onClick={handleFileSelect}
                disabled={isLoading}
              >
                Add PDF Files
              </Button>
              <div className="grid grid-cols-2 overflow-hidden gap-4 max-h-[400px] overflow-y-auto p-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative group border rounded-lg p-2 hover:border-primary transition-colors"
                  >
                    <div className="aspect-square relative bg-secondary rounded-md overflow-hidden">
                      <object data={file.previewUrl} type="application/pdf">
                        <div className="flex items-center justify-center h-full">
                          <FileText className="w-12 h-12 text-muted-foreground" />
                        </div>
                      </object>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm truncate max-w-[180px]">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
