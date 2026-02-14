import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, Trophy, Calendar, ChevronRight, Flame, 
  Play, BookOpen, Zap, Edit3, Check, X
} from 'lucide-react';
import CycleProgress from './components/CycleProgress';

export default function GymDashboard({ cycle, progress, status, stats, onNavigate, onRenew }) {
  const { prs = {}, streak = 0, weekStats = {}, allTimeStats = {} } = stats || {};
  const routine = cycle?.routine || { name: 'Mi Rutina', days: [] };
  const prList = Object.entries(prs).slice(0, 6);
  const [editingPR, setEditingPR] = useState(null);
  const [prValue, setPrValue] = useState('');

  const startEditPR = (id, weight) => { setEditingPR(id); setPrValue(String(weight || 0)); };

  const savePR = (prId) => {
    const val = parseFloat(prValue);
    if (!isNaN(val) && val > 0 && stats?.updatePR) stats.updatePR(prId, val);
    setEditingPR(null);
  };

  return (
    <div className="space-y-5">
      {/* Cycle Progress */}
      <CycleProgress 
        progress={progress} 
        status={status} 
        cycleName={routine.name} 
        onRenew={onRenew} 
      />

      {/* Streak + Week Stats */}
      <div className="grid grid-cols-3 gap-2">
        <motion.div whileTap={{ scale: 0.97 }} className="bg-[#111827] border border-white/[0.06] rounded-2xl p-3 text-center">
          <Flame size={22} className="text-orange-400 mx-auto mb-1" />
          <div className="text-2xl font-black text-white">{streak}</div>
          <div className="text-[10px] text-gray-500">racha</div>
        </motion.div>
        <motion.div whileTap={{ scale: 0.97 }} className="bg-[#111827] border border-white/[0.06] rounded-2xl p-3 text-center">
          <Dumbbell size={22} className="text-blue-400 mx-auto mb-1" />
          <div className="text-2xl font-black text-white">{weekStats.totalSessions || 0}</div>
          <div className="text-[10px] text-gray-500">esta semana</div>
        </motion.div>
        <motion.div whileTap={{ scale: 0.97 }} className="bg-[#111827] border border-white/[0.06] rounded-2xl p-3 text-center">
          <Zap size={22} className="text-yellow-400 mx-auto mb-1" />
          <div className="text-2xl font-black text-white">
            {(weekStats.totalVolume || 0) >= 1000 
              ? `${((weekStats.totalVolume || 0) / 1000).toFixed(1)}k` 
              : weekStats.totalVolume || 0}
          </div>
          <div className="text-[10px] text-gray-500">vol. (kg)</div>
        </motion.div>
      </div>

      {/* PRs Panel */}
      {prList.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Trophy size={16} className="text-yellow-400" /> Records Personales
            </h3>
            <button 
              onClick={() => onNavigate('prs')}
              className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300"
            >
              Ver todos <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {prList.map(([id, pr]) => {
              const isRecent = pr.date && (Date.now() - new Date(pr.date).getTime()) < 14 * 24 * 60 * 60 * 1000;
              return (
                <motion.div 
                  key={id}
                  whileTap={{ scale: 0.97 }}
                  className={`bg-[#1C2333] border rounded-xl p-3 relative ${isRecent ? 'border-yellow-500/40' : 'border-white/[0.06]'}`}
                >
                  {isRecent && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Zap size={10} className="text-black" />
                    </div>
                  )}
                  <div className="text-xs text-gray-400 truncate">{pr.name || id}</div>
                  {editingPR === id ? (
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="number"
                        value={prValue}
                        onChange={(e) => setPrValue(e.target.value)}
                        className="w-16 bg-gray-800 rounded px-2 py-1 text-white text-sm outline-none"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && savePR(id)}
                      />
                      <button onClick={() => savePR(id)} className="text-green-400 p-0.5"><Check size={14} /></button>
                      <button onClick={() => setEditingPR(null)} className="text-gray-500 p-0.5"><X size={14} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xl font-bold text-white">{pr.weight || '—'}<span className="text-xs text-gray-400 ml-0.5">kg</span></span>
                      <button onClick={() => startEditPR(id, pr.weight)} className="text-gray-500 hover:text-white p-1"><Edit3 size={12} /></button>
                    </div>
                  )}
                  {pr.date && <div className="text-[10px] text-gray-500 mt-1">{typeof pr.date === 'string' ? pr.date.split('T')[0] : ''}</div>}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Routine — Days */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Dumbbell size={16} className="text-blue-400" /> {routine.name || "Mi Rutina"}
          </h3>
        </div>
        <div className="space-y-2">
          {routine.days.map((day, idx) => (
            <motion.button
              key={day.id || idx}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('session', { dayIndex: idx })}
              className="w-full bg-[#111827] border border-white/[0.06] rounded-2xl p-4 text-left transition-all hover:border-blue-500/30"
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="font-semibold text-white">{day.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{day.focus}</span>
                </div>
                <ChevronRight size={16} className="text-gray-500" />
              </div>
              <div className="text-xs text-gray-500">{day.exercises?.length || 0} ejercicios</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const today = new Date().getDay();
            const dayIndex = Math.min(today > 0 ? today - 1 : 0, routine.days.length - 1);
            onNavigate('session', { dayIndex: Math.max(0, dayIndex) });
          }}
          className="bg-blue-500 rounded-2xl p-4 flex flex-col items-center gap-2 text-white"
        >
          <Play size={24} />
          <span className="text-xs font-medium text-center">Entrenar Hoy</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('library')}
          className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4 flex flex-col items-center gap-2 text-gray-300"
        >
          <BookOpen size={24} />
          <span className="text-xs font-medium text-center">Biblioteca</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('calendar')}
          className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4 flex flex-col items-center gap-2 text-gray-300"
        >
          <Calendar size={24} />
          <span className="text-xs font-medium text-center">Calendario</span>
        </motion.button>
      </div>
    </div>
  );
}
