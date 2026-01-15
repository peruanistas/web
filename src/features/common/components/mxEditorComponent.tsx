import { type MDXEditorMethods } from '@mdxeditor/editor';
import {
  MDXEditor,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  Separator,
  listsPlugin,
  linkPlugin,
  linkDialogPlugin,
  CreateLink,
  quotePlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import '../styles/mdx-editor.css';
import { useRef, useState, useEffect, memo } from 'react';

interface MDXEditorComponentProps {
  markdown: string;
  onChange: (markdown: string) => void;
  error?: boolean;
}

// Memoized inner editor to prevent re-renders from parent state changes
const InnerEditor = memo(function InnerEditor({
  initialMarkdown,
  onChange,
  error,
}: {
  initialMarkdown: string;
  onChange: (markdown: string) => void;
  error?: boolean;
}) {
  const editorRef = useRef<MDXEditorMethods>(null);

  return (
    <MDXEditor
      ref={editorRef}
      markdown={initialMarkdown}
      onChange={onChange}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle options={['bullet', 'number']} />
              <Separator />
              <CreateLink />
            </>
          ),
        }),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
      ]}
      contentEditableClassName={`
        mdx-editor
        ${error ? 'border-red-500' : 'border-gray-200'} min-h-[200px] rounded-md p-2`}
    />
  );
});

export function MDXEditorComponent({
  markdown,
  onChange,
  error,
}: MDXEditorComponentProps) {
  // Capture initial markdown only on first render
  const [initialMarkdown] = useState(markdown);

  // Track if we need to reset the editor (e.g., after form submission)
  const [editorKey, setEditorKey] = useState(0);

  // Reset editor if markdown is cleared externally (e.g., form reset)
  useEffect(() => {
    if (markdown === '' && initialMarkdown !== '') {
      setEditorKey(prev => prev + 1);
    }
  }, [markdown, initialMarkdown]);

  return (
    <div id="description" aria-describedby="description-error">
      <InnerEditor
        key={editorKey}
        initialMarkdown={editorKey === 0 ? initialMarkdown : ''}
        onChange={onChange}
        error={error}
      />
    </div>
  );
}
