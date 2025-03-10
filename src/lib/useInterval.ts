import { useEffect, useRef } from 'react'

//a custom hook to handle the main gameplay loop so that it can be abtracted away from the main code logic

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (delay === null) {
      return;
    }

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => {
      clearInterval(id);
    }
  }, [delay])
}