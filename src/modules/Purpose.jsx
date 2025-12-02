import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Target, Compass, Flag, Edit2, Save } from 'lucide-react';

export default function Purpose({ data, updateData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ ...data.purpose });

  if (!data) return null;

  const handleSave = () => {
    updateData('purpose', tempData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <Compass className="text-orange-500" /> Propósito
        </h2>
        <IOSButton size="sm" onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
            {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
        </IOSButton>
      </div>

      <IOSCard title="Valores Fundamentales" icon={<Flag className="text-red-400" />}>
        {isEditing ? (
            <textarea 
                value={tempData.values}
                onChange={(e) => handleChange('values', e.target.value)}
                className="w-full h-32 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-orange-500"
            />
        ) : (
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{data.purpose.values || "Define tus valores..."}</p>
        )}
      </IOSCard>

      <IOSCard title="Visión (Largo Plazo)" icon={<Target className="text-blue-400" />}>
        {isEditing ? (
            <textarea 
                value={tempData.vision}
                onChange={(e) => handleChange('vision', e.target.value)}
                className="w-full h-32 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-orange-500"
            />
        ) : (
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{data.purpose.vision || "Define tu visión..."}</p>
        )}
      </IOSCard>

      <IOSCard title="Misión (Diaria)" icon={<Compass className="text-green-400" />}>
        {isEditing ? (
            <textarea 
                value={tempData.mission}
                onChange={(e) => handleChange('mission', e.target.value)}
                className="w-full h-32 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-orange-500"
            />
        ) : (
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{data.purpose.mission || "Define tu misión..."}</p>
        )}
      </IOSCard>
    </div>
  );
}
