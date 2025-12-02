import React from 'react';
import { motion } from 'framer-motion';

const IOSButton = ({ children, onClick, variant = 'primary', className = "", size = 'md', type = "button" }) => {
  const baseClass = "rounded-full font-semibold flex items-center justify-center gap-2 transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700",
    secondary: "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600",
    danger: "bg-red-500 text-white shadow-lg shadow-red-500/30",
    ghost: "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base w-full"
  };

  const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };

  return (
    <motion.button 
      type={type}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => { triggerHaptic(); onClick && onClick(e); }} 
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default IOSButton;
