import { useEffect, useState } from 'react';

const mediaQuery = '(prefers-reduced-motion: no-preference)';

const prefersReducedMotion = () => !window.matchMedia(mediaQuery).matches;

export default function usePrefersReducedMotion() {
  const [state, setState] = useState(prefersReducedMotion());

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery);
    const listener = (event) => setState(!event.matches);

    mediaQueryList.addEventListener('change', listener);

    return () => mediaQueryList.removeEventListener('change', listener);
  }, []);

  return state;
}
