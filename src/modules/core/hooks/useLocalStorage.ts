import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const isStringType = typeof initialValue === 'string';

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      if (item === null) return initialValue;

      return isStringType ? (item as unknown as T) : (JSON.parse(item) as T);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key, isStringType]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      if (typeof window === 'undefined') return;

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;

        const isString = typeof newValue === 'string';

        window.localStorage.setItem(
          key,
          isString ? (newValue as string) : JSON.stringify(newValue)
        );

        setStoredValue(newValue);
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
        return;
      }
      setStoredValue(readValue());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage' as any, handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage' as any, handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
