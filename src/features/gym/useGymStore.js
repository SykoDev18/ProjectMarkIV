import { useState, useEffect, useCallback } from 'react';
import { findExercise, ROUTINE_TEMPLATES } from './gymData';

const STORAGE_PREFIX = 'gym_';

const loadFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch { return defaultValue; }
};

const saveToStorage = (key, value) => {
  try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value)); } catch {}
};

const DEFAULT_PRS = [
  { id: 'bench', name: 'Bench Press', weight: 60, date: null, history: [] },
  { id: 'squat', name: 'Squat', weight: 80, date: null, history: [] },
  { id: 'deadlift', name: 'Deadlift', weight: 100, date: null, history: [] },
  { id: 'ohp', name: 'Overhead Press', weight: 40, date: null, history: [] },
  { id: 'row', name: 'Barbell Row', weight: 60, date: null, history: [] },
];

const DEFAULT_ROUTINE = {
  name: "Push/Pull/Legs/Upper",
  days: [
    {
      id: 1, name: "Push", focus: "Pecho/Tríceps",
      exercises: [
        { exerciseId: "bench_press", sets: 4, reps: "8-10", weight: 60, restTime: 90, notes: "" },
        { exerciseId: "press_inclinado", sets: 3, reps: "10-12", weight: 50, restTime: 90, notes: "" },
        { exerciseId: "crossover_polea", sets: 3, reps: "12-15", weight: 20, restTime: 60, notes: "" },
        { exerciseId: "press_militar", sets: 4, reps: "8-10", weight: 40, restTime: 90, notes: "" },
        { exerciseId: "elevaciones_laterales", sets: 4, reps: "15-20", weight: 8, restTime: 60, notes: "" },
        { exerciseId: "extension_polea", sets: 3, reps: "12-15", weight: 25, restTime: 60, notes: "" },
      ]
    },
    {
      id: 2, name: "Pull", focus: "Espalda/Bíceps",
      exercises: [
        { exerciseId: "dominadas", sets: 4, reps: "6-10", weight: 0, restTime: 120, notes: "BW" },
        { exerciseId: "remo_barra", sets: 4, reps: "8-12", weight: 60, restTime: 90, notes: "" },
        { exerciseId: "jalon_polea", sets: 3, reps: "10-12", weight: 50, restTime: 90, notes: "" },
        { exerciseId: "face_pull", sets: 3, reps: "15-20", weight: 15, restTime: 60, notes: "" },
        { exerciseId: "curl_barra", sets: 3, reps: "10-12", weight: 25, restTime: 90, notes: "" },
        { exerciseId: "curl_martillo", sets: 3, reps: "12-15", weight: 12, restTime: 60, notes: "" },
      ]
    },
    {
      id: 3, name: "Legs", focus: "Pierna completa",
      exercises: [
        { exerciseId: "sentadilla", sets: 4, reps: "8-10", weight: 80, restTime: 180, notes: "" },
        { exerciseId: "prensa", sets: 4, reps: "10-15", weight: 120, restTime: 120, notes: "" },
        { exerciseId: "extensiones_cuad", sets: 3, reps: "12-15", weight: 40, restTime: 60, notes: "" },
        { exerciseId: "curl_isquiotibiales", sets: 3, reps: "12-15", weight: 30, restTime: 60, notes: "" },
        { exerciseId: "hip_thrust", sets: 3, reps: "10-15", weight: 60, restTime: 90, notes: "" },
        { exerciseId: "gemelo_maquina", sets: 4, reps: "15-20", weight: 40, restTime: 60, notes: "" },
      ]
    },
    {
      id: 4, name: "Upper", focus: "Hombro/Abs",
      exercises: [
        { exerciseId: "press_militar", sets: 4, reps: "8-10", weight: 40, restTime: 120, notes: "" },
        { exerciseId: "elevaciones_laterales", sets: 4, reps: "15-20", weight: 8, restTime: 60, notes: "" },
        { exerciseId: "remo_mancuerna", sets: 3, reps: "10-12", weight: 20, restTime: 90, notes: "" },
        { exerciseId: "press_frances", sets: 3, reps: "10-12", weight: 20, restTime: 90, notes: "" },
        { exerciseId: "curl_mancuernas", sets: 3, reps: "10-12", weight: 12, restTime: 60, notes: "" },
        { exerciseId: "plancha", sets: 3, reps: "60s", weight: 0, restTime: 60, notes: "" },
      ]
    }
  ]
};

