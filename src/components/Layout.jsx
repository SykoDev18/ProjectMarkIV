import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  Compass, 
  User,
  ChevronLeft,
  Moon,
  Sun
} from 'lucide-react';

const BOTTOM_NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutGrid, label: 'Inicio' },
  { id: 'explore', icon: Compass, label: 'Explorar' },
  { id: 'profile', icon: User, label: 'Perfil' },
];

// Map of tool IDs to their display labels for the header
const TOOL_LABELS = {
  habits: 'Hábitos',
  gym: 'Gym',
  finance: 'Finanzas',
  style: 'Estilo',
  friends: 'Amigos',
  purpose: 'Propósito',
  hobbies: 'Hobbies',
  wins: 'Logros',
  security: 'Seguridad',
  overthinking: 'Calma',
  dialogue: 'Diálogo',
  gratitude: 'Gratitud',
  project: 'Proyecto',
  knowledge: 'Saber',
  playlists: 'Música',
  posture: 'Postura'
};

export default function Layout({ children, activeTab, onTabChange, darkMode, toggleTheme }) {
  const today = new Date();
  const dateString = today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase();

  const isMainTab = BOTTOM_NAV_ITEMS.some(item => item.id === activeTab);

  const getHeaderContent = () => {
    if (activeTab === 'dashboard') {
      return {
        title: 'Resumen',
        subtitle: dateString,
        showTheme: true,
        showBack: false
      };
    }
    if (activeTab === 'explore') return { title: 'Explorar', showBack: false };
    if (activeTab === 'profile') return { title: 'Perfil', showBack: false };

    // Sub-modules
    return {
      title: TOOL_LABELS[activeTab] || 'App',
      showBack: true
    };
  };

  const headerContent = getHeaderContent();

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500/30 pb-24 transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      {darkMode && <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10" />}
      
      {/* Custom Header */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {headerContent.showBack ? (
              <button 
                onClick={() => onTabChange('explore')} 
                className="flex items-center text-blue-500 hover:text-blue-400 transition-colors"
              >
                <ChevronLeft size={24} />
                <span className="text-base">Atrás</span>
              </button>
            ) : (
              <div>
                {headerContent.subtitle && (
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{headerContent.subtitle}</p>
                )}
                <h1 className="text-2xl font-bold tracking-tight">{headerContent.title}</h1>
              </div>
            )}
            
            {headerContent.showBack && (
              <h1 className="text-xl font-bold">{headerContent.title}</h1>
            )}
            
            {headerContent.showTheme && (
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
              >
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            )}
            
            {headerContent.showBack && <div className="w-8" />}
          </div>
        </div>
      </header>

      <main className="pt-24 px-4 max-w-md mx-auto space-y-6">
        {children}
      </main>

      {/* Bottom Navigation Bar - iOS Style */}
      <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t pb-6 pt-2 px-4 z-50 transition-colors duration-300 ${darkMode ? 'bg-black/80 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex justify-around items-center h-16 px-2">
          {BOTTOM_NAV_ITEMS.map((item) => {
            // Highlight 'explore' if we are in a sub-module
            const isActive = activeTab === item.id || (item.id === 'explore' && !isMainTab);
            
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
