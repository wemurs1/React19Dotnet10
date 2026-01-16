import { useEffect, useState } from 'react';

function LifeCycleDemo() {
  const [childCounter, setChildCounter] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Interval tiekc: ', Date.now());
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <p>Child Counter: {childCounter}</p>
      <button onClick={() => setChildCounter((o) => o + 1)}>Increment Child Counter</button>
    </div>
  );
}

export default LifeCycleDemo;
