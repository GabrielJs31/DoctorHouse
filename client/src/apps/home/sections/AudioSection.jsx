// AudioSection.jsx: sección que sube audio y recibe ficha
import React from 'react';
import AudioUploader from '../../../components/AudioUploader';

const AudioSection = ({ onData }) => (
  <AudioUploader onData={onData} />
);

export default AudioSection;
