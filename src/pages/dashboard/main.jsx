import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../index.css';
import DashboardPage from './DashboardPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DashboardPage />
  </StrictMode>
);
