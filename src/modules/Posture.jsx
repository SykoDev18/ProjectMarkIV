import React from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { User, Check } from 'lucide-react';
import { triggerHaptic } from '../utils';

export default function Posture({ data, updateData }) {
  if (!data) return null;

  const toggleCheck = (id) => {
    triggerHaptic();
    const checks = [...data.posture.checks];
    const index = checks.findIndex(c => c.id === id);
    checks[index].done = !checks[index].done;
    updateData('posture.checks', checks);
  };

  const toggleReminder = () => {
    triggerHaptic();
    updateData('posture.reminderEnabled', !data.posture.reminderEnabled);
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
        {data.posture.checks.map(check => (
            <IOSButton 
                key={check.id} 
                onClick={() => toggleCheck(check.id)}
                variant="secondary"
                className={`w-full flex justify-between items-center ${check.done ? 'bg-blue-900/20 border-blue-500/30' : ''}`}
            >
                <span>{check.text}</span>
                {check.done && <Check size={16} className="text-blue-400" />}
            </IOSButton>
        ))}
      </div>
    </div>
  );
}
