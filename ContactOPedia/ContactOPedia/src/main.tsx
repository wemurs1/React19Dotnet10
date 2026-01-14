import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './Components/Layout/Header';
import Footer from './Components/Layout/Footer';
import ContactIndex from './Components/ContactPages/ContactIndex';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className='d-flex flex-column min-vh-100'>
      <Header />
      <div className='flex-fill'>
        <ContactIndex />
      </div>
      <Footer />
    </div>
  </StrictMode>
);
