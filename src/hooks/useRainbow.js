import { interpolateHslLong } from 'd3-interpolate';
import { useEffect, useRef, useState } from 'react';

const interpolator = interpolateHslLong('#ff0000', '#0000ff');

export default function useRainbow(timeDilation = 2000) {
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
