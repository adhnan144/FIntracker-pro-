import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Target, Plus, Trash2, Edit2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const Goals: React.FC = () => {
  const { user } = useAuth();
  const { data: goals } = useFirestoreData<any>('goals');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const openModal = (goal?: any) => {
    if (goal) {
      setIsEdit(true);
      setCurrentId(goal.id);
      setName(goal.name);
      setTargetAmount(goal.target_amount.toString());
      setSavedAmount(goal.saved_amount.toString());
      setDeadline(goal.deadline.split('T')[0]);
    } else {
      setIsEdit(false);
      setName('');
      setTargetAmount('');
      setSavedAmount('0');
      setDeadline(new Date().toISOString().split('T')[0]);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !targetAmount || !deadline) return;

    setLoading(true);
    try {
      const data = {
        user_id: user.uid,
        name,
        target_amount: Number(targetAmount),
        saved_amount: Number(savedAmount),
        deadline: new Date(deadline).toISOString(),
      };

      if (isEdit) {
        await updateDoc(doc(db, 'goals', currentId), data);
      } else {
        await addDoc(collection(db, 'goals'), data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'goals', id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your savings and targets.</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="h-4 w-4" /> Add Goal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.saved_amount / goal.target_amount) * 100));
          return (
            <Card key={goal.id} className="relative overflow-hidden group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(goal)} className="p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-sm text-gray-500 hover:text-emerald-600 transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(goal.id)} className="p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-sm text-gray-500 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
                  <Target className="h-5 w-5" />
                </div>
                <CardTitle>{goal.name}</CardTitle>
                <p className="text-sm text-gray-500">Target: {format(parseISO(goal.deadline), 'MMM dd, yyyy')}</p>
              </CardHeader>
              <CardContent>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">₹{goal.saved_amount.toLocaleString()}</span>
                    <span className="text-gray-500">of ₹{goal.target_amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-right mt-2 text-gray-500 font-medium">{progress}% Complete</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {goals.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No goals yet</h3>
            <p className="text-gray-500 mb-4">Set a financial goal to start tracking your progress.</p>
            <Button onClick={() => openModal()}>Create your first goal</Button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? "Edit Goal" : "Add Goal"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Goal Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Emergency Fund, New Car" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Target Amount (₹)</label>
            <Input type="number" min="0" step="0.01" required value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="100000" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currently Saved (₹)</label>
            <Input type="number" min="0" step="0.01" required value={savedAmount} onChange={(e) => setSavedAmount(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Target Date</label>
            <Input type="date" required value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={loading}>{isEdit ? 'Save Changes' : 'Create Goal'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
