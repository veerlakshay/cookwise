import React, { createContext, useState, useContext } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const themeColors = {
    light: {
      background: '#f9f9f9',
      text: '#333',
      card: '#fff',
      primary: '#E81B0E',
      border: '#ccc',
      placeholder: '#777',
    },
    dark: {
      background: '#121212',
      text: '#fff',
      card: '#1E1E1E',
      primary: '#FF6B6B',
      border: '#555',
      placeholder: '#ccc',
    },
  };

  const theme = isDarkMode ? themeColors.dark : themeColors.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);