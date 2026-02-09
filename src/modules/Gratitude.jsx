import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Heart, Sparkles, RefreshCw, Plus, Trash2, X } from 'lucide-react';
import { triggerHaptic } from '../utils';

export default function Gratitude({ data, updateData }) {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newAffirmation, setNewAffirmation] = useState('');

  if (!data) return null;

  const nextAffirmation = () => {
    triggerHaptic();
    setCurrentAffirmation((prev) => (prev + 1) % data.gratitude.affirmations.length);
  };

  const addAffirmation = () => {
    if (!newAffirmation.trim()) return;
    triggerHaptic();
    updateData('gratitude', {
      ...data.gratitude,
      affirmations: [...data.gratitude.affirmations, newAffirmation]
    });
    setNewAffirmation('');
    setShowAdd(false);
  };

  const deleteAffirmation = (index) => {
    triggerHaptic();
    const newList = data.gratitude.affirmations.filter((_, i) => i !== index);
    updateData('gratitude', { ...data.gratitude, affirmations: newList });
    if (currentAffirmation >= newList.length) {
      setCurrentAffirmation(Math.max(0, newList.length - 1));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="relative w-full">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full" />
          
          <IOSCard className="text-center py-10 border-pink-500/20 bg-pink-900/10">
              <Sparkles className="mx-auto text-pink-400 mb-6" size={32} />
              {data.gratitude.affirmations.length > 0 ? (
                <>
                  <h2 className="text-2xl md:text-3xl font-serif italic text-white mb-8 px-4 leading-relaxed">
                      "{data.gratitude.affirmations[currentAffirmation]}"
                  </h2>
                  
                  <IOSButton onClick={nextAffirmation} variant="secondary" className="mx-auto flex items-center gap-2">
                      <RefreshCw size={16} /> Otra afirmación
                  </IOSButton>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    {currentAffirmation + 1} / {data.gratitude.affirmations.length}
                  </p>
                </>
              ) : (
                <p className="text-gray-400">Añade tu primera afirmación</p>
              )}
          </IOSCard>
        </div>

        <div className="text-center space-y-2 mt-6">
          <p className="text-gray-400 text-sm">Recuerda:</p>
          <p className="text-gray-300 text-xs max-w-xs mx-auto">
              No atraes lo que quieres, atraes lo que eres. Vibra alto.
          </p>
        </div>
      </div>

      {/* Add Affirmation */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-300 ml-1">Mis Afirmaciones</h3>
          <IOSButton size="sm" variant="ghost" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? <X size={18} /> : <Plus size={18} />}
          </IOSButton>
        </div>

        {showAdd && (
          <IOSCard className="animate-in fade-in slide-in-from-top-4">
            <div className="flex gap-2">
              <input 
                value={newAffirmation}
                onChange={(e) => setNewAffirmation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAffirmation()}
                placeholder="Nueva afirmación positiva..."
                className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-pink-500"
                autoFocus
              />
              <IOSButton onClick={addAffirmation} variant="primary">Añadir</IOSButton>
            </div>
          </IOSCard>
        )}

        <div className="space-y-2">
          {data.gratitude.affirmations.map((aff, idx) => (
            <IOSCard key={idx} className="flex justify-between items-center py-3 group">
              <span className="text-sm text-gray-300">{aff}</span>
              <button 
                onClick={() => deleteAffirmation(idx)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
              >
                <Trash2 size={14} />
              </button>
            </IOSCard>
          ))}
        </div>
      </div>
    </div>
  );
}
