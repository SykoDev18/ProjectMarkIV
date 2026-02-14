import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Dumbbell, Timer, Zap } from 'lucide-react';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const DAY_COLORS = {
  'Push': '#3B82F6',
  'Pull': '#10B981',
  'Legs': '#F59E0B',
  'Upper': '#8B5CF6',
  'Lower': '#EC4899',
  'Full Body': '#06B6D4',
};

function getColor(name) {
  for (const [key, color] of Object.entries(DAY_COLORS)) {
    if (name?.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return '#3B82F6';
}

export default function WorkoutCalendar({ sessions = [], onBack }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days = [];
    // Padding
    for (let i = 0; i < startDay; i++) {
      const d = new Date(year, month, -startDay + i + 1);
      days.push({ date: d, currentMonth: false });
    }
    // Days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), currentMonth: true });
    }
    // Fill to 42
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), currentMonth: false });
    }
    return days;
  }, [year, month]);

  const sessionsByDate = useMemo(() => {
    const map = {};
    sessions.forEach(s => {
      const dateKey = s.date.split('T')[0];
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(s);
    });
    return map;
  }, [sessions]);

  const selectedSessions = selectedDate ? (sessionsByDate[selectedDate] || []) : [];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date().toISOString().split('T')[0];

  // Year stats
  const yearSessions = sessions.filter(s => new Date(s.date).getFullYear() === year);
  const totalYearSessions = yearSessions.length;
  const totalYearVolume = yearSessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0);

  const formatTime = (s) => {
    if (!s) return '0:00';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 hover:text-white p-1"><ChevronLeft size={20} /></button>
        <h2 className="font-bold text-white flex items-center gap-2"><Calendar size={18} className="text-blue-400" /> Calendario</h2>
        <div />
      </div>

      {/* Year Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-3 text-center">
          <div className="text-2xl font-black text-white">{totalYearSessions}</div>
          <div className="text-[10px] text-gray-400">Sesiones en {year}</div>
        </div>
        <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-3 text-center">
          <div className="text-2xl font-black text-white">{Math.round(totalYearVolume).toLocaleString()}</div>
          <div className="text-[10px] text-gray-400">Kg totales</div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-800 rounded-full"><ChevronLeft size={18} className="text-gray-400" /></button>
          <div className="text-center">
            <span className="font-bold text-white">{MONTHS[month]} {year}</span>
            <button
              onClick={() => { setCurrentDate(new Date()); setSelectedDate(today); }}
              className="block text-xs text-blue-400 mx-auto hover:text-blue-300"
            >Hoy</button>
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-full"><ChevronRight size={18} className="text-gray-400" /></button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-gray-500 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((item, i) => {
            const dateStr = item.date.toISOString().split('T')[0];
            const daySessions = sessionsByDate[dateStr] || [];
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDate;

            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDate(dateStr)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                  isSelected ? 'bg-blue-500 text-white' 
                    : isToday ? 'bg-blue-500/20 text-blue-400' 
                    : item.currentMonth ? 'hover:bg-gray-800 text-white' : 'text-gray-600'
                }`}
              >
                <span className="text-xs font-medium">{item.date.getDate()}</span>
                {daySessions.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {daySessions.slice(0, 3).map((s, si) => (
                      <div key={si} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getColor(s.dayName) }} />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap gap-2 px-1">
        {Object.entries(DAY_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-gray-400">{name}</span>
          </div>
        ))}
      </div>

      {/* Selected Date Sessions */}
      {selectedDate && (
        <div className="space-y-2">
          <h3 className="text-xs text-gray-400 font-medium px-1">
            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          {selectedSessions.length === 0 ? (
            <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 text-center">
              <Calendar size={24} className="text-gray-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Sin entrenamiento este día</p>
            </div>
          ) : (
            selectedSessions.map((s, i) => (
              <div key={i} className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(s.dayName) }} />
                  <span className="font-semibold text-white text-sm">{s.dayName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Timer size={12} /> {formatTime(s.duration)}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Dumbbell size={12} /> {s.completedExercises?.length || 0} ej.
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Zap size={12} /> {Math.round(s.totalVolume || 0).toLocaleString()} kg
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
