import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Wallet, TrendingUp, Plus, DollarSign } from 'lucide-react';

export default function Finance({ data, updateData }) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ desc: '', amount: '' });

  if (!data) return null;

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.desc || !newExpense.amount) return;
    
    const amount = parseFloat(newExpense.amount);
    const updatedExpenses = [...data.finance.expenses, { id: Date.now(), desc: newExpense.desc, amount }];
    
    updateData('finance.expenses', updatedExpenses);
    updateData('finance.spent', data.finance.spent + amount);
    
    setNewExpense({ desc: '', amount: '' });
    setShowAddExpense(false);
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
        <p className="text-gray-400 text-sm mb-1">Presupuesto Restante</p>
        <h2 className="text-4xl font-bold text-white mb-4">${remaining.toFixed(2)}</h2>
        
        <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
                <span>Gastado: ${data.finance.spent}</span>
                <span>Total: ${data.finance.budget}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${progress > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>
        </div>
      </div>

      {/* Goals Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-3 ml-1">Metas de Ahorro</h3>
        <div className="space-y-3">
            {data.finance.goals.map(goal => (
                <IOSCard key={goal.id}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{goal.name}</span>
                        <span className="text-sm text-green-400">${goal.saved} / ${goal.target}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-500"
                            style={{ width: `${(goal.saved / goal.target) * 100}%` }}
                        />
                    </div>
                </IOSCard>
            ))}
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
    </div>
  );
}
