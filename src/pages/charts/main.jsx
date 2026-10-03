import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../index.css';
import ChartsPage from './ChartsPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChartsPage />
  </StrictMode>
);
