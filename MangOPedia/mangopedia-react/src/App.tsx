import { Bounce, ToastContainer } from 'react-toastify';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import AppRoutes from './routes/AppRouter';

function App() {
  return (
    <div className='d-flex flex-column min-vh-100 bg-body'>
      <Header />
      <main className='flex-grow-1'>
        <AppRoutes />
      </main>
      <Footer />
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        transition={Bounce}
      />
    </div>
  );
}

export default App;
