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
import {
  MarginTwoTone,
  UploadOutlined as UploadIcon,
} from '@mui/icons-material';
import Textarea from './components/common/textArea';

import axios from 'axios';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>();
  const [reportResult, setReportResult] = useState<string>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      setReportResult(undefined);
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

    // const prompt =
    //   'Study all the documents and report the discrepancies between what people think has happened.';

    try {
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

      setFiles([]); // Clear selected files after upload
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
          <Container>
            <Typography
              style={{ marginTop: '100px', fontSize: '16px' }}
              gutterBottom
            >
              Please select the documents and enter your query or prompt. An
              answer or comment will be generated based on all the information
              in the documents holistically.
            </Typography>

            {/* Select Files Button */}
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              style={{ display: 'none' }}
              id="fileInput"
            />
            <label htmlFor="fileInput">
              <Button
                style={{ marginTop: '20px' }}
                variant="contained"
                component="span"
              >
                Select Files
              </Button>
            </label>

            {/* Display Selected Files */}
            <Grid
              container
              spacing={2}
              style={{ marginTop: '20px', width: '400px' }}
            >
              {files.map((file, index) => (
                <Grid item key={index}>
                  {file.name}
                </Grid>
              ))}
            </Grid>

            {/* Prompt Input */}
            <div
              style={{
                marginTop: '20px',
                marginLeft: '33%',
                width: '100%',
                maxWidth: '400px',
              }}
            >
              <Textarea
                placeholder="Enter a prompt or query on all the selected documents..."
                onChange={e => setPrompt(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
              />
              {/* Submit Button */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={files.length === 0}
                style={{ width: '100%' }} // Make the button width 100%
              >
                SUBMIT
              </Button>
            </div>

            {/* Display Report Result */}
            <p style={{ marginTop: '20px' }}>{reportResult}</p>
          </Container>
        </header>
      </div>
    </ThemeProvider>
  );
};

export default App;
