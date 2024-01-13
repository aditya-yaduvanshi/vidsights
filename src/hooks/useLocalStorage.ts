import { useState, useEffect, useCallback } from 'react';
import { APP_PREFIX } from 'consts/app';

const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [value: T, setValue: React.Dispatch<React.SetStateAction<T>>] => {
  const getStoredValue = useCallback(() => {
    const item = localStorage.getItem(`${APP_PREFIX}:${key}`);
    return item ? JSON.parse(item) : initialValue;
  }, [key, initialValue]);

  const [value, setValue] = useState<T>(getStoredValue);

  useEffect(() => {
    localStorage.setItem(`${APP_PREFIX}:${key}`, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
};

export default useLocalStorage;