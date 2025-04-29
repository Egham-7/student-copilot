import { useEffect, useRef } from 'react';
import type { BlockNoteEditor } from '@blocknote/core';
import { useAISuggestion } from '@/hooks/notes/use-ai-suggestion';

export function SuggestionOverlay({
  editor,
}: {
  editor: BlockNoteEditor | null;
}) {
  const { suggestion, activeBlock, acceptSuggestion } = useAISuggestion(editor);
  const ref = useRef<HTMLDivElement>(null);

  // Position overlay over the block's DOM node
  useEffect(() => {
    if (!activeBlock || !ref.current) return;
    const blockNode = document.querySelector(
      `[data-block-id="${activeBlock.id}"]`,
    ) as HTMLElement;
    if (blockNode) {
      const rect = blockNode.getBoundingClientRect();
      ref.current.style.position = 'absolute';
      ref.current.style.left = `${rect.left + window.scrollX}px`;
      ref.current.style.top = `${rect.top + window.scrollY}px`;
      ref.current.style.width = `${rect.width}px`;
      ref.current.style.height = `${rect.height}px`;
      ref.current.style.pointerEvents = 'none';
      ref.current.style.zIndex = '10';
    }
  }, [activeBlock, suggestion]);

  // Handle Tab to accept suggestion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Tab' &&
        suggestion &&
        activeBlock &&
        document.activeElement &&
        (document.activeElement as HTMLElement).closest('.blocknote-editor')
      ) {
        e.preventDefault();
        acceptSuggestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [suggestion, activeBlock, acceptSuggestion]);

  if (!activeBlock || !suggestion) return null;

  // Get the current block's text for alignment
  const blockText = Array.isArray(activeBlock.content)
    ? activeBlock.content
        .map((item) =>
          typeof item === 'string'
            ? item
            : item.type === 'text'
              ? item.text
              : '',
        )
        .join('')
    : '';

  return (
    <div
      ref={ref}
      style={{
        color: '#bbb',
        fontStyle: 'italic',
        background: 'transparent',
        whiteSpace: 'pre-wrap',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        paddingLeft: 0,
        pointerEvents: 'none',
      }}
    >
      <span style={{ opacity: 0 }}>{blockText}</span>
      <span>{suggestion}</span>
    </div>
  );
}
