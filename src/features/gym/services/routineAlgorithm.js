/**
 * routineAlgorithm.js
 * 
 * Motor de generación de rutinas basado en principios de la
 * Enciclopedia de Musculación y periodización científica.
 * 
 * Sistema de reglas expertas (Expert System) con scoring
 * y selección de ejercicios — sin Machine Learning.
 */

import { EXERCISE_DATABASE, getAllExercises, findExercise } from '../data/gymData';

// ════════════════════════════════════════════════════════════
// SPLITS — Estructuras de división semanal
// ════════════════════════════════════════════════════════════

const SPLITS = {
  2: {
    name: "Full Body 2x",
    structure: [
      { id: "FB_A", name: "Full Body A", muscles: ["pecho", "espalda", "piernas", "hombros"] },
      { id: "FB_B", name: "Full Body B", muscles: ["espalda", "piernas", "pecho", "hombros"] }
    ],
    weeklySchedule: ["A", "rest", "B", "rest", "rest", "rest", "rest"]
  },
  3: {
    name: "Full Body 3x",
    structure: [
      { id: "FB_A", name: "Full Body A", muscles: ["pecho", "espalda", "piernas", "hombros", "biceps"] },
      { id: "FB_B", name: "Full Body B", muscles: ["piernas", "pecho", "espalda", "hombros", "triceps"] },
      { id: "FB_C", name: "Full Body C", muscles: ["espalda", "piernas", "pecho", "hombros", "abdomen"] }
    ],
    weeklySchedule: ["A", "rest", "B", "rest", "C", "rest", "rest"]
  },
  4: {
    name: "Upper / Lower 4x",
    structure: [
      { id: "UPPER_A", name: "Upper A — Pecho/Espalda", muscles: ["pecho", "espalda", "hombros", "biceps"] },
      { id: "LOWER_A", name: "Lower A — Cuádriceps", muscles: ["piernas", "abdomen"] },
      { id: "UPPER_B", name: "Upper B — Hombros/Brazos", muscles: ["hombros", "espalda", "pecho", "triceps"] },
      { id: "LOWER_B", name: "Lower B — Isquio/Glúteos", muscles: ["piernas", "abdomen"] }
    ],
    weeklySchedule: ["UPPER_A", "LOWER_A", "rest", "UPPER_B", "LOWER_B", "rest", "rest"]
  },
  5: {
    name: "Push / Pull / Legs + Upper / Lower",
    structure: [
      { id: "PUSH", name: "Push — Pecho/Hombros/Tríceps", muscles: ["pecho", "hombros", "triceps"] },
      { id: "PULL", name: "Pull — Espalda/Bíceps", muscles: ["espalda", "biceps"] },
      { id: "LEGS", name: "Legs — Piernas/Glúteos", muscles: ["piernas", "abdomen"] },
      { id: "UPPER", name: "Upper — Hombros/Brazos", muscles: ["hombros", "biceps", "triceps", "abdomen"] },
      { id: "LOWER", name: "Lower — Piernas completo", muscles: ["piernas", "abdomen"] }
    ],
    weeklySchedule: ["PUSH", "PULL", "LEGS", "rest", "UPPER", "LOWER", "rest"]
  },
  6: {
    name: "Push / Pull / Legs 2x (PPL)",
    structure: [
      { id: "PUSH_A", name: "Push A — Énfasis Pecho", muscles: ["pecho", "hombros", "triceps"] },
      { id: "PULL_A", name: "Pull A — Énfasis Espalda", muscles: ["espalda", "biceps"] },
      { id: "LEGS_A", name: "Legs A — Énfasis Cuádriceps", muscles: ["piernas", "abdomen"] },
      { id: "PUSH_B", name: "Push B — Énfasis Hombros", muscles: ["hombros", "pecho", "triceps"] },
      { id: "PULL_B", name: "Pull B — Énfasis Dorsal", muscles: ["espalda", "biceps"] },
      { id: "LEGS_B", name: "Legs B — Énfasis Isquiotibiales", muscles: ["piernas", "abdomen"] }
    ],
    weeklySchedule: ["PUSH_A", "PULL_A", "LEGS_A", "rest", "PUSH_B", "PULL_B", "LEGS_B"]
  }
};

