import React from 'react';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';

type Props = {
  /** the HTML string to show */
  value: string;
  /** called whenever the editor content changes */
  onChange: (html: string) => void;
};

const RichNotesEditor: React.FC<Props> = ({ value, onChange }) => {
  // sanitize on each change to avoid XSS
  const handleChange = (html: string) => {
    const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
    onChange(clean);
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
        ],
      }}
    />
  );
};

export default RichNotesEditor;
