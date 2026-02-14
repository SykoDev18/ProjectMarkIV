import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, Filter, X, Dumbbell, Info, ChevronRight } from 'lucide-react';
import { EXERCISE_DATABASE, getAllExercises, MUSCLE_GROUPS } from './data/gymData';

const EQUIPMENT_FILTERS = ['barra', 'mancuernas', 'máquina', 'polea', 'cuerpo libre', 'paralelas'];
const DIFFICULTY_FILTERS = ['principiante', 'intermedio', 'avanzado'];
const TYPE_FILTERS = ['compuesto', 'aislamiento', 'estático'];

export default function ExerciseLibrary({ onBack }) {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const allExercises = useMemo(() => getAllExercises(), []);

  const filtered = useMemo(() => {
    return allExercises.filter(ex => {
      if (search) {
        const q = search.toLowerCase();
        if (!ex.name.toLowerCase().includes(q) && !ex.nameEn.toLowerCase().includes(q) && !ex.musclesPrimary?.some(m => m.toLowerCase().includes(q))) return false;
      }
      if (selectedGroup) {
        const group = EXERCISE_DATABASE[selectedGroup] || [];
        if (!group.some(g => g.id === ex.id)) return false;
      }
      if (selectedEquipment) {
        if (!ex.equipment?.some(e => e.toLowerCase().includes(selectedEquipment.toLowerCase()))) return false;
      }
      if (selectedDifficulty && ex.difficulty !== selectedDifficulty) return false;
      if (selectedType && ex.type !== selectedType) return false;
      return true;
    });
  }, [allExercises, search, selectedGroup, selectedEquipment, selectedDifficulty, selectedType]);

  const activeFilters = [selectedGroup, selectedEquipment, selectedDifficulty, selectedType].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 hover:text-white p-1"><ChevronLeft size={20} /></button>
        <h2 className="font-bold text-white flex items-center gap-2">
          <Dumbbell size={18} className="text-blue-400" /> Biblioteca de Ejercicios
        </h2>
        <button onClick={() => setShowFilters(!showFilters)} className="relative text-gray-400 hover:text-white p-1">
          <Filter size={18} />
          {activeFilters > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[10px] text-white flex items-center justify-center">{activeFilters}</span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o músculo..."
          className="w-full pl-9 pr-10 py-3 bg-[#111827] border border-white/[0.06] rounded-2xl text-sm text-white outline-none focus:border-blue-500"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Muscle Group Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setSelectedGroup(null)}
          className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors shrink-0 ${!selectedGroup ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}
        >
          Todos ({allExercises.length})
        </button>
        {MUSCLE_GROUPS.map(g => (
          <button
            key={g.id}
            onClick={() => setSelectedGroup(selectedGroup === g.id ? null : g.id)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors shrink-0 ${
              selectedGroup === g.id ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {g.icon} {g.name} ({(EXERCISE_DATABASE[g.id] || []).length})
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4 space-y-3">
              <div>
                <span className="text-xs text-gray-400 mb-1.5 block">Equipamiento</span>
                <div className="flex flex-wrap gap-1.5">
                  {EQUIPMENT_FILTERS.map(eq => (
                    <button key={eq}
                      onClick={() => setSelectedEquipment(selectedEquipment === eq ? null : eq)}
                      className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                        selectedEquipment === eq ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >{eq}</button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-400 mb-1.5 block">Dificultad</span>
                <div className="flex gap-1.5">
                  {DIFFICULTY_FILTERS.map(d => (
                    <button key={d}
                      onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                      className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                        selectedDifficulty === d ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-400 mb-1.5 block">Tipo</span>
                <div className="flex gap-1.5">
                  {TYPE_FILTERS.map(t => (
                    <button key={t}
                      onClick={() => setSelectedType(selectedType === t ? null : t)}
                      className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                        selectedType === t ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >{t}</button>
                  ))}
                </div>
              </div>
              {activeFilters > 0 && (
                <button
                  onClick={() => { setSelectedEquipment(null); setSelectedDifficulty(null); setSelectedType(null); setSelectedGroup(null); }}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="text-xs text-gray-500 px-1">{filtered.length} ejercicio{filtered.length !== 1 ? 's' : ''}</div>

      {/* Exercise List */}
      <div className="space-y-2">
        {filtered.map(ex => (
          <motion.button
            key={ex.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedExercise(ex)}
            className="w-full bg-[#111827] border border-white/[0.06] rounded-2xl p-4 text-left flex items-center gap-3 transition-colors hover:border-blue-500/30"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1C2333] flex items-center justify-center shrink-0">
              <Dumbbell size={20} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{ex.name}</div>
              <div className="text-xs text-gray-500 truncate">{ex.nameEn}</div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {ex.musclesPrimary?.slice(0, 2).map(m => (
                  <span key={m} className="text-[10px] px-1.5 py-0.5 bg-blue-500/15 text-blue-400 rounded-full">{m}</span>
                ))}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  ex.difficulty === 'principiante' ? 'bg-green-500/15 text-green-400' :
                  ex.difficulty === 'intermedio' ? 'bg-yellow-500/15 text-yellow-400' :
                  'bg-red-500/15 text-red-400'
                }`}>{ex.difficulty}</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-600 shrink-0" />
          </motion.button>
        ))}
      </div>

      {/* Exercise Detail Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedExercise(null)}
          >
            <motion.div
              initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0A0F1E] rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-b from-blue-600/20 to-transparent p-5 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Dumbbell size={28} className="text-blue-400" />
                  </div>
                  <button onClick={() => setSelectedExercise(null)} className="text-gray-400 p-1"><X size={18} /></button>
                </div>
                <h2 className="text-xl font-black text-white">{selectedExercise.name}</h2>
                <p className="text-sm text-gray-400">{selectedExercise.nameEn}</p>
              </div>

              <div className="p-5 space-y-5">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    selectedExercise.type === 'compuesto' ? 'bg-blue-500/20 text-blue-400' :
                    selectedExercise.type === 'estático' ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>{selectedExercise.type}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    selectedExercise.difficulty === 'principiante' ? 'bg-green-500/20 text-green-400' :
                    selectedExercise.difficulty === 'intermedio' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{selectedExercise.difficulty}</span>
                  {selectedExercise.mechanics && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-700 text-gray-300">{selectedExercise.mechanics}</span>
                  )}
                </div>

                {/* Muscles */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Músculos Primarios</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedExercise.musclesPrimary?.map(m => (
                      <span key={m} className="px-3 py-1.5 bg-blue-500/15 text-blue-400 rounded-xl text-xs font-medium">{m}</span>
                    ))}
                  </div>
                </div>
                {selectedExercise.musclesSecondary?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Músculos Secundarios</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedExercise.musclesSecondary.map(m => (
                        <span key={m} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-xl text-xs">{m}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sets x Reps */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Series × Repeticiones</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(selectedExercise.setsReps || {}).map(([goal, sr]) => (
                      <div key={goal} className="bg-[#1C2333] rounded-xl p-3 text-center">
                        <div className="text-[10px] text-gray-400 capitalize mb-1">{goal}</div>
                        <div className="text-sm text-white font-bold">{sr}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rest times */}
                {selectedExercise.rest && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Descanso</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(selectedExercise.rest).map(([goal, sec]) => (
                        <div key={goal} className="bg-[#1C2333] rounded-xl p-2.5 text-center">
                          <div className="text-[10px] text-gray-400 capitalize">{goal}</div>
                          <div className="text-xs text-white font-medium">{sec >= 60 ? `${sec/60}min` : `${sec}s`}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tips de Ejecución</h4>
                  <ul className="space-y-2">
                    {selectedExercise.tips?.map((tip, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-gray-300">
                        <span className="text-blue-400 mt-0.5 shrink-0">▸</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Equipment */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Equipamiento</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedExercise.equipment?.map(eq => (
                      <span key={eq} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-xl text-xs capitalize">{eq}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
