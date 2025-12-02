import React from 'react';
import { motion } from 'framer-motion';

const IOSCard = ({ children, className = "", onClick, style, title }) => (
  <motion.div 
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
    style={style}
    className={`bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-sm rounded-3xl p-5 transition-colors duration-300 ${className}`}
  >
    {title && <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">{title}</h3>}
    {children}
  </motion.div>
);

export default IOSCard;
