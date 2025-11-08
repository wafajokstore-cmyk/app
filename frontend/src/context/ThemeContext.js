import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ThemeContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });
  
  const [colors, setColors] = useState(() => {
    const saved = localStorage.getItem('colors');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      primaryColor: '#3B82F6',
      darkBg: '#0F0F0F',
      lightBg: '#FFFFFF',
      textColor: '#E5E7EB'
    };
  });

  const [logo, setLogo] = useState(() => {
    return localStorage.getItem('logo') || '';
  });

  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API}/settings`);
        const settings = response.data;
        
        if (settings.primaryColor) {
          const newColors = {
            primaryColor: settings.primaryColor,
            darkBg: settings.darkBg,
            lightBg: settings.lightBg,
            textColor: settings.textColor
          };
          setColors(newColors);
          localStorage.setItem('colors', JSON.stringify(newColors));
        }
        
        if (settings.logo) {
          setLogo(settings.logo);
          localStorage.setItem('logo', settings.logo);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    
    fetchSettings();
  }, []);

  // Apply theme and colors to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--bg-color', colors.darkBg);
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--bg-color', colors.lightBg);
    }
    
    root.style.setProperty('--primary-color', colors.primaryColor);
    root.style.setProperty('--text-color', colors.textColor);
    
    localStorage.setItem('theme', theme);
  }, [theme, colors]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateColors = (newColors) => {
    setColors(prev => ({ ...prev, ...newColors }));
    localStorage.setItem('colors', JSON.stringify({ ...colors, ...newColors }));
  };

  const updateLogo = (newLogo) => {
    setLogo(newLogo);
    localStorage.setItem('logo', newLogo);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, updateColors, logo, updateLogo }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};