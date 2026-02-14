import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy, TrendingUp, Calendar, Edit3, Check, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';

const PR_ICONS = {
  bench:    { icon: '🏋️', color: '#3B82F6' },
  squat:    { icon: '🦵', color: '#10B981' },
  deadlift: { icon: '💀', color: '#EF4444' },
  ohp:      { icon: '🙌', color: '#F59E0B' },
  row:      { icon: '🚣', color: '#8B5CF6' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1C2333] border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400">{label}</p>
      <p className="text-white font-bold">{payload[0].value} kg</p>
    </div>
  );
};

// pr = { id, name, weight, date, history: [{weight, date}] }
function PRCard({ pr, onUpdate, color }) {
  const iconConfig = PR_ICONS[pr.id] || { icon: '💪', color: color || '#3B82F6' };
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(pr.weight);
  const [showChart, setShowChart] = useState(false);

  const chartData = useMemo(() => {
    return (pr.history || []).map(h => ({
      date: new Date(h.date).toLocaleDateString('es', { day: '2-digit', month: 'short' }),
      kg: h.weight,
    }));
  }, [pr.history]);

  const improvement = useMemo(() => {
    if (chartData.length < 2) return null;
    const first = chartData[0].kg;
    const last = chartData[chartData.length - 1].kg;
    return last - first;
  }, [chartData]);

  const savePR = () => {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      onUpdate(pr.id, num);
      setEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#111827] border border-white/[0.06] rounded-2xl overflow-hidden"
    >
      <div className="p-4 flex items-center gap-3">
        <div className="text-2xl">{iconConfig.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-400">{pr.name}</div>
          {editing ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="number"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className="w-20 bg-[#1C2333] px-2 py-1 rounded-lg text-sm text-white outline-none border border-blue-500/50"
                autoFocus
              />
              <span className="text-xs text-gray-500">kg</span>
              <button onClick={savePR} className="text-green-400 p-1"><Check size={14} /></button>
              <button onClick={() => { setEditing(false); setVal(pr.weight); }} className="text-red-400 p-1"><X size={14} /></button>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{pr.weight || '—'}</span>
              <span className="text-xs text-gray-500">kg</span>
              {improvement != null && improvement !== 0 && (
                <span className={`text-xs font-medium ml-2 ${improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {improvement > 0 ? '+' : ''}{improvement} kg
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <button onClick={() => setEditing(!editing)}
            className="p-2 bg-[#1C2333] rounded-lg text-gray-400 hover:text-white transition-colors">
            <Edit3 size={14} />
          </button>
          <button onClick={() => setShowChart(!showChart)}
            className={`p-2 rounded-lg transition-colors ${showChart ? 'bg-blue-500/20 text-blue-400' : 'bg-[#1C2333] text-gray-400 hover:text-white'}`}>
            <TrendingUp size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showChart && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 200, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {chartData.length >= 2 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id={`grad-${pr.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={iconConfig.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={iconConfig.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="kg" stroke={iconConfig.color} strokeWidth={2} fill={`url(#grad-${pr.id})`} dot={{ r: 3, fill: iconConfig.color }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[160px] flex items-center justify-center text-sm text-gray-500">
                  Registra más PRs para ver la gráfica
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PRTracker({ stats, onBack }) {
  const { prs = {}, sessions = [], streak = 0, weekStats = {}, allTimeStats = {} } = stats || {};
  const prList = Object.entries(prs);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-white p-1"><ChevronLeft size={20} /></button>
        <h2 className="font-bold text-white flex items-center gap-2">
          <Trophy size={18} className="text-yellow-400" /> Personal Records
        </h2>
      </div>

      {/* Weekly Stats */}
      <div className="bg-gradient-to-br from-[#111827] to-[#0F172A] border border-white/[0.06] rounded-2xl p-4">
        <div className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
          <Calendar size={12} /> Estadísticas de la semana
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-xl font-black text-white">{weekStats.totalSessions || 0}</div>
            <div className="text-[10px] text-gray-500">Sesiones</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-blue-400">
              {(weekStats.totalVolume || 0) >= 1000 ? `${((weekStats.totalVolume || 0) / 1000).toFixed(1)}k` : weekStats.totalVolume || 0}
            </div>
            <div className="text-[10px] text-gray-500">Vol. (kg)</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-orange-400">{streak || 0}</div>
            <div className="text-[10px] text-gray-500">Racha</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-green-400 truncate">{weekStats.topMuscle || '—'}</div>
            <div className="text-[10px] text-gray-500">Top Músculo</div>
          </div>
        </div>
      </div>

      {/* PR Cards */}
      <div className="space-y-3">
        {prList.map(([id, pr]) => (
          <PRCard
            key={id}
            pr={{ id, name: pr.name || id, weight: pr.weight, date: pr.date, history: pr.history || [] }}
            onUpdate={stats?.updatePR || (() => {})}
            color={PR_ICONS[id]?.color}
          />
        ))}
        {prList.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            Aún no hay PRs registrados. ¡Empieza a entrenar!
          </div>
        )}
      </div>

      {/* All-time stats */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">All-Time Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1C2333] rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-white">{allTimeStats.totalSessions || sessions.length || 0}</div>
            <div className="text-xs text-gray-500">Total Sesiones</div>
          </div>
          <div className="bg-[#1C2333] rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-blue-400">
              {(() => {
                const total = allTimeStats.totalVolume || 0;
                return total >= 1000000 ? `${(total / 1000000).toFixed(1)}M` :
                       total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total;
              })()}
            </div>
            <div className="text-xs text-gray-500">Vol. Total (kg)</div>
          </div>
          <div className="bg-[#1C2333] rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-green-400">
              {allTimeStats.prTotal || prList.reduce((s, [, pr]) => s + (pr.weight || 0), 0)}
            </div>
            <div className="text-xs text-gray-500">PR Total (kg)</div>
          </div>
          <div className="bg-[#1C2333] rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-orange-400">{streak || 0}</div>
            <div className="text-xs text-gray-500">Semanas</div>
          </div>
        </div>
      </div>
    </div>
  );
}
