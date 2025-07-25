// doctorHouseService.js: funciones específicas de tu API

import api from './api';

/**
 * Envía el audio al backend y devuelve
 * la data extraída (JSON con toda la ficha médica).
 *
 * @param {File} audioFile — archivo de audio seleccionado
 * @returns {Promise<Object>} — data.extracted_data del servidor
 */
export const procesarAudio = async (audioFile) => {
  const form = new FormData();
  form.append('file', audioFile);

  // POST / → devuelve { status:"ok", extracted_data: {...} }
  const { data } = await api.post('/transcribe', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data?.extracted_data ?? data; // :contentReference[oaicite:2]{index=2}
};
