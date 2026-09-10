'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function ToastNotification() {
  const [toastData, setToastData] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
    visible: boolean;
  }>({
    message: '',
    type: 'success',
    visible: false
  });

  useEffect(() => {
    const unsubscribe = toast.subscribe((message, type = 'success') => {
      setToastData({ message, type, visible: true });
      const timer = setTimeout(() => {
        setToastData((prev) => ({ ...prev, visible: false }));
      }, 3200);
      return () => clearTimeout(timer);
    });
    return unsubscribe;
  }, []);

  if (!toastData.visible) return null;

  const bgStyles = {
    success: 'bg-[#1A1311] text-white border-l-4 border-[#FF5E00]',
    info: 'bg-[#1A1311] text-white border-l-4 border-blue-500',
    error: 'bg-[#1A1311] text-white border-l-4 border-red-500'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#FF5E00] shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 ${bgStyles[toastData.type]}`}
    >
      {icons[toastData.type]}
      <span className="text-sm font-medium">{toastData.message}</span>
    </div>
  );
}
