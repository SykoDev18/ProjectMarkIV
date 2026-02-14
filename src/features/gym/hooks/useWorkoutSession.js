/**
 * useWorkoutSession.js — Hook para gestionar una sesión activa de entrenamiento
 * 
 * Maneja: timer, ejercicios con sets, rest timer, guardado en Firebase.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import * as gymService from '../services/gymService';
import { findExercise } from '../data/gymData';

export function useWorkoutSession(userId, dayConfig, onSessionSaved) {
  // dayConfig = { id, name, focus, exercises: [{ exerciseId, sets, reps, weight, rest, ... }] }
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [activeRestTimer, setActiveRestTimer] = useState(null); // { seconds, remaining }
  const timerRef = useRef(null);

  // Initialize exercises from day config
  useEffect(() => {
    if (!dayConfig?.exercises) return;
    const mapped = dayConfig.exercises.map((ex, idx) => {
      const dbEx = findExercise(ex.exerciseId);
      return {
        ...ex,
        index: idx,
        dbData: dbEx,
        setsData: Array.from({ length: ex.sets || 3 }, (_, i) => ({
          setNumber: i + 1,
          reps: 0,
          weight: ex.weight || 0,
          completed: false,
          rpe: null
        })),
        expanded: idx === 0,
        completed: false
      };
    });
    setExercises(mapped);
    setIsActive(true);
    setSessionTimer(0);
  }, [dayConfig]);

  // Session timer
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setSessionTimer(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]);

  // Update a set value
  const updateSet = useCallback((exerciseIndex, setIndex, field, value) => {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exerciseIndex) return ex;
      const newSets = ex.setsData.map((s, si) => {
        if (si !== setIndex) return s;
        return { ...s, [field]: value };
      });
      const allDone = newSets.every(s => s.completed);
      return { ...ex, setsData: newSets, completed: allDone };
    }));
  }, []);

  // Toggle set completion
  const toggleSetComplete = useCallback((exerciseIndex, setIndex) => {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exerciseIndex) return ex;
      const newSets = ex.setsData.map((s, si) => {
        if (si !== setIndex) return s;
        return { ...s, completed: !s.completed };
      });
      const allDone = newSets.every(s => s.completed);
      return { ...ex, setsData: newSets, completed: allDone };
    }));
  }, []);

  // Toggle expand exercise
  const toggleExpand = useCallback((exerciseIndex) => {
    setExercises(prev => prev.map((ex, ei) => ({
      ...ex,
      expanded: ei === exerciseIndex ? !ex.expanded : ex.expanded
    })));
  }, []);

  // Start rest timer
  const startRestTimer = useCallback((seconds) => {
    setActiveRestTimer({ seconds, remaining: seconds });
  }, []);

  // Rest timer countdown
  useEffect(() => {
    if (!activeRestTimer || activeRestTimer.remaining <= 0) return;
    const id = setTimeout(() => {
      setActiveRestTimer(prev => {
        if (!prev) return null;
        const next = prev.remaining - 1;
        if (next <= 0) {
          // Vibrate if available
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          return null;
        }
        return { ...prev, remaining: next };
      });
    }, 1000);
    return () => clearTimeout(id);
  }, [activeRestTimer]);

  // Calculate total volume
  const getTotalVolume = useCallback(() => {
    return exercises.reduce((total, ex) => {
      return total + ex.setsData.reduce((sum, s) => {
        if (!s.completed) return sum;
        return sum + (s.reps * s.weight);
      }, 0);
    }, 0);
  }, [exercises]);

  // Finish and save session
  const finishSession = useCallback(async () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const totalVolume = getTotalVolume();
    const completedExercises = exercises.filter(e => e.completed).map(e => e.exerciseId);

    const sessionData = {
      date: new Date().toISOString(),
      dayId: dayConfig?.id,
      dayName: dayConfig?.name || '',
      exercises: exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        name: ex.name || ex.dbData?.name || '',
        sets: ex.setsData.filter(s => s.completed),
        totalVolume: ex.setsData.reduce((s, set) => s + (set.completed ? set.reps * set.weight : 0), 0),
        completed: ex.completed
      })),
      totalVolume,
      duration: sessionTimer,
      completedExercises,
      completed: completedExercises.length >= exercises.length * 0.5 // >50% = completed
    };

    if (userId) {
      try {
        await gymService.saveSession(userId, sessionData);
      } catch (err) {
        console.error('Error saving session:', err);
        // Fallback: save to localStorage
        const stored = JSON.parse(localStorage.getItem('gym_pending_sessions') || '[]');
        stored.push(sessionData);
        localStorage.setItem('gym_pending_sessions', JSON.stringify(stored));
      }
    }

    onSessionSaved?.(sessionData);
    return sessionData;
  }, [exercises, sessionTimer, dayConfig, userId, getTotalVolume, onSessionSaved]);

  return {
    exercises,
    sessionTimer,
    isActive,
    activeRestTimer,
    updateSet,
    toggleSetComplete,
    toggleExpand,
    startRestTimer,
    skipRestTimer: () => setActiveRestTimer(null),
    getTotalVolume,
    finishSession
  };
}