export function useGymStore() {
  const [week, setWeek] = useState(() => loadFromStorage('week', 1));
  const [weekStartDate, setWeekStartDate] = useState(() => loadFromStorage('weekStartDate', new Date().toISOString()));
  const [prs, setPrs] = useState(() => loadFromStorage('prs', DEFAULT_PRS));
  const [routine, setRoutine] = useState(() => loadFromStorage('routine', DEFAULT_ROUTINE));
  const [sessions, setSessions] = useState(() => loadFromStorage('sessions', []));
  const [settings, setSettings] = useState(() => loadFromStorage('settings', { goal: 'hipertrofia', experience: 'intermedio' }));

  // Persist on change
  useEffect(() => { saveToStorage('week', week); }, [week]);
  useEffect(() => { saveToStorage('weekStartDate', weekStartDate); }, [weekStartDate]);
  useEffect(() => { saveToStorage('prs', prs); }, [prs]);
  useEffect(() => { saveToStorage('routine', routine); }, [routine]);
  useEffect(() => { saveToStorage('sessions', sessions); }, [sessions]);
  useEffect(() => { saveToStorage('settings', settings); }, [settings]);

  // Calculate streak
  const streak = (() => {
    if (sessions.length === 0) return 0;
    const weeks = new Set();
    sessions.forEach(s => {
      const d = new Date(s.date);
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay());
      weeks.add(startOfWeek.toISOString().split('T')[0]);
    });
    const sortedWeeks = [...weeks].sort().reverse();
    let count = 0;
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    let checkDate = currentWeekStart;
    for (const w of sortedWeeks) {
      const diff = Math.abs(checkDate.getTime() - new Date(w).getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 7) { count++; checkDate.setDate(checkDate.getDate() - 7); }
      else break;
    }
    return count;
  })();

  const advanceWeek = useCallback(() => {
    setWeek(w => w + 1);
  }, []);

  const updatePR = useCallback((prId, newWeight) => {
    setPrs(prev => prev.map(pr => {
      if (pr.id !== prId) return pr;
      const today = new Date().toISOString().split('T')[0];
      return {
        ...pr,
        weight: newWeight,
        date: today,
        history: [...(pr.history || []), { weight: newWeight, date: today }]
      };
    }));
  }, []);

  const updateRoutine = useCallback((newRoutine) => {
    setRoutine(newRoutine);
  }, []);

  const applyTemplate = useCallback((templateKey) => {
    const template = ROUTINE_TEMPLATES[templateKey];
    if (!template) return;
    const goal = settings.goal || 'hipertrofia';
    const newRoutine = {
      name: template.name,
      days: template.days.map((day, i) => ({
        id: i + 1,
        name: day.name,
        focus: day.focus,
        exercises: day.exercises.map(exId => {
          const ex = findExercise(exId);
          const setsReps = ex?.setsReps?.[goal] || "3 x 10";
          const [sets, reps] = setsReps.split(' x ').map(s => s.trim());
          return {
            exerciseId: exId,
            sets: parseInt(sets) || 3,
            reps: reps || "10",
            weight: 0,
            restTime: ex?.rest?.[goal] || 90,
            notes: ""
          };
        })
      }))
    };
    setRoutine(newRoutine);
  }, [settings.goal]);

  const saveSession = useCallback((sessionData) => {
    const session = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...sessionData
    };
    setSessions(prev => [...prev, session]);
    return session;
  }, []);

  const getSessionsForDate = useCallback((dateStr) => {
    return sessions.filter(s => s.date.startsWith(dateStr));
  }, [sessions]);

  const getWeekProgress = useCallback(() => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const weekSessions = sessions.filter(s => new Date(s.date) >= weekAgo);
    return {
      completed: weekSessions.length,
      total: routine.days.length,
      percentage: Math.round((weekSessions.length / routine.days.length) * 100)
    };
  }, [sessions, routine]);

  const getDayProgress = useCallback((dayId) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysSession = sessions.find(s => s.date.startsWith(today) && s.dayId === dayId);
    if (!todaysSession) return { completed: 0, total: 0, percentage: 0, status: 'pending' };
    const day = routine.days.find(d => d.id === dayId);
    const total = day?.exercises?.length || 0;
    const completed = todaysSession.completedExercises?.length || 0;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      status: completed >= total ? 'completed' : completed > 0 ? 'in-progress' : 'pending'
    };
  }, [sessions, routine]);

  const getTotalVolume = useCallback(() => {
    return sessions.reduce((total, s) => {
      return total + (s.totalVolume || 0);
    }, 0);
  }, [sessions]);

  return {
    week, weekStartDate, prs, routine, sessions, settings, streak,
    advanceWeek, updatePR, updateRoutine, applyTemplate,
    saveSession, getSessionsForDate, getWeekProgress, getDayProgress, getTotalVolume,
    setSettings, setRoutine,
  };
}
