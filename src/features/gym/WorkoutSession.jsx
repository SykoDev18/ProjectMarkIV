import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronDown, ChevronUp, Check, Play, Pause, 
  SkipForward, Dumbbell, Trophy, X, Info, RotateCcw, 
  Zap, Timer
} from 'lucide-react';
import { findExercise } from './data/gymData';
import { useWorkoutSession } from './hooks/useWorkoutSession';

const REST_OPTIONS = [15, 30, 45, 60, 90, 120];

function RestTimer({ seconds, onComplete, onSkip, onAdjust }) {
  const [remaining, setRemaining] = useState(seconds);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => { setRemaining(seconds); }, [seconds]);

  useEffect(() => {
    if (paused || remaining <= 0) {
      clearInterval(intervalRef.current);
      if (remaining <= 0) { 
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        onComplete(); 
      }
      return;
    }
    intervalRef.current = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, [remaining, paused, onComplete]);

  const progress = ((seconds - remaining) / seconds) * 100;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
      <div className="text-sm text-gray-400 mb-4 font-medium">Tiempo de Descanso</div>
      <div className="relative w-40 h-40 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#1f2937" strokeWidth="8" />
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#3B82F6" strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-white">{remaining}</span>
          <span className="text-xs text-gray-400">seg</span>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setPaused(!paused)} className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700">
          {paused ? <Play size={20} /> : <Pause size={20} />}
        </button>
        <button onClick={onSkip} className="px-5 py-3 rounded-full bg-blue-500 text-white font-semibold flex items-center gap-2 hover:bg-blue-600">
          <SkipForward size={18} /> Saltar
        </button>
        <button onClick={() => setRemaining(seconds)} className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700">
          <RotateCcw size={18} />
        </button>
      </div>
      <div className="flex gap-2">
        {REST_OPTIONS.map(t => (
          <button key={t} onClick={() => { setRemaining(t); onAdjust(t); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              seconds === t ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}>
            {t >= 60 ? `${t/60}m` : `${t}s`}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function SetRow({ setIndex, set, onUpdate, onComplete }) {
  const [reps, setReps] = useState(String(set.reps || ''));
  const [weight, setWeight] = useState(String(set.weight || ''));

  return (
    <div className={`flex items-center gap-2 py-2 px-3 rounded-xl transition-colors ${
      set.completed ? 'bg-green-500/10' : 'bg-gray-800/50'
    }`}>
      <span className="w-8 text-center text-xs font-bold text-gray-400">{setIndex + 1}</span>
      <input type="text" value={reps}
        onChange={(e) => { setReps(e.target.value); onUpdate({ ...set, reps: e.target.value }); }}
        className="w-16 text-center bg-gray-800 rounded-lg px-2 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Reps" />
      <input type="text" value={weight}
        onChange={(e) => { setWeight(e.target.value); onUpdate({ ...set, weight: e.target.value }); }}
        className="w-20 text-center bg-gray-800 rounded-lg px-2 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Kg" />
      <button onClick={() => onComplete({ ...set, reps, weight, completed: !set.completed })}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          set.completed ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-blue-500 hover:text-white'
        }`}>
        <Check size={16} />
      </button>
    </div>
  );
}

function ExerciseCard({ exercise, exerciseIndex, onUpdateSets, onShowInfo }) {
  const [expanded, setExpanded] = useState(false);
  const sets = exercise.setsData || exercise.sets || [];
  const completedSets = sets.filter(s => s.completed).length;
  const totalSets = sets.length;
  const allComplete = completedSets === totalSets && totalSets > 0;
  const exData = exercise.dbData || findExercise(exercise.exerciseId);

  return (
    <motion.div layout
      className={`bg-[#111827] border rounded-2xl overflow-hidden transition-colors ${
        allComplete ? 'border-green-500/30' : 'border-white/[0.06]'
      }`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 flex items-center gap-3 text-left">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
          allComplete ? 'bg-green-500/20' : 'bg-blue-500/20'
        }`}>
          {allComplete ? <Check size={20} className="text-green-400" /> : <Dumbbell size={18} className="text-blue-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm truncate">{exData?.name || exercise.exerciseId}</div>
          <div className="text-xs text-gray-400">
            {totalSets} series × {exercise.reps || exercise.targetReps || '?'} — {exercise.weight || exercise.targetWeight || 0}kg
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{completedSets}/{totalSets}</span>
          {expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-2">
              <div className="flex items-center gap-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                <span className="w-8 text-center">Set</span>
                <span className="w-16 text-center">Reps</span>
                <span className="w-20 text-center">Kg</span>
                <span className="w-9 text-center">✓</span>
              </div>
              {sets.map((set, si) => (
                <SetRow key={si} setIndex={si} set={set}
                  onUpdate={(updated) => {
                    const newSets = [...sets]; newSets[si] = updated;
                    onUpdateSets(exerciseIndex, newSets);
                  }}
                  onComplete={(updated) => {
                    const newSets = [...sets]; newSets[si] = updated;
                    onUpdateSets(exerciseIndex, newSets, updated.completed);
                  }}
                />
              ))}
              <div className="flex items-center gap-2 pt-2">
                <button onClick={() => onShowInfo(exData)}
                  className="flex-1 py-2 rounded-xl bg-gray-800 text-xs text-gray-400 flex items-center justify-center gap-1 hover:bg-gray-700">
                  <Info size={12} /> Tips y detalles
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function WorkoutSession({ userId, dayConfig, onBack, onSessionComplete }) {
  const session = useWorkoutSession(userId, dayConfig, onSessionComplete);
  const { exercises, sessionTimer, isActive, activeRestTimer, 
    updateSet, toggleSetComplete, toggleExpand, startRestTimer, finishSession, getTotalVolume } = session;
  
  const [showRest, setShowRest] = useState(false);
  const [restSeconds, setRestSeconds] = useState(90);
  const [showInfo, setShowInfo] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleUpdateSets = useCallback((exIndex, newSets, triggerRest = false) => {
    // Update each set individually through the hook
    newSets.forEach((set, si) => {
      const ex = exercises[exIndex];
      const oldSet = ex?.setsData?.[si] || {};
      if (set.reps !== oldSet.reps) updateSet(exIndex, si, 'reps', set.reps);
      if (set.weight !== oldSet.weight) updateSet(exIndex, si, 'weight', set.weight);
      if (set.completed !== oldSet.completed) toggleSetComplete(exIndex, si);
    });
    if (triggerRest) {
      const ex = exercises[exIndex];
      setRestSeconds(ex?.rest || 90);
      setShowRest(true);
    }
  }, [exercises, updateSet, toggleSetComplete]);

  const handleFinish = async () => {
    const result = await finishSession();
    if (result) setShowSummary(result);
  };

  if (!dayConfig) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Día no encontrado</p>
        <button onClick={onBack} className="mt-4 text-blue-400">Volver</button>
      </div>
    );
  }

  const totalCompleted = exercises.reduce((sum, ex) => sum + (ex.setsData || []).filter(s => s.completed).length, 0);
  const totalSets = exercises.reduce((sum, ex) => sum + (ex.setsData || []).length, 0);

  return (
    <div className="space-y-4">
      {/* Session Header */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="text-gray-400 hover:text-white p-1">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <div className="font-bold text-white">{dayConfig.name}</div>
            <div className="text-xs text-gray-400">{dayConfig.focus}</div>
          </div>
          <button onClick={handleFinish} className="text-red-400 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-500/10">
            Finalizar
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-blue-400">
            <Timer size={14} />
            <span className="font-mono font-bold">{formatTime(sessionTimer)}</span>
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <div className="text-gray-400">
            <span className="text-white font-bold">{totalCompleted}</span>/{totalSets} sets
          </div>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-green-400 rounded-full transition-all duration-300"
            style={{ width: `${totalSets > 0 ? (totalCompleted / totalSets) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-3">
        {exercises.map((ex, i) => (
          <ExerciseCard
            key={ex.exerciseId + '-' + i}
            exercise={ex}
            exerciseIndex={i}
            onUpdateSets={handleUpdateSets}
            onShowInfo={setShowInfo}
          />
        ))}
      </div>

      {/* Finish Button */}
      <motion.button whileTap={{ scale: 0.95 }} onClick={handleFinish}
        className="w-full py-4 rounded-2xl bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600">
        <Trophy size={18} /> Finalizar Entrenamiento
      </motion.button>

      {/* Rest Timer */}
      <AnimatePresence>
        {showRest && (
          <RestTimer seconds={restSeconds} onComplete={() => setShowRest(false)}
            onSkip={() => setShowRest(false)} onAdjust={(t) => setRestSeconds(t)} />
        )}
      </AnimatePresence>

      {/* Exercise Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowInfo(null)}>
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111827] rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-white">{showInfo.name}</h3>
                <button onClick={() => setShowInfo(null)} className="text-gray-400 p-1"><X size={18} /></button>
              </div>
              <div className="p-4 space-y-4">
                {showInfo.nameEn && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Nombre en inglés</div>
                    <div className="text-sm text-white">{showInfo.nameEn}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-400 mb-2">Músculos primarios</div>
                  <div className="flex flex-wrap gap-1">
                    {showInfo.musclesPrimary?.map(m => (
                      <span key={m} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">{m}</span>
                    ))}
                  </div>
                </div>
                {showInfo.musclesSecondary?.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Músculos secundarios</div>
                    <div className="flex flex-wrap gap-1">
                      {showInfo.musclesSecondary.map(m => (
                        <span key={m} className="px-2 py-1 bg-gray-700 text-gray-300 rounded-lg text-xs">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
                {showInfo.tips?.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Tips de ejecución</div>
                    <ul className="space-y-1.5">
                      {showInfo.tips.map((tip, i) => (
                        <li key={i} className="text-xs text-gray-300 flex gap-2">
                          <span className="text-blue-400 shrink-0">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-800 rounded-xl p-2.5">
                    <span className="text-gray-400">Dificultad</span>
                    <div className="text-white font-medium capitalize mt-0.5">{showInfo.difficulty}</div>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-2.5">
                    <span className="text-gray-400">Tipo</span>
                    <div className="text-white font-medium capitalize mt-0.5">{showInfo.type}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Summary */}
      <AnimatePresence>
        {showSummary && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-[#111827] rounded-2xl w-full max-w-md text-center p-6">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-black text-white mb-1">¡Entrenamiento Completado!</h2>
              <p className="text-gray-400 text-sm mb-6">{showSummary.dayName}</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-800 rounded-xl p-3">
                  <Timer size={18} className="text-blue-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{formatTime(showSummary.duration)}</div>
                  <div className="text-[10px] text-gray-400">Duración</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <Dumbbell size={18} className="text-green-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{showSummary.completedExercises?.length || 0}</div>
                  <div className="text-[10px] text-gray-400">Ejercicios</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <Zap size={18} className="text-yellow-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{Math.round(showSummary.totalVolume || 0).toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400">Volumen (kg)</div>
                </div>
              </div>
              <button onClick={() => { setShowSummary(false); onBack(); }}
                className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600">
                Volver al Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
