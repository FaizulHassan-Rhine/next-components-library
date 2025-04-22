import { useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef();
  const folderInputRef = useRef();

  const handleFiles = (fileList) => {
    const processedFiles = Array.from(fileList).map((file) => ({
      name: file.name,
      type: file.type,
      relativePath: file.webkitRelativePath || file.name,
      url: URL.createObjectURL(file),
    }));

    localStorage.setItem('uploadedFiles', JSON.stringify(processedFiles));
    router.push('/preview');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    const uploadedFiles = [];

    const traverse = (item, path = '') => {
      if (item.isFile) {
        item.file((file) => {
          file.relativePath = path + file.name;
          uploadedFiles.push({
            name: file.name,
            type: file.type,
            relativePath: file.relativePath,
            url: URL.createObjectURL(file),
          });
          if (uploadedFiles.length === items.length) {
            localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
            router.push('/preview');
          }
        });
      } else if (item.isDirectory) {
        const reader = item.createReader();
        reader.readEntries((entries) => {
          entries.forEach((entry) => traverse(entry, path + item.name + '/'));
        });
      }
    };

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) traverse(entry);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-2">Upload Files or Folders</h1>

      {/* Drag & Drop */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full max-w-2xl h-64 border-4 border-dashed border-blue-500 rounded-lg flex items-center justify-center text-center text-blue-500 bg-white shadow-md"
      >
        Drag & drop images or folders here
      </div>

      {/* Upload Buttons */}
      <div className="space-x-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => fileInputRef.current.click()}
        >
          Upload Images (Files)
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => folderInputRef.current.click()}
        >
          Upload Folder
        </button>
      </div>

      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory="true"
        directory=""
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
