/* // TemplateEditor.tsx
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: { author: string; content: string; version: number }) => void;
  template: { id: string; author: string; content: string; version: number } | null;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ isOpen, onClose, onSave, template }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [version, setVersion] = useState(1);

  useEffect(() => {
    if (template) {
      setAuthor(template.author);
      setContent(template.content);
      setVersion(template.version + 1); // Increment version for new version
    } else {
      setAuthor('');
      setContent('');
      setVersion(1); // Reset for new template
    }
  }, [template]);

  const handleSave = () => {
    onSave({ author, content, version });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{template ? 'Edit Template' : 'Create Template'}</h3>
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <ReactQuill value={content} onChange={setContent} />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default TemplateEditor;
 */

import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Partial<Template>) => void;
  template: Template | null;
}

interface Template {
  id: string;
  author: string;
  state: string;
  content: string;
  version: number;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ isOpen, onClose, onSave, template }) => {
  const [author, setAuthor] = useState(template ? template.author : '');
  const [content, setContent] = useState(template ? template.content : '');
  const [version, setVersion] = useState(template ? template.version : 1);

  useEffect(() => {
    if (template) {
      setAuthor(template.author);
      setContent(template.content);
      setVersion(template.version);
    } else {
      setAuthor('');
      setContent('');
      setVersion(1);
    }
  }, [template]);

  const handleSave = () => {
    onSave({ author, content, version });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{template ? 'Edit Template' : 'Create Template'}</h2>
        <div>
          <label>Author</label>
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)} />
        </div>
        <div>
          <label>Content</label>
          <ReactQuill value={content} onChange={setContent} />
        </div>
        <div>
          <label>Version</label>
          <input type="number" value={version} onChange={e => setVersion(Number(e.target.value))} />
        </div>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default TemplateEditor;
