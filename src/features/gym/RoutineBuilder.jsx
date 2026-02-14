import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Plus, Trash2, ChevronUp, ChevronDown, Save,
  Wand2, Copy, X, Search, Check, Dumbbell, Settings
} from 'lucide-react';
import { EXERCISE_DATABASE, getAllExercises, findExercise, ROUTINE_TEMPLATES, MUSCLE_GROUPS } from './data/gymData';

const GOALS = [
  { id: 'hipertrofia', name: 'Hipertrofia', desc: 'Ganar músculo', icon: '💪' },
  { id: 'fuerza', name: 'Fuerza', desc: 'Levantar más peso', icon: '🏋️' },
  { id: 'resistencia', name: 'Resistencia', desc: 'Resistencia muscular', icon: '🔄' },
  { id: 'definicion', name: 'Definición', desc: 'Pérdida de grasa', icon: '🔥' },
];

const EXPERIENCE = [
  { id: 'principiante', name: 'Principiante', desc: '0-6 meses' },
  { id: 'intermedio', name: 'Intermedio', desc: '6 meses - 2 años' },
  { id: 'avanzado', name: 'Avanzado', desc: 'Más de 2 años' },
];

function ExercisePicker({ onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const allExercises = getAllExercises();

  const filtered = allExercises.filter(ex => {
    if (search) return ex.name.toLowerCase().includes(search.toLowerCase()) || ex.nameEn.toLowerCase().includes(search.toLowerCase());
    if (selectedGroup) {
      const group = EXERCISE_DATABASE[selectedGroup] || [];
      return group.some(g => g.id === ex.id);
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111827] rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col"
      >
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-white">Agregar Ejercicio</h3>
          <button onClick={onClose} className="text-gray-400"><X size={18} /></button>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelectedGroup(null); }}
              placeholder="Buscar ejercicio..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-800 rounded-xl text-sm text-white outline-none border border-gray-700 focus:border-blue-500"
            />
          </div>
        </div>

        {!search && (
          <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedGroup(null)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${!selectedGroup ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              Todos
            </button>
            {MUSCLE_GROUPS.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g.id)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${selectedGroup === g.id ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                {g.icon} {g.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filtered.map(ex => (
            <button
              key={ex.id}
              onClick={() => { onSelect(ex); onClose(); }}
              className="w-full p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700 text-left flex items-center gap-3 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                <Dumbbell size={14} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{ex.name}</div>
                <div className="text-xs text-gray-500">{ex.musclesPrimary?.join(', ')}</div>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                ex.type === 'compuesto' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
              }`}>{ex.type}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AutoGenerator({ onGenerate, onClose, settings }) {
  const [goal, setGoal] = useState(settings.goal || 'hipertrofia');
  const [experience, setExperience] = useState(settings.experience || 'intermedio');
  const [days, setDays] = useState(4);

  const handleGenerate = () => {
    // Find best matching template
    const keys = Object.keys(ROUTINE_TEMPLATES);
    let bestKey = keys.find(k => k.startsWith(`${days}_`)) || keys.find(k => k.includes('4_')) || keys[0];
    onGenerate(bestKey, { goal, experience, days });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111827] rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
      >
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2"><Wand2 size={18} className="text-blue-400" /> Generar Rutina</h3>
          <button onClick={onClose} className="text-gray-400"><X size={18} /></button>
        </div>

        <div className="p-4 space-y-5">
          {/* Goal */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Objetivo principal</label>
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map(g => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    goal === g.id ? 'bg-blue-500/20 border border-blue-500' : 'bg-gray-800 border border-transparent'
                  }`}
                >
                  <span className="text-lg">{g.icon}</span>
                  <div className="text-sm text-white font-medium mt-1">{g.name}</div>
                  <div className="text-[10px] text-gray-400">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Experiencia</label>
            <div className="flex gap-2">
              {EXPERIENCE.map(e => (
                <button
                  key={e.id}
                  onClick={() => setExperience(e.id)}
                  className={`flex-1 p-2.5 rounded-xl text-center transition-all ${
                    experience === e.id ? 'bg-blue-500/20 border border-blue-500' : 'bg-gray-800 border border-transparent'
                  }`}
                >
                  <div className="text-xs text-white font-medium">{e.name}</div>
                  <div className="text-[10px] text-gray-400">{e.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Days per week */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Días por semana</label>
            <div className="flex gap-2">
              {[3, 4, 5, 6].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`flex-1 py-3 rounded-xl text-center font-bold transition-all ${
                    days === d ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-3.5 rounded-xl bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-600"
          >
            <Wand2 size={18} /> Generar Rutina
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function RoutineBuilder({ store, onBack }) {
  const { routine, updateRoutine, applyTemplate, settings, setSettings } = store;
  const [localRoutine, setLocalRoutine] = useState(JSON.parse(JSON.stringify(routine)));
  const [showPicker, setShowPicker] = useState(null); // { dayIndex }
  const [showAuto, setShowAuto] = useState(false);
  const [routineName, setRoutineName] = useState(localRoutine.name || '');

  const addDay = () => {
    setLocalRoutine(prev => ({
      ...prev,
      days: [...prev.days, { id: Date.now(), name: `Día ${prev.days.length + 1}`, focus: '', exercises: [] }]
    }));
  };

  const removeDay = (dayIndex) => {
    setLocalRoutine(prev => ({ ...prev, days: prev.days.filter((_, i) => i !== dayIndex) }));
  };

  const duplicateDay = (dayIndex) => {
    const day = localRoutine.days[dayIndex];
    const newDay = { ...JSON.parse(JSON.stringify(day)), id: Date.now(), name: day.name + ' (copia)' };
    setLocalRoutine(prev => ({
      ...prev,
      days: [...prev.days.slice(0, dayIndex + 1), newDay, ...prev.days.slice(dayIndex + 1)]
    }));
  };

  const updateDay = (dayIndex, field, value) => {
    setLocalRoutine(prev => {
      const days = [...prev.days];
      days[dayIndex] = { ...days[dayIndex], [field]: value };
      return { ...prev, days };
    });
  };

  const addExerciseToDay = (dayIndex, exercise) => {
    const goal = settings.goal || 'hipertrofia';
    const setsReps = exercise.setsReps?.[goal] || "3 x 10";
    const parts = setsReps.split(' x ');
    const newEx = {
      exerciseId: exercise.id,
      sets: parseInt(parts[0]) || 3,
      reps: parts[1]?.trim() || "10",
      weight: 0,
      restTime: exercise.rest?.[goal] || 90,
      notes: ""
    };
    setLocalRoutine(prev => {
      const days = [...prev.days];
      days[dayIndex] = { ...days[dayIndex], exercises: [...days[dayIndex].exercises, newEx] };
      return { ...prev, days };
    });
  };

  const removeExercise = (dayIndex, exIndex) => {
    setLocalRoutine(prev => {
      const days = [...prev.days];
      days[dayIndex] = { ...days[dayIndex], exercises: days[dayIndex].exercises.filter((_, i) => i !== exIndex) };
      return { ...prev, days };
    });
  };

  const moveExercise = (dayIndex, exIndex, direction) => {
    setLocalRoutine(prev => {
      const days = [...prev.days];
      const exercises = [...days[dayIndex].exercises];
      const newIndex = exIndex + direction;
      if (newIndex < 0 || newIndex >= exercises.length) return prev;
      [exercises[exIndex], exercises[newIndex]] = [exercises[newIndex], exercises[exIndex]];
      days[dayIndex] = { ...days[dayIndex], exercises };
      return { ...prev, days };
    });
  };

  const updateExercise = (dayIndex, exIndex, field, value) => {
    setLocalRoutine(prev => {
      const days = [...prev.days];
      const exercises = [...days[dayIndex].exercises];
      exercises[exIndex] = { ...exercises[exIndex], [field]: value };
      days[dayIndex] = { ...days[dayIndex], exercises };
      return { ...prev, days };
    });
  };

  const save = () => {
    const updated = { ...localRoutine, name: routineName };
    updateRoutine(updated);
    onBack();
  };

  const handleAutoGenerate = (templateKey, opts) => {
    setSettings({ ...settings, ...opts });
    applyTemplate(templateKey);
    // Reload from store after template applied
    setTimeout(() => {
      const saved = localStorage.getItem('gym_routine');
      if (saved) setLocalRoutine(JSON.parse(saved));
    }, 50);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 hover:text-white p-1"><ChevronLeft size={20} /></button>
        <h2 className="font-bold text-white">Constructor de Rutina</h2>
        <button onClick={save} className="text-blue-400 text-sm font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-500/10">
          <Save size={14} /> Guardar
        </button>
      </div>

      {/* Routine Name */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
        <input
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          className="w-full bg-transparent text-lg font-bold text-white outline-none placeholder-gray-600"
          placeholder="Nombre de la rutina..."
        />
      </div>

      {/* Auto Generate Button */}
      <button
        onClick={() => setShowAuto(true)}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2"
      >
        <Wand2 size={18} /> Generar Rutina Automática
      </button>

      {/* Days */}
      <div className="space-y-4">
        {localRoutine.days.map((day, dayIndex) => (
          <div key={day.id} className="bg-[#111827] border border-white/[0.06] rounded-2xl overflow-hidden">
            {/* Day Header */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <input
                  value={day.name}
                  onChange={(e) => updateDay(dayIndex, 'name', e.target.value)}
                  className="flex-1 bg-transparent font-semibold text-white outline-none"
                  placeholder="Nombre del día"
                />
                <button onClick={() => duplicateDay(dayIndex)} className="text-gray-500 hover:text-blue-400 p-1" title="Duplicar"><Copy size={14} /></button>
                <button onClick={() => removeDay(dayIndex)} className="text-gray-500 hover:text-red-400 p-1" title="Eliminar"><Trash2 size={14} /></button>
              </div>
              <input
                value={day.focus || ''}
                onChange={(e) => updateDay(dayIndex, 'focus', e.target.value)}
                className="w-full bg-transparent text-xs text-gray-400 outline-none mt-1"
                placeholder="Enfoque (ej: Pecho + Tríceps)"
              />
            </div>

            {/* Exercises */}
            <div className="p-3 space-y-1.5">
              {day.exercises.map((ex, exIndex) => {
                const exData = findExercise(ex.exerciseId);
                return (
                  <div key={ex.exerciseId + exIndex} className="flex items-center gap-2 p-2.5 bg-gray-800/50 rounded-xl">
                    <div className="flex flex-col">
                      <button onClick={() => moveExercise(dayIndex, exIndex, -1)} className="text-gray-600 hover:text-white"><ChevronUp size={12} /></button>
                      <button onClick={() => moveExercise(dayIndex, exIndex, 1)} className="text-gray-600 hover:text-white"><ChevronDown size={12} /></button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{exData?.name || ex.exerciseId}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="number" value={ex.sets} onChange={(e) => updateExercise(dayIndex, exIndex, 'sets', parseInt(e.target.value) || 1)}
                          className="w-10 bg-gray-700 rounded px-1.5 py-0.5 text-xs text-center text-white outline-none" />
                        <span className="text-gray-500 text-xs">×</span>
                        <input type="text" value={ex.reps} onChange={(e) => updateExercise(dayIndex, exIndex, 'reps', e.target.value)}
                          className="w-14 bg-gray-700 rounded px-1.5 py-0.5 text-xs text-center text-white outline-none" />
                        <span className="text-gray-500 text-xs">—</span>
                        <input type="number" value={ex.weight} onChange={(e) => updateExercise(dayIndex, exIndex, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-14 bg-gray-700 rounded px-1.5 py-0.5 text-xs text-center text-white outline-none" />
                        <span className="text-gray-500 text-[10px]">kg</span>
                      </div>
                    </div>
                    <button onClick={() => removeExercise(dayIndex, exIndex)} className="text-gray-600 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                  </div>
                );
              })}

              <button
                onClick={() => setShowPicker({ dayIndex })}
                className="w-full py-2.5 rounded-xl border border-dashed border-gray-700 text-xs text-gray-400 flex items-center justify-center gap-1 hover:border-blue-500 hover:text-blue-400 transition-colors"
              >
                <Plus size={14} /> Agregar Ejercicio
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Day */}
      <button
        onClick={addDay}
        className="w-full py-3 rounded-xl border border-dashed border-gray-700 text-sm text-gray-400 flex items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-400"
      >
        <Plus size={16} /> Agregar Día
      </button>

      {/* Save */}
      <button
        onClick={save}
        className="w-full py-3.5 rounded-xl bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-600"
      >
        <Save size={18} /> Guardar Rutina
      </button>

      {/* Modals */}
      <AnimatePresence>
        {showPicker && (
          <ExercisePicker 
            onSelect={(ex) => addExerciseToDay(showPicker.dayIndex, ex)}
            onClose={() => setShowPicker(null)}
          />
        )}
        {showAuto && (
          <AutoGenerator 
            onGenerate={handleAutoGenerate}
            onClose={() => setShowAuto(false)}
            settings={settings}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