// ════════════════════════════════════════════════════════════
// PARÁMETROS DE VOLUMEN Y PERIODIZACIÓN
// ════════════════════════════════════════════════════════════

const REP_RANGES = {
  fuerza:      { reps: "3-5",   rpe: "8-9", rest: 180 },
  hipertrofia: { reps: "8-12",  rpe: "7-8", rest: 90 },
  resistencia: { reps: "15-20", rpe: "6-7", rest: 45 },
  definicion:  { reps: "12-15", rpe: "7-8", rest: 60 },
  bienestar:   { reps: "10-15", rpe: "6-7", rest: 60 }
};

const EXERCISES_PER_SESSION = { 30: 4, 45: 5, 60: 7, 90: 9 };

const WEEK_MODIFIERS = [
  { week: 1, label: "Adaptación",  setsMultiplier: 0.80, weightMultiplier: 0.90 },
  { week: 2, label: "Carga",       setsMultiplier: 1.00, weightMultiplier: 0.95 },
  { week: 3, label: "Sobrecarga",  setsMultiplier: 1.15, weightMultiplier: 1.00 },
  { week: 4, label: "Descarga",    setsMultiplier: 0.60, weightMultiplier: 0.80 }
];

const EQUIPMENT_TIERS = {
  'cuerpo libre':       ['cuerpo libre'],
  'mancuernas':         ['cuerpo libre', 'mancuernas'],
  'mancuernas_y_barra': ['cuerpo libre', 'mancuernas', 'barra', 'banco', 'barra EZ', 'barra de dominadas', 'paralelas', 'rack'],
  'gym_completo':       ['cuerpo libre', 'mancuernas', 'barra', 'banco', 'barra EZ', 'barra de dominadas', 'paralelas', 'rack', 'polea', 'máquina', 'gym', 'banco inclinado', 'disco', 'rueda abdominal']
};

const STARTER_WEIGHTS = {
  principiante: { pecho: 20, espalda: 25, piernas: 40, hombros: 10, biceps: 8, triceps: 10, abdomen: 0 },
  intermedio:   { pecho: 60, espalda: 70, piernas: 80, hombros: 30, biceps: 20, triceps: 25, abdomen: 0 },
  avanzado:     { pecho: 100, espalda: 120, piernas: 140, hombros: 60, biceps: 35, triceps: 45, abdomen: 10 }
};

// ════════════════════════════════════════════════════════════
// CLASE PRINCIPAL
// ════════════════════════════════════════════════════════════

export class RoutineAlgorithm {

  /**
   * PUNTO DE ENTRADA
   * @param {Object} evaluation — perfil del usuario desde EvaluationForm
   * @returns {Object} rutina completa para ciclo de 30 días
   */
  static generate(evaluation) {
    const split = this.selectSplit(evaluation);
    const volumeParams = this.calculateVolume(evaluation);

    const days = split.structure.map(dayTemplate =>
      this.buildDay(dayTemplate, evaluation, volumeParams)
    );

    const periodizedDays = this.applyPeriodization(days);

    const finalDays = periodizedDays.map(day => ({
      ...day,
      exercises: this.orderExercises(day.exercises)
    }));

    return {
      name: split.name,
      goal: evaluation.goal,
      daysPerWeek: evaluation.daysPerWeek,
      days: finalDays,
      weeklySchedule: split.weeklySchedule,
      periodization: WEEK_MODIFIERS,
      generatedAt: new Date().toISOString(),
      algorithmVersion: "2.0"
    };
  }

  // ── PASO 1: Seleccionar split ──────────────────────────

  static selectSplit(evaluation) {
    return SPLITS[evaluation.daysPerWeek] || SPLITS[3];
  }

  // ── PASO 2: Calcular parámetros de volumen ─────────────

  static calculateVolume(evaluation) {
    const { goal, experience, sessionDuration } = evaluation;
    const repParams = REP_RANGES[goal] || REP_RANGES.hipertrofia;
    const exerciseCount = EXERCISES_PER_SESSION[sessionDuration] || 6;
    const setsPerCompound  = goal === 'fuerza' ? 5 : (goal === 'resistencia' ? 3 : 4);
    const setsPerIsolation = goal === 'fuerza' ? 3 : 3;

    return { repParams, exerciseCount, setsPerCompound, setsPerIsolation };
  }

