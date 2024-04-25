import React, { useState, ChangeEvent } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
  ThemeProvider,
  createTheme,
  Input,
  Stack,
  InputLabel,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { UploadOutlined as UploadIcon } from '@mui/icons-material';
import Textarea from './components/common/textArea';

import axios from 'axios';
import './App.css';
import { display } from '@mui/system';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App: React.FC = () => {
  const [files, setSelectedFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>();
  const [reportResult, setReportResult] = useState<string>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setSelectedFiles(selectedFiles);

      setReportResult(undefined);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select one or more files.');
      return;
    }

    if (!prompt) {
      alert('Please enter a prompt or question.');
      return;
    }
    await queryDocuments(prompt, files);
  };

  const queryDocuments = async (prompt: string, files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      // Sample Prompt:
      //   'Study all the documents and report the discrepancies between what people think has happened.';

      const response = await axios.post(
        `http://localhost:3000/api/queryDocuments/report?prompt=${prompt}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response: ', response);

      setReportResult(response.data);

      setSelectedFiles([]); // Clear selected files after upload
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files.');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <Stack
            spacing={4}
            style={{
              maxWidth: '800px',
              width: '100%',
              margin: 'auto',
              marginTop: '10px',
            }}
          >
            <Typography style={{ fontSize: '24px', marginTop: '50px' }}>
              MINE GUARD
            </Typography>

            <Container>
              <Typography style={{ fontSize: '16px' }} gutterBottom>
                Please select the PDF documents and enter your query or prompt.
              </Typography>
              <Typography style={{ fontSize: '16px' }} gutterBottom>
                An answer or comment will be generated based on all the
                information in the documents holistically.
              </Typography>
            </Container>

            <Input
              id="fileInput"
              style={{ display: 'none' }}
              type="file"
              onChange={handleFileChange}
              inputProps={{ multiple: true, accept: '.pdf' }}
            />
            <InputLabel htmlFor="fileInput">
              <Button
                variant="contained"
                component="span"
                startIcon={<UploadIcon />}
              >
                Select Files
              </Button>
            </InputLabel>

            <Grid container spacing={2} style={{ width: '400px' }}>
              {files.map((file, index) => (
                <Grid item key={index}>
                  {file.name}
                </Grid>
              ))}
            </Grid>

            <Textarea
              placeholder="Enter a prompt or query on all the selected documents..."
              onChange={e => setPrompt(e.target.value)}
              style={{ width: '100%', marginBottom: '10px' }}
            />

            <Button
              variant="contained"
              color="secondary"
              component="span"
              style={{ width: 'fit-content', margin: '10px auto' }}
              onClick={handleUpload}
              disabled={files.length === 0}
            >
              SUBMIT
            </Button>
            <Typography>{reportResult}</Typography>
          </Stack>
        </header>
      </div>
    </ThemeProvider>
  );
};

export default App;
