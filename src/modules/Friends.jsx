import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Users, Phone, Calendar, Plus, UserPlus, Trash2, X, MessageSquare } from 'lucide-react';
import { triggerHaptic } from '../utils';

export default function Friends({ data, updateData }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [tempNote, setTempNote] = useState('');

  if (!data) return null;

  const addFriend = () => {
    if (!newName) return;
    triggerHaptic();
    const newFriend = {
        id: Date.now(),
        name: newName,
        lastInteraction: new Date().toISOString(),
        notes: ''
    };
    updateData('friends', { ...data.friends, list: [...data.friends.list, newFriend] });
    setNewName('');
    setShowAdd(false);
  };

  const updateInteraction = (id) => {
    triggerHaptic();
    const newList = data.friends.list.map(f => 
        f.id === id ? { ...f, lastInteraction: new Date().toISOString() } : f
    );
    updateData('friends', { ...data.friends, list: newList });
  };

  const deleteFriend = (id) => {
    triggerHaptic();
    const newList = data.friends.list.filter(f => f.id !== id);
    updateData('friends', { ...data.friends, list: newList });
  };

  const saveNote = (id) => {
    const newList = data.friends.list.map(f => 
      f.id === id ? { ...f, notes: tempNote } : f
    );
    updateData('friends', { ...data.friends, list: newList });
    setEditingNote(null);
  };

  // Sort friends by last interaction, oldest first
  const sortedFriends = [...data.friends.list].sort((a, b) => 
    new Date(a.lastInteraction) - new Date(b.lastInteraction)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-purple-500" /> Círculo Social
        </h2>
        <IOSButton size="sm" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? <X size={18} /> : <UserPlus size={18} />}
        </IOSButton>
      </div>

      {showAdd && (
        <IOSCard className="animate-in fade-in slide-in-from-top-4">
            <div className="flex gap-2">
                <input 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addFriend()}
                    placeholder="Nombre del amigo..."
                    className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-purple-500"
                    autoFocus
                />
                <IOSButton onClick={addFriend} variant="primary">Guardar</IOSButton>
            </div>
        </IOSCard>
      )}

      {sortedFriends.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <Users size={48} className="mx-auto mb-3 opacity-20" />
          <p>Añade amigos para hacer seguimiento</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedFriends.map(friend => {
              const lastDate = new Date(friend.lastInteraction);
              const daysDiff = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
              const isOverdue = daysDiff > 14; // Alert if no contact in 2 weeks

              return (
                  <IOSCard key={friend.id} className={`${isOverdue ? 'border-red-500/30 bg-red-900/10' : ''} group`}>
                      <div className="flex justify-between items-center">
                          <div className="flex-1">
                              <h3 className="font-bold text-lg">{friend.name}</h3>
                              <p className={`text-xs flex items-center gap-1 mt-1 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                                  <Calendar size={12} /> 
                                  {daysDiff === 0 ? 'Hoy' : daysDiff === 1 ? 'Ayer' : `Hace ${daysDiff} días`}
                              </p>
                              {friend.notes && !editingNote && (
                                <p className="text-xs text-gray-500 mt-2 italic">📝 {friend.notes}</p>
                              )}
                              {editingNote === friend.id && (
                                <div className="flex gap-2 mt-2">
                                  <input 
                                    value={tempNote}
                                    onChange={(e) => setTempNote(e.target.value)}
                                    placeholder="Notas..."
                                    className="flex-1 p-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs outline-none"
                                    autoFocus
                                  />
                                  <IOSButton size="sm" onClick={() => saveNote(friend.id)}>✓</IOSButton>
                                </div>
                              )}
                          </div>
                          <div className="flex items-center gap-2">
                              <IOSButton 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => { setEditingNote(friend.id); setTempNote(friend.notes || ''); }}
                              >
                                  <MessageSquare size={14} />
                              </IOSButton>
                              <IOSButton 
                                  size="sm" 
                                  variant="secondary" 
                                  onClick={() => updateInteraction(friend.id)}
                                  className="flex items-center gap-2"
                              >
                                  <Phone size={14} /> Contactado
                              </IOSButton>
                              <button 
                                onClick={() => deleteFriend(friend.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                          </div>
                      </div>
                  </IOSCard>
              );
          })}
        </div>
      )}
    </div>
  );
}
