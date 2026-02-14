/**
 * useGymStats.js — Hook para estadísticas del gym
 * 
 * Provee: sessions, prs, streak, weekStats, allTimeStats
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { auth } from '../../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import * as gymService from '../services/gymService';

export function useGymStats() {
  const [userId, setUserId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [prs, setPrs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
  }, []);

  const refresh = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [sessionsData, prsData] = await Promise.all([
        gymService.getSessions(userId),
        gymService.getPRs(userId)
      ]);
      setSessions(sessionsData);
      setPrs(prsData);
    } catch (err) {
      console.error('useGymStats error:', err);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  // Calculate streak (consecutive weeks with at least 1 session)
  const streak = useMemo(() => {
    if (sessions.length === 0) return 0;
    const weeks = new Set();
    sessions.forEach(s => {
      const d = new Date(s.date);
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      weeks.add(start.toISOString().split('T')[0]);
    });
    const sorted = [...weeks].sort().reverse();
    let count = 0;
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    let check = new Date(currentWeekStart);
    for (const w of sorted) {
      const diff = Math.abs(check.getTime() - new Date(w).getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 7) { count++; check.setDate(check.getDate() - 7); }
      else break;
    }
    return count;
  }, [sessions]);

  // Week stats
  const weekStats = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekSessions = sessions.filter(s => new Date(s.date) >= weekStart);
    const totalVolume = weekSessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0);

    // Top muscle worked
    const muscleCount = {};
    weekSessions.forEach(s => {
      (s.exercises || []).forEach(ex => {
        const name = ex.name || ex.dayName || '';
        if (name) muscleCount[name] = (muscleCount[name] || 0) + 1;
      });
    });
    const topMuscle = Object.entries(muscleCount).sort((a, b) => b[1] - a[1])[0];

    return {
      totalSessions: weekSessions.length,
      totalVolume,
      topMuscle: topMuscle?.[0] || '—'
    };
  }, [sessions]);

  // All-time stats
  const allTimeStats = useMemo(() => {
    const totalVolume = sessions.reduce((s, ses) => s + (ses.totalVolume || 0), 0);
    const prTotal = Object.values(prs).reduce((s, pr) => s + (pr.weight || 0), 0);
    return {
      totalSessions: sessions.length,
      totalVolume,
      prTotal
    };
  }, [sessions, prs]);

  // Update a PR
  const updatePR = useCallback(async (exerciseId, weight) => {
    if (!userId) return;
    await gymService.updatePR(userId, exerciseId, weight);
    await refresh();
  }, [userId, refresh]);

  // Get sessions for a specific date
  const getSessionsForDate = useCallback((dateStr) => {
    return sessions.filter(s => s.date?.startsWith(dateStr));
  }, [sessions]);

  return {
    sessions,
    prs,
    streak,
    weekStats,
    allTimeStats,
    loading,
    updatePR,
    getSessionsForDate,
    refresh
  };
}
