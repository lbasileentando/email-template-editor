// App.tsx
import React, { useState } from 'react';
import TemplateList from './TemplateList';
import './TemplateList.css';

interface Template {
  id: string;
  author: string;
  state: string;
  content: string;
  version: number;
}

const App: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(undefined);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  return (
    <div>
      <TemplateList onSelectTemplate={handleSelectTemplate} />
    </div>
  );
};

export default App;
