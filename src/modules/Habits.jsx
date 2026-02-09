import React from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Droplets, Check, Moon, Book, Smile, Activity, Sun, Heart, RotateCcw, Minus } from 'lucide-react';
import { triggerHaptic } from '../utils';

export default function Habits({ data, updateData }) {
  if (!data) return null;

  const toggleHabit = (key) => {
    triggerHaptic();
    const newHabits = { ...data.habits };
    newHabits[key] = { ...newHabits[key], done: !newHabits[key].done };
    updateData('habits', newHabits);
  };

  const addWater = () => {
    triggerHaptic();
    const current = data.habits.water.current;
    if (current < data.habits.water.target) {
      const newHabits = { ...data.habits };
      newHabits.water = { ...newHabits.water, current: current + 1 };
      updateData('habits', newHabits);
    }
  };

  const removeWater = () => {
    triggerHaptic();
    const current = data.habits.water.current;
    if (current > 0) {
      const newHabits = { ...data.habits };
      newHabits.water = { ...newHabits.water, current: current - 1 };
      updateData('habits', newHabits);
    }
  };

  const resetAllHabits = () => {
    triggerHaptic();
    const resetHabits = {
      water: { ...data.habits.water, current: 0 },
      gym: { done: false },
      reading: { done: false },
      meditation: { done: false },
      sleep: { done: false },
      skincare: { done: false },
      emotional: { done: false }
    };
    updateData('habits', resetHabits);
  };

  const habitsConfig = [
    { key: 'gym', label: 'Entrenamiento', icon: Activity, color: 'text-red-400' },
    { key: 'reading', label: 'Lectura (20 min)', icon: Book, color: 'text-yellow-400' },
    { key: 'meditation', label: 'Meditación', icon: Sun, color: 'text-orange-400' },
    { key: 'sleep', label: 'Dormir 7h+', icon: Moon, color: 'text-indigo-400' },
    { key: 'skincare', label: 'Skincare', icon: Smile, color: 'text-pink-400' },
    { key: 'emotional', label: 'Check Emocional', icon: Heart, color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-6">
      <IOSCard title="Hidratación" className="bg-blue-900/10 border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
              <Droplets size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{data.habits.water.current} <span className="text-sm text-gray-400 font-normal">/ {data.habits.water.target}</span></h3>
              <p className="text-xs text-blue-300">Vasos de agua</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IOSButton onClick={removeWater} variant="secondary" className="w-10 h-10 rounded-full !p-0 flex items-center justify-center">
              <Minus size={18} />
            </IOSButton>
            <IOSButton onClick={addWater} variant="primary" className="w-12 h-12 rounded-full !p-0 flex items-center justify-center">
              <span className="text-xl">+</span>
            </IOSButton>
          </div>
        </div>
        {/* Water Progress Bar */}
        <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
                className="h-full bg-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${(data.habits.water.current / data.habits.water.target) * 100}%` }}
            />
        </div>
      </IOSCard>

      {/* Reset Button */}
      <IOSButton onClick={resetAllHabits} variant="ghost" className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white">
        <RotateCcw size={16} /> Reiniciar hábitos del día
      </IOSButton>

      <div className="grid grid-cols-1 gap-3">
        {habitsConfig.map((habit) => {
            const isDone = data.habits[habit.key]?.done;
            const Icon = habit.icon;
            
            return (
                <IOSCard 
                    key={habit.key} 
                    onClick={() => toggleHabit(habit.key)}
                    className={`transition-all duration-300 ${isDone ? 'bg-white/10 border-white/20' : 'bg-black/40'}`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${isDone ? 'bg-white text-black' : 'bg-gray-800 text-gray-400'}`}>
                                <Icon size={20} className={isDone ? 'text-black' : habit.color} />
                            </div>
                            <span className={`font-medium ${isDone ? 'text-white' : 'text-gray-400'}`}>{habit.label}</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isDone ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                            {isDone && <Check size={14} className="text-black" strokeWidth={3} />}
                        </div>
                    </div>
                </IOSCard>
            );
        })}
      </div>
    </div>
  );
}
