import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import useFileValidation from "../apps/home/hooks/useFileValidation";
import { procesarAudio } from "../services/api/transcriptionApi";
import LoadingModal from "./LoadingModal";
import { getLogger } from "../services/logs";
const log = getLogger("audio.uploader");

const getFileIcon = (file) => {
  const { type } = file;
  if (type === "audio/mpeg")
    return (
      <MusicNoteIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
    );
  if (type === "audio/wav")
    return (
      <GraphicEqIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
    );
  if (type.startsWith("audio/"))
    return (
      <AudiotrackIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
    );
  return (
    <InsertDriveFileIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
  );
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const dropZoneVariants = { hover: { scale: 1.02 }, tap: { scale: 0.98 } };

const AudioUploader = ({ onData }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validación de archivo
  const { valid, error: validationError } = useFileValidation(file, {
    types: ["audio/wav", "audio/mpeg", "audio/mp3", "audio/aac", "audio/ogg"],
    maxSize: 5 * 1024 * 1024,
  });

  const handleChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setError(null);
    if (f) log.debug("file_selected", { mime: f.type, size: f.size });
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor selecciona un archivo de audio");
      return;
    }
    if (!valid) {
      setError(validationError || "Archivo no válido");
      return;
    }

    setError(null);
    setLoading(true);
    log.info("upload_start", { mime: file.type, size: file.size });

    try {
      const extracted = await procesarAudio(file);
      onData(extracted);
      log.info("upload_success");
    } catch (err) {
      setError(err.message ?? "Error al procesar el audio");
      log.warn("upload_failed", { message: err?.message || "unknown" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingModal open={loading} />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ marginTop: 24 }}
      >
        <Card sx={{ boxShadow: 4, borderRadius: 2 }}>
          <CardHeader
            avatar={<UploadFileIcon color="primary" fontSize="large" />}
            title={<Typography variant="h6">Subir Audio</Typography>}
            sx={{ pb: 0 }}
          />
          <CardContent>
            <motion.label
              htmlFor="audio-upload"
              variants={dropZoneVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: file ? "primary.main" : "grey.400",
                  borderRadius: 1,
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: file ? "action.selected" : "transparent",
                }}
              >
                <input
                  accept="audio/*"
                  id="audio-upload"
                  type="file"
                  hidden
                  onChange={handleChange}
                />
                {file ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    {getFileIcon(file)}
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      {file.name}
                    </Typography>
                  </Box>
                ) : (
                  <Typography>Haz clic o arrastra tu archivo aquí</Typography>
                )}
              </Box>
            </motion.label>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!file || loading}
              startIcon={<UploadFileIcon />}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Subir y procesar"
              )}
            </Button>
          </CardActions>
        </Card>
      </motion.div>
    </>
  );
};

export default AudioUploader;
