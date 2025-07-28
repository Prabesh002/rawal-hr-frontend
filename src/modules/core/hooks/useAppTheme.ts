import { useEffect, useCallback } from 'react';
import { useTheme as useHeroUITheme } from '@heroui/use-theme';

import useLocalStorage from './useLocalStorage';

export type AppTheme = 'light' | 'dark' | 'system'; 

const THEME_STORAGE_KEY = 'app-theme';

export function useAppTheme() {
  const { setTheme: setHeroUITheme } = useHeroUITheme();
  const [storedTheme, setStoredTheme] = useLocalStorage<AppTheme>(THEME_STORAGE_KEY, 'system');

  const applyTheme = useCallback((newTheme: AppTheme) => {
    let effectiveTheme: 'light' | 'dark';

    if (newTheme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      effectiveTheme = newTheme;
    }

    setHeroUITheme(effectiveTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(effectiveTheme);
  }, [setHeroUITheme]);


  useEffect(() => {
    applyTheme(storedTheme);
  }, [storedTheme, applyTheme]);


  useEffect(() => {
    if (storedTheme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storedTheme, applyTheme]);

  const setTheme = useCallback((newTheme: AppTheme) => {
    setStoredTheme(newTheme); 
  }, [setStoredTheme]);

  const currentEffectiveTheme = (() => {
    if (storedTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return storedTheme;
  })();


  return {
    theme: storedTheme, 
    effectiveTheme: currentEffectiveTheme, 
    setTheme,
    isDark: currentEffectiveTheme === 'dark', 
  };
}