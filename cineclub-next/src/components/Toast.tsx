'use client';

import { useState, useEffect } from 'react';

type ToastProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // CORREGIDO: Color de éxito cambiado a 'bg-rose-600'
  const bgColor = type === 'success' ? 'bg-rose-600' : 'bg-red-700';

  return (
    <div className={`fixed bottom-5 right-5 p-4 rounded-lg text-white shadow-xl ${bgColor} animate-fade-in z-50 border border-black/20`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-xl font-bold opacity-70 hover:opacity-100">&times;</button>
      </div>
    </div>
  );
}