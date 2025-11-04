'use client';

import { useState, useEffect } from 'react';

type ToastProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    // Cierra el toast automáticamente después de 3 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`fixed bottom-5 right-5 p-4 rounded-lg text-white shadow-xl ${bgColor} animate-fade-in z-50`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-xl font-bold">&times;</button>
      </div>
    </div>
  );
}