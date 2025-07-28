import { useCallback } from 'react';
import { addToast } from '@heroui/toast';

export interface ToastOptions{
    title: string;
    description: string;
    color?: 'success' | 'default' | 'warning' | 'danger' | 'foreground' | 'primary' | 'secondary' ;
    timeout?: number;
}

const useAppToasts = () => {
  const showToast = useCallback((options : ToastOptions) => {
    addToast({
      title: options.title,
      description: options.description,
      color: options.color,
      timeout: options.timeout,
    });
  }, []);


  return { showToast };
};

export default useAppToasts;