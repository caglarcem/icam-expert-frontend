import React, { useState, ChangeEvent } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { UploadOutlined as UploadIcon } from '@mui/icons-material';
import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select one or more files.');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(
        'http://localhost:3000/api/file/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data);
      alert('Files uploaded successfully.');
      setFiles([]); // Clear selected files after upload
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files.');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container>
        {/* <Typography variant="h5" gutterBottom>
          File Upload
        </Typography> */}
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          style={{ display: 'none' }}
          id="fileInput"
        />
        <label htmlFor="fileInput">
          <Button
            style={{ marginTop: '50px' }}
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
          >
            Select Files
          </Button>
        </label>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          {files.map((file, index) => (
            <Grid item key={index}>
              {file.name}
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={files.length === 0}
          style={{ marginTop: '20px' }}
        >
          Upload
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default App;
