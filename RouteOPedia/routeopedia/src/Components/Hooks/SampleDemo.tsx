import { useState } from 'react';
import LifeCycleDemo from './LifeCycleDemo';

function SampleDemo() {
  const [counter, setCounter] = useState(0);
  const [showComponent, setShowComponent] = useState(true);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>React Hooks</h2>
      <button onClick={() => setShowComponent((o) => !o)}>
        {showComponent ? 'Unmount Component' : 'Mount Component'}
      </button>
      <p>Parent Counter: {counter}</p>
      <button onClick={() => setCounter((o) => o + 1)}>Increment Parent Counter</button>

      <br />
      <br />
      {showComponent && <LifeCycleDemo />}
    </div>
  );
}

export default SampleDemo;
