import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

interface ProcessFileResponse {
  message: string;
  csvPath: string;
  txtPath: string;
}

const FileUploadAndProcess: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [csvDownloadLink, setCsvDownloadLink] = useState<string | null>(null);
  const [txtDownloadLink, setTxtDownloadLink] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setCsvDownloadLink(null); // Reset download links on new file selection
      setTxtDownloadLink(null);
    }
  };

  // Handle file upload and processing
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    debugger
    try {
      const response = await axios.post<ProcessFileResponse>('http://localhost:4000/ports/process-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Extract download paths
      setCsvDownloadLink(`http://localhost:3000/${response.data.csvPath}`);
      setTxtDownloadLink(`http://localhost:3000/${response.data.txtPath}`);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process the file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Upload and Process File
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
        {uploading ? <CircularProgress size={24} /> : 'Upload and Process'}
      </Button>

      {/* Download Links */}
      {csvDownloadLink && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Processed files are ready. Click below to download:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <a
              href={csvDownloadLink}
              download
              style={{ textDecoration: 'none' }}
            >
              <Button variant="outlined" color="secondary">
                Download CSV File
              </Button>
            </a>
            <a
              href={txtDownloadLink as string}
              download
              style={{ textDecoration: 'none' }}
            >
              <Button variant="outlined" color="secondary">
                Download TXT File
              </Button>
            </a>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FileUploadAndProcess;
