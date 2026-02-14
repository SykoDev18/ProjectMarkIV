/**
 * cycleManager.js — Lógica de ciclos de 30 días (SmartFit-like)
 * 
 * Estados:
 *   active         → 🟢 Entrenar normalmente
 *   expiring_soon  → 🟡 ≤ 7 días restantes, banner de renovación
 *   expired        → 🔴 Modal de renovación obligatorio
 *   no_cycle       → ⚪ Onboarding / evaluación inicial
 */

import {
  getCurrentCycle, createNewCycle, updateCycle, updateCycleStatus,
  getNextCycleNumber, saveEvaluation
} from './gymService';
import { RoutineAlgorithm } from './routineAlgorithm';
import { Timestamp } from 'firebase/firestore';

const CYCLE_DURATION_DAYS = 30;

export class CycleManager {

  /**
   * Verificar estado del ciclo al iniciar la app.
   * @returns {{ status, daysRemaining?, daysElapsed?, cycle?, weekModifier? }}
   */
  static async checkCycleStatus(userId) {
    const cycle = await getCurrentCycle(userId);

    if (!cycle) return { status: 'no_cycle', cycle: null };

    const now = new Date();
    let endDate;
    // Handle Firestore Timestamp or ISO string
    if (cycle.endDate?.toDate) {
      endDate = cycle.endDate.toDate();
    } else if (cycle.endDate) {
      endDate = new Date(cycle.endDate);
    } else {
      return { status: 'no_cycle', cycle: null };
    }

    let startDate;
    if (cycle.startDate?.toDate) {
      startDate = cycle.startDate.toDate();
    } else if (cycle.startDate) {
      startDate = new Date(cycle.startDate);
    } else {
      startDate = new Date();
    }

    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    const weekModifier = RoutineAlgorithm.getCurrentWeekModifier(startDate);

    if (now > endDate) {
      // Mark as expired in Firestore if not already
      if (cycle.status !== 'expired') {
        await updateCycleStatus(userId, 'expired');
      }
      return { status: 'expired', daysRemaining: 0, daysElapsed, cycle, weekModifier };
    }

    if (daysRemaining <= 7) {
      return { status: 'expiring_soon', daysRemaining, daysElapsed, cycle, weekModifier };
    }

    return { status: 'active', daysRemaining, daysElapsed, cycle, weekModifier };
  }

  /**
   * Crear un nuevo ciclo de 30 días con rutina generada.
   */
  static async startNewCycle(userId, evaluation) {
    // 1. Guardar evaluación
    await saveEvaluation(userId, evaluation);

    // 2. Generar rutina con el algoritmo
    const routine = RoutineAlgorithm.generate(evaluation);

    // 3. Calcular fechas
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + CYCLE_DURATION_DAYS);

    const cycleNumber = await getNextCycleNumber(userId);

    const cycleData = {
      cycleNumber,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      routine,
      totalSessions: routine.days.length * Math.floor(CYCLE_DURATION_DAYS / 7),
      completedSessions: 0,
      progressPercent: 0,
      evaluation: { ...evaluation }
    };

    // 4. Guardar en Firestore
    await createNewCycle(userId, cycleData);

    return cycleData;
  }

  /**
   * Renovar ciclo: mantener el actual pero actualizarlo o crear uno nuevo.
   */
  static async renewCycle(userId, evaluation) {
    return this.startNewCycle(userId, evaluation);
  }

  /**
   * Continuar con el ciclo expirado (extiende 30 días más).
   */
  static async continueCycle(userId) {
    const cycle = await getCurrentCycle(userId);
    if (!cycle) return null;

    const newEnd = new Date();
    newEnd.setDate(newEnd.getDate() + CYCLE_DURATION_DAYS);

    const updates = {
      endDate: newEnd.toISOString(),
      status: 'active',
      cycleNumber: (cycle.cycleNumber || 1)
    };

    await updateCycle(userId, updates);
    return { ...cycle, ...updates };
  }

  /**
   * Calcular progreso del ciclo actual.
   */
  static getCycleProgress(cycle) {
    if (!cycle) return { percent: 0, completed: 0, total: 0, daysLeft: 0, weekLabel: '' };

    let startDate;
    if (cycle.startDate?.toDate) startDate = cycle.startDate.toDate();
    else startDate = new Date(cycle.startDate);

    let endDate;
    if (cycle.endDate?.toDate) endDate = cycle.endDate.toDate();
    else endDate = new Date(cycle.endDate);

    const now = new Date();
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
    const dayPercent = Math.min(100, Math.round((daysElapsed / totalDays) * 100));

    const weekMod = RoutineAlgorithm.getCurrentWeekModifier(startDate);

    return {
      percent: cycle.progressPercent || 0,
      dayPercent,
      completed: cycle.completedSessions || 0,
      total: cycle.totalSessions || 0,
      daysLeft,
      daysElapsed,
      weekNumber: weekMod.weekNumber,
      weekLabel: weekMod.label,
      setsMultiplier: weekMod.setsMultiplier,
      weightMultiplier: weekMod.weightMultiplier
    };
  }
}

export { CYCLE_DURATION_DAYS };
