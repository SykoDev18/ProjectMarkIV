import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Gamepad2, Plus, Clock, Star, Trash2, X } from 'lucide-react';
import { triggerHaptic } from '../utils';

export default function Hobbies({ data, updateData }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newHobby, setNewHobby] = useState('');

  if (!data) return null;

  const addHobby = () => {
    if (!newHobby) return;
    triggerHaptic();
    const newItem = {
        id: Date.now(),
        name: newHobby,
        progress: 0,
        lastSession: new Date().toISOString()
    };
    updateData('hobbies', { ...data.hobbies, list: [...data.hobbies.list, newItem] });
    setNewHobby('');
    setShowAdd(false);
  };

  const logSession = (id) => {
    triggerHaptic();
    const newList = data.hobbies.list.map(h => 
        h.id === id ? { ...h, lastSession: new Date().toISOString(), progress: Math.min(h.progress + 10, 100) } : h
    );
    updateData('hobbies', { ...data.hobbies, list: newList });
  };

  const deleteHobby = (id) => {
    triggerHaptic();
    const newList = data.hobbies.list.filter(h => h.id !== id);
    updateData('hobbies', { ...data.hobbies, list: newList });
  };

  const resetProgress = (id) => {
    triggerHaptic();
    const newList = data.hobbies.list.map(h => 
      h.id === id ? { ...h, progress: 0 } : h
    );
    updateData('hobbies', { ...data.hobbies, list: newList });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <Gamepad2 className="text-indigo-500" /> Hobbies & Skills
        </h2>
        <IOSButton size="sm" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? <X size={18} /> : <Plus size={18} />}
        </IOSButton>
      </div>

      {showAdd && (
        <IOSCard className="animate-in fade-in slide-in-from-top-4">
            <div className="flex gap-2">
                <input 
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addHobby()}
                    placeholder="Nuevo hobby..."
                    className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-indigo-500"
                    autoFocus
                />
                <IOSButton onClick={addHobby} variant="primary">Añadir</IOSButton>
            </div>
        </IOSCard>
      )}

      {data.hobbies.list.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <Gamepad2 size={48} className="mx-auto mb-3 opacity-20" />
          <p>Añade tus hobbies y habilidades a practicar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.hobbies.list.map(hobby => (
              <IOSCard key={hobby.id} className="group">
                  <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg">{hobby.name}</h3>
                      <div className="flex items-center gap-1">
                        <IOSButton size="sm" variant="secondary" onClick={() => logSession(hobby.id)}>
                            <Clock size={14} className="mr-1" /> +10%
                        </IOSButton>
                        <button 
                          onClick={() => deleteHobby(hobby.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                          <span>Progreso</span>
                          <span>{hobby.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                              className="h-full bg-indigo-500 transition-all duration-500"
                              style={{ width: `${hobby.progress}%` }}
                          />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                            Última vez: {new Date(hobby.lastSession).toLocaleDateString()}
                        </p>
                        {hobby.progress > 0 && (
                          <button 
                            onClick={() => resetProgress(hobby.id)}
                            className="text-xs text-gray-500 hover:text-gray-300"
                          >
                            Reiniciar
                          </button>
                        )}
                      </div>
                      {hobby.progress >= 100 && (
                        <div className="flex items-center justify-center gap-1 text-yellow-500 text-xs mt-2">
                          <Star size={12} fill="currentColor" /> ¡Completado!
                        </div>
                      )}
                  </div>
              </IOSCard>
          ))}
        </div>
      )}
    </div>
  );
}
