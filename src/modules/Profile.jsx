import React from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { User, Settings, LogOut } from 'lucide-react';

export default function Profile({ user, darkMode, toggleTheme }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center py-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
            <User size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold">Marco</h2>
        <p className="text-gray-500">Mejorando cada día 1%</p>
      </div>

      <IOSCard title="Configuración">
        <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span>Modo Oscuro</span>
                <button 
                    onClick={toggleTheme}
                    className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
                </button>
            </div>
            <div className="flex justify-between items-center py-2">
                <span>Notificaciones</span>
                <span className="text-gray-500 text-sm">Activadas</span>
            </div>
        </div>
      </IOSCard>

      <IOSButton variant="secondary" className="w-full flex items-center justify-center gap-2 text-red-400">
        <LogOut size={18} /> Cerrar Sesión
      </IOSButton>
    </div>
  );
}
