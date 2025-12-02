import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Dumbbell, ChevronRight, Trophy, Calendar } from 'lucide-react';
import { triggerHaptic, addToCalendar } from '../utils';

export default function Gym({ data, updateData }) {
  const [activeDay, setActiveDay] = useState(null);

  if (!data) return null;

  const toggleExercise = (dayId, exerciseIndex) => {
    triggerHaptic();
    const dayIndex = data.gym.dias.findIndex(d => d.id === dayId);
    const newDias = [...data.gym.dias];
    newDias[dayIndex].exercises[exerciseIndex].done = !newDias[dayIndex].exercises[exerciseIndex].done;
    updateData('gym.dias', newDias);
  };

  if (activeDay) {
    const day = data.gym.dias.find(d => d.id === activeDay);
    return (
        <div className="space-y-4">
            <IOSButton onClick={() => setActiveDay(null)} variant="secondary" className="mb-4">
                ← Volver a Rutinas
            </IOSButton>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{day.name}</h2>
                <IOSButton 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => addToCalendar(`Entrenamiento: ${day.name}`)}
                >
                    <Calendar size={20} className="text-blue-400" />
                </IOSButton>
            </div>
            {day.exercises.map((ex, idx) => (
                <IOSCard key={idx} onClick={() => toggleExercise(day.id, idx)} className={ex.done ? 'opacity-50' : ''}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-lg">{ex.name}</h4>
                            <div className="flex gap-3 text-sm text-gray-400 mt-1">
                                <span className="bg-gray-800 px-2 py-0.5 rounded">{ex.sets} sets</span>
                                <span className="bg-gray-800 px-2 py-0.5 rounded">{ex.reps} reps</span>
                                <span className="text-blue-400 font-bold">{ex.weight}</span>
                            </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${ex.done ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                            {ex.done && <Dumbbell size={16} className="text-black" />}
                        </div>
                    </div>
                </IOSCard>
            ))}
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900 rounded-2xl p-3 text-center border border-gray-800">
            <p className="text-xs text-gray-400">Bench</p>
            <p className="text-lg font-bold text-white">{data.gym.pbs.bench}kg</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-3 text-center border border-gray-800">
            <p className="text-xs text-gray-400">Squat</p>
            <p className="text-lg font-bold text-white">{data.gym.pbs.squat}kg</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-3 text-center border border-gray-800">
            <p className="text-xs text-gray-400">Deadlift</p>
            <p className="text-lg font-bold text-white">{data.gym.pbs.deadlift}kg</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-300 ml-1">Rutina Semanal</h3>
        {data.gym.dias.map(day => (
            <IOSCard key={day.id} onClick={() => setActiveDay(day.id)} className="group">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <Calendar size={20} />
                        </div>
                        <span className="font-medium">{day.name}</span>
                    </div>
                    <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
                </div>
            </IOSCard>
        ))}
      </div>
    </div>
  );
}
