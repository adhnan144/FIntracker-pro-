import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const Insights: React.FC = () => {
  const { data: income } = useFirestoreData<any>('income');
  const { data: expenses } = useFirestoreData<any>('expenses');
  const { data: goals } = useFirestoreData<any>('goals');
  
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const financialData = {
        totalIncome: income.reduce((acc, curr) => acc + curr.amount, 0),
        totalExpenses: expenses.reduce((acc, curr) => acc + curr.amount, 0),
        expensesByCategory: expenses.reduce((acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
          return acc;
        }, {} as Record<string, number>),
        goals: goals.map(g => ({ name: g.name, target: g.target_amount, saved: g.saved_amount })),
      };

      const prompt = `
        You are an expert financial advisor. Analyze the following financial data and provide 3-4 actionable insights.
        Keep it concise, encouraging, and use bullet points. Focus on savings rate, high expense categories, and goal progress.
        
        Data:
        Total Income: ₹${financialData.totalIncome}
        Total Expenses: ₹${financialData.totalExpenses}
        Expenses by Category: ${JSON.stringify(financialData.expensesByCategory)}
        Goals: ${JSON.stringify(financialData.goals)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsights(response.text || 'No insights generated.');
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Failed to generate insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-gray-500 dark:text-gray-400">Smart financial recommendations powered by Gemini.</p>
        </div>
        <Button onClick={generateInsights} isLoading={loading} className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <Sparkles className="h-4 w-4" /> Generate Insights
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-100 dark:border-emerald-900/50">
          <CardHeader className="pb-2">
            <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mb-2" />
            <CardTitle className="text-emerald-900 dark:text-emerald-100">Growth Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">Discover new ways to invest your surplus income and accelerate your wealth building.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-100 dark:border-amber-900/50">
          <CardHeader className="pb-2">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mb-2" />
            <CardTitle className="text-amber-900 dark:text-amber-100">Risk Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 dark:text-amber-300">Get notified about unusual spending patterns or when you're approaching budget limits.</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100 dark:border-blue-900/50">
          <CardHeader className="pb-2">
            <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
            <CardTitle className="text-blue-900 dark:text-blue-100">Smart Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700 dark:text-blue-300">Personalized recommendations on where you can cut back without sacrificing your lifestyle.</p>
          </CardContent>
        </Card>
      </div>

      {insights && (
        <Card className="border-2 border-purple-200 dark:border-purple-900/50 shadow-lg">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <CardTitle>Your Personalized Financial Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-emerald dark:prose-invert max-w-none">
              <ReactMarkdown>{insights}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!insights && !loading && (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No insights generated yet</h3>
          <p className="text-gray-500 mb-4">Click the button above to get AI-powered financial advice based on your data.</p>
        </div>
      )}
    </div>
  );
};
