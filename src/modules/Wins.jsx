import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Trophy, Plus, Calendar, Star } from 'lucide-react';

export default function Wins({ data, updateData }) {
  const [newWin, setNewWin] = useState('');

  if (!data) return null;

  const addWin = () => {
    if (!newWin) return;
    const newItem = {
        id: Date.now(),
        title: newWin,
        date: new Date().toISOString(),
        category: 'general'
    };
    updateData('wins.history', [newItem, ...data.wins.history]);
    setNewWin('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Logros & Victorias
        </h2>
      </div>

      <IOSCard className="bg-gradient-to-br from-yellow-900/20 to-transparent border-yellow-500/30">
        <h3 className="text-lg font-bold mb-3 text-yellow-100">Registrar Victoria de Hoy</h3>
        <div className="flex gap-2">
            <input 
                value={newWin}
                onChange={(e) => setNewWin(e.target.value)}
                placeholder="¿Qué lograste hoy?"
                className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-yellow-500"
            />
            <IOSButton onClick={addWin} className="bg-yellow-600 hover:bg-yellow-500 text-white">
                <Plus size={20} />
            </IOSButton>
        </div>
      </IOSCard>

      <div className="space-y-4">
        {data.wins.history.map(win => (
            <div key={win.id} className="flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2">
                <div className="mt-1 p-2 bg-yellow-500/10 rounded-full text-yellow-500">
                    <Star size={16} fill="currentColor" />
                </div>
                <div className="flex-1 pb-4 border-b border-gray-800">
                    <h4 className="font-medium text-lg">{win.title}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        {new Date(win.date).toLocaleDateString()} • {new Date(win.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>
            </div>
        ))}
        
        {data.wins.history.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <Trophy size={48} className="mx-auto mb-3 opacity-20" />
                <p>Aún no hay victorias registradas. ¡Empieza hoy!</p>
            </div>
        )}
      </div>
    </div>
  );
}
