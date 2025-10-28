import AudioUploader from '../../../components/AudioUploader';
import AudioRecorder from '../../../components/AudioRecorder';
import { Box, Typography, Divider } from '@mui/material';

const AudioSection = ({ onData }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 1 }}>Grabar audio</Typography>
    <AudioRecorder onData={onData} />
    <Divider sx={{ my: 3 }}>o</Divider>
    <Typography variant="h6" sx={{ mb: 1 }}>Subir archivo de audio</Typography>
    <AudioUploader onData={onData} />
  </Box>
);

export default AudioSection;
