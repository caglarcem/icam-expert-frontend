import { FormEvent, useState, useEffect, useRef } from 'react';
import './App.css';
import {
  TextField,
  Button,
  Autocomplete,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import Textarea from './components/common/textArea';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface Language {
  code: string;
  name: string;
}

interface TranslationRequest {
  inputMode: 'speech' | 'text';
  incomingSentence?: string | undefined;
  incomingSpeech?: string | undefined;
  fromLanguageCode: string | undefined;
  toLanguageCode: string | undefined;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Translation
  const [incomingSentence, setIncomingSentence] = useState<string>();
  const [fromLanguageCode, setFromLanguageCode] = useState<string>();
  const [toLanguageCode, setToLanguageCode] = useState<string>();
  const [translation, setTranslation] = useState<string>();
  const [languages, setLanguages] = useState<Language[]>([]);
  // Audio
  // incoming speech response
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  // listening to user speech to stream
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const [alignment, setAlignment] = React.useState('web');

  const defaultPropsFromLanguage = {
    options: languages || [],
    getOptionLabel: (option: Language) => option.name,
  };

  const defaultPropsToLanguage = {
    options: languages || [],
    getOptionLabel: (option: Language) => option.name,
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
    console.log(newAlignment);
  };

  useEffect(() => {
    // Function to get available languages and initialize websocket
    const fetchData = async () => {
      const cachedLanguages = localStorage.getItem('cachedLanguages');
      if (cachedLanguages) {
        setLanguages(JSON.parse(cachedLanguages));
      } else {
        try {
          const response = await fetch(
            'http://localhost:9000/translation/languages'
          );
          if (response.ok) {
            const languagesData: Language[] = await response.json();
            setLanguages(languagesData);
            localStorage.setItem(
              'cachedLanguages',
              JSON.stringify(languagesData)
            );
          }
        } catch (error) {
          console.error('Error fetching languages:', error);
        }
      }
    };

    fetchData();

    // Initialize microphone access and set up audio stream
    const initializeMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setAudioStream(stream);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    initializeMicrophone();

    const ws = new WebSocket('ws://localhost:8000');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWs(ws);
    };

    ws.onmessage = event => {
      console.log('incoming websocket event: ', event);

      const audioUrl = URL.createObjectURL(
        new Blob([event.data], { type: 'audio/mp3' })
      );

      console.log('Audio URL: ', audioUrl);

      setAudioUrl(audioUrl);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setWs(null);
    };

    return () => {
      if (ws) {
        ws.close();
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Function to play the translated speech response
    setAudioUrl(audioUrl);

    if (audioUrl) {
      const audioElement = new Audio(audioUrl);
      audioElement.play();
    }

    setLoading(false);
  }, [audioUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (incomingSentence) {
      setLoading(true);

      const translateRequest: TranslationRequest = {
        inputMode: 'text',
        incomingSentence,
        fromLanguageCode,
        toLanguageCode,
      };

      if (ws) {
        ws.send(JSON.stringify(translateRequest));
      }
    } else {
      setTranslation('Sentence must be entered.');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: 500,
                marginTop: 10,
              }}
            >
              <div>Select languages</div>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}
              >
                <Autocomplete
                  sx={{ width: '40%' }}
                  {...defaultPropsFromLanguage}
                  id="from-language"
                  includeInputInList
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="From language"
                      variant="standard"
                    />
                  )}
                  onChange={(event, newValue) => {
                    setFromLanguageCode(newValue?.code);
                  }}
                />
                <Autocomplete
                  sx={{ width: '40%' }}
                  {...defaultPropsToLanguage}
                  id="to-language"
                  includeInputInList
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="To language"
                      variant="standard"
                    />
                  )}
                  onChange={(event, newValue) => {
                    setToLanguageCode(newValue?.code);
                  }}
                />
              </Box>
              <ToggleButtonGroup
                color="primary"
                style={{
                  marginTop: 100,
                  marginLeft: 50,
                }}
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
              >
                <ToggleButton value="speak">Speak to translate</ToggleButton>
                <ToggleButton value="type-text">
                  Type text to translate
                </ToggleButton>
              </ToggleButtonGroup>
              {alignment === 'type-text' && (
                <>
                  <Textarea
                    placeholder="Sentence to translate..."
                    onChange={(e: any) => setIncomingSentence(e.target.value)}
                    style={{
                      marginTop: 80,
                      marginLeft: 50,
                      width: 400,
                    }}
                  />
                  <Button
                    color="primary"
                    type="submit"
                    style={{ marginTop: 40 }}
                  >
                    Translate
                  </Button>
                </>
              )}
              {loading ? (
                <CircularProgress
                  color="secondary"
                  size={40}
                  thickness={5}
                  style={{ marginTop: 100 }}
                />
              ) : (
                <>
                  <p
                    style={{
                      fontSize: 17,
                      marginTop: 100,
                      maxWidth: 800,
                    }}
                  >
                    {translation}
                  </p>
                  <p>
                    {audioUrl && (
                      <audio ref={audioRef} controls autoPlay>
                        <source src={audioUrl} type="audio/mp3" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </p>
                </>
              )}
            </Box>
          </form>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
