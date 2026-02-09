import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { ShieldCheck, Eye, Mic, UserCheck, Calendar, Plus, Trash2, X, RotateCcw } from 'lucide-react';
import { triggerHaptic, addToCalendar } from '../utils';

export default function Security({ data, updateData }) {
  const [showAddDaily, setShowAddDaily] = useState(false);
  const [showAddWeekly, setShowAddWeekly] = useState(false);
  const [newCheck, setNewCheck] = useState('');

  if (!data) return null;

  const toggleCheck = (id, type) => {
    triggerHaptic();
    const listKey = type === 'daily' ? 'dailyChecks' : 'weeklyGoals';
    const list = [...data.security[listKey]];
    const index = list.findIndex(i => i.id === id);
    list[index].done = !list[index].done;
    updateData('security', { ...data.security, [listKey]: list });
  };

  const addCheck = (type) => {
    if (!newCheck.trim()) return;
    triggerHaptic();
    const listKey = type === 'daily' ? 'dailyChecks' : 'weeklyGoals';
    const newItem = { id: Date.now(), text: newCheck, done: false };
    updateData('security', { 
      ...data.security, 
      [listKey]: [...data.security[listKey], newItem] 
    });
    setNewCheck('');
    setShowAddDaily(false);
    setShowAddWeekly(false);
  };

  const deleteCheck = (id, type) => {
    triggerHaptic();
    const listKey = type === 'daily' ? 'dailyChecks' : 'weeklyGoals';
    const newList = data.security[listKey].filter(i => i.id !== id);
    updateData('security', { ...data.security, [listKey]: newList });
  };

  const resetDaily = () => {
    triggerHaptic();
    const resetList = data.security.dailyChecks.map(c => ({ ...c, done: false }));
    updateData('security', { ...data.security, dailyChecks: resetList });
  };

  const getDailyProgress = () => {
    const done = data.security.dailyChecks.filter(c => c.done).length;
    return Math.round((done / data.security.dailyChecks.length) * 100) || 0;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-3xl p-6 text-center">
        <ShieldCheck size={48} className="mx-auto text-blue-400 mb-3" />
        <h2 className="text-2xl font-bold text-white">Protocolo Social</h2>
        <p className="text-blue-200 text-sm mt-1">Confianza no es saber que les gustarás, es saber que estarás bien si no lo haces.</p>
        <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${getDailyProgress()}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">{getDailyProgress()}% completado hoy</p>
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
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-300 ml-1 flex items-center gap-2">
              <Eye size={18} /> Checks Diarios
          </h3>
          <div className="flex gap-2">
            <IOSButton size="sm" variant="ghost" onClick={resetDaily}>
              <RotateCcw size={14} />
            </IOSButton>
            <IOSButton size="sm" variant="ghost" onClick={() => setShowAddDaily(!showAddDaily)}>
              {showAddDaily ? <X size={18} /> : <Plus size={18} />}
            </IOSButton>
          </div>
        </div>
        
        {showAddDaily && (
          <div className="flex gap-2 animate-in fade-in slide-in-from-top-4">
            <input 
              value={newCheck}
              onChange={(e) => setNewCheck(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCheck('daily')}
              placeholder="Nuevo check diario..."
              className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-blue-500"
              autoFocus
            />
            <IOSButton onClick={() => addCheck('daily')} variant="primary">Añadir</IOSButton>
          </div>
        )}
        
        {data.security.dailyChecks.map(check => (
            <IOSCard 
                key={check.id} 
                className={`${check.done ? 'opacity-60' : ''} group`}
            >
                <div className="flex items-center gap-4">
                    <div 
                      onClick={() => toggleCheck(check.id, 'daily')}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${check.done ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}
                    >
                        {check.done && <ShieldCheck size={14} className="text-white" />}
                    </div>
                    <span className={`flex-1 font-medium ${check.done ? 'line-through text-gray-500' : 'text-white'}`}>{check.text}</span>
                    <button 
                      onClick={() => deleteCheck(check.id, 'daily')}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                </div>
            </IOSCard>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-300 ml-1 flex items-center gap-2">
              <UserCheck size={18} /> Retos Semanales
          </h3>
          <IOSButton size="sm" variant="ghost" onClick={() => setShowAddWeekly(!showAddWeekly)}>
            {showAddWeekly ? <X size={18} /> : <Plus size={18} />}
          </IOSButton>
        </div>
        
        {showAddWeekly && (
          <div className="flex gap-2 animate-in fade-in slide-in-from-top-4">
            <input 
              value={newCheck}
              onChange={(e) => setNewCheck(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCheck('weekly')}
              placeholder="Nuevo reto semanal..."
              className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-blue-500"
              autoFocus
            />
            <IOSButton onClick={() => addCheck('weekly')} variant="primary">Añadir</IOSButton>
          </div>
        )}
        
        {data.security.weeklyGoals.map(goal => (
            <IOSCard 
                key={goal.id} 
                className={`border-l-4 ${goal.done ? 'border-l-green-500 opacity-60' : 'border-l-orange-500'} group`}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 flex-1" onClick={() => toggleCheck(goal.id, 'weekly')}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${goal.done ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                            {goal.done && <ShieldCheck size={14} className="text-white" />}
                        </div>
                        <span className={`font-medium ${goal.done ? 'line-through text-gray-500' : 'text-white'}`}>{goal.text}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IOSButton 
                          size="sm" 
                          variant="ghost" 
                          onClick={(e) => { e.stopPropagation(); addToCalendar(goal.text); }}
                      >
                          <Calendar size={16} className="text-blue-400" />
                      </IOSButton>
                      <button 
                        onClick={() => deleteCheck(goal.id, 'weekly')}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                </div>
            </IOSCard>
        ))}
      </div>
    </div>
  );
}