  // ── PASO 3: Construir día de entrenamiento ─────────────

  static buildDay(dayTemplate, evaluation, volumeParams) {
    const { muscles } = dayTemplate;
    const { goal, experience, equipment, priorityMuscles } = evaluation;
    const { repParams, exerciseCount, setsPerCompound, setsPerIsolation } = volumeParams;

    let selectedExercises = [];

    muscles.forEach((muscle, idx) => {
      const isPriority = priorityMuscles?.includes(muscle);
      const muscleExercises = EXERCISE_DATABASE[muscle] || [];

      // Filtrar por equipamiento disponible
      const available = muscleExercises.filter(ex =>
        this.isEquipmentAvailable(ex.equipment, equipment)
      );
      if (available.length === 0) return;

      // Ordenar por score
      const sorted = [...available].sort((a, b) =>
        this.scoreExercise(b, experience, goal, isPriority) -
        this.scoreExercise(a, experience, goal, isPriority)
      );

      // Músculo prioritario → hasta 2 ejercicios; normal → 1
      const take = (isPriority && idx < 2) ? 2 : 1;

      sorted.slice(0, take).forEach(ex => {
        const sets = ex.type === 'compuesto' ? setsPerCompound : setsPerIsolation;
        selectedExercises.push({
          exerciseId: ex.id,
          name: ex.name,
          nameEn: ex.nameEn,
          type: ex.type,
          musclesPrimary: ex.musclesPrimary,
          musclesSecondary: ex.musclesSecondary,
          sets,
          reps: repParams.reps,
          rest: repParams.rest,
          weight: this.getSuggestedWeight(ex, experience),
          rpe: repParams.rpe,
          tips: ex.tips,
          equipment: ex.equipment
        });
      });
    });

    return {
      ...dayTemplate,
      exercises: selectedExercises.slice(0, exerciseCount),
      estimatedDuration: evaluation.sessionDuration
    };
  }

  // ── PASO 4: Periodización de 30 días (4 semanas) ──────

  static applyPeriodization(days) {
    return days.map(day => ({
      ...day,
      periodization: WEEK_MODIFIERS
    }));
  }

  // ── HELPERS ────────────────────────────────────────────

  static scoreExercise(exercise, experience, goal, isPriority) {
    let score = 0;
    if (exercise.type === 'compuesto') score += 30;

    const diffMap = { principiante: 1, intermedio: 2, avanzado: 3 };
    const exDiff = diffMap[exercise.difficulty] || 2;
    const userDiff = diffMap[experience] || 2;
    score += (3 - Math.abs(exDiff - userDiff)) * 10;

    if (exercise.setsReps?.[goal] && exercise.setsReps[goal] !== 'N/A') score += 20;
    if (isPriority) score += 15;

    return score;
  }

  static isEquipmentAvailable(requiredEquipment, userEquipment) {
    const available = EQUIPMENT_TIERS[userEquipment] || EQUIPMENT_TIERS.gym_completo;
    return requiredEquipment.some(eq => available.includes(eq));
  }

  static getSuggestedWeight(exercise, experience) {
    const primaryMuscle = (exercise.musclesPrimary?.[0] || '').toLowerCase();
    const group = Object.keys(STARTER_WEIGHTS.intermedio).find(k =>
      primaryMuscle.includes(k)
    ) || 'pecho';
    return STARTER_WEIGHTS[experience]?.[group] || 20;
  }

  static orderExercises(exercises) {
    const typeOrder = { compuesto: 0, aislamiento: 1, 'estático': 2 };
    return [...exercises].sort((a, b) =>
      (typeOrder[a.type] || 1) - (typeOrder[b.type] || 1)
    );
  }

  /**
   * Devuelve el modificador de la semana actual dentro del ciclo.
   * @param {Date} cycleStartDate
   * @returns {{ week, label, setsMultiplier, weightMultiplier }}
   */
  static getCurrentWeekModifier(cycleStartDate) {
    const start = new Date(cycleStartDate);
    const now = new Date();
    const daysDiff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const weekIndex = Math.min(Math.floor(daysDiff / 7), 3);
    return { ...WEEK_MODIFIERS[weekIndex], weekNumber: weekIndex + 1 };
  }
}

export { SPLITS, REP_RANGES, WEEK_MODIFIERS, EQUIPMENT_TIERS };
