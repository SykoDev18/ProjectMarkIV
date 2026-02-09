import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Trophy, Plus, Calendar, Star, Trash2, Filter } from 'lucide-react';
import { triggerHaptic } from '../utils';

export default function Wins({ data, updateData }) {
  const [newWin, setNewWin] = useState('');
  const [category, setCategory] = useState('general');

  if (!data) return null;

  const addWin = () => {
    if (!newWin) return;
    triggerHaptic();
    const newItem = {
        id: Date.now(),
        title: newWin,
        date: new Date().toISOString(),
        category
    };
    updateData('wins', { 
      ...data.wins, 
      history: [newItem, ...data.wins.history],
      stars: (data.wins.stars || 0) + 1
    });
    setNewWin('');
  };

  const deleteWin = (id) => {
    triggerHaptic();
    const newHistory = data.wins.history.filter(w => w.id !== id);
    updateData('wins', { 
      ...data.wins, 
      history: newHistory,
      stars: Math.max(0, (data.wins.stars || 0) - 1)
    });
  };

  const categories = [
    { id: 'general', label: 'General', color: 'bg-blue-500' },
    { id: 'fitness', label: 'Fitness', color: 'bg-red-500' },
    { id: 'work', label: 'Trabajo', color: 'bg-green-500' },
    { id: 'social', label: 'Social', color: 'bg-purple-500' },
    { id: 'personal', label: 'Personal', color: 'bg-yellow-500' }
  ];

  const getCategoryColor = (cat) => {
    const found = categories.find(c => c.id === cat);
    return found ? found.color : 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Logros & Victorias
        </h2>
        <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
          <Star size={16} className="text-yellow-500" fill="currentColor" />
          <span className="text-yellow-400 font-bold">{data.wins.stars || 0}</span>
        </div>
      </div>

      <IOSCard className="bg-gradient-to-br from-yellow-900/20 to-transparent border-yellow-500/30">
        <h3 className="text-lg font-bold mb-3 text-yellow-100">Registrar Victoria de Hoy</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
              <input 
                  value={newWin}
                  onChange={(e) => setNewWin(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addWin()}
                  placeholder="¿Qué lograste hoy?"
                  className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-yellow-500"
              />
              <IOSButton onClick={addWin} className="bg-yellow-600 hover:bg-yellow-500 text-white">
                  <Plus size={20} />
              </IOSButton>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  category === cat.id 
                    ? `${cat.color} text-white` 
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </IOSCard>

      <div className="space-y-4">
        {data.wins.history.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
                <Trophy size={48} className="mx-auto mb-3 opacity-20" />
                <p>Aún no hay victorias registradas. ¡Empieza hoy!</p>
            </div>
        ) : (
          data.wins.history.map(win => (
              <div key={win.id} className="flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2 group">
                  <div className={`mt-1 p-2 rounded-full ${getCategoryColor(win.category)}/20`}>
                      <Star size={16} className={`${getCategoryColor(win.category).replace('bg-', 'text-')}`} fill="currentColor" />
                  </div>
                  <div className="flex-1 pb-4 border-b border-gray-800">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-lg">{win.title}</h4>
                        <button 
                          onClick={() => deleteWin(win.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {new Date(win.date).toLocaleDateString()} • {new Date(win.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                  </div>
              </div>
          ))
        )}
      </div>
    </div>
  );
}
