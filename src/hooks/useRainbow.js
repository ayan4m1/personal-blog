import { interpolateHslLong } from 'd3-interpolate';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function useRainbow(
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

  const animate = (time) => {
    setColor(interpolator(Math.abs(Math.sin(time / timeDilation))));

    requestId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestId.current);
  }, []);

  return color;
}
