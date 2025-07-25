// api.js: instancia de Axios con la base URL de tu backend
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://208.67.222.222:8000', // tu endpoint
  timeout: 30000,                                    // 30s timeout
});

export default api;
