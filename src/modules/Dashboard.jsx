import React from 'react';
import { motion } from 'framer-motion';
import IOSCard from '../components/ui/IOSCard';
import FitnessRing from '../components/ui/FitnessRing';
import { Droplets, Dumbbell, Brain, ShieldCheck } from 'lucide-react';

export default function Dashboard({ data }) {
  if (!data) return <div className="text-center text-gray-500 mt-10">Cargando...</div>;

  const waterProgress = (data.habits.water.current / data.habits.water.target) * 100;
  
  // Calculate overall daily score based on habits
  const habitsList = ['gym', 'reading', 'meditation', 'sleep', 'skincare', 'emotional'];
  const completedHabits = habitsList.filter(h => data.habits[h]?.done).length;
  const totalHabits = habitsList.length;
  const habitProgress = (completedHabits / totalHabits) * 100;

  return (
    <div className="space-y-6">
      {/* Daily Affirmation */}
      <IOSCard className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/20">
        <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">Afirmación del día</h3>
        <p className="text-lg font-medium text-white">"Soy capaz, soy fuerte, soy suficiente."</p>
      </IOSCard>

      {/* Progreso Diario Card (Matches Image) */}
      <IOSCard className="bg-slate-900 text-white border-none shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Progreso Diario</p>
            <h2 className="text-3xl font-bold">Sigue así</h2>
          </div>
          <div className="relative w-20 h-20 flex items-center justify-center">
             <FitnessRing progress={habitProgress} color="#3b82f6" size={80} strokeWidth={8} />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 border-t border-gray-800 pt-4">
            <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Gym</p>
                <p className="font-bold text-xl">{data.gym.week > 0 ? data.gym.week : '-'}</p>
            </div>
            <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Mente</p>
                <p className="font-bold text-xl">{data.habits.meditation.done ? '1' : '-'}</p>
            </div>
            <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Agua</p>
                <p className="font-bold text-xl text-blue-400">{data.habits.water.current}/{data.habits.water.target}</p>
            </div>
        </div>
      </IOSCard>

      <IOSCard title="Estado Mental">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${data.overthinking.emergencyMode ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
              <Brain size={20} />
            </div>
            <div>
              <h4 className="font-medium">Overthinking</h4>
              <p className="text-xs text-gray-400">{data.overthinking.emergencyMode ? 'Activo' : 'Bajo control'}</p>
            </div>
          </div>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </IOSCard>

      <IOSCard title="Seguridad Social">
        <div className="space-y-3">
            {data.security.dailyChecks.slice(0, 2).map(check => (
                <div key={check.id} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${check.done ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                        {check.done && <ShieldCheck size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm ${check.done ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{check.text}</span>
                </div>
            ))}
        </div>
      </IOSCard>
    </div>
  );
}
