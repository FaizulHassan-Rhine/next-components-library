export function buildFileTree(files) {
    const root = {};
  
    files.forEach(file => {
      const parts = file.relativePath.split('/');
      let current = root;
  
      parts.forEach((part, idx) => {
        if (idx === parts.length - 1) {
          current[part] = file; // it's a file
        } else {
          current[part] = current[part] || {}; // it's a folder
          current = current[part];
        }
      });
    });
  
    return root;
  }
  