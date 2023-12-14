import { useCallback, useEffect, useState } from 'react';

const mediaQuery = '(prefers-color-scheme: dark)';

const prefersDarkMode = () =>
  window.matchMedia ? window.matchMedia(mediaQuery).matches : false;

export default function useDarkMode() {
  const [state, setState] = useState(prefersDarkMode());
  const toggle = useCallback(() => setState((prevVal) => !prevVal), []);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery);
    const listener = (event) => setState(!event.matches);

    mediaQueryList.addEventListener('change', listener);

    return () => mediaQueryList.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (state) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }, [state]);

  return {
    state,
    toggle
  };
}
