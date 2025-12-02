import React from 'react';

const IOSHeader = ({ title, subtitle, rightAction, large = true }) => (
  <div className={`flex justify-between items-end mb-6 ${large ? 'pt-4' : ''}`}>
    <div>
      {subtitle && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{subtitle}</p>}
      <h1 className={`${large ? 'text-3xl' : 'text-xl'} font-bold tracking-tight text-slate-900 dark:text-white`}>{title}</h1>
    </div>
    {rightAction}
  </div>
);

export default IOSHeader;
