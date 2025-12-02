import React from 'react';
import { 
  Dumbbell, 
  Droplets, 
  Wallet, 
  Brain, 
  Music, 
  ShieldCheck, 
  BookOpen, 
  Briefcase,
  Shirt,
  Users,
  Compass,
  Gamepad2,
  Trophy,
  MessageCircle,
  Heart,
  User
} from 'lucide-react';
import IOSCard from '../components/ui/IOSCard';

const TOOLS = [
  { id: 'gym', icon: Dumbbell, label: 'Gym', color: 'text-orange-500' },
  { id: 'habits', icon: Droplets, label: 'Hábitos', color: 'text-green-500' },
  { id: 'finance', icon: Wallet, label: 'Finanzas', color: 'text-blue-500' },
  { id: 'overthinking', icon: Brain, label: 'Calma', color: 'text-purple-500' },
  { id: 'playlists', icon: Music, label: 'Música', color: 'text-pink-500' },
  { id: 'security', icon: ShieldCheck, label: 'Seguridad', color: 'text-indigo-500' },
  { id: 'knowledge', icon: BookOpen, label: 'Saber', color: 'text-teal-500' },
  { id: 'project', icon: Briefcase, label: 'Proyecto', color: 'text-red-500' },
  { id: 'style', icon: Shirt, label: 'Estilo', color: 'text-purple-400' },
  { id: 'friends', icon: Users, label: 'Amigos', color: 'text-yellow-500' },
  { id: 'purpose', icon: Compass, label: 'Propósito', color: 'text-orange-400' },
  { id: 'hobbies', icon: Gamepad2, label: 'Hobbies', color: 'text-indigo-400' },
  { id: 'wins', icon: Trophy, label: 'Logros', color: 'text-yellow-400' },
  { id: 'dialogue', icon: MessageCircle, label: 'Diálogo', color: 'text-blue-400' },
  { id: 'gratitude', icon: Heart, label: 'Gratitud', color: 'text-pink-400' },
  { id: 'posture', icon: User, label: 'Postura', color: 'text-cyan-500' },
];

export default function Explore({ onNavigate }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Herramientas</h2>
      <div className="grid grid-cols-2 gap-4">
        {TOOLS.map((tool) => (
          <button 
            key={tool.id}
            onClick={() => onNavigate(tool.id)}
            className="block w-full"
          >
            <IOSCard className="flex items-center gap-3 hover:bg-gray-800/50 transition-colors h-full">
              <div className={`p-2 rounded-full bg-gray-800/50 ${tool.color}`}>
                <tool.icon size={24} />
              </div>
              <span className="font-medium text-lg">{tool.label}</span>
            </IOSCard>
          </button>
        ))}
      </div>
    </div>
  );
}
