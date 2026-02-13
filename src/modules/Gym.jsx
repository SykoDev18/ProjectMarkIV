import React, { useState, useEffect, useCallback } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  ChevronRight, 
  Trophy, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Search,
  Image,
  Play,
  ExternalLink,
  Info,
  Target,
  Settings,
  AlertCircle
} from 'lucide-react';
import { triggerHaptic, addToCalendar } from '../utils';
import { API_CONFIG } from '../config/apiKeys';

// ExerciseDB API configuration
const EXERCISEDB_API = API_CONFIG.exerciseDB.baseUrl;
const RAPIDAPI_KEY = API_CONFIG.exerciseDB.apiKey;

// Popular fallback exercises with free images
const FALLBACK_EXERCISES = {
  'Press Banca': { 
    gifUrl: 'https://media.giphy.com/media/3o6ZsYz1LQzgyNgnks/giphy.gif',
    target: 'pectorales',
    equipment: 'barra'
  },
  'Sentadilla': { 
    gifUrl: 'https://media.giphy.com/media/1qfKN8Dt0CRdCRxz9q/giphy.gif',
    target: 'cuádriceps',
    equipment: 'barra'
  },
  'Dominadas': { 
    gifUrl: 'https://media.giphy.com/media/3o6Zt3AC93PIPAdQ9a/giphy.gif',
    target: 'espalda',
    equipment: 'barra fija'
  },
  'Press Militar': { 
    gifUrl: 'https://media.giphy.com/media/l0HlQoWRbsM3657t6/giphy.gif',
    target: 'hombros',
    equipment: 'barra'
  },
  'Peso Muerto': { 
    gifUrl: 'https://media.giphy.com/media/xT0xeqCPUF5aLLYJHi/giphy.gif',
    target: 'espalda baja',
    equipment: 'barra'
  },
  'Curl Bíceps': { 
    gifUrl: 'https://media.giphy.com/media/3o6ZsTYhM1qJn3LXWS/giphy.gif',
    target: 'bíceps',
    equipment: 'mancuernas'
  }
};

