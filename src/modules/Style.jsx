import React, { useState } from 'react';
import IOSCard from '../components/ui/IOSCard';
import IOSButton from '../components/ui/IOSButton';
import { Shirt, ShoppingBag, Plus, Trash2, Camera } from 'lucide-react';

export default function Style({ data, updateData }) {
  const [newItem, setNewItem] = useState('');
  const [activeTab, setActiveTab] = useState('shopping'); // shopping, outfits, tips

  if (!data) return null;

  const addItem = () => {
    if (!newItem) return;
    const newList = [...data.style.shoppingList, { id: Date.now(), text: newItem, done: false }];
    updateData('style.shoppingList', newList);
    setNewItem('');
  };

  const toggleItem = (id) => {
    const newList = data.style.shoppingList.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    );
    updateData('style.shoppingList', newList);
  };

  const deleteItem = (id) => {
    const newList = data.style.shoppingList.filter(item => item.id !== id);
    updateData('style.shoppingList', newList);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['shopping', 'outfits', 'tips'].map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-800 text-gray-400'
                }`}
            >
                {tab === 'shopping' && 'Compras'}
                {tab === 'outfits' && 'Outfits'}
                {tab === 'tips' && 'Tips'}
            </button>
        ))}
      </div>

      {activeTab === 'shopping' && (
        <div className="space-y-4">
            <IOSCard>
                <div className="flex gap-2">
                    <input 
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Añadir prenda..."
                        className="flex-1 p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm outline-none focus:border-blue-500"
                    />
                    <IOSButton onClick={addItem} variant="secondary">
                        <Plus size={20} />
                    </IOSButton>
                </div>
            </IOSCard>

            <div className="space-y-2">
                {data.style.shoppingList.map(item => (
                    <IOSCard key={item.id} className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-3" onClick={() => toggleItem(item.id)}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${item.done ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                                {item.done && <ShoppingBag size={12} className="text-white" />}
                            </div>
                            <span className={item.done ? 'line-through text-gray-500' : 'text-white'}>{item.text}</span>
                        </div>
                        <button onClick={() => deleteItem(item.id)} className="text-red-400 p-2">
                            <Trash2 size={16} />
                        </button>
                    </IOSCard>
                ))}
                {data.style.shoppingList.length === 0 && (
                    <p className="text-center text-gray-500 text-sm mt-4">Tu lista de compras está vacía.</p>
                )}
            </div>
        </div>
      )}

      {activeTab === 'outfits' && (
          <div className="text-center py-10">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera size={32} className="text-gray-500" />
              </div>
              <p className="text-gray-400">Registro de outfits próximamente.</p>
          </div>
      )}

      {activeTab === 'tips' && (
          <div className="space-y-3">
              {data.style.tips.map((tip, idx) => (
                  <IOSCard key={idx} className="bg-blue-900/10 border-blue-500/20">
                      <div className="flex gap-3">
                          <Shirt size={20} className="text-blue-400 shrink-0" />
                          <p className="text-sm text-gray-200">{tip}</p>
                      </div>
                  </IOSCard>
              ))}
          </div>
      )}
    </div>
  );
}
