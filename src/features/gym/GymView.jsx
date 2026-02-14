import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Dumbbell } from 'lucide-react';
import { useCurrentCycle } from './hooks/useCurrentCycle';
import { useGymStats } from './hooks/useGymStats';
import GymDashboard from './GymDashboard';
import WorkoutSession from './WorkoutSession';
import WorkoutCalendar from './WorkoutCalendar';
import ExerciseLibrary from './ExerciseLibrary';
import PRTracker from './PRTracker';
import EvaluationForm from './components/EvaluationForm';
import RenewalModal from './components/RenewalModal';

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function GymView() {
  const cycleHook = useCurrentCycle();
  const statsHook = useGymStats();
  const { status, cycle, progress, weekModifier, evaluation,
    loading: cycleLoading, userId, startNewCycle, renewCycle, continueCycle, refreshCycle } = cycleHook;
  const { sessions, loading: statsLoading } = statsHook;

  const [view, setView] = useState('dashboard');
  const [viewParams, setViewParams] = useState({});
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showEvalForRenewal, setShowEvalForRenewal] = useState(false);

  const navigate = useCallback((target, params = {}) => {
    setViewParams(params);
    setView(target);
  }, []);

  const goBack = useCallback(() => {
    setView('dashboard');
    setViewParams({});
  }, []);

  const handleEvaluationComplete = async (evalData) => {
    await startNewCycle(evalData);
    setView('dashboard');
    statsHook.refresh();
  };

  const handleRenewalEvalComplete = async (evalData) => {
    await renewCycle(evalData);
    setShowEvalForRenewal(false);
    setShowRenewalModal(false);
    statsHook.refresh();
  };

  const handleContinueCycle = async () => {
    await continueCycle();
    setShowRenewalModal(false);
  };

  const handleSessionComplete = () => {
    refreshCycle();
    statsHook.refresh();
  };

  // Loading state
  if (cycleLoading || statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 size={32} className="text-blue-400 animate-spin" />
        <span className="text-sm text-gray-400">Cargando tu gym...</span>
      </div>
    );
  }

  // No cycle — show evaluation form
  if (status === 'no_cycle' || view === 'evaluation') {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
        <div className="mb-4 text-center">
          <Dumbbell size={32} className="text-blue-400 mx-auto mb-2" />
          <h2 className="text-lg font-black text-white">Configura tu entrenamiento</h2>
          <p className="text-xs text-gray-400 mt-1">Responde unas preguntas y generamos tu rutina personalizada de 30 días</p>
        </div>
        <EvaluationForm
          onComplete={handleEvaluationComplete}
          onBack={() => status !== 'no_cycle' ? setView('dashboard') : null}
          initialData={evaluation}
        />
      </motion.div>
    );
  }

  // Renewal evaluation form (from modal)
  if (showEvalForRenewal) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
        <EvaluationForm
          onComplete={handleRenewalEvalComplete}
          onBack={() => setShowEvalForRenewal(false)}
          initialData={evaluation}
        />
      </motion.div>
    );
  }

  const routine = cycle?.routine || { name: 'Sin rutina', days: [] };

  const renderView = () => {
    switch (view) {
      case 'session': {
        const dayIndex = viewParams.dayIndex ?? 0;
        const dayConfig = routine.days[dayIndex];
        if (!dayConfig) return <div className="text-center py-20 text-gray-400">Día no encontrado</div>;
        return (
          <WorkoutSession
            userId={userId}
            dayConfig={dayConfig}
            onBack={goBack}
            onSessionComplete={handleSessionComplete}
          />
        );
      }
      case 'calendar':
        return <WorkoutCalendar sessions={sessions} onBack={goBack} />;
      case 'library':
        return <ExerciseLibrary onBack={goBack} />;
      case 'prs':
        return <PRTracker stats={statsHook} onBack={goBack} />;
      default:
        return (
          <GymDashboard
            cycle={cycle}
            progress={progress}
            status={status}
            stats={statsHook}
            onNavigate={navigate}
            onRenew={() => setShowRenewalModal(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>

      {/* Renewal Modal — shown when expired or user triggers */}
      <AnimatePresence>
        {(showRenewalModal || status === 'expired') && (
          <RenewalModal
            cycle={cycle}
            onRenew={() => { setShowRenewalModal(false); setShowEvalForRenewal(true); }}
            onContinue={handleContinueCycle}
            onClose={() => setShowRenewalModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
