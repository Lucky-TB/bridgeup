import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
}

const lightColors = {
  primary: '#6366F1',
  background: '#FEFEFE',
  surface: '#FFFFFF',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    muted: '#9CA3AF',
  },
  border: '#E5E7EB',
  accent: '#6366F1',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const darkColors = {
  primary: '#818CF8',
  background: '#0F172A',
  surface: '#1E293B',
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    muted: '#64748B',
  },
  border: '#334155',
  accent: '#818CF8',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
