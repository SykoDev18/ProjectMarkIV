import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Briefcase, CheckCircle2, Circle, Plus, Trash2, FolderPlus, Edit2, Save, X } from 'lucide-react';
import { triggerHaptic } from '../utils';

export default function Project({ data, updateData }) {
  const [newTask, setNewTask] = useState('');
  const [editingProject, setEditingProject] = useState(false);
  const [projectName, setProjectName] = useState(data?.project?.name || '');
  const [showAddSprint, setShowAddSprint] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');

  if (!data) return null;

  const toggleTask = (sprintId, taskId) => {
    triggerHaptic();
    const sprintIndex = data.project.sprints.findIndex(s => s.id === sprintId);
    const newSprints = [...data.project.sprints];
    const taskIndex = newSprints[sprintIndex].tasks.findIndex(t => t.id === taskId);
    newSprints[sprintIndex].tasks[taskIndex].done = !newSprints[sprintIndex].tasks[taskIndex].done;
    updateData('project', { ...data.project, sprints: newSprints });
  };

  const addTask = (sprintId) => {
    if (!newTask.trim()) return;
    triggerHaptic();
    const sprintIndex = data.project.sprints.findIndex(s => s.id === sprintId);
    const newSprints = [...data.project.sprints];
    newSprints[sprintIndex].tasks.push({
      id: Date.now(),
      text: newTask,
      done: false
    });
    updateData('project', { ...data.project, sprints: newSprints });
    setNewTask('');
  };

  const deleteTask = (sprintId, taskId) => {
    triggerHaptic();
    const sprintIndex = data.project.sprints.findIndex(s => s.id === sprintId);
    const newSprints = [...data.project.sprints];
    newSprints[sprintIndex].tasks = newSprints[sprintIndex].tasks.filter(t => t.id !== taskId);
    updateData('project', { ...data.project, sprints: newSprints });
  };

  const addSprint = () => {
    if (!newSprintName.trim()) return;
    triggerHaptic();
    const newSprint = {
      id: Date.now(),
      name: newSprintName,
      tasks: []
    };
    updateData('project', { ...data.project, sprints: [...data.project.sprints, newSprint] });
    setNewSprintName('');
    setShowAddSprint(false);
  };

  const deleteSprint = (sprintId) => {
    triggerHaptic();
    if (window.confirm('¿Eliminar este sprint y todas sus tareas?')) {
      const newSprints = data.project.sprints.filter(s => s.id !== sprintId);
      updateData('project', { ...data.project, sprints: newSprints });
    }
  };

  const saveProjectName = () => {
    updateData('project', { ...data.project, name: projectName });
    setEditingProject(false);
  };

  const getProgress = (tasks) => {
    if (!tasks.length) return 0;
    return Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {editingProject ? (
          <div className="flex items-center gap-2 flex-1">
            <input 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="text-2xl font-bold bg-transparent border-b border-blue-500 outline-none text-white flex-1"
              autoFocus
            />
            <IOSButton size="sm" variant="primary" onClick={saveProjectName}>
              <Save size={16} />
            </IOSButton>
            <IOSButton size="sm" variant="ghost" onClick={() => setEditingProject(false)}>
              <X size={16} />
            </IOSButton>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold">{data.project.name}</h2>
            <div className="flex items-center gap-2">
              <IOSButton size="sm" variant="ghost" onClick={() => setEditingProject(true)}>
                <Edit2 size={16} />
              </IOSButton>
              <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">En Progreso</span>
            </div>
          </>
        )}
      </div>

      {data.project.sprints.map(sprint => (
        <div key={sprint.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider ml-1">{sprint.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-400">{getProgress(sprint.tasks)}%</span>
                <IOSButton size="sm" variant="ghost" onClick={() => deleteSprint(sprint.id)} className="text-red-400">
                  <Trash2 size={14} />
                </IOSButton>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${getProgress(sprint.tasks)}%` }}
              />
            </div>
            
            {sprint.tasks.map(task => (
                <IOSCard 
                    key={task.id} 
                    className={`${task.done ? 'opacity-50' : ''} group`}
                >
                    <div className="flex items-center gap-3">
                        <div onClick={() => toggleTask(sprint.id, task.id)} className="cursor-pointer">
                          {task.done ? (
                              <CheckCircle2 className="text-green-500" size={20} />
                          ) : (
                              <Circle className="text-gray-600" size={20} />
                          )}
                        </div>
                        <span className={`flex-1 ${task.done ? 'line-through text-gray-500' : 'text-white'}`}>
                            {task.text}
                        </span>
                        <button 
                          onClick={() => deleteTask(sprint.id, task.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                    </div>
                </IOSCard>
            ))}
            
            {/* Add task input */}
            <div className="flex gap-2">
              <input 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask(sprint.id)}
                placeholder="Nueva tarea..."
                className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-blue-500"
              />
              <IOSButton onClick={() => addTask(sprint.id)} variant="secondary">
                <Plus size={18} />
              </IOSButton>
            </div>
        </div>
      ))}

      {/* Add Sprint */}
      {showAddSprint ? (
        <IOSCard className="animate-in fade-in slide-in-from-bottom-4">
          <div className="flex gap-2">
            <input 
              value={newSprintName}
              onChange={(e) => setNewSprintName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSprint()}
              placeholder="Nombre del sprint..."
              className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-blue-500"
              autoFocus
            />
            <IOSButton onClick={addSprint} variant="primary">Crear</IOSButton>
            <IOSButton onClick={() => setShowAddSprint(false)} variant="ghost">
              <X size={18} />
            </IOSButton>
          </div>
        </IOSCard>
      ) : (
        <IOSButton onClick={() => setShowAddSprint(true)} variant="secondary" className="w-full flex items-center justify-center gap-2">
          <FolderPlus size={18} /> Añadir Sprint
        </IOSButton>
      )}
    </div>
  );
}
