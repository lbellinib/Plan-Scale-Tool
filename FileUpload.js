import React, { useState } from 'react';

function FileUpload({ onFileSelect }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  return (
    <div>
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
      {file && <p>Selected: {file.name}</p>}
    </div>
  );
}

export default FileUpload;
​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
