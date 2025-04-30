import React, { useState, useEffect } from 'react';
import { PrimaryButton, Spacings, Text } from '@commercetools-frontend/ui-kit';

interface NotesEditorProps {
  notes: string;
  onSave: (newNotes: string) => Promise<void>;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({ notes, onSave }) => {
  const [content, setContent] = useState(notes);

  // Whenever parent `notes` updates (e.g. after a Key Decision),
  // reload that into our textarea.
  useEffect(() => {
    setContent(notes);
  }, [notes]);

  return (
    <Spacings.Stack scale="l">
      <Text.Headline as="h3">Notes</Text.Headline>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: '100%',
          minHeight: '150px',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <PrimaryButton
        label="Save Notes"
        onClick={() => onSave(content)}
      />
    </Spacings.Stack>
  );
};
