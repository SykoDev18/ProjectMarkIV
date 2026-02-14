import React from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCcw, ArrowRight, Info, Zap, Target, Calendar } from 'lucide-react';

/**
 * RenewalModal — Se muestra cuando el ciclo de 30 días ha expirado.
 * Flujo tipo SmartFit: ofrece renovar con nueva evaluación o continuar el actual.
 */
export default function RenewalModal({ onRenew, onContinue, onClose, cycle }) {
  const cycleNumber = cycle?.cycleNumber || 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0A0F1E] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className="text-lg font-bold text-white">Renovación de entrenamiento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1"><X size={18} /></button>
        </div>

        {/* Hero */}
        <div className="p-5">
          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">⏰</div>
            <h3 className="text-xl font-black text-white mb-1">Tu ciclo #{cycleNumber} ha expirado</h3>
            <p className="text-sm text-gray-400">
              Actualiza tus objetivos para recibir un nuevo plan de 30 días personalizado
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="px-5 space-y-3">
          {[
            {
              num: 1,
              icon: <Target size={18} className="text-blue-400" />,
              title: "Actualiza tus objetivos",
              desc: "Indica tu objetivo actual, experiencia y disponibilidad"
            },
            {
              num: 2,
              icon: <Zap size={18} className="text-yellow-400" />,
              title: "El algoritmo genera tu rutina",
              desc: "Basado en tu perfil, un plan personalizado de 30 días"
            },
            {
              num: 3,
              icon: <Calendar size={18} className="text-green-400" />,
              title: "Empieza hoy mismo",
              desc: "Tu nuevo entrenamiento estará listo de inmediato en la app"
            }
          ].map((step) => (
            <div key={step.num} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-[#1C2333] flex items-center justify-center shrink-0 text-sm font-bold text-white">
                {step.num}
              </div>
              <div>
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  {step.icon} {step.title}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-5 space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onRenew}
            className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCcw size={18} /> Quiero un entrenamiento nuevo
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="w-full py-3.5 bg-[#111827] border border-white/[0.06] text-gray-300 hover:text-white rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowRight size={16} /> Seguir con el actual
          </motion.button>
        </div>

        {/* Info box */}
        <div className="px-5 pb-5">
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-blue-400">¿Por qué cambiar el entrenamiento?</div>
                <p className="text-xs text-gray-400 mt-1">
                  Cambiar el estímulo cada 4 semanas evita la adaptación muscular y garantiza
                  progreso continuo. Es uno de los principios de la periodización científica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
