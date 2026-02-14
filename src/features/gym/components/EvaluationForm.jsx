import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Target, Dumbbell, Clock,
  Zap, Star, AlertTriangle, Check
} from 'lucide-react';

const GOALS = [
  { id: 'hipertrofia', label: 'Hipertrofia', desc: 'Ganar masa muscular', icon: '💪', color: 'blue' },
  { id: 'fuerza', label: 'Fuerza', desc: 'Más peso, menos reps', icon: '🏋️', color: 'red' },
  { id: 'resistencia', label: 'Resistencia', desc: 'Más reps, cardio muscular', icon: '🏃', color: 'green' },
  { id: 'definicion', label: 'Definición', desc: 'Perder grasa, mantener músculo', icon: '✂️', color: 'yellow' },
  { id: 'bienestar', label: 'Bienestar general', desc: 'Salud y movimiento', icon: '🧘', color: 'cyan' },
];

const EXPERIENCE = [
  { id: 'principiante', label: 'Principiante', desc: '0-6 meses entrenando', icon: '🌱' },
  { id: 'intermedio', label: 'Intermedio', desc: '6 meses - 2 años', icon: '🌿' },
  { id: 'avanzado', label: 'Avanzado', desc: '2+ años consistentes', icon: '🌳' },
];

const DAYS_OPTIONS = [2, 3, 4, 5, 6];

const EQUIPMENT = [
  { id: 'cuerpo libre', label: 'Solo cuerpo libre', desc: 'Sin equipo' },
  { id: 'mancuernas', label: 'Mancuernas', desc: 'Casa con mancuernas' },
  { id: 'mancuernas_y_barra', label: 'Mancuernas + Barra', desc: 'Home gym completo' },
  { id: 'gym_completo', label: 'Gym completo', desc: 'Gimnasio comercial' },
];

const DURATIONS = [
  { value: 30, label: '30 min', desc: 'Rápido' },
  { value: 45, label: '45 min', desc: 'Estándar' },
  { value: 60, label: '60 min', desc: 'Completo' },
  { value: 90, label: '90 min', desc: 'Intenso' },
];

const MUSCLE_PRIORITIES = [
  { id: 'pecho', label: 'Pecho', icon: '🫁' },
  { id: 'espalda', label: 'Espalda', icon: '🔙' },
  { id: 'piernas', label: 'Piernas', icon: '🦵' },
  { id: 'hombros', label: 'Hombros', icon: '💪' },
  { id: 'biceps', label: 'Bíceps', icon: '💪' },
  { id: 'triceps', label: 'Tríceps', icon: '💪' },
  { id: 'abdomen', label: 'Abdomen', icon: '🎯' },
];

const TOTAL_STEPS = 6;

