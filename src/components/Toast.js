'use client';
import { useState, useEffect } from 'react';

let setToastsGlobal = null;

export function ToastProvider({ children }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    setToastsGlobal = setList;
    return () => {
      setToastsGlobal = null;
    };
  }, []);
  return (
    <>
      {children}
      <div className="toast-container">
        {list.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.icon}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export function showToast(message, type = 'success', icon = '✅') {
  if (!setToastsGlobal) return;
  const id = Date.now();
  setToastsGlobal(prev => [...prev, { id, message, type, icon }]);
  setTimeout(() => {
    setToastsGlobal(prev => prev.filter(t => t.id !== id));
  }, 3000);
}
