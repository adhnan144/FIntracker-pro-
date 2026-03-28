import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO, subMonths, isAfter } from 'date-fns';
import { cn } from '@/lib/utils';

export const Dashboard: React.FC = () => {
  const { data: income } = useFirestoreData<any>('income');
  const { data: expenses } = useFirestoreData<any>('expenses');
  const { data: investments } = useFirestoreData<any>('investments');
  const { data: debts } = useFirestoreData<any>('debts');

  const stats = useMemo(() => {
    const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalInvestments = investments.reduce((acc, curr) => acc + curr.amount, 0);
    const totalDebts = debts.reduce((acc, curr) => acc + curr.total_amount, 0);

    const netWorth = totalIncome - totalExpenses + totalInvestments - totalDebts;
    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, netWorth, balance };
  }, [income, expenses, investments, debts]);

  const chartData = useMemo(() => {
    // Generate last 6 months data
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = subMonths(new Date(), 5 - i);
      return {
        name: format(d, 'MMM'),
        month: d.getMonth(),
        year: d.getFullYear(),
        income: 0,
        expenses: 0,
      };
    });

    income.forEach((inc) => {
      const d = parseISO(inc.date);
      const match = months.find((m) => m.month === d.getMonth() && m.year === d.getFullYear());
      if (match) match.income += inc.amount;
    });

    expenses.forEach((exp) => {
      const d = parseISO(exp.date);
      const match = months.find((m) => m.month === d.getMonth() && m.year === d.getFullYear());
      if (match) match.expenses += exp.amount;
    });

    return months;
  }, [income, expenses]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back. Here's your financial overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Worth</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.netWorth.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Total assets minus liabilities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.balance.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Available cash</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{stats.totalIncome.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">₹{stats.totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Cash Flow Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#f9fafb' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Combine and sort recent transactions */}
              {[...income.map(i => ({ ...i, type: 'income' })), ...expenses.map(e => ({ ...e, type: 'expense' }))]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((tx, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center",
                        tx.type === 'income' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      )}>
                        {tx.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.source || tx.category}</p>
                        <p className="text-xs text-gray-500">{format(parseISO(tx.date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "font-medium",
                      tx.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
                {income.length === 0 && expenses.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No recent transactions</p>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
