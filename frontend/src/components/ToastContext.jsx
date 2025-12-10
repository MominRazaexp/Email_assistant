import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      message,
      type: type || "info"
    };
    setToasts((prev) => prev.concat(newToast));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((toast) => {
          const base =
            "px-4 py-2 rounded-md shadow text-sm text-white max-w-xs";
          let bg = "bg-gray-800";
          if (toast.type === "success") bg = "bg-green-600";
          if (toast.type === "error") bg = "bg-red-600";
          if (toast.type === "info") bg = "bg-blue-600";
          return (
            <div key={toast.id} className={base + " " + bg}>
              {toast.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  return ctx;
};