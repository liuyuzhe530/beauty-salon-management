import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    if (duration === 0) return; // 永久显示
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      text: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      text: 'text-red-800'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      text: 'text-blue-800'
    }
  };

  const style = styles[type];

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-lg p-4 flex items-start gap-3 shadow-md animate-slide-in`}
      role="alert"
    >
      {style.icon}
      <div className={`flex-1 ${style.text} text-sm font-medium`}>{message}</div>
      <button
        onClick={() => onClose(id)}
        className="p-1 hover:bg-white rounded transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export const ToastContainer: React.FC<{
  messages: ToastMessage[];
  onClose: (id: string) => void;
}> = ({ messages, onClose }) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
    {messages.map(msg => (
      <div key={msg.id} className="pointer-events-auto">
        <Toast {...msg} onClose={onClose} />
      </div>
    ))}
  </div>
);

// Toast Context 和 Hook
import { createContext, useContext, useState, useCallback } from 'react';

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      <ToastContainer messages={toasts} onClose={removeToast} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};




