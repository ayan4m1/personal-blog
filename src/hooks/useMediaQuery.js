import { useState, useEffect } from 'react';

const queryMatches = (query) =>
  typeof window !== 'undefined' ? window.matchMedia(query).matches : false;

const bindListener = (object, event, handler) => {
  object.addEventListener(event, handler);

  return () => object.removeEventListener(event, handler);
};

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(queryMatches(query));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const listener = (event) => setMatches(event.matches);

    return bindListener(window.matchMedia(query), 'change', listener);
  }, [query]);

  return matches;
}
