import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import {
  increment,
  decrement,
  decrementMultiplier,
  incrementMultiplier,
} from '../redux/slice/counterSlice';
import { useState, type ChangeEvent } from 'react';

function Counter() {
  const count = useSelector((state: RootState) => state.counterStore.count);
  const dispatch = useDispatch();
  const [multiplierValue, setMultiplierValue] = useState(10);

  const handleMultiplierChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMultiplierValue(Number(event.target.value));
  };

  return (
    <div className='m-4 row border text-center'>
      <h1 className='text-warning pt-3'>Counter App</h1>
      <hr />
      <span className='col-4 offset-4 badge bg-secondary fs-1 p-3 mb-3'>{count}</span>
      <div className='pb-2 col-6'>
        <div className='border p-2 '>
          <p className='text-success h3'>Basic Counter</p>
          <button onClick={() => dispatch(decrement())} className='btn btn-danger m-2'>
            Decrement
          </button>
          <button onClick={() => dispatch(increment())} className='btn btn-success m-2'>
            Increment
          </button>
        </div>
      </div>
      <div className='pb-2 col-6'>
        <div className='border p-2 '>
          <p className='text-success h3'>Multiplier Counter</p>
          <input
            type='text'
            placeholder='multiplier...'
            className='form-control my-2'
            value={multiplierValue}
            onChange={handleMultiplierChange}
          />
          <button
            onClick={() => dispatch(decrementMultiplier(multiplierValue))}
            className='btn btn-danger m-2'
          >
            Decrement
          </button>
          <button
            onClick={() => dispatch(incrementMultiplier(multiplierValue))}
            className='btn btn-success m-2'
          >
            Increment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Counter;
