import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Wallet, TrendingUp, Plus, DollarSign, Trash2, Target, X, Edit2 } from 'lucide-react';
import { triggerHaptic } from '../utils';

export default function Finance({ data, updateData }) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ desc: '', amount: '' });
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState('');

  if (!data) return null;

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.desc || !newExpense.amount) return;
    triggerHaptic();
    
    const amount = parseFloat(newExpense.amount);
    const updatedExpenses = [...data.finance.expenses, { 
      id: Date.now(), 
      desc: newExpense.desc, 
      amount,
      date: new Date().toISOString()
    }];
    
    updateData('finance', {
      ...data.finance,
      expenses: updatedExpenses,
      spent: data.finance.spent + amount
    });
    
    setNewExpense({ desc: '', amount: '' });
    setShowAddExpense(false);
  };

  const deleteExpense = (id, amount) => {
    triggerHaptic();
    const newExpenses = data.finance.expenses.filter(e => e.id !== id);
    updateData('finance', {
      ...data.finance,
      expenses: newExpenses,
      spent: Math.max(0, data.finance.spent - amount)
    });
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;
    triggerHaptic();
    
    const goal = {
      id: Date.now(),
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      saved: 0
    };
    
    updateData('finance', {
      ...data.finance,
      goals: [...data.finance.goals, goal]
    });
    
    setNewGoal({ name: '', target: '' });
    setShowAddGoal(false);
  };

  const deleteGoal = (id) => {
    triggerHaptic();
    const newGoals = data.finance.goals.filter(g => g.id !== id);
    updateData('finance', { ...data.finance, goals: newGoals });
  };

  const addToGoal = (id, amount) => {
    triggerHaptic();
    const newGoals = data.finance.goals.map(g => 
      g.id === id ? { ...g, saved: Math.min(g.saved + amount, g.target) } : g
    );
    updateData('finance', { ...data.finance, goals: newGoals });
  };

  const saveBudget = () => {
    const newBudget = parseFloat(tempBudget);
    if (!isNaN(newBudget) && newBudget > 0) {
      updateData('finance', { ...data.finance, budget: newBudget });
    }
    setEditingBudget(false);
  };

  const resetMonth = () => {
    triggerHaptic();
    if (window.confirm('¿Reiniciar gastos del mes? Los datos se perderán.')) {
      updateData('finance', {
        ...data.finance,
        spent: 0,
        expenses: []
      });
    }
  };

  const remaining = data.finance.budget - data.finance.spent;
  const progress = (data.finance.spent / data.finance.budget) * 100;

  return (
    <div className="space-y-6">
      {/* Main Budget Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-900 to-black border border-green-500/30 p-6">
        <div className="absolute top-0 right-0 p-4 opacity-20">
            <Wallet size={100} className="text-green-400" />
        </div>
        <div className="flex justify-between items-start">
          <p className="text-gray-400 text-sm mb-1">Presupuesto Restante</p>
          <IOSButton size="sm" variant="ghost" onClick={() => { setTempBudget(data.finance.budget.toString()); setEditingBudget(true); }}>
            <Edit2 size={14} className="text-gray-400" />
          </IOSButton>
        </div>
        
        {editingBudget ? (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl text-white">$</span>
            <input 
              type="number"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="text-3xl font-bold bg-transparent border-b border-green-500 outline-none text-white w-32"
              autoFocus
            />
            <IOSButton size="sm" variant="primary" onClick={saveBudget}>
              Guardar
            </IOSButton>
          </div>
        ) : (
          <h2 className={`text-4xl font-bold mb-4 ${remaining < 0 ? 'text-red-400' : 'text-white'}`}>
            ${remaining.toFixed(2)}
          </h2>
        )}
        
        <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
                <span>Gastado: ${data.finance.spent.toFixed(2)}</span>
                <span>Total: ${data.finance.budget}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${progress > 90 ? 'bg-red-500' : progress > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>
        </div>
        
        <IOSButton onClick={resetMonth} variant="ghost" size="sm" className="mt-4 text-gray-500 text-xs">
          Reiniciar mes
        </IOSButton>
      </div>

      {/* Goals Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-300 ml-1">Metas de Ahorro</h3>
          <IOSButton size="sm" variant="ghost" onClick={() => setShowAddGoal(!showAddGoal)}>
            {showAddGoal ? <X size={18} /> : <Target size={18} />}
          </IOSButton>
        </div>
        
        {showAddGoal && (
          <IOSCard className="mb-3 animate-in fade-in slide-in-from-top-4">
            <form onSubmit={handleAddGoal} className="space-y-3">
              <input 
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                placeholder="Nombre de la meta..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-green-500 outline-none"
              />
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input 
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  placeholder="Monto objetivo"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 pl-8 text-white focus:border-green-500 outline-none"
                />
              </div>
              <IOSButton type="submit" variant="primary" className="w-full">Crear Meta</IOSButton>
            </form>
          </IOSCard>
        )}
        
        <div className="space-y-3">
            {data.finance.goals.map(goal => (
                <IOSCard key={goal.id} className="group">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{goal.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-400">${goal.saved} / ${goal.target}</span>
                          <button 
                            onClick={() => deleteGoal(goal.id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2">
                        <div 
                            className="h-full bg-blue-500"
                            style={{ width: `${(goal.saved / goal.target) * 100}%` }}
                        />
                    </div>
                    <div className="flex gap-2">
                      {[10, 50, 100].map(amount => (
                        <IOSButton 
                          key={amount}
                          size="sm" 
                          variant="ghost" 
                          onClick={() => addToGoal(goal.id, amount)}
                          className="text-xs"
                        >
                          +${amount}
                        </IOSButton>
                      ))}
                    </div>
                </IOSCard>
            ))}
            {data.finance.goals.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-4">No hay metas de ahorro</p>
            )}
        </div>
      </div>

      {/* Add Expense Button */}
      <IOSButton onClick={() => setShowAddExpense(!showAddExpense)} variant="primary" className="w-full flex items-center justify-center gap-2">
        <Plus size={20} />
        {showAddExpense ? 'Cancelar' : 'Registrar Gasto'}
      </IOSButton>

      {showAddExpense && (
        <IOSCard className="animate-in slide-in-from-bottom-4 fade-in duration-300">
            <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                    <label className="text-xs text-gray-500 uppercase ml-1">Descripción</label>
                    <input 
                        type="text" 
                        value={newExpense.desc}
                        onChange={e => setNewExpense({...newExpense, desc: e.target.value})}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                        placeholder="Ej. Café"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 uppercase ml-1">Monto</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <input 
                            type="number" 
                            value={newExpense.amount}
                            onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 pl-8 text-white focus:border-blue-500 outline-none"
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <IOSButton type="submit" variant="primary" className="w-full">Guardar</IOSButton>
            </form>
        </IOSCard>
      )}

      {/* Recent Expenses */}
      {data.finance.expenses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-3 ml-1">Gastos Recientes</h3>
          <div className="space-y-2">
            {data.finance.expenses.slice(-5).reverse().map(expense => (
              <IOSCard key={expense.id} className="flex justify-between items-center py-3 group">
                <div>
                  <span className="font-medium">{expense.desc}</span>
                  {expense.date && (
                    <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">-${expense.amount.toFixed(2)}</span>
                  <button 
                    onClick={() => deleteExpense(expense.id, expense.amount)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </IOSCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
