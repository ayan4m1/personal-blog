---
path: /react/use-rainbow-hook
date: 2023-12-05
description: A simple custom hook for lerping through the color wheel.
title: useRainbow Hook
---

Let's put together a simple hook in React that performs "linear interpolation" through the color wheel using hooks intelligently. This will give us a "useRainbow" hook that we can use to animate the color of anything on your page.

## The Hook

```jsx
// d3-interpolate handles the linear interpolation math
import { interpolateHslLong } from 'd3-interpolate';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function useRainbow(
  startColor = '#ff0000', // start at red
  endColor = '#0000ff', // end at blue
  timeDilation = 2000 // slow time down by a factor of 2000, this depends on your CPU/GPU
) {
  // interpolateHslLong takes two colors and returns a function which can interpolate between them.
  // here, useMemo helps us only recalculate the interpolation function if/when the input colors change
  const interpolator = useMemo(
    () => interpolateHslLong(startColor, endColor),
    [startColor, endColor]
  );
  // requestId will be used to store the temporary ID assigned to an in-flight animation frame request.
  // if the component unmounts, we will cancel this in-flight request to stop the render loop.
  const requestId = useRef(null);
  // this stores the current color which this hook returns directly
  const [color, setColor] = useState(null);

  // this function is called every "frame" and updates the output color
  const animate = (time) => {
    // (time / timeDilation) will increase monotonically. Pass it into abs(sin()) to convert it to a
    // infinite sweep between 0 and 1. This is the input range for the interpolator function.
    setColor(interpolator(Math.abs(Math.sin(time / timeDilation))));

    // this is what causes the rendering to loop "infinitely"
    requestId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // kick off the first animation frame request
    requestId.current = requestAnimationFrame(animate);

    // if the component unmounts, cancel the render loop
    return () => cancelAnimationFrame(requestId.current);
  }, []);

  // return the current color
  return color;
}
```

## Example Usage

```jsx
import useRainbow from 'hooks/useRainbow';

export default function Component() {
  const color = useRainbow();

  return <p style={{ color }}>Hello World</p>;
}
```
