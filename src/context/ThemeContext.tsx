import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeContextType, Theme } from '../types';
import { themes } from '@ui/tokens';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const palette = themes[theme].colors;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: palette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useDarkMode() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return { isDark, toggleTheme };
}
