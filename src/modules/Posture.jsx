import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { User, Check, Plus, Trash2, X, RotateCcw } from 'lucide-react';
import { triggerHaptic } from '../utils';

export default function Posture({ data, updateData }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newCheck, setNewCheck] = useState('');

  if (!data) return null;

  const toggleCheck = (id) => {
    triggerHaptic();
    const checks = data.posture.checks.map(c => 
      c.id === id ? { ...c, done: !c.done } : c
    );
    updateData('posture', { ...data.posture, checks });
  };

  const toggleReminder = () => {
    triggerHaptic();
    updateData('posture', { ...data.posture, reminderEnabled: !data.posture.reminderEnabled });
  };

  const addCheck = () => {
    if (!newCheck.trim()) return;
    triggerHaptic();
    const newItem = { id: Date.now(), text: newCheck, done: false };
    updateData('posture', { 
      ...data.posture, 
      checks: [...data.posture.checks, newItem] 
    });
    setNewCheck('');
    setShowAdd(false);
  };

  const deleteCheck = (id) => {
    triggerHaptic();
    const newChecks = data.posture.checks.filter(c => c.id !== id);
    updateData('posture', { ...data.posture, checks: newChecks });
  };

  const resetChecks = () => {
    triggerHaptic();
    const resetList = data.posture.checks.map(c => ({ ...c, done: false }));
    updateData('posture', { ...data.posture, checks: resetList });
  };

  const getProgress = () => {
    if (!data.posture.checks.length) return 0;
    return Math.round((data.posture.checks.filter(c => c.done).length / data.posture.checks.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="relative inline-block">
            <div className={`absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full ${data.posture.reminderEnabled ? 'animate-pulse' : ''}`} />
            <User size={80} className="relative z-10 text-white" strokeWidth={1} />
        </div>
        <h2 className="text-2xl font-bold mt-4">Check de Postura</h2>
        <p className="text-gray-400 text-sm mt-2">
            Tu lenguaje corporal grita lo que tu boca calla.
        </p>
        <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden max-w-xs mx-auto">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{getProgress()}% completado</p>
      </div>

      <IOSCard>
        <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Recordatorio cada 30 min</span>
            <div 
                onClick={toggleReminder}
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${data.posture.reminderEnabled ? 'bg-green-500' : 'bg-gray-700'}`}
            >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${data.posture.reminderEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
        </div>
        <p className="text-xs text-gray-500">
            Te enviaremos una notificación silenciosa para que corrijas tu postura.
        </p>
      </IOSCard>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-400 ml-1">Checks de Postura</h3>
          <div className="flex gap-2">
            <IOSButton size="sm" variant="ghost" onClick={resetChecks}>
              <RotateCcw size={14} />
            </IOSButton>
            <IOSButton size="sm" variant="ghost" onClick={() => setShowAdd(!showAdd)}>
              {showAdd ? <X size={18} /> : <Plus size={18} />}
            </IOSButton>
          </div>
        </div>

        {showAdd && (
          <div className="flex gap-2 animate-in fade-in slide-in-from-top-4">
            <input 
              value={newCheck}
              onChange={(e) => setNewCheck(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCheck()}
              placeholder="Nuevo check de postura..."
              className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-blue-500"
              autoFocus
            />
            <IOSButton onClick={addCheck} variant="primary">Añadir</IOSButton>
          </div>
        )}

        {data.posture.checks.map(check => (
            <IOSButton 
                key={check.id} 
                variant="secondary"
                className={`w-full flex justify-between items-center ${check.done ? 'bg-blue-900/20 border-blue-500/30' : ''} group`}
            >
                <span onClick={() => toggleCheck(check.id)} className="flex-1 text-left cursor-pointer">
                  {check.text}
                </span>
                <div className="flex items-center gap-2">
                  {check.done && <Check size={16} className="text-blue-400" />}
                  <button 
                    onClick={() => deleteCheck(check.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
            </IOSButton>
        ))}
      </div>
    </div>
  );
}
