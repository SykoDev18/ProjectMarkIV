/**
 * useCurrentCycle.js — Hook para gestionar el ciclo activo de 30 días
 * 
 * Provee: cycleStatus, cycle, progress, weekModifier, startNewCycle, renewCycle, etc.
 */

import { useState, useEffect, useCallback } from 'react';
import { auth } from '../../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { CycleManager } from '../services/cycleManager';
import * as gymService from '../services/gymService';

export function useCurrentCycle() {
  const [userId, setUserId] = useState(null);
  const [cycleState, setCycleState] = useState({
    status: 'loading',   // loading | no_cycle | active | expiring_soon | expired
    cycle: null,
    progress: null,
    weekModifier: null,
    evaluation: null
  });
  const [loading, setLoading] = useState(true);

  // Listen for auth
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
  }, []);

  // Fetch cycle status on userId change
  const refreshCycle = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await CycleManager.checkCycleStatus(userId);
      const evaluation = await gymService.getEvaluation(userId);
      const progress = result.cycle ? CycleManager.getCycleProgress(result.cycle) : null;

      setCycleState({
        status: result.status,
        cycle: result.cycle,
        progress,
        weekModifier: result.weekModifier || null,
        evaluation
      });
    } catch (err) {
      console.error('useCurrentCycle error:', err);
      setCycleState(prev => ({ ...prev, status: 'no_cycle' }));
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refreshCycle();
  }, [refreshCycle]);

  // Start a brand new cycle
  const startNewCycle = useCallback(async (evaluation) => {
    if (!userId) return;
    setLoading(true);
    try {
      const cycleData = await CycleManager.startNewCycle(userId, evaluation);
      await refreshCycle();
      return cycleData;
    } catch (err) {
      console.error('startNewCycle error:', err);
    }
    setLoading(false);
  }, [userId, refreshCycle]);

  // Renew with new evaluation
  const renewCycle = useCallback(async (evaluation) => {
    if (!userId) return;
    setLoading(true);
    try {
      await CycleManager.renewCycle(userId, evaluation);
      await refreshCycle();
    } catch (err) {
      console.error('renewCycle error:', err);
    }
    setLoading(false);
  }, [userId, refreshCycle]);

  // Continue with current routine (extend 30 days)
  const continueCycle = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await CycleManager.continueCycle(userId);
      await refreshCycle();
    } catch (err) {
      console.error('continueCycle error:', err);
    }
    setLoading(false);
  }, [userId, refreshCycle]);

  return {
    ...cycleState,
    loading,
    userId,
    startNewCycle,
    renewCycle,
    continueCycle,
    refreshCycle
  };
}
