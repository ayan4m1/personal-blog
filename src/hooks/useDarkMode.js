import { useCallback, useEffect, useState } from 'react';
import useMediaQuery from './useMediaQuery';

const mediaQuery = '(prefers-color-scheme: dark)';

export default function useDarkMode() {
  const [state, setState] = useState(useMediaQuery(mediaQuery));
  const toggle = useCallback(() => setState((prevVal) => !prevVal), []);

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
