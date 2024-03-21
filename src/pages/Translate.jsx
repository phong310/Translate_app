import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Grid, Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ClearIcon from '@mui/icons-material/Clear';
import TranslateIcon from '@mui/icons-material/Translate';
import { LoadingButton } from '@mui/lab'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import IconButton from '@mui/material/IconButton';
import { useSpeechSynthesis } from 'react-speech-kit';


export default function Translate() {
  const { speak, voices } = useSpeechSynthesis();
  const [isLoading, setIsLoading] = useState(false)
  const [optionLanguage, setOptionsLanguage] = useState([]);
  const [textType, setTextType] = useState('')
  const [textTranslate, setTextTranslate] = useState('')
  const [fromLanguage, setFromLanguage] = useState('en')
  const [toLanguage, setToLanguage] = useState('vi')


  const TranslateText = async () => {
    setIsLoading(true)
    const encodedParams = new URLSearchParams();
    encodedParams.set('from', fromLanguage);
    encodedParams.set('to', toLanguage);
    encodedParams.set('text', textType);

    const options = {
      method: 'POST',
      url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '29e70a1ecfmsh52fb7d76959ca15p13deb3jsne13b5bca2604',
        'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      setTextTranslate(response.data.trans);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchLang = () => {
    setFromLanguage(toLanguage)
    setToLanguage(fromLanguage)
    handleClear()
  }

  const handleClear = () => {
    setTextType('')
    setTextTranslate('')
  }

  const handleSpeaker = () => {
    const googleVoices = voices.filter(voice => voice.voiceURI === 'Google US English');
    speak({ text: textTranslate, voice: googleVoices[0], rate: 0.8 });
  }

  useEffect(() => {
    const fetchLanguages = async () => {
      const options = {
        method: 'GET',
        url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/support-languages',
        headers: {
          'X-RapidAPI-Key': '29e70a1ecfmsh52fb7d76959ca15p13deb3jsne13b5bca2604',
          'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setOptionsLanguage(response.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchLanguages();
  }, []);


  return (
    <Box>
      <Grid container justifyContent={'center'} alignItems={'center'} sx={{ gap: 4, mb: 8 }}>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/480px-Google_Translate_logo.svg.png'
          style={{ width: 60 }}
        />

        <Typography
          variant='h4'
          sx={{ ...styleTitle }}>
          THEWIND <span style={{ color: 'black' }}>Dịch</span>
        </Typography>
      </Grid>
      <Grid container justifyContent={'center'} sx={{ gap: 4 }} alignItems={'center'}>
        <Grid item md={3} sm={4} xs={12}>
          <Grid container sx={{ gap: 2, mb: 2 }} alignItems={'center'}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">From</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={fromLanguage}
                label="From"
                onChange={(e) => setFromLanguage(e.target.value)}
              >
                {optionLanguage.map((item, i) => (
                  <MenuItem key={i} value={item.code}>{item.language}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <TextField
            id="outlined-basic"
            label=""
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={textType}
            onChange={(e) => setTextType(e.target.value)}
          />
        </Grid>
        <Grid>
          <IconButton onClick={handleSwitchLang}>
            <CompareArrowsIcon />
          </IconButton>
        </Grid>
        <Grid item md={3} sm={4} xs={12}>
          <Grid container sx={{ gap: 2, mb: 2 }} alignItems={'center'}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">To</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={toLanguage}
                label="To"
                onChange={(e) => setToLanguage(e.target.value)}
              >
                {optionLanguage.map((item, i) => (
                  <MenuItem key={i} value={item.code}>{item.language}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton onClick={handleSpeaker}>
              <VolumeUpIcon />
            </IconButton>
          </Grid>
          <TextField
            id="outlined-basic"
            label="Bản dịch"
            variant="outlined"
            multiline
            rows={4}
            readOnly
            fullWidth
            value={textTranslate}
          />
        </Grid>
        <Grid item xs={12} >
          <Grid container justifyContent={'center'} alignItems={'center'} sx={{ gap: 1 }}>
            <LoadingButton loading={isLoading} startIcon={<TranslateIcon />} variant="contained" onClick={TranslateText}>Dịch</LoadingButton>
            <Button variant="contained" color='error' startIcon={<ClearIcon />} onClick={handleClear}>
              Xóa
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

const styleTitle = {
  fontWeight: 'bold',
  color: '#4a90e2'
}