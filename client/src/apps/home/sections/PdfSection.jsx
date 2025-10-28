import { Box } from '@mui/material';
import GenerarPDF from '../../../components/GenerarPDF';
import ImprimirPDF from '../../../components/ImprimirPDF';

const PdfSection = ({ data }) => (
  <Box mt={2}>
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
      <ImprimirPDF data={data} />
    </Box>

    <GenerarPDF data={data} />
  </Box>
);

export default PdfSection;