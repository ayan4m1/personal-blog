import { differenceInSeconds } from 'date-fns';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';

export default function useTimer(run = true, interval = 1000) {
  const intervalRef = useRef(null);
  const startTime = useMemo(() => Date.now(), []);
  const [running, setRunning] = useState(run);
  const [currentTime, setCurrentTime] = useState(startTime);
  const startTimer = useCallback(() => setRunning(true), [setRunning]);
  const stopTimer = useCallback(() => setRunning(false), [setRunning]);
  const toggleTimer = useCallback(
    () => setRunning((prevVal) => !prevVal),
    [setRunning]
  );
  const resetTimer = useCallback(
    () => setCurrentTime(startTime),
    [setCurrentTime, startTime]
  );
  const incrementTimer = useCallback(
    (amount = interval) => setCurrentTime((prevVal) => prevVal + amount),
    [setCurrentTime]
  );
  const handleDocumentVisibilityChange = useCallback(
    () => (document.hidden ? stopTimer() : startTimer()),
    []
  );

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(incrementTimer, interval);

      return () => clearInterval(intervalRef.current);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [running]);

  useEffect(() => {
    // if we remove visibilitychange on unmount we lose it, so only set it up once
    document.addEventListener(
      'visibilitychange',
      handleDocumentVisibilityChange
    );
  });

  return {
    elapsedTime: differenceInSeconds(currentTime, startTime),
    running,
    startTimer,
    stopTimer,
    toggleTimer,
    resetTimer,
    incrementTimer
  };
}
