import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
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
  CircularProgress,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { UploadOutlined as UploadIcon } from '@mui/icons-material';
import { Box } from '@mui/system';

import './App.css';
import Textarea from './components/common/textArea';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App: React.FC = () => {
  const [files, setSelectedFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>();
  const [reportResult, setReportResult] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false); // Added loading state

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setSelectedFiles(selectedFiles);

      setReportResult(undefined);
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('Please select one or more files.');
      return;
    }

    if (!prompt) {
      alert('Please enter a prompt or question.');
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      await queryDocuments(prompt, files);
    } finally {
      setLoading(false); // Reset loading state whether success or error
    }
  };

  const queryDocuments = async (prompt: string, files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      // Sample Prompt: // 4
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
            <Typography
              style={{
                fontSize: '24px',
                marginTop: '50px',
                color: '#F9BF90',
                fontWeight: '400',
              }}
            >
              ICAM Expert
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

            <Box style={{ display: 'flex', color: '#90caf9' }}>
              {files.map((file, index) => (
                <Grid item key={index} style={{ marginRight: '16px' }}>
                  {file.name}
                </Grid>
              ))}
            </Box>

            <Textarea
              placeholder="Enter a prompt or query on all the selected documents..."
              onChange={e => setPrompt(e.target.value)}
              style={{ width: '100%', marginTop: '80px' }}
            />

            <Button
              variant="contained"
              color="secondary"
              component="span"
              style={{ width: 'fit-content', margin: '40px auto' }}
              onClick={handleSubmit}
              disabled={files.length === 0 || loading}
            >
              SUBMIT
            </Button>

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="secondary" />
              </div>
            )}

            <Typography>{reportResult}</Typography>
          </Stack>
        </header>
      </div>
    </ThemeProvider>
  );
};

export default App;
