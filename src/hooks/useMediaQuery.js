import { useState, useEffect } from 'react';

const queryMatches = (query) =>
  typeof window !== 'undefined' ? window.matchMedia(query).matches : false;

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(queryMatches(query));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);

    mediaQueryList.addEventListener('change', listener);

    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
