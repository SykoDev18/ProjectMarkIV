import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Flame, TrendingUp } from 'lucide-react';

/**
 * CycleProgress — Barra de progreso de 30 días + info del ciclo.
 * 
 * Props:
 *   progress: { percent, dayPercent, completed, total, daysLeft, daysElapsed, weekNumber, weekLabel, setsMultiplier, weightMultiplier }
 *   status: 'active' | 'expiring_soon' | 'expired'
 *   cycleName: string
 *   onRenew: () => void  (solo si expiring_soon)
 */
export default function CycleProgress({ progress, status, cycleName, onRenew }) {
  if (!progress) return null;

  const statusColors = {
    active: 'from-blue-500 to-cyan-400',
    expiring_soon: 'from-yellow-500 to-orange-400',
    expired: 'from-red-500 to-pink-400'
  };

  const statusBg = {
    active: 'bg-blue-500/10 border-blue-500/20',
    expiring_soon: 'bg-yellow-500/10 border-yellow-500/20',
    expired: 'bg-red-500/10 border-red-500/20'
  };

  const weekBadgeColors = {
    'Adaptación': 'bg-green-500/15 text-green-400',
    'Carga': 'bg-blue-500/15 text-blue-400',
    'Sobrecarga': 'bg-orange-500/15 text-orange-400',
    'Descarga': 'bg-purple-500/15 text-purple-400',
  };

  return (
    <div className={`border rounded-2xl p-4 ${statusBg[status] || statusBg.active}`}>
      {/* Title row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-400">Ciclo de 30 días</span>
        </div>
        {progress.weekLabel && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${weekBadgeColors[progress.weekLabel] || 'bg-gray-700 text-gray-300'}`}>
            S{progress.weekNumber} — {progress.weekLabel}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress.dayPercent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${statusColors[status] || statusColors.active}`}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Clock size={12} className="text-gray-500" />
            <span className="text-sm font-bold text-white">{progress.daysLeft}</span>
          </div>
          <div className="text-[10px] text-gray-500">días restantes</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame size={12} className="text-orange-400" />
            <span className="text-sm font-bold text-white">{progress.completed}/{progress.total}</span>
          </div>
          <div className="text-[10px] text-gray-500">sesiones</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp size={12} className="text-green-400" />
            <span className="text-sm font-bold text-white">{progress.percent}%</span>
          </div>
          <div className="text-[10px] text-gray-500">progreso</div>
        </div>
      </div>

      {/* Expiring soon banner */}
      {status === 'expiring_soon' && (
        <motion.button
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onRenew}
          className="w-full mt-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-xs text-yellow-400 font-medium hover:bg-yellow-500/15 transition-colors"
        >
          ⏰ Tu ciclo vence en {progress.daysLeft} días — Renovar
        </motion.button>
      )}
    </div>
  );
}
