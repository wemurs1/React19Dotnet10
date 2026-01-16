import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Counter from './components/Counter';
import DestinationList from './components/DestinationList';
import DestinationFact from './components/DestinationFact';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Header />
      <div className='d-flex flex-column min-vh-100'>
        <main className='flex-grow-1 row'>
          <div className='col-12'>
            <Counter />
            <div className='p-3 m-4 border'>
              <h4 className='text-success pb-4 text-center'>Destination List</h4>
              <DestinationList />
              <DestinationFact/>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </Provider>
  </StrictMode>
);
