import { useEffect, useState } from 'react';
import { buildFileTree } from '../utils/buildTree';

export default function Preview() {
  const [fileTree, setFileTree] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('uploadedFiles');
    if (stored) {
      const files = JSON.parse(stored);
      setFileTree(buildFileTree(files));
    }
  }, []);

  const renderTree = (node, level = 0) => {
    return Object.entries(node).map(([key, value]) => {
      const isFile = value.url !== undefined;

      return (
        <div key={key} className={`ml-${level * 4} mb-2`}>
          {isFile ? (
            <div className="flex items-center space-x-4 p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition">
              <img
                src={value.url}
                alt={key}
                className="w-16 h-16 object-cover rounded-md border"
              />
              <div>
                <p className="text-sm text-gray-700">{key}</p>
                <p className="text-xs text-gray-400">{value.relativePath}</p>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="font-semibold text-blue-600 text-base mb-2">{'📁 ' + key}</p>
              <div className="ml-4 border-l-2 border-blue-200 pl-4">
                {renderTree(value, level + 1)}
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📂 Folder View with Previews</h2>
        {fileTree ? renderTree(fileTree) : (
          <p className="text-gray-500 text-center mt-10">No files uploaded.</p>
        )}
      </div>
    </div>
  );
}
