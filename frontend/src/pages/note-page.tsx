import { useCallback, useEffect, useRef } from 'react';
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
import { debounce } from 'lodash';
import { DebouncedFunc } from 'lodash';

export default function NotePage() {
  const { noteId } = useParams({ from: '/_app/notes/$noteId/' });
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

  const noteEditor = useCreateBlockNote({
    initialContent: note?.content,
  });

  // Auto-save handler (debounced)
  const debouncedSaveRef = useRef<DebouncedFunc<() => void | undefined>>(undefined);

  const saveNote = useCallback(async () => {
    if (!noteEditor || !note || !session) return;

    await updateNote({
      id: note.id,
      title: note.title,
      content: noteEditor.document,
      userId: session.user.id,
    });

    toast({ title: 'Note saved' });
  }, [noteEditor, note, session, updateNote, toast]);

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
    return noteEditor.onEditorContentChange(() => {
      debouncedSaveRef.current?.();
    });
  }, [noteEditor]);

  // Manual save hotkey
  useHotkeys([
    [
      'mod+S',
      (e) => {
        e.preventDefault();
        saveNote();
      },
    ],
  ]);

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
      <NoteHeader
        title={note.title}
        lastEdited={new Date(note.updatedAt)}
        artifacts={note.artifacts}
        noteId={note.id}
      />
      <BlockNoteView
        className="w-full h-full"
        editor={noteEditor}
        slashMenu={false}
      >
        <SuggestionMenuController
          triggerCharacter="/"
          getItems={async (query: string) =>
            filterSuggestionItems(getCustomSlashMenuItems(noteEditor), query)
          }
        />
      </BlockNoteView>
      <NoteChat />
    </div>
  );
}
