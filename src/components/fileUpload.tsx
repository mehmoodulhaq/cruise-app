import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Selected file
  const [uploading, setUploading] = useState<boolean>(false); // Uploading state
  const [downloadLink, setDownloadLink] = useState<string | null>(null); // Link to download the uploaded file

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setDownloadLink(null); // Reset download link on new file selection
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post<{ downloadUrl: string }>('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setDownloadLink(response.data.downloadUrl); // Set the download link from the response
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload the file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Upload File
      </Typography>

      {/* File Input */}
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: '16px', display: 'block' }}
      />

      {/* Upload Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        sx={{ mb: 2 }}
      >
        {uploading ? <CircularProgress size={24} /> : 'Upload'}
      </Button>

      {/* Download Link */}
      {downloadLink && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            File uploaded successfully. Click below to download:
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            href={downloadLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download File
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
