import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../index.css';
import InsightsPage from './InsightsPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InsightsPage />
  </StrictMode>
);
