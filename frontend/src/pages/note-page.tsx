import { useCallback, useEffect, useRef, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView, Theme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  DefaultReactSuggestionItem,
} from "@blocknote/react";
import { filterSuggestionItems, BlockNoteEditor } from "@blocknote/core";
import { ImMagicWand } from "react-icons/im";
import { useParams } from "@tanstack/react-router";
import { useNote } from "@/hooks/notes/use-note";
import { useUpdateNote } from "@/hooks/notes/use-update-note";
import { SkeletonItem } from "@/components/skeleton-item";
import { ErrorState } from "@/components/error-display";
import { useHotkeys } from "@mantine/hooks";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session";
import { NoteHeader } from "@/components/notes/note-header";
import { debounce } from "lodash";
import { DebouncedFunc } from "lodash";
import { useGenerateAutoComplete } from "@/hooks/notes/use-generate-auto-complete";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { NoteChat } from "@/components/notes/note-chat/note-chat";
import { NoteDock } from "@/components/notes/notes-dock";
import { useTheme } from "@/hooks/use-theme";
import { blockNoteTheme } from "@/lib/blocknote/theme";

export default function NotePage() {
  const { noteId } = useParams({ from: "/_app/notes/$noteId/" });
  const [isChatDocked, setIsChatDocked] = useState(false);

  const { theme } = useTheme();

  const {
    data: note,
    isLoading: isNoteLoading,
    isError: isNoteError,
    refetch,
    error: noteError,
  } = useNote(Number(noteId));

  const { mutateAsync: updateNote } = useUpdateNote(Number(noteId));
  const { toast } = useToast();

  const {
    session,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useSupabaseSession();

  const { mutateAsync: generateAutoComplete } = useGenerateAutoComplete();

  const noteEditor = useCreateBlockNote();

  // Auto-save handler (debounced)
  const debouncedSaveRef =
    useRef<DebouncedFunc<() => void | undefined>>(undefined);

  const saveNote = useCallback(async () => {
    if (!noteEditor || !note || !session) return;

    const markdown = await noteEditor.blocksToHTMLLossy(noteEditor.document);

    await updateNote({
      title: note.title,
      content: markdown,
      userId: session.user.id,
    });
  }, [noteEditor, note, session, updateNote]);

  // Debounce setup
  useEffect(() => {
    debouncedSaveRef.current = debounce(() => {
      saveNote();
    }, 1000); // 1 second debounce
    return () => {
      debouncedSaveRef.current?.cancel();
    };
  }, [saveNote]);

  // Attach autosave on editor change
  useEffect(() => {
    if (!noteEditor) return;
    return noteEditor.onChange(() => {
      debouncedSaveRef.current?.();
    });
  }, [noteEditor]);

  useEffect(() => {
    const parseAndReplaceBlocks = async () => {
      const blocks = await noteEditor.tryParseHTMLToBlocks(note?.content ?? "");
      noteEditor.replaceBlocks(noteEditor.document, blocks);
    };

    parseAndReplaceBlocks();
  }, [note?.content, noteEditor]);

  // Manual save hotkey
  useHotkeys([
    [
      "mod+S",
      (e) => {
        e.preventDefault();
        saveNote();
        toast({ title: "Note saved" });
      },
    ],
  ]);

  const insertMagicItem = (
    editor: BlockNoteEditor,
  ): DefaultReactSuggestionItem => ({
    title: "Insert Magic Text",
    onItemClick: async () => {
      if (!note) return;

      const autoCompleteText = await generateAutoComplete(note.id);

      const blocks = await editor.tryParseHTMLToBlocks(autoCompleteText ?? "");

      const lastBlock = editor.document.at(editor.document.length - 1);

      if (lastBlock) {
        editor.insertBlocks(blocks, lastBlock, "after");
      } else {
        editor.replaceBlocks(editor.document, blocks);
      }
    },
    aliases: ["autocomplete", "ai"],
    group: "AI",
    icon: <ImMagicWand size={18} />,
    subtext: "Continue your note with AI-generated text",
  });

  const getCustomSlashMenuItems = (
    editor: BlockNoteEditor,
  ): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor),
    insertMagicItem(editor),
  ];

  if (isSessionLoading || isNoteLoading) {
    return <SkeletonItem count={5} />;
  }

  if (sessionError) {
    return (
      <ErrorState
        message={`Authentication error: ${sessionError.message}`}
        onRetry={refetch}
      />
    );
  }

  if (isNoteError) {
    return (
      <ErrorState
        message={`Failed to load note: ${noteError?.message ?? ""}`}
        onRetry={refetch}
      />
    );
  }

  if (!session) {
    return (
      <ErrorState
        message="You must be logged in to view this note."
        onRetry={refetch}
      />
    );
  }

  if (!note) {
    return <ErrorState message="Note not found." onRetry={refetch} />;
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={isChatDocked ? 65 : 100} minSize={60}>
        <div className="flex flex-col overflow-y-auto h-full">
          <NoteHeader
            title={note.title}
            lastEdited={note.updatedAt ? new Date(note.updatedAt) : undefined}
            artifacts={note.artifacts}
            noteId={note.id}
          />
          <BlockNoteView
            theme={blockNoteTheme}
            className="w-full h-full"
            editor={noteEditor}
            slashMenu={false}
          >
            <SuggestionMenuController
              triggerCharacter="/"
              getItems={async (query: string) =>
                filterSuggestionItems(
                  getCustomSlashMenuItems(noteEditor),
                  query,
                )
              }
            />
          </BlockNoteView>
        </div>
      </ResizablePanel>

      {isChatDocked ? (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={35} minSize={15} maxSize={40}>
            <NoteChat
              noteId={note.id}
              isDocked={isChatDocked}
              onUndock={() => setIsChatDocked(false)}
            />
          </ResizablePanel>
        </>
      ) : null}
      <NoteDock
        noteId={Number(noteId)}
        isDocked={isChatDocked}
        onDock={() => setIsChatDocked(true)}
      />
    </ResizablePanelGroup>
  );
}
