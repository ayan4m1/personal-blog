import { interpolateHslLong } from 'd3-interpolate';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

export default function useRainbow(
  run = true,
  startColor = '#ff0000',
  endColor = '#0000ff',
  timeDilation = 2000
) {
  const interpolator = useMemo(
    () => interpolateHslLong(startColor, endColor),
    [startColor, endColor]
  );
  const requestId = useRef(null);
  const [color, setColor] = useState(null);
  const [running, setRunning] = useState(run);
  const start = useCallback(() => setRunning(true), []);
  const stop = useCallback(() => setRunning(false), []);

  const animate = (time) => {
    setColor(interpolator(Math.abs(Math.sin(time / timeDilation))));

    if (running) {
      requestId.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (running) {
      requestId.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestId.current);
    }

    return () => cancelAnimationFrame(requestId.current);
  }, [running]);

  return { color, start, stop };
}
