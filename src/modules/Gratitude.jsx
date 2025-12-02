import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';

export default function Gratitude({ data, updateData }) {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  if (!data) return null;

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % data.gratitude.affirmations.length);
  };

  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-full">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full" />
        
        <IOSCard className="text-center py-10 border-pink-500/20 bg-pink-900/10">
            <Sparkles className="mx-auto text-pink-400 mb-6" size={32} />
            <h2 className="text-2xl md:text-3xl font-serif italic text-white mb-8 px-4 leading-relaxed">
                "{data.gratitude.affirmations[currentAffirmation]}"
            </h2>
            
            <IOSButton onClick={nextAffirmation} variant="secondary" className="mx-auto flex items-center gap-2">
                <RefreshCw size={16} /> Otra afirmación
            </IOSButton>
        </IOSCard>
      </div>

      <div className="text-center space-y-2">
        <p className="text-gray-400 text-sm">Recuerda:</p>
        <p className="text-gray-300 text-xs max-w-xs mx-auto">
            No atraes lo que quieres, atraes lo que eres. Vibra alto.
        </p>
      </div>
    </div>
  );
}
