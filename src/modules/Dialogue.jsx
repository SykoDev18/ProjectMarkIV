import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { MessageCircle, Send, Trash2, X } from 'lucide-react';
import { triggerHaptic } from '../utils';

export default function Dialogue({ data, updateData }) {
  const [input, setInput] = useState('');

  if (!data) return null;

  const addEntry = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    triggerHaptic();
    
    const newEntry = {
        id: Date.now(),
        text: input,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    updateData('dialogue', { 
      ...data.dialogue, 
      entries: [newEntry, ...data.dialogue.entries] 
    });
    setInput('');
  };

  const deleteEntry = (id) => {
    triggerHaptic();
    const newEntries = data.dialogue.entries.filter(e => e.id !== id);
    updateData('dialogue', { ...data.dialogue, entries: newEntries });
  };

  const clearAll = () => {
    triggerHaptic();
    if (window.confirm('¿Eliminar todas las entradas?')) {
      updateData('dialogue', { ...data.dialogue, entries: [] });
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col">
      {data.dialogue.entries.length > 0 && (
        <div className="flex justify-end mb-2">
          <IOSButton size="sm" variant="ghost" onClick={clearAll} className="text-red-400">
            <Trash2 size={14} /> Limpiar todo
          </IOSButton>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 no-scrollbar">
        {data.dialogue.entries.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
                <p>Habla contigo mismo. Nadie más leerá esto.</p>
            </div>
        ) : (
            data.dialogue.entries.map(entry => (
                <div key={entry.id} className="flex flex-col items-end group">
                    <div className="relative max-w-[85%]">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm text-sm">
                          {entry.text}
                      </div>
                      <button 
                        onClick={() => deleteEntry(entry.id)}
                        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-500 hover:text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 mr-1">{entry.time} • {entry.date}</span>
                </div>
            ))
        )}
      </div>

      <form onSubmit={addEntry} className="mt-4 relative">
        <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 pl-4 pr-12 text-white focus:border-blue-500 outline-none"
            placeholder="¿Qué estás pensando?"
        />
        <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-blue-500 rounded-full text-white disabled:opacity-50 disabled:bg-gray-700"
        >
            <Send size={16} />
        </button>
      </form>
    </div>
  );
}
