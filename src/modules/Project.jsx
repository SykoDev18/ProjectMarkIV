import React from 'react';
import IOSCard from '../components/ui/IOSCard';
import { Briefcase, CheckCircle2, Circle } from 'lucide-react';
import { triggerHaptic } from '../utils';

export default function Project({ data, updateData }) {
  if (!data) return null;

  const toggleTask = (sprintId, taskId) => {
    triggerHaptic();
    const sprintIndex = data.project.sprints.findIndex(s => s.id === sprintId);
    const newSprints = [...data.project.sprints];
    const taskIndex = newSprints[sprintIndex].tasks.findIndex(t => t.id === taskId);
    newSprints[sprintIndex].tasks[taskIndex].done = !newSprints[sprintIndex].tasks[taskIndex].done;
    updateData('project.sprints', newSprints);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{data.project.name}</h2>
        <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">En Progreso</span>
      </div>

      {data.project.sprints.map(sprint => (
        <div key={sprint.id} className="space-y-3">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider ml-1">{sprint.name}</h3>
            {sprint.tasks.map(task => (
                <IOSCard 
                    key={task.id} 
                    onClick={() => toggleTask(sprint.id, task.id)}
                    className={task.done ? 'opacity-50' : ''}
                >
                    <div className="flex items-center gap-3">
                        {task.done ? (
                            <CheckCircle2 className="text-green-500" size={20} />
                        ) : (
                            <Circle className="text-gray-600" size={20} />
                        )}
                        <span className={task.done ? 'line-through text-gray-500' : 'text-white'}>
                            {task.text}
                        </span>
                    </div>
                </IOSCard>
            ))}
        </div>
      ))}
    </div>
  );
}
