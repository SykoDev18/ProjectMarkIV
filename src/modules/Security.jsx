import React from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { ShieldCheck, Eye, Mic, UserCheck, Calendar } from 'lucide-react';
import { triggerHaptic, addToCalendar } from '../utils';

export default function Security({ data, updateData }) {
  if (!data) return null;

  const toggleCheck = (id, type) => {
    triggerHaptic();
    const listKey = type === 'daily' ? 'dailyChecks' : 'weeklyGoals';
    const list = [...data.security[listKey]];
    const index = list.findIndex(i => i.id === id);
    list[index].done = !list[index].done;
    updateData(`security.${listKey}`, list);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-3xl p-6 text-center">
        <ShieldCheck size={48} className="mx-auto text-blue-400 mb-3" />
        <h2 className="text-2xl font-bold text-white">Protocolo Social</h2>
        <p className="text-blue-200 text-sm mt-1">Confianza no es saber que les gustarás, es saber que estarás bien si no lo haces.</p>
      </div>

      <IOSCard className="bg-purple-900/20 border-purple-500/30">
          <h3 className="font-bold text-purple-300 mb-2 flex items-center gap-2">
              <ShieldCheck size={18} /> Recordatorio de Rechazo
          </h3>
          <p className="text-sm text-gray-300 italic">
              "El rechazo es información, no una sentencia. Si pides un café y dicen que no, aprendiste que ahí no hay café. Tú sigues valiendo lo mismo."
          </p>
      </IOSCard>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-300 ml-1 flex items-center gap-2">
            <Eye size={18} /> Checks Diarios
        </h3>
        {data.security.dailyChecks.map(check => (
            <IOSCard 
                key={check.id} 
                onClick={() => toggleCheck(check.id, 'daily')}
                className={check.done ? 'opacity-60' : ''}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${check.done ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                        {check.done && <ShieldCheck size={14} className="text-white" />}
                    </div>
                    <span className={`font-medium ${check.done ? 'line-through text-gray-500' : 'text-white'}`}>{check.text}</span>
                </div>
            </IOSCard>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-300 ml-1 flex items-center gap-2">
            <UserCheck size={18} /> Retos Semanales
        </h3>
        {data.security.weeklyGoals.map(goal => (
            <IOSCard 
                key={goal.id} 
                className={`border-l-4 ${goal.done ? 'border-l-green-500 opacity-60' : 'border-l-orange-500'}`}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 flex-1" onClick={() => toggleCheck(goal.id, 'weekly')}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${goal.done ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                            {goal.done && <ShieldCheck size={14} className="text-white" />}
                        </div>
                        <span className={`font-medium ${goal.done ? 'line-through text-gray-500' : 'text-white'}`}>{goal.text}</span>
                    </div>
                    <IOSButton 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => { e.stopPropagation(); addToCalendar(goal.text); }}
                    >
                        <Calendar size={16} className="text-blue-400" />
                    </IOSButton>
                </div>
            </IOSCard>
        ))}
      </div>
    </div>
  );
}
