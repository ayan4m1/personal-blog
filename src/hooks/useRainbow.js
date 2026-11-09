import { interpolateHslLong } from 'd3-interpolate';
import { useEffect, useMemo, useState } from 'react';

export default function useRainbow(
  run = true,
  loop = true,
  startColor = '#ff0000',
  endColor = '#0000ff',
  timeDilation = 2000
) {
  const interpolator = useMemo(
    () => interpolateHslLong(startColor, endColor),
    [startColor, endColor]
  );
  const [color, setColor] = useState(null);

  useEffect(() => {
    if (!run) {
      return;
    }

    let requestId = null;
    const animate = (time) => {
      setColor(
        interpolator(
          loop ? Math.abs(Math.sin(time / timeDilation)) : time / timeDilation
        )
      );
      requestId = requestAnimationFrame(animate);
    };

    requestId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestId);
  }, [run, interpolator, loop, timeDilation]);

  return { color };
}
