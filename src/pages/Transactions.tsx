import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const Transactions: React.FC = () => {
  const { user } = useAuth();
  const { data: income } = useFirestoreData<any>('income');
  const { data: expenses } = useFirestoreData<any>('expenses');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const allTransactions = [...income.map(i => ({ ...i, type: 'income' })), ...expenses.map(e => ({ ...e, type: 'expense' }))]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || !category || !date) return;

    setLoading(true);
    try {
      const collectionName = type === 'income' ? 'income' : 'expenses';
      const data = {
        user_id: user.uid,
        amount: Number(amount),
        date: new Date(date).toISOString(),
        ...(type === 'income' ? { source: category } : { category }),
      };

      await addDoc(collection(db, collectionName), data);
      setIsModalOpen(false);
      setAmount('');
      setCategory('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, txType: 'income' | 'expense') => {
    try {
      await deleteDoc(doc(db, txType === 'income' ? 'income' : 'expenses', id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your income and expenses.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Category/Source</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {allTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                          {tx.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        </div>
                        <span className="capitalize font-medium">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{tx.source || tx.category}</td>
                    <td className="px-6 py-4 text-gray-500">{format(parseISO(tx.date), 'MMM dd, yyyy')}</td>
                    <td className={`px-6 py-4 text-right font-medium ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(tx.id, tx.type as 'income' | 'expense')} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {allTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No transactions found. Add one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
        <form onSubmit={handleAddTransaction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount (₹)</label>
            <Input type="number" min="0" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{type === 'income' ? 'Source' : 'Category'}</label>
            <Input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder={type === 'income' ? 'e.g., Salary, Freelance' : 'e.g., Food, Rent, Utilities'} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={loading}>Save Transaction</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
