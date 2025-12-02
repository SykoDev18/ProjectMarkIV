import React from 'react';

const FitnessRing = ({ progress, color = "#3b82f6", size = 60, stroke = 6, icon: Icon }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="transparent" className="text-slate-200 dark:text-slate-700" />
        <circle 
          cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="transparent" 
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {Icon && <Icon size={size * 0.4} className="absolute text-slate-600 dark:text-slate-300" />}
    </div>
  );
};

export default FitnessRing;
