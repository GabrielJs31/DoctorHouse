/**
 * useFileValidation
 * Valida tipo y tamaño del archivo
 */
import { useState, useEffect } from 'react';

const useFileValidation = (file, { types, maxSize }) => {
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) {
      setValid(false);
      setError(null);
      return;
    }
    if (!types.includes(file.type)) {
      setValid(false);
      setError('Formato no soportado');
      return;
    }
    if (file.size > maxSize) {
      setValid(false);
      setError('Archivo muy grande');
      return;
    }
    setValid(true);
    setError(null);
  }, [file, types, maxSize]);

  return { valid, error };
};

export default useFileValidation;