export default function EvaluationForm({ onComplete, onBack, initialData }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    goal: initialData?.goal || '',
    experience: initialData?.experience || '',
    daysPerWeek: initialData?.daysPerWeek || 4,
    equipment: initialData?.equipment || 'gym_completo',
    sessionDuration: initialData?.sessionDuration || 60,
    priorityMuscles: initialData?.priorityMuscles || [],
    injuries: initialData?.injuries || '',
  });

  const update = (key, value) => setForm(p => ({ ...p, [key]: value }));

  const toggleMuscle = (id) => {
    setForm(p => ({
      ...p,
      priorityMuscles: p.priorityMuscles.includes(id)
        ? p.priorityMuscles.filter(m => m !== id)
        : p.priorityMuscles.length < 3
          ? [...p.priorityMuscles, id]
          : p.priorityMuscles
    }));
  };

  const canAdvance = () => {
    switch (step) {
      case 1: return !!form.goal;
      case 2: return !!form.experience;
      case 3: return form.daysPerWeek >= 2;
      case 4: return !!form.equipment;
      case 5: return form.sessionDuration > 0;
      case 6: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
    else onComplete(form);
  };

  const OptionCard = ({ selected, onClick, children, className = '' }) => (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-all ${
        selected
          ? 'bg-blue-500/15 border-blue-500/50 ring-1 ring-blue-500/30'
          : 'bg-[#111827] border-white/[0.06] hover:border-white/20'
      } ${className}`}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : onBack?.()}
          className="text-gray-400 hover:text-white p-1"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-sm text-gray-400">Paso {step}/{TOTAL_STEPS}</div>
        <div className="w-6" />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-blue-500 rounded-full"
        />
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          {/* STEP 1: Goal */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Target size={22} className="text-blue-400" /> ¿Cuál es tu objetivo?
                </h2>
                <p className="text-sm text-gray-400 mt-1">Esto define las repeticiones, descansos y selección de ejercicios.</p>
              </div>
              <div className="space-y-2">
                {GOALS.map(g => (
                  <OptionCard key={g.id} selected={form.goal === g.id} onClick={() => update('goal', g.id)}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{g.icon}</span>
                      <div>
                        <div className="font-semibold text-white">{g.label}</div>
                        <div className="text-xs text-gray-400">{g.desc}</div>
                      </div>
                      {form.goal === g.id && <Check size={18} className="text-blue-400 ml-auto" />}
                    </div>
                  </OptionCard>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Experience */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Star size={22} className="text-yellow-400" /> Nivel de experiencia
                </h2>
                <p className="text-sm text-gray-400 mt-1">Ajusta la dificultad de los ejercicios y el volumen de trabajo.</p>
              </div>
              <div className="space-y-2">
                {EXPERIENCE.map(e => (
                  <OptionCard key={e.id} selected={form.experience === e.id} onClick={() => update('experience', e.id)}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{e.icon}</span>
                      <div>
                        <div className="font-semibold text-white">{e.label}</div>
                        <div className="text-xs text-gray-400">{e.desc}</div>
                      </div>
                      {form.experience === e.id && <Check size={18} className="text-blue-400 ml-auto" />}
                    </div>
                  </OptionCard>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Days per week */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Dumbbell size={22} className="text-green-400" /> ¿Cuántos días por semana?
                </h2>
                <p className="text-sm text-gray-400 mt-1">Define el tipo de split (Full Body, Upper/Lower, PPL…).</p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {DAYS_OPTIONS.map(d => (
                  <motion.button
                    key={d}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => update('daysPerWeek', d)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all ${
                      form.daysPerWeek === d
                        ? 'bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/30'
                        : 'bg-[#111827] border-white/[0.06]'
                    }`}
                  >
                    <span className="text-2xl font-black text-white">{d}</span>
                    <span className="text-[10px] text-gray-400">días</span>
                  </motion.button>
                ))}
              </div>
              <div className="bg-[#1C2333] rounded-xl p-3 text-xs text-gray-400">
                {form.daysPerWeek <= 3 && '💡 Con 2-3 días → Full Body. Ideal si estás empezando o tienes poco tiempo.'}
                {form.daysPerWeek === 4 && '💡 4 días → Upper/Lower. Buen balance entre volumen y recuperación.'}
                {form.daysPerWeek === 5 && '💡 5 días → Push/Pull/Legs + Upper/Lower. Para intermedios-avanzados.'}
                {form.daysPerWeek === 6 && '💡 6 días → PPL 2x. Alto volumen — requiere buena recuperación.'}
              </div>
            </div>
          )}

          {/* STEP 4: Equipment */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Dumbbell size={22} className="text-purple-400" /> Equipamiento disponible
                </h2>
                <p className="text-sm text-gray-400 mt-1">Filtra los ejercicios para lo que tienes acceso.</p>
              </div>
              <div className="space-y-2">
                {EQUIPMENT.map(eq => (
                  <OptionCard key={eq.id} selected={form.equipment === eq.id} onClick={() => update('equipment', eq.id)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{eq.label}</div>
                        <div className="text-xs text-gray-400">{eq.desc}</div>
                      </div>
                      {form.equipment === eq.id && <Check size={18} className="text-blue-400" />}
                    </div>
                  </OptionCard>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Session Duration */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Clock size={22} className="text-orange-400" /> Duración por sesión
                </h2>
                <p className="text-sm text-gray-400 mt-1">Determina cuántos ejercicios por sesión.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DURATIONS.map(d => (
                  <OptionCard key={d.value} selected={form.sessionDuration === d.value} onClick={() => update('sessionDuration', d.value)}>
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">{d.label}</div>
                      <div className="text-xs text-gray-400">{d.desc}</div>
                    </div>
                  </OptionCard>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Priority muscles + injuries */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Zap size={22} className="text-yellow-400" /> Ajustes finales
                </h2>
                <p className="text-sm text-gray-400 mt-1">Músculos prioritarios (max 3) y lesiones.</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Músculos prioritarios</span>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {MUSCLE_PRIORITIES.map(m => (
                    <motion.button
                      key={m.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleMuscle(m.id)}
                      className={`p-2.5 rounded-xl text-center border transition-all ${
                        form.priorityMuscles.includes(m.id)
                          ? 'bg-blue-500/20 border-blue-500/50'
                          : 'bg-[#111827] border-white/[0.06]'
                      }`}
                    >
                      <div className="text-lg">{m.icon}</div>
                      <div className="text-[10px] text-gray-300 mt-0.5">{m.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lesiones o limitaciones</span>
                <textarea
                  value={form.injuries}
                  onChange={(e) => update('injuries', e.target.value)}
                  placeholder="Ej: Dolor en hombro derecho, hernia lumbar..."
                  className="w-full mt-2 p-3 bg-[#111827] border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-2">
        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex-1 py-3 rounded-2xl border border-white/[0.06] text-gray-300 text-sm font-medium"
          >
            Atrás
          </button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          disabled={!canAdvance()}
          className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            canAdvance()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {step === TOTAL_STEPS ? (
            <><Zap size={16} /> Generar mi rutina</>
          ) : (
            <>Siguiente <ChevronRight size={16} /></>
          )}
        </motion.button>
      </div>
    </div>
  );
}
