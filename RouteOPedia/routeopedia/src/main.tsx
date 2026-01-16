import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SampleDemo from './Components/Hooks/SampleDemo';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SampleDemo />
  </StrictMode>
);
