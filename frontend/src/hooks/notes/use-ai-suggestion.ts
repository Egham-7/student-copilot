import { useState, useEffect } from 'react';
import type { BlockNoteEditor, Block } from '@blocknote/core';

async function getAISuggestion(fullText: string): Promise<string> {
  // Replace with your real AI call
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (fullText.trim().endsWith('hello')) return ', how are you?';
  return '';
}

export function useAISuggestion(editor: BlockNoteEditor | null) {
  const [suggestion, setSuggestion] = useState('');
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);

  useEffect(() => {
    if (!editor) return;

    const updateSuggestion = async () => {
      let block: Block | null = null;
      const selection = editor.getSelection();
      if (selection && selection.blocks.length > 0) {
        block = selection.blocks[0];
      } else {
        block = editor.getTextCursorPosition().block;
      }

      // Only show suggestion for paragraphs (or whatever block types you want)
      if (block && block.type === 'paragraph') {
        setActiveBlock(block);

        const fullText = await editor.blocksToMarkdownLossy(editor.document);
        const aiSuggestion = await getAISuggestion(fullText);
        setSuggestion(aiSuggestion);
      } else {
        setActiveBlock(null);
        setSuggestion('');
      }
    };

    updateSuggestion();
    // Optionally, you could debounce this if needed
  }, [editor]);

  const acceptSuggestion = () => {
    if (suggestion && activeBlock && editor) {
      editor.blocksToMarkdownLossy([activeBlock]).then((currentText) => {
        const newText = currentText + suggestion;
        editor.updateBlock(activeBlock.id, {
          content: [
            {
              type: 'text',
              text: newText,
              styles: {},
            },
          ],
        });
        setSuggestion('');
      });
    }
  };

  return { suggestion, activeBlock, acceptSuggestion };
}
