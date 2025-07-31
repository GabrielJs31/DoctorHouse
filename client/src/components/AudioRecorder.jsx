import React, { useRef, useState } from 'react';
import { procesarAudio } from '../services/doctorHouseService';
import { Button, Box, Typography, CircularProgress } from '@mui/material';

const AudioRecorder = ({ onData }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    setResult(null);
    setAudioURL(null);
    setLoading(false);
    if (!navigator.mediaDevices) {
      alert('La grabación de audio no es soportada en este navegador.');
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new window.MediaRecorder(stream);
    audioChunks.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = () => {
      // El tipo real lo determina el navegador (puede ser audio/webm, audio/ogg, etc.)
      const audioBlob = new Blob(audioChunks.current, { type: mediaRecorderRef.current.mimeType || 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const sendAudio = async () => {
    if (!audioURL) return;
    setLoading(true);
    setResult(null);
    // Convertir el blob a File
    const response = await fetch(audioURL);
    const blob = await response.blob();
    // Detectar extensión y tipo MIME correctos
    let extension = 'webm';
    let mime = blob.type || 'audio/webm';
    if (mime.includes('ogg')) extension = 'ogg';
    else if (mime.includes('wav')) extension = 'wav';
    else if (mime.includes('mp3')) extension = 'mp3';
    const file = new File([blob], `grabacion.${extension}`, { type: mime });
    try {
      const data = await procesarAudio(file);
      setResult(data);
      if (onData) onData(data);
    } catch (err) {
      // Mostrar mensaje de error real si está disponible
      let errorMsg = 'Error al enviar el audio.';
      if (err?.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      setResult({ error: errorMsg });
    }
    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h6">Grabadora de voz</Typography>
      <Box>
        <Button variant="contained" color="primary" onClick={startRecording} disabled={recording || loading} sx={{ mr: 1 }}>
          Grabar
        </Button>
        <Button variant="contained" color="secondary" onClick={stopRecording} disabled={!recording || loading} sx={{ mr: 1 }}>
          Detener
        </Button>
        <Button variant="contained" onClick={sendAudio} disabled={!audioURL || recording || loading}>
          Enviar
        </Button>
      </Box>
      {recording && <Typography color="info.main">Grabando...</Typography>}
      {audioURL && (
        <audio src={audioURL} controls style={{ marginTop: 8 }} />
      )}
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {result && (
        <Box mt={2}>
          <Typography variant="subtitle1">Respuesta del servidor:</Typography>
          <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: 8, borderRadius: 4, maxWidth: 400, overflowX: 'auto' }}>{JSON.stringify(result, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default AudioRecorder;
