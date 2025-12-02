import React from 'react';
import { motion } from 'framer-motion';
import IOSHeader from './ui/IOSHeader';
import { 
  LayoutGrid, 
  Dumbbell, 
  Wallet, 
  ShieldCheck, 
  Brain, 
  MessageCircle, 
  Heart, 
  Briefcase, 
  BookOpen, 
  Music, 
  User,
  Droplets,
  Moon,
  Sun
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutGrid, label: 'Inicio' },
  { id: 'habits', icon: Droplets, label: 'Hábitos' },
  { id: 'gym', icon: Dumbbell, label: 'Gym' },
  { id: 'finance', icon: Wallet, label: 'Finanzas' },
  { id: 'security', icon: ShieldCheck, label: 'Seguridad' },
  { id: 'overthinking', icon: Brain, label: 'Calma' },
  { id: 'dialogue', icon: MessageCircle, label: 'Diálogo' },
  { id: 'gratitude', icon: Heart, label: 'Gratitud' },
  { id: 'project', icon: Briefcase, label: 'Proyecto' },
  { id: 'knowledge', icon: BookOpen, label: 'Saber' },
  { id: 'playlists', icon: Music, label: 'Música' },
  { id: 'posture', icon: User, label: 'Postura' },
];

export default function Layout({ children, activeTab, onTabChange, darkMode, toggleTheme }) {
  const today = new Date();
  const dateString = today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' }).toUpperCase();

  const getHeaderProps = () => {
    if (activeTab === 'dashboard') {
      return {
        title: 'Resumen',
        subtitle: dateString,
        rightAction: (
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
          >
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        )
      };
    }
    return {
      title: NAV_ITEMS.find(i => i.id === activeTab)?.label || 'App'
    };
  };

  const headerProps = getHeaderProps();

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500/30 pb-24 transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      {darkMode && <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10" />}
      
      <IOSHeader {...headerProps} />

      <main className="pt-24 px-4 max-w-md mx-auto space-y-6">
        {children}
      </main>

      {/* Bottom Navigation Bar - iOS Style */}
      <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t pb-6 pt-2 px-4 z-50 transition-colors duration-300 ${darkMode ? 'bg-black/80 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex overflow-x-auto no-scrollbar gap-6 justify-start md:justify-center items-center h-16 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-1 min-w-[60px] transition-colors duration-300 ${
                  isActive 
                    ? 'text-blue-500' 
                    : darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                >
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
