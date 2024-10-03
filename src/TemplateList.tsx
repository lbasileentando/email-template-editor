/* // TemplateList.tsx
import React, { useEffect, useState } from 'react';
import './TemplateList.css';
import ConfirmationModal from './ConfirmationModal';
import TemplateEditor from './TemplateEditor';

interface Template {
  id: string;
  author: string;
  state: string;
  content: string;
  version: number;
}

interface TemplateListProps {
  onSelectTemplate: (template: Template) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalEditor, setShowModalEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Template; direction: 'ascending' | 'descending' }>({
    key: 'id',
    direction: 'ascending',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 5;

  useEffect(() => {
    fetchTemplates();
  }, [refreshFlag]);

  const fetchTemplates = async () => {
    const response = await fetch(`http://localhost:3001/api/templates?search=${searchQuery}&sortKey=${sortConfig.key}&sortDirection=${sortConfig.direction}&page=${currentPage}&pageSize=${templatesPerPage}`);
    const data = await response.json();
    setTemplates(data);
  };

  const handleApprove = async (id: string) => {
    const response = await fetch(`http://localhost:3001/api/templates/${id}/approve`, { method: 'POST' });
    if (response.ok) {
      const updatedTemplate = await response.json();
      setTemplates(templates.map(template => template.id === id ? updatedTemplate : template));
    }
  };

  const handleReject = async (id: string) => {
    const response = await fetch(`http://localhost:3001/api/templates/${id}/reject`, { method: 'POST' });
    if (response.ok) {
      const updatedTemplate = await response.json();
      setTemplates(templates.map(template => template.id === id ? updatedTemplate : template));
    }
  };

  const handleDelete = async () => {
    if (selectedTemplate) {
      const response = await fetch(`http://localhost:3001/api/templates/${selectedTemplate.id}`, { method: 'DELETE' });
      if (response.ok) {
        setTemplates(templates.filter(template => template.id !== selectedTemplate.id));
        setShowModal(false);
      }
    }
  };

  const openModal = (template: Template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  const openModalEditor = (template: Template) => {
    setSelectedTemplate(template);
    setShowModalEditor(true);
  };

  const handleCreate = async (newTemplate: { author: string; content: string; version: number }) => {
    await fetch('http://localhost:3001/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTemplate),
    });
    setRefreshFlag(!refreshFlag);
    setShowModal(false);
  };

  const handleSave = (newTemplate: { author: string; content: string; version: number }) => {
    handleCreate(newTemplate);
    setShowModalEditor(false);
  };

  const handleSort = (key: keyof Template) => {
    console.log("Sorting");
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setRefreshFlag(!refreshFlag);
  };

  const sortedTemplates = React.useMemo(() => {
    if (sortConfig.key) {
      return [...templates].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return templates;
  }, [templates, sortConfig]);

  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = sortedTemplates.slice(indexOfFirstTemplate, indexOfLastTemplate);

  const totalPages = Math.ceil(sortedTemplates.length / templatesPerPage);


  return (
    <div className="table-container">
      <h2>Templates</h2>
      <button onClick={() => setShowModalEditor(true)} style={{ float: 'right', marginBottom: '10px' }}>Create</button>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: '10px' }}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('author')}>Author</th>
            <th onClick={() => handleSort('state')}>State</th>
            <th onClick={() => handleSort('version')}>Version</th>
            <th onClick={() => handleSort('content')}>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTemplates.map(template => (
            <tr key={template.id}>
              <td>{template.author}</td>
              <td>{template.state}</td>
              <td>{template.version}</td>
              <td>{template.content}</td>
              <td>
                <button onClick={() => openModalEditor(template)}>Edit</button>
                <button onClick={() => handleApprove(template.id)}>Approve</button>
                <button onClick={() => handleReject(template.id)}>Reject</button>
                <button onClick={() => openModal(template)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={index + 1 === currentPage ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this template?"
      />
      <TemplateEditor
        isOpen={showModalEditor}
        onClose={() => setShowModalEditor(false)}
        onSave={handleSave} // Use handleSave instead
        template={selectedTemplate} // Pass template to edit or undefined for new
      />
    </div>
  );
};

export default TemplateList;
 */


