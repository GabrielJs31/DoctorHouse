// api.js: instancia de Axios con la base URL de tu backend
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.1.40.31:8080', // tu endpoint
  timeout: 0,                                    // 30s timeout
  headers: { Accept: 'application/json' },
});

export default api;
