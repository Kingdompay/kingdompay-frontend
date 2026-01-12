import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'info',
        warning: 'warning'
    };

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-orange-500'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-4 right-4 z-50 ${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md`}
        >
            <span className="material-symbols-outlined text-2xl">{icons[type]}</span>
            <p className="m-0 font-medium">{message}</p>
            <button
                onClick={onClose}
                className="ml-auto bg-white/20 hover:bg-white/30 border-none rounded-full w-6 h-6 flex items-center justify-center cursor-pointer transition-colors"
            >
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
        </motion.div>
    );
};

export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-0 right-0 p-4 z-50 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto mb-3">
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                            duration={toast.duration}
                        />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Toast;
