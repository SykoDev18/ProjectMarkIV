import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Dumbbell, ChevronRight, Trophy, Calendar, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { triggerHaptic, addToCalendar } from '../utils';

export default function Gym({ data, updateData }) {
  const [activeDay, setActiveDay] = useState(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', weight: '' });
  const [editingPB, setEditingPB] = useState(null);
  const [tempPB, setTempPB] = useState('');

  if (!data) return null;

  const toggleExercise = (dayId, exerciseIndex) => {
    triggerHaptic();
    const dayIndex = data.gym.dias.findIndex(d => d.id === dayId);
    const newDias = [...data.gym.dias];
    newDias[dayIndex].exercises[exerciseIndex].done = !newDias[dayIndex].exercises[exerciseIndex].done;
    updateData('gym', { ...data.gym, dias: newDias });
  };

  const addExercise = (dayId) => {
    if (!newExercise.name) return;
    triggerHaptic();
    const dayIndex = data.gym.dias.findIndex(d => d.id === dayId);
    const newDias = [...data.gym.dias];
    newDias[dayIndex].exercises.push({
      name: newExercise.name,
      sets: newExercise.sets || '3',
      reps: newExercise.reps || '10',
      weight: newExercise.weight || 'BW',
      done: false
    });
    updateData('gym', { ...data.gym, dias: newDias });
    setNewExercise({ name: '', sets: '', reps: '', weight: '' });
    setShowAddExercise(false);
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
            
            {day.exercises.map((ex, idx) => (
                <IOSCard key={idx} className={`${ex.done ? 'opacity-50' : ''} group`}>
                    <div className="flex justify-between items-center">
                        <div onClick={() => toggleExercise(day.id, idx)} className="flex-1 cursor-pointer">
                            <h4 className="font-bold text-lg">{ex.name}</h4>
                            <div className="flex gap-3 text-sm text-gray-400 mt-1">
                                <span className="bg-gray-800 px-2 py-0.5 rounded">{ex.sets} sets</span>
                                <span className="bg-gray-800 px-2 py-0.5 rounded">{ex.reps} reps</span>
                                <span className="text-blue-400 font-bold">{ex.weight}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
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
                </IOSCard>
            ))}
            
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
              <IOSButton onClick={() => setShowAddExercise(true)} variant="secondary" className="w-full flex items-center justify-center gap-2">
                <Plus size={18} /> Añadir Ejercicio
              </IOSButton>
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
    </div>
  );
}
