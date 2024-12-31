import React from 'react';
import CruiseSearch from './components/cruise';
import FileUploadAndProcess from './components/updatedFileUpload';

const App: React.FC = () => {
  return (
    <div className="App">
      <CruiseSearch />
      <FileUploadAndProcess />
    </div>
  );
};

export default App;