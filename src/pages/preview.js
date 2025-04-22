import { useEffect, useState } from 'react';
import { buildFileTree } from '../utils/buildTree';

export default function Preview() {
  const [fileTree, setFileTree] = useState(null);
  const [openFolders, setOpenFolders] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('uploadedFiles');
    if (stored) {
      const files = JSON.parse(stored);
      setFileTree(buildFileTree(files));
    }
  }, []);

  const toggleFolder = (path) => {
    setOpenFolders(prev => ({
      ...prev,
      [path]: !prev[path] // toggle open/close
    }));
  };

  const renderTree = (node, path = '') => {
    return Object.entries(node).map(([key, value]) => {
      const isFile = value.url !== undefined;
      const currentPath = path ? `${path}/${key}` : key;

      if (isFile) {
        return (
          <div key={currentPath} className="flex items-center space-x-4 p-2 bg-white rounded-lg shadow-sm mb-2">
            <img src={value.url} alt={key} className="w-16 h-16 object-cover rounded border" />
            <div>
              <p className="text-sm font-medium text-gray-800">{key}</p>
              <p className="text-xs text-gray-500">{value.relativePath}</p>
            </div>
          </div>
        );
      } else {
        const isOpen = openFolders[currentPath] ?? false; // ❗default collapsed

        return (
          <div key={currentPath} className="mb-2">
            <div
              className="flex items-center cursor-pointer space-x-1 group"
              onClick={() => toggleFolder(currentPath)}
            >
              <span className="text-lg transition-transform group-hover:scale-105">
                {isOpen ? '🔽' : '▶'}
              </span>
              <span className="text-blue-600 font-semibold text-base">{key}/</span>
            </div>

            {isOpen && (
              <div className="ml-6 mt-2 border-l border-gray-300 pl-4">
                {renderTree(value, currentPath)}
              </div>
            )}
          </div>
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📂 Collapsible Folder View</h2>
        {fileTree ? renderTree(fileTree) : (
          <p className="text-gray-500 text-center mt-10">No files uploaded.</p>
        )}
      </div>
    </div>
  );
}
