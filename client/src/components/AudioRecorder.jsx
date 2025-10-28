import { useEffect, useRef, useState } from "react";
import { procesarAudio } from "../services/api/transcriptionApi";
import { Button, Box, Typography } from "@mui/material";
import LoadingModal from "./LoadingModal";
import { getLogger } from "../services/logs";
const log = getLogger("audio.recorder");

const AudioRecorder = ({ onData }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    return () => {
      try {
        mediaRecorderRef.current?.stream?.getTracks?.().forEach((t) => t.stop());
      } catch {}
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioURL) {
        try {
          URL.revokeObjectURL(audioURL);
        } catch {}
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    onData?.(null);
    if (audioURL) {
      try { URL.revokeObjectURL(audioURL); } catch {}
    }
    setAudioURL(null);
    setLoading(false);

    if (!navigator.mediaDevices || typeof window.MediaRecorder === "undefined") {
      log.warn("media_devices_unavailable");
      alert("La grabación de audio no es soportada en este navegador.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new window.MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data?.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, {
          type: mediaRecorderRef.current.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        log.debug("recording_blob_ready", { size: audioBlob.size, type: audioBlob.type });
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      log.info("recording_started", { mime: mediaRecorderRef.current.mimeType });
    } catch (err) {
      log.error("recording_start_failed", { message: String(err) });
      alert("No se pudo iniciar la grabación.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream?.getTracks?.().forEach((t) => t.stop());
      } catch (e) {
        log.warn("recording_stop_warning", { message: String(e) });
      }
      setRecording(false);
      log.info("recording_stopped");
    }
  };

  const sendAudio = async () => {
    if (!audioURL) return;
    setLoading(true);
    onData?.(null);

    try {
      const response = await fetch(audioURL);
      const blob = await response.blob();

      let extension = "webm";
      const mime = blob.type || "audio/webm";
      if (mime.includes("ogg")) extension = "ogg";
      else if (mime.includes("wav")) extension = "wav";
      else if (mime.includes("mp3")) extension = "mp3";

      const file = new File([blob], `grabacion.${extension}`, { type: mime });
      log.info("send_start", { mime, size: blob.size });

      const data = await procesarAudio(file);
      onData?.(data);
      log.info("send_success");
    } catch (err) {
      let errorMsg = "Error al enviar el audio.";
      if (err?.response?.data?.error) errorMsg = err.response.data.error;
      else if (err?.message) errorMsg = err.message;

      onData?.({ error: errorMsg });
      log.error("send_failed", { message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h6">Grabadora de voz</Typography>

      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={startRecording}
          disabled={recording || loading}
          sx={{ mr: 1 }}
        >
          Grabar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={stopRecording}
          disabled={!recording || loading}
          sx={{ mr: 1 }}
        >
          Detener
        </Button>
        <Button
          variant="contained"
          onClick={sendAudio}
          disabled={!audioURL || recording || loading}
        >
          Enviar
        </Button>
      </Box>

      {recording && <Typography color="info.main">Grabando...</Typography>}
      {audioURL && <audio src={audioURL} controls style={{ marginTop: 8 }} />}

      <LoadingModal open={loading} />
    </Box>
  );
};

export default AudioRecorder;
