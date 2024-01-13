import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import useMediaQuery from 'hooks/useMediaQuery';
import { ThemeContext } from 'hooks/useThemeContext';

const mediaQuery = '(prefers-color-scheme: dark)';

export default function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useLocalStorageState('darkMode', {
    defaultValue: useMediaQuery(mediaQuery)
  });
  const toggleDarkMode = useCallback(
    () => setDarkMode((val) => !val),
    [setDarkMode]
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};
