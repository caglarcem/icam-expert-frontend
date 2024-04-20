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
  const [reportResult, setReportResult] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  // const convertPdfToText = async () => {
  //   try {
  //     const response = await axios.get(
  //       'http://localhost:3000/api/pdfToText/convert'
  //     );
  //     console.log(response.data);
  //     alert('Pdf converted successfully');
  //   } catch (error) {
  //     console.error('Error converting pdf to text:', error);
  //     alert('Error converting pdf to text.');
  //   }
  // };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select one or more files.');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const prompt =
      'Study all the documents and report the discrepancies between what people think has happened.';

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
              SUBMIT
            </Button>
            {/* <Textarea
              placeholder="Enter query on all the selected documents..."
              onChange={e => setQuery(e.target.value)}
              style={{
                marginTop: 80,
                marginLeft: 50,
                width: 400,
              }}
            /> */}

            <p>{reportResult}</p>
          </Container>
        </header>
      </div>
    </ThemeProvider>
  );
};

export default App;
