import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Gamepad2, Plus, Clock, Star } from 'lucide-react';

export default function Hobbies({ data, updateData }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newHobby, setNewHobby] = useState('');

  if (!data) return null;

  const addHobby = () => {
    if (!newHobby) return;
    const newItem = {
        id: Date.now(),
        name: newHobby,
        progress: 0,
        lastSession: new Date().toISOString()
    };
    updateData('hobbies.list', [...data.hobbies.list, newItem]);
    setNewHobby('');
    setShowAdd(false);
  };

  const logSession = (id) => {
    const newList = data.hobbies.list.map(h => 
        h.id === id ? { ...h, lastSession: new Date().toISOString(), progress: Math.min(h.progress + 10, 100) } : h
    );
    updateData('hobbies.list', newList);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <Gamepad2 className="text-indigo-500" /> Hobbies & Skills
        </h2>
        <IOSButton size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus size={18} />
        </IOSButton>
      </div>

      {showAdd && (
        <IOSCard className="animate-in fade-in slide-in-from-top-4">
            <div className="flex gap-2">
                <input 
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    placeholder="Nuevo hobby..."
                    className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-indigo-500"
                />
                <IOSButton onClick={addHobby} variant="primary">Añadir</IOSButton>
            </div>
        </IOSCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.hobbies.list.map(hobby => (
            <IOSCard key={hobby.id}>
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">{hobby.name}</h3>
                    <IOSButton size="sm" variant="secondary" onClick={() => logSession(hobby.id)}>
                        <Clock size={14} className="mr-1" /> Practicar
                    </IOSButton>
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
                    <p className="text-xs text-gray-500 mt-2 text-right">
                        Última vez: {new Date(hobby.lastSession).toLocaleDateString()}
                    </p>
                </div>
            </IOSCard>
        ))}
      </div>
    </div>
  );
}
