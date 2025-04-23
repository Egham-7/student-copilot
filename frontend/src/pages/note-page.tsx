import { useCallback, useEffect } from "react";
import { SaveIcon, FileIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { useParams } from "@tanstack/react-router";
import { useNote } from "@/hooks/notes/use-note";
import { useUpdateNote } from "@/hooks/notes/use-update-note";
import { SkeletonItem } from "@/components/skeleton-item";
import { ErrorState } from "@/components/error-display";
import { useHotkeys, useDebouncedCallback } from "@mantine/hooks";
import { useToast } from "@/hooks/use-toast";
import { BlockNoteView } from "@blocknote/mantine";

export default function NotePage() {
  const { noteId } = useParams({ from: "/_notes/$noteId/" });
  const { data: note, isLoading, isError, refetch } = useNote(Number(noteId));
  const { mutateAsync: updateNote, isPending: isSaving } = useUpdateNote();
  const { toast } = useToast();

  const editor = useCreateBlockNote({
    domAttributes: {
      editor: {
        "data-unsaved": "true",
      },
    },
  });

  useEffect(() => {
    if (note?.content && editor) {
      const parsedContent = JSON.parse(note.content);
      editor.replaceBlocks(editor.document, parsedContent);
    }
  }, [note?.content, editor]);

  const saveNote = useCallback(async () => {
    if (!editor || !note) return;

    try {
      await updateNote({
        id: note.id,
        title: note.title,
        content: JSON.stringify(editor.document),
      });

      toast({
        title: "Saved successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to save",
        variant: "destructive",
      });
    }
  }, [editor, note, updateNote, toast]);

  const debouncedSave = useDebouncedCallback(saveNote, 1000);

  useHotkeys([
    [
      "mod+S",
      (e) => {
        e.preventDefault();
        saveNote();
      },
    ],
  ]);

  if (isLoading) return <SkeletonItem count={5} />;
  if (isError)
    return (
      <ErrorState message="Failed to load note" onRetry={() => refetch()} />
    );

  const hasUnsavedChanges =
    editor.document !== JSON.parse(note?.content || "[]");

  return (
    <Card className="border-none shadow-none p-0 rounded-none">
      <CardHeader className="space-y-4 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileIcon className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">
              {note?.title}
            </h1>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-muted-foreground"
            onClick={saveNote}
            disabled={!hasUnsavedChanges}
          >
            <SaveIcon
              className={`h-4 w-4 mr-2 ${isSaving ? "animate-spin" : ""}`}
            />
            {isSaving
              ? "Saving..."
              : hasUnsavedChanges
                ? "Save changes"
                : "Saved"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <BlockNoteView
          editor={editor}
          theme="light"
          onChange={debouncedSave}
          className="min-h-[calc(100vh-12rem)] rounded-lg border border-border bg-card p-4"
        />
      </CardContent>
    </Card>
  );
}
