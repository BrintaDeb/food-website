type ToastListener = (message: string, type?: 'success' | 'info' | 'error') => void;

let listener: ToastListener | null = null;

export const toast = {
  subscribe(fn: ToastListener) {
    listener = fn;
    return () => {
      listener = null;
    };
  },
  show(message: string, type: 'success' | 'info' | 'error' = 'success') {
    if (listener) {
      listener(message, type);
    }
  }
};
