import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { BookOpen, Tag, Plus, Trash2, X, Search } from 'lucide-react';
import { triggerHaptic } from '../utils';

export default function Knowledge({ data, updateData }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', tag: 'General' });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('Todos');

  if (!data) return null;

  const addNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    triggerHaptic();
    const note = {
      id: Date.now(),
      ...newNote
    };
    updateData('knowledge', { 
      ...data.knowledge, 
      notes: [note, ...data.knowledge.notes] 
    });
    setNewNote({ title: '', content: '', tag: 'General' });
    setShowAdd(false);
  };

  const deleteNote = (id) => {
    triggerHaptic();
    const newNotes = data.knowledge.notes.filter(n => n.id !== id);
    updateData('knowledge', { ...data.knowledge, notes: newNotes });
  };

  const tags = ['Todos', ...new Set(data.knowledge.notes.map(n => n.tag))];
  const tagOptions = ['General', 'Relaciones', 'Finanzas', 'Salud', 'Carrera', 'Mentalidad', 'Social'];

  const filteredNotes = data.knowledge.notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeTag === 'Todos' || note.tag === activeTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="text-yellow-500" />
          <h2 className="text-2xl font-bold">Conocimiento</h2>
        </div>
        <IOSButton size="sm" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? <X size={18} /> : <Plus size={18} />}
        </IOSButton>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar notas..."
          className="w-full p-3 pl-10 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-yellow-500"
        />
      </div>

      {/* Tags filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeTag === tag 
                ? 'bg-yellow-500 text-black' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Add Note Form */}
      {showAdd && (
        <IOSCard className="animate-in fade-in slide-in-from-top-4 bg-yellow-900/10 border-yellow-500/20">
          <div className="space-y-3">
            <input 
              value={newNote.title}
              onChange={(e) => setNewNote({...newNote, title: e.target.value})}
              placeholder="Título de la nota..."
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-yellow-500"
            />
            <textarea 
              value={newNote.content}
              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              placeholder="Contenido de la nota..."
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-yellow-500 h-24 resize-none"
            />
            <div className="flex gap-2 items-center">
              <select 
                value={newNote.tag}
                onChange={(e) => setNewNote({...newNote, tag: e.target.value})}
                className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-yellow-500"
              >
                {tagOptions.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <IOSButton onClick={addNote} variant="primary">Guardar</IOSButton>
            </div>
          </div>
        </IOSCard>
      )}

      {/* Notes List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-3 opacity-20" />
            <p>{searchQuery ? 'No se encontraron notas' : 'Añade tu primera nota de conocimiento'}</p>
          </div>
        ) : (
          filteredNotes.map(note => (
              <IOSCard key={note.id} className="bg-yellow-900/10 border-yellow-500/20 group">
                  <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-yellow-100">{note.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                            <Tag size={10} /> {note.tag}
                        </span>
                        <button 
                          onClick={() => deleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                      {note.content}
                  </p>
              </IOSCard>
          ))
        )}
      </div>
    </div>
  );
}
