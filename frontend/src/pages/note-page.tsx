import { useCallback, useEffect } from 'react';
import '@blocknote/core/fonts/inter.css';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  DefaultReactSuggestionItem,
} from '@blocknote/react';
import { filterSuggestionItems, BlockNoteEditor } from '@blocknote/core';
import { ImMagicWand } from 'react-icons/im';
import { useParams } from '@tanstack/react-router';
import { useNote } from '@/hooks/notes/use-note';
import { useUpdateNote } from '@/hooks/notes/use-update-note';
import { SkeletonItem } from '@/components/skeleton-item';
import { ErrorState } from '@/components/error-display';
import { useHotkeys } from '@mantine/hooks';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseSession } from '@/hooks/auth/use-supabase-session';
import { NoteChat } from '@/components/notes/note-chat';
import { NoteHeader } from '@/components/notes/note-header';

export default function NotePage() {
  const { noteId } = useParams({ from: '/_notes/$noteId/' });
  const {
    data: note,
    isLoading: isNoteLoading,
    isError: isNoteError,
    refetch,
    error: noteError,
  } = useNote(Number(noteId));
  const { mutateAsync: updateNote } = useUpdateNote();
  const { toast } = useToast();

  const {
    session,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useSupabaseSession();

  const editor = useCreateBlockNote({});

  // Only replace blocks when both note and editor are ready
  useEffect(() => {
    if (note?.content && editor) {
      editor.replaceBlocks(editor.document, note.content);
    }
  }, [note?.content, editor]);

  const saveNote = useCallback(async () => {
    if (!editor || !note) return;

    await updateNote({
      id: note.id,
      title: note.title,
      content: editor.document,
      userId: session?.user.id ?? '',
    });

    toast({
      title: 'Saved successfully',
    });
  }, [editor, note, updateNote, toast, session]);

  useHotkeys([
    [
      'mod+S',
      (e) => {
        e.preventDefault();
        saveNote();
      },
    ],
  ]);

  // --- Custom Slash Menu Item (UI only) ---
  const insertMagicItem = (
    editor: BlockNoteEditor,
  ): DefaultReactSuggestionItem => ({
    title: 'Insert Magic Text',
    onItemClick: () => {
      editor.insertInlineContent('✨ Magic AI text goes here! ✨');
    },
    aliases: ['autocomplete', 'ai'],
    group: 'AI',
    icon: <ImMagicWand size={18} />,
    subtext: 'Continue your note with AI-generated text',
  });

  // Combine with default Slash Menu items
  const getCustomSlashMenuItems = (
    editor: BlockNoteEditor,
  ): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor),
    insertMagicItem(editor),
  ];

  // Handle loading and error states
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
        message={`Failed to load note: ${noteError?.message ?? ''}`}
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
    <div className="flex flex-col py-6 px-2 items-center justify-center w-full h-full">
      <NoteHeader title={note.title} lastEdited={new Date(note.updatedAt)} />
      <BlockNoteView
        className="w-full h-full "
        editor={editor}
        slashMenu={false}
      >
        <SuggestionMenuController
          triggerCharacter={'/'}
          getItems={async (query: string) =>
            filterSuggestionItems(getCustomSlashMenuItems(editor), query)
          }
        />
      </BlockNoteView>
      <NoteChat />
    </div>
  );
}
