import React, { useState, useEffect } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Brain, AlertTriangle, Wind, Clock, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../utils';

export default function Overthinking({ data, updateData }) {
  const [breathing, setBreathing] = useState(false);
  const [breathText, setBreathText] = useState('Inhala');
  const [worryTimer, setWorryTimer] = useState(0);
  const [isWorrying, setIsWorrying] = useState(false);
  const [thoughtRecord, setThoughtRecord] = useState({ thought: '', forEvidence: '', againstEvidence: '' });
  const [savedThoughts, setSavedThoughts] = useState([]);

  useEffect(() => {
    if (breathing) {
        const phases = ['Inhala', 'Sostén', 'Exhala'];
        let phaseIndex = 0;
        setBreathText(phases[0]);
        const interval = setInterval(() => {
            phaseIndex = (phaseIndex + 1) % 3;
            setBreathText(phases[phaseIndex]);
        }, 4000);
        return () => clearInterval(interval);
    }
  }, [breathing]);

  useEffect(() => {
    let interval;
    if (isWorrying && worryTimer > 0) {
      interval = setInterval(() => setWorryTimer(t => t - 1), 1000);
    } else if (worryTimer === 0 && isWorrying) {
      setIsWorrying(false);
      triggerHaptic();
    }
    return () => clearInterval(interval);
  }, [isWorrying, worryTimer]);

  if (!data) return null;

  const toggleEmergency = () => {
    triggerHaptic();
    updateData('overthinking', { ...data.overthinking, emergencyMode: !data.overthinking.emergencyMode });
  };

  const saveThoughtRecord = () => {
    if (!thoughtRecord.thought.trim()) return;
    triggerHaptic();
    const newRecord = {
      id: Date.now(),
      ...thoughtRecord,
      date: new Date().toLocaleDateString(),
      resolved: false
    };
    setSavedThoughts([newRecord, ...savedThoughts]);
    setThoughtRecord({ thought: '', forEvidence: '', againstEvidence: '' });
  };

  const deleteThought = (id) => {
    triggerHaptic();
    setSavedThoughts(savedThoughts.filter(t => t.id !== id));
  };

  return (
    <div className={`space-y-6 transition-colors duration-500 ${data.overthinking.emergencyMode ? 'bg-red-900/10' : ''}`}>
      <IOSCard className={`transition-colors duration-500 ${data.overthinking.emergencyMode ? 'bg-red-900/30 border-red-500' : 'bg-blue-900/10 border-blue-500/20'}`}>
        <div className="text-center py-4">
            <div className={`inline-flex p-4 rounded-full mb-4 ${data.overthinking.emergencyMode ? 'bg-red-500 animate-pulse' : 'bg-blue-500/20'}`}>
                <Brain size={48} className={data.overthinking.emergencyMode ? 'text-white' : 'text-blue-400'} />
            </div>
            <h2 className="text-2xl font-bold mb-2">{data.overthinking.emergencyMode ? 'MODO EMERGENCIA' : 'Estado: Calma'}</h2>
            <p className="text-gray-400 text-sm px-4">
                {data.overthinking.emergencyMode 
                    ? "Detente. No tomes decisiones ahora. Tu cerebro te está mintiendo." 
                    : "Todo está bajo control. Sigue fluyendo."}
            </p>
            
            <IOSButton 
                onClick={toggleEmergency} 
                variant={data.overthinking.emergencyMode ? 'primary' : 'secondary'}
                className={`mt-6 w-full ${data.overthinking.emergencyMode ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
                {data.overthinking.emergencyMode ? 'DESACTIVAR ALARMA' : 'Activar SOS'}
            </IOSButton>
        </div>
      </IOSCard>

      {data.overthinking.emergencyMode ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <IOSCard title="Grounding 5-4-3-2-1">
                <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex gap-3 items-start">
                        <span className="text-xl">👀</span>
                        <span><strong>5</strong> cosas que ves ahora mismo.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-xl">✋</span>
                        <span><strong>4</strong> cosas que puedes tocar.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-xl">👂</span>
                        <span><strong>3</strong> sonidos que escuchas.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-xl">👃</span>
                        <span><strong>2</strong> olores que percibes.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-xl">👅</span>
                        <span><strong>1</strong> sabor o sensación en tu boca.</span>
                    </li>
                </ul>
            </IOSCard>

            <IOSCard>
                <div className="text-center">
                    <h3 className="font-bold mb-4 flex items-center justify-center gap-2"><Wind size={20}/> Respiración 4-4-4</h3>
                    <p className="text-sm text-gray-400 mb-4">Inhala... Sigue el ritmo del círculo</p>
                    
                    <div className="relative h-32 flex items-center justify-center my-4">
                        <AnimatePresence mode='wait'>
                            {breathing ? (
                                <motion.div 
                                    key="circle"
                                    animate={{ scale: [1, 1.5, 1.5, 1] }}
                                    transition={{ duration: 12, repeat: Infinity, times: [0, 0.33, 0.66, 1], ease: "easeInOut" }}
                                    className="w-24 h-24 rounded-full bg-blue-500/30 flex items-center justify-center border border-blue-400"
                                >
                                    <span className="text-white font-bold text-xs">{breathText}</span>
                                </motion.div>
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">Inactivo</span>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <IOSButton onClick={() => setBreathing(!breathing)} variant="secondary" className="w-full">
                        {breathing ? 'Detener' : 'Iniciar Guía'}
                    </IOSButton>
                </div>
            </IOSCard>
        </div>
      ) : (
        <div className="space-y-6">
            {/* Worry Time */}
            <IOSCard className="bg-orange-900/10 border-orange-500/20">
               <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-orange-400 flex items-center gap-2">
                     <Clock size={18} /> Worry Time
                  </h3>
                  <span className="text-xs text-orange-300 bg-orange-500/20 px-2 py-1 rounded-full">15 min</span>
               </div>
               <p className="text-xs text-gray-400 mb-4">
                  Si te preocupas ahora, anótalo y déjalo para tu "Worry Time".
               </p>
               {isWorrying ? (
                  <div className="text-center">
                     <div className="text-4xl font-mono font-bold text-orange-500 mb-2">
                        {Math.floor(worryTimer / 60)}:{(worryTimer % 60).toString().padStart(2, '0')}
                     </div>
                     <IOSButton onClick={() => setIsWorrying(false)} variant="secondary" size="sm">Detener</IOSButton>
                  </div>
               ) : (
                  <IOSButton onClick={() => { setWorryTimer(900); setIsWorrying(true); }} className="w-full bg-orange-600 hover:bg-orange-700">
                     Iniciar Temporizador
                  </IOSButton>
               )}
            </IOSCard>

            {/* Thought Record */}
            <IOSCard>
               <h3 className="font-bold mb-4 flex gap-2 items-center"><Brain size={18} /> Registro de Pensamientos</h3>
               <div className="space-y-3">
                  <input 
                    value={thoughtRecord.thought}
                    onChange={(e) => setThoughtRecord({...thoughtRecord, thought: e.target.value})}
                    placeholder="Pensamiento Intrusivo..." 
                    className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-blue-500" 
                  />
                  <div className="grid grid-cols-2 gap-2">
                     <textarea 
                       value={thoughtRecord.forEvidence}
                       onChange={(e) => setThoughtRecord({...thoughtRecord, forEvidence: e.target.value})}
                       placeholder="Evidencia A FAVOR" 
                       className="p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs h-20 resize-none outline-none focus:border-blue-500" 
                     />
                     <textarea 
                       value={thoughtRecord.againstEvidence}
                       onChange={(e) => setThoughtRecord({...thoughtRecord, againstEvidence: e.target.value})}
                       placeholder="Evidencia EN CONTRA" 
                       className="p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs h-20 resize-none outline-none focus:border-blue-500" 
                     />
                  </div>
                  <IOSButton 
                    size="lg" 
                    variant="primary" 
                    className="w-full"
                    onClick={saveThoughtRecord}
                  >
                    <Save size={16} className="mr-2" /> Guardar Análisis
                  </IOSButton>
               </div>
            </IOSCard>

            {/* Saved Thoughts */}
            {savedThoughts.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 ml-1">Pensamientos Analizados</h3>
                {savedThoughts.map(thought => (
                  <IOSCard key={thought.id} className="bg-gray-900/50">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-white">{thought.thought}</p>
                      <button onClick={() => deleteThought(thought.id)} className="text-gray-500 hover:text-red-400 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-red-900/20 p-2 rounded-lg">
                        <span className="text-red-400 font-medium block mb-1">A favor:</span>
                        <span className="text-gray-400">{thought.forEvidence || '-'}</span>
                      </div>
                      <div className="bg-green-900/20 p-2 rounded-lg">
                        <span className="text-green-400 font-medium block mb-1">En contra:</span>
                        <span className="text-gray-400">{thought.againstEvidence || '-'}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">{thought.date}</p>
                  </IOSCard>
                ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
