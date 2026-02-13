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

      {/* WhatsApp Chat Widget */}
      <IOSCard className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-white">Contactar por WhatsApp</h3>
            <p className="text-xs text-gray-400">Chat directo con tus contactos</p>
          </div>
        </div>
        <div className="elfsight-app-a91f328f-e59a-4557-a53e-35f88686dabf" data-elfsight-app-lazy></div>
      </IOSCard>

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
