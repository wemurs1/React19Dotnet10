import { useState } from 'react';
import attackImg from './images/attack.png';
import defenceImg from './images/defend.png';

function Counter() {
  const [count, setCount] = useState(0);

  const gameStatus = count <= -5 ? 'You Lost!' : count >= 5 ? 'You Won!!' : '';

  function handleIncrement() {
    const newValue = count + 1;
    setCount(newValue);
  }

  function handleDecrement() {
    const newValue = count - 1;
    setCount(newValue);
  }

  function handleRandomPlay() {
    const playMode = Math.round(Math.random());
    if (playMode === 0) {
      handleIncrement();
    } else {
      handleDecrement();
    }
  }

  function handleReset() {
    setCount(0);
  }

  function handleLog() {
    console.log(count);
  }

  return (
    <div className='container'>
      <div className='row text-white text-center'>
        <h1>Game Score: {count}</h1>
        <p>You win at +5 points and lose at -5 points!</p>
        <p>Last Play: </p>
        <h3>Game Status : {gameStatus}</h3>
        <div className='col-6 col-md-3 offset-md-3'>
          <img
            src={attackImg}
            style={{ width: '100%', cursor: 'pointer', border: '1px solid green' }}
            onClick={handleIncrement}
            className='p-4 rounded'
          ></img>
        </div>
        <div className='col-6 col-md-3 offset-md-3'>
          <img
            src={defenceImg}
            style={{ width: '100%', cursor: 'pointer', border: '1px solid red' }}
            onClick={handleDecrement}
            className='p-4 rounded'
          ></img>
        </div>
        <div className='col-12 col-md-4 offset-md-4'>
          <button onClick={handleRandomPlay} className='btn btn-success m-2 w-100'>
            Random Play
          </button>
          <br />
          <button onClick={handleReset} className='btn btn-danger m-2 w-100'>
            Reset
          </button>
          <button onClick={handleLog} className='btn btn-warning m-2 w-100'>
            Log
          </button>
        </div>
      </div>
    </div>
  );
}

export default Counter;
