import { createContext, useContext } from 'react';

export const ThemeContext = createContext({
  darkMode: false
});

export const useThemeContext = () => useContext(ThemeContext);