export default function Gym({ data, updateData }) {
  const [activeDay, setActiveDay] = useState(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', weight: '' });
  const [editingPB, setEditingPB] = useState(null);
  const [tempPB, setTempPB] = useState('');
  
  // ExerciseDB state
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedExerciseInfo, setSelectedExerciseInfo] = useState(null);
  const [showApiSetup, setShowApiSetup] = useState(false);

  const hasExerciseDBKey = RAPIDAPI_KEY !== '';

  // Search ExerciseDB API
  const searchExercises = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    if (!hasExerciseDBKey) {
      // Use fallback search through our predefined exercises
      const lowerQuery = searchQuery.toLowerCase();
      const results = Object.entries(FALLBACK_EXERCISES)
        .filter(([name]) => name.toLowerCase().includes(lowerQuery))
        .map(([name, data]) => ({
          id: name,
          name,
          ...data,
          isFallback: true
        }));
      setSearchResults(results);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `${EXERCISEDB_API}/exercises/name/${encodeURIComponent(searchQuery)}?limit=20`,
        {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('ExerciseDB search error:', error);
    }
    setIsSearching(false);
  }, [searchQuery, hasExerciseDBKey]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(searchExercises, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchExercises]);

  // Get exercise info from ExerciseDB or fallback
  const getExerciseInfo = (exerciseName) => {
    // Check fallback first
    if (FALLBACK_EXERCISES[exerciseName]) {
      return {
        name: exerciseName,
        ...FALLBACK_EXERCISES[exerciseName],
        isFallback: true
      };
    }
    return null;
  };

  if (!data) return null;

  const toggleExercise = (dayId, exerciseIndex) => {
    triggerHaptic();
    const dayIndex = data.gym.dias.findIndex(d => d.id === dayId);
    const newDias = [...data.gym.dias];
    newDias[dayIndex].exercises[exerciseIndex].done = !newDias[dayIndex].exercises[exerciseIndex].done;
    updateData('gym', { ...data.gym, dias: newDias });
  };

  const addExercise = (dayId, fromSearch = null) => {
    let exerciseData;
    
    if (fromSearch) {
      // Adding from ExerciseDB search
      exerciseData = {
        name: fromSearch.name,
        sets: '3',
        reps: '10',
        weight: 'BW',
        done: false,
        gifUrl: fromSearch.gifUrl,
        target: fromSearch.target,
        equipment: fromSearch.equipment,
        bodyPart: fromSearch.bodyPart
      };
    } else {
      // Manual add
      if (!newExercise.name) return;
      const fallbackInfo = FALLBACK_EXERCISES[newExercise.name];
      exerciseData = {
        name: newExercise.name,
        sets: newExercise.sets || '3',
        reps: newExercise.reps || '10',
        weight: newExercise.weight || 'BW',
        done: false,
        gifUrl: fallbackInfo?.gifUrl,
        target: fallbackInfo?.target,
        equipment: fallbackInfo?.equipment
      };
    }
    
    triggerHaptic();
    const dayIndex = data.gym.dias.findIndex(d => d.id === dayId);
    const newDias = [...data.gym.dias];
    newDias[dayIndex].exercises.push(exerciseData);
    updateData('gym', { ...data.gym, dias: newDias });
    
    if (!fromSearch) {
      setNewExercise({ name: '', sets: '', reps: '', weight: '' });
      setShowAddExercise(false);
    } else {
      setShowExerciseSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const deleteExercise = (dayId, exerciseIndex) => {
    triggerHaptic();
    const dayIndex = data.gym.dias.findIndex(d => d.id === dayId);
    const newDias = [...data.gym.dias];
    newDias[dayIndex].exercises.splice(exerciseIndex, 1);
    updateData('gym', { ...data.gym, dias: newDias });
  };

  const updatePB = (key) => {
    const newValue = parseFloat(tempPB);
    if (!isNaN(newValue) && newValue > 0) {
      triggerHaptic();
      updateData('gym', { 
        ...data.gym, 
        pbs: { ...data.gym.pbs, [key]: newValue }
      });
    }
    setEditingPB(null);
  };

  const incrementWeek = () => {
    triggerHaptic();
    updateData('gym', { ...data.gym, week: data.gym.week + 1 });
  };

  const resetDayExercises = (dayId) => {
    triggerHaptic();
    const dayIndex = data.gym.dias.findIndex(d => d.id === dayId);
    const newDias = [...data.gym.dias];
    newDias[dayIndex].exercises = newDias[dayIndex].exercises.map(ex => ({ ...ex, done: false }));
    updateData('gym', { ...data.gym, dias: newDias });
  };

  const getDayProgress = (exercises) => {
    if (!exercises.length) return 0;
    return Math.round((exercises.filter(e => e.done).length / exercises.length) * 100);
  };

  if (activeDay) {
    const day = data.gym.dias.find(d => d.id === activeDay);
    const dayProgress = getDayProgress(day.exercises);
    
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
              <IOSButton onClick={() => setActiveDay(null)} variant="secondary" size="sm">
                  ← Volver
              </IOSButton>
              <IOSButton 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => addToCalendar(`Entrenamiento: ${day.name}`)}
              >
                  <Calendar size={20} className="text-blue-400" />
              </IOSButton>
            </div>
            
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{day.name}</h2>
                <span className="text-sm text-blue-400">{dayProgress}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${dayProgress}%` }}
              />
            </div>
            
            {day.exercises.map((ex, idx) => {
                const exerciseInfo = ex.gifUrl ? ex : getExerciseInfo(ex.name);
                return (
                <IOSCard key={idx} className={`${ex.done ? 'opacity-50' : ''} group`}>
                    <div className="flex gap-3">
                        {/* Exercise GIF/Image */}
                        {exerciseInfo?.gifUrl && (
                          <div 
                            className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800 shrink-0 cursor-pointer"
                            onClick={() => setSelectedExerciseInfo(exerciseInfo)}
                          >
                            <img 
                              src={exerciseInfo.gifUrl} 
                              alt={ex.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Play size={20} className="text-white" />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div onClick={() => toggleExercise(day.id, idx)} className="flex-1 cursor-pointer">
                                <h4 className="font-bold text-lg">{ex.name}</h4>
                                {exerciseInfo?.target && (
                                  <span className="text-xs text-orange-400 capitalize">{exerciseInfo.target}</span>
                                )}
                                <div className="flex gap-2 text-sm text-gray-400 mt-1 flex-wrap">
                                    <span className="bg-gray-800 px-2 py-0.5 rounded">{ex.sets} sets</span>
                                    <span className="bg-gray-800 px-2 py-0.5 rounded">{ex.reps} reps</span>
                                    <span className="text-blue-400 font-bold">{ex.weight}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {exerciseInfo && (
                                <button 
                                  onClick={() => setSelectedExerciseInfo(exerciseInfo)}
                                  className="p-1 text-gray-500 hover:text-blue-400"
                                >
                                  <Info size={16} />
                                </button>
                              )}
                              <button 
                                onClick={() => deleteExercise(day.id, idx)}
                                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                              <div 
                                onClick={() => toggleExercise(day.id, idx)}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer ${ex.done ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}
                              >
                                {ex.done && <Dumbbell size={16} className="text-black" />}
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </IOSCard>
              );
            })}
            
            {/* Add Exercise */}
            {showAddExercise ? (
              <IOSCard className="animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-3">
                  <input 
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                    placeholder="Nombre del ejercicio..."
                    className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-blue-500"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input 
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({...newExercise, sets: e.target.value})}
                      placeholder="Sets"
                      className="p-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-blue-500 text-center"
                    />
                    <input 
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                      placeholder="Reps"
                      className="p-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-blue-500 text-center"
                    />
                    <input 
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise({...newExercise, weight: e.target.value})}
                      placeholder="Peso"
                      className="p-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-blue-500 text-center"
                    />
                  </div>
                  <div className="flex gap-2">
                    <IOSButton onClick={() => addExercise(day.id)} variant="primary" className="flex-1">
                      Añadir
                    </IOSButton>
                    <IOSButton onClick={() => setShowAddExercise(false)} variant="ghost">
                      <X size={18} />
                    </IOSButton>
                  </div>
                </div>
              </IOSCard>
            ) : (
              <div className="flex gap-2">
                <IOSButton onClick={() => setShowAddExercise(true)} variant="secondary" className="flex-1 flex items-center justify-center gap-2">
                  <Plus size={18} /> Manual
                </IOSButton>
                <IOSButton onClick={() => setShowExerciseSearch(true)} variant="primary" className="flex-1 flex items-center justify-center gap-2">
                  <Search size={18} /> Buscar
                </IOSButton>
              </div>
            )}
            
            {day.exercises.length > 0 && (
              <IOSButton onClick={() => resetDayExercises(day.id)} variant="ghost" className="w-full text-gray-500 text-sm">
                Reiniciar ejercicios del día
              </IOSButton>
            )}
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Week Counter */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-4 border border-blue-500/20">
        <div>
          <p className="text-xs text-gray-400 uppercase">Semana de Entrenamiento</p>
          <p className="text-3xl font-bold text-white">{data.gym.week}</p>
        </div>
        <IOSButton onClick={incrementWeek} variant="secondary" size="sm">
          <Trophy size={16} className="mr-1" /> +1 Semana
        </IOSButton>
      </div>

      {/* Personal Bests */}
      <div className="grid grid-cols-3 gap-3">
        {['bench', 'squat', 'deadlift'].map(key => (
          <div key={key} className="bg-gray-900 rounded-2xl p-3 text-center border border-gray-800 group">
            {editingPB === key ? (
              <div className="space-y-2">
                <input 
                  type="number"
                  value={tempPB}
                  onChange={(e) => setTempPB(e.target.value)}
                  className="w-full bg-transparent text-center text-lg font-bold text-white outline-none border-b border-blue-500"
                  autoFocus
                />
                <div className="flex gap-1">
                  <button onClick={() => updatePB(key)} className="flex-1 text-xs text-green-400">✓</button>
                  <button onClick={() => setEditingPB(null)} className="flex-1 text-xs text-red-400">✕</button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-400 capitalize">{key}</p>
                <p className="text-lg font-bold text-white">{data.gym.pbs[key]}kg</p>
                <button 
                  onClick={() => { setEditingPB(key); setTempPB(data.gym.pbs[key].toString()); }}
                  className="opacity-0 group-hover:opacity-100 text-xs text-blue-400 transition-opacity"
                >
                  <Edit2 size={12} className="inline" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-300 ml-1">Rutina Semanal</h3>
        {data.gym.dias.map(day => {
            const dayProgress = getDayProgress(day.exercises);
            return (
                <IOSCard key={day.id} onClick={() => setActiveDay(day.id)} className="group">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <Calendar size={20} />
                            </div>
                            <div>
                              <span className="font-medium">{day.name}</span>
                              <div className="h-1 w-20 bg-gray-800 rounded-full mt-1 overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 transition-all"
                                  style={{ width: `${dayProgress}%` }}
                                />
                              </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{dayProgress}%</span>
                          <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </IOSCard>
            );
        })}
      </div>

      {/* Exercise Search Modal */}
      <AnimatePresence>
        {showExerciseSearch && activeDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => { setShowExerciseSearch(false); setSearchQuery(''); setSearchResults([]); }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            >
              <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Buscar Ejercicios</h3>
                  <button onClick={() => { setShowExerciseSearch(false); setSearchQuery(''); setSearchResults([]); }}>
                    <X size={20} />
                  </button>
                </div>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar ejercicio..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>
                {!hasExerciseDBKey && (
                  <p className="text-xs text-yellow-500 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} /> Modo demo - Configura ExerciseDB API para más ejercicios
                  </p>
                )}
              </div>

              <div className="overflow-y-auto max-h-96 p-4 space-y-2">
                {isSearching && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                )}

                {!isSearching && searchResults.length === 0 && searchQuery && (
                  <p className="text-center text-gray-500 py-8">No se encontraron ejercicios</p>
                )}

                {!isSearching && searchResults.length === 0 && !searchQuery && (
                  <div className="text-center py-8 text-gray-500">
                    <Dumbbell size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Busca ejercicios para ver demos</p>
                  </div>
                )}

                {searchResults.map(exercise => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <IOSCard className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800/50"
                      onClick={() => addExercise(activeDay, exercise)}
                    >
                      {exercise.gifUrl && (
                        <img 
                          src={exercise.gifUrl} 
                          alt={exercise.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white capitalize truncate">{exercise.name}</h4>
                        <div className="flex gap-2 text-xs text-gray-400 mt-1">
                          {exercise.target && <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded capitalize">{exercise.target}</span>}
                          {exercise.equipment && <span className="bg-gray-800 px-2 py-0.5 rounded capitalize">{exercise.equipment}</span>}
                        </div>
                      </div>
                      <Plus size={20} className="text-blue-400" />
                    </IOSCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise Info Modal */}
      <AnimatePresence>
        {selectedExerciseInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedExerciseInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl w-full max-w-sm overflow-hidden"
            >
              {selectedExerciseInfo.gifUrl && (
                <div className="aspect-square bg-black">
                  <img 
                    src={selectedExerciseInfo.gifUrl} 
                    alt={selectedExerciseInfo.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-xl capitalize">{selectedExerciseInfo.name}</h3>
                
                <div className="flex flex-wrap gap-2">
                  {selectedExerciseInfo.target && (
                    <span className="flex items-center gap-1 text-sm bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                      <Target size={14} /> {selectedExerciseInfo.target}
                    </span>
                  )}
                  {selectedExerciseInfo.equipment && (
                    <span className="flex items-center gap-1 text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded-full capitalize">
                      <Dumbbell size={14} /> {selectedExerciseInfo.equipment}
                    </span>
                  )}
                  {selectedExerciseInfo.bodyPart && (
                    <span className="flex items-center gap-1 text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full capitalize">
                      {selectedExerciseInfo.bodyPart}
                    </span>
                  )}
                </div>

                {selectedExerciseInfo.instructions && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Instrucciones</h4>
                    <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                      {selectedExerciseInfo.instructions.slice(0, 5).map((instruction, i) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                )}

                <IOSButton onClick={() => setSelectedExerciseInfo(null)} variant="secondary" className="w-full mt-4">
                  Cerrar
                </IOSButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
