import { useDispatch } from 'react-redux';
import { resetCounterSlice } from '../redux/slice/counterSlice';
import { resetDestinationSlice } from '../redux/slice/destinationSlice';

function ResetApp() {
  const dispatch = useDispatch();

  function handleReset() {
    dispatch(resetCounterSlice());
    dispatch(resetDestinationSlice());
  }

  return (
    <div className='text-center pt-4'>
      <button onClick={handleReset} className='btn btn-warning'>
        Reset App
      </button>
    </div>
  );
}

export default ResetApp;
