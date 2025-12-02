import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Users, Phone, Calendar, Plus, UserPlus } from 'lucide-react';

export default function Friends({ data, updateData }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  if (!data) return null;

  const addFriend = () => {
    if (!newName) return;
    const newFriend = {
        id: Date.now(),
        name: newName,
        lastInteraction: new Date().toISOString(),
        notes: ''
    };
    updateData('friends.list', [...data.friends.list, newFriend]);
    setNewName('');
    setShowAdd(false);
  };

  const updateInteraction = (id) => {
    const newList = data.friends.list.map(f => 
        f.id === id ? { ...f, lastInteraction: new Date().toISOString() } : f
    );
    updateData('friends.list', newList);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-purple-500" /> Círculo Social
        </h2>
        <IOSButton size="sm" onClick={() => setShowAdd(!showAdd)}>
            <UserPlus size={18} />
        </IOSButton>
      </div>

      {showAdd && (
        <IOSCard className="animate-in fade-in slide-in-from-top-4">
            <div className="flex gap-2">
                <input 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nombre del amigo..."
                    className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-purple-500"
                />
                <IOSButton onClick={addFriend} variant="primary">Guardar</IOSButton>
            </div>
        </IOSCard>
      )}

      <div className="space-y-4">
        {data.friends.list.map(friend => {
            const lastDate = new Date(friend.lastInteraction);
            const daysDiff = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            const isOverdue = daysDiff > 14; // Alert if no contact in 2 weeks

            return (
                <IOSCard key={friend.id} className={isOverdue ? 'border-red-500/30 bg-red-900/10' : ''}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{friend.name}</h3>
                            <p className={`text-xs flex items-center gap-1 mt-1 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                                <Calendar size={12} /> 
                                {daysDiff === 0 ? 'Hoy' : `Hace ${daysDiff} días`}
                            </p>
                        </div>
                        <IOSButton 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => updateInteraction(friend.id)}
                            className="flex items-center gap-2"
                        >
                            <Phone size={14} /> Contactado
                        </IOSButton>
                    </div>
                </IOSCard>
            );
        })}
      </div>
    </div>
  );
}
