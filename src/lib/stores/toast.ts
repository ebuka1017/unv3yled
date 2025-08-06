import { writable } from 'svelte/store';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  return {
    subscribe,
    add: (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration || 5000
      };
      
      update(toasts => [...toasts, newToast]);
      
      // Auto remove after duration
      setTimeout(() => {
        this.remove(id);
      }, newToast.duration);
    },
    remove: (id: string) => {
      update(toasts => toasts.filter(toast => toast.id !== id));
    },
    clear: () => {
      update(() => []);
    }
  };
}

export const toastStore = createToastStore();