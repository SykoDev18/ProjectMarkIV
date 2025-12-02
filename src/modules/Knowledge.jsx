import React from 'react';
import IOSCard from '../components/ui/IOSCard';
import { BookOpen, Tag } from 'lucide-react';

export default function Knowledge({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="text-yellow-500" />
        <h2 className="text-2xl font-bold">Base de Conocimiento</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.knowledge.notes.map(note => (
            <IOSCard key={note.id} className="bg-yellow-900/10 border-yellow-500/20">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-yellow-100">{note.title}</h3>
                    <span className="flex items-center gap-1 text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                        <Tag size={10} /> {note.tag}
                    </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                    {note.content}
                </p>
            </IOSCard>
        ))}
      </div>
    </div>
  );
}