import React, { useEffect, useState } from 'react';
import './TemplateList.css';
import ConfirmationModal from './ConfirmationModal';
import TemplateEditor from './TemplateEditor';

interface Template {
  id: string;
  author: string;
  state: string;
  content: string;
  version: number;
}

interface TemplateListProps {
  onSelectTemplate: (template: Template) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Template; direction: 'ascending' | 'descending' }>({
    key: 'author',
    direction: 'ascending',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 5;
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [showEditorModal, setShowEditorModal] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, [refreshFlag, sortConfig, searchQuery, currentPage]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/templates?search=${searchQuery}&sortKey=${sortConfig.key}&sortDirection=${sortConfig.direction}&page=${currentPage}&pageSize=${templatesPerPage}`
      );
      const data = await response.json();
      setTemplates(data.templates);//console.log("data found : "+JSON.stringify(data));
      setTotalTemplates(data.totalTemplates);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      setTemplates([]); // Ensure templates is an empty array if fetch fails
    }
  };

  const handleApprove = async (id: string) => {
    const response = await fetch(`http://localhost:3001/api/templates/${id}/approve`, { method: 'POST' });
    if (response.ok) {
      const updatedTemplate = await response.json();
      setTemplates(templates.map(template => template.id === id ? updatedTemplate : template));
    }
  };

  const handleReject = async (id: string) => {
    const response = await fetch(`http://localhost:3001/api/templates/${id}/reject`, { method: 'POST' });
    if (response.ok) {
      const updatedTemplate = await response.json();
      setTemplates(templates.map(template => template.id === id ? updatedTemplate : template));
    }
  };

  const handleDelete = async () => {
    if (templateToDelete) {
      const response = await fetch(`http://localhost:3001/api/templates/${templateToDelete.id}`, { method: 'DELETE' });
      if (response.ok) {
        setRefreshFlag(!refreshFlag);
        setShowModal(false);
      }
    }
  };

  const openDeleteModal = (template: Template) => {
    setTemplateToDelete(template);
    setShowModal(true);
  };

  const openEditorModal = (template: Template) => {
    setSelectedTemplate(template);
    setShowEditorModal(true);
  };

  const openCreateModal = () => {
    setSelectedTemplate(null);
    setShowEditorModal(true);
  };

  const handleCreate = async (newTemplate: Partial<Template>) => {
    const completeTemplate = {
      ...newTemplate,
      id: `${new Date().getTime()}`, // Generate a unique id for the new template
      state: 'draft', // Default state
    };
    await fetch('http://localhost:3001/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completeTemplate),
    });
    setRefreshFlag(!refreshFlag);
    setShowEditorModal(false);
  };

  const handleSort = (key: keyof Template) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const totalPages = Math.ceil(totalTemplates / templatesPerPage);

  return (
    <div className="table-container">
      <h2>Templates</h2>
      <button onClick={openCreateModal} style={{ float: 'right', marginBottom: '10px' }}>Create</button>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: '10px' }}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('author')}>Author</th>
            <th onClick={() => handleSort('state')}>State</th>
            <th onClick={() => handleSort('version')}>Version</th>
            <th onClick={() => handleSort('content')}>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(template => (
            <tr key={template.id}>
              <td>{template.author}</td>
              <td>{template.state}</td>
              <td>{template.version}</td>
              <td>{template.content}</td>
              <td>
                <button onClick={() => openEditorModal(template)}>Edit</button>
                <button onClick={() => handleApprove(template.id)}>Approve</button>
                <button onClick={() => handleReject(template.id)}>Reject</button>
                <button onClick={() => openDeleteModal(template)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={index + 1 === currentPage ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this template?"
      />
      <TemplateEditor
        isOpen={showEditorModal}
        onClose={() => setShowEditorModal(false)}
        onSave={handleCreate}
        template={selectedTemplate} // Pass null for new template
      />
    </div>
  );
};

export default TemplateList;
