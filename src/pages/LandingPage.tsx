import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { ArrowRight, BarChart3, Shield, Zap, CheckCircle2 } from 'lucide-react';

import { ThemeToggle } from '@/components/ThemeToggle';

export const LandingPage: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">F</div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">FinTrack Pro</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" onClick={signInWithGoogle}>Log in</Button>
          <Button onClick={signInWithGoogle}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="px-8 pt-20 pb-32 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            FinTrack Pro 2.0 is here
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Take Control of Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">Financial Life</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            The smart finance OS that helps you track expenses, grow investments, and achieve your goals with AI-powered insights.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={signInWithGoogle} className="gap-2">
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">View Demo</Button>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0a0a0a] z-10 h-full w-full"></div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-2 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="rounded-xl object-cover w-full h-[500px] opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-3 gap-12 text-left">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Real-time Analytics</h3>
            <p className="text-gray-500 dark:text-gray-400">Track your net worth, cash flow, and spending habits with beautiful, interactive charts.</p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">AI-Powered Insights</h3>
            <p className="text-gray-500 dark:text-gray-400">Get personalized recommendations on how to save more and reach your financial goals faster.</p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Bank-grade Security</h3>
            <p className="text-gray-500 dark:text-gray-400">Your data is encrypted and securely stored. We never sell your personal financial information.</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-40">
          <h2 className="text-3xl font-bold mb-12">Simple, transparent pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-8 bg-white dark:bg-gray-950">
              <h3 className="text-2xl font-semibold mb-2">Free</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Perfect for getting started.</p>
              <div className="text-4xl font-bold mb-8">₹0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Basic expense tracking', 'Up to 2 goals', 'Standard charts', 'Community support'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="outline" onClick={signInWithGoogle}>Get Started</Button>
            </div>
            <div className="rounded-2xl border-2 border-emerald-500 p-8 bg-white dark:bg-gray-950 relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">Most Popular</div>
              <h3 className="text-2xl font-semibold mb-2">Pro</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">For serious wealth builders.</p>
              <div className="text-4xl font-bold mb-8">₹199<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Unlimited tracking & goals', 'AI-powered insights', 'Advanced analytics', 'Export reports', 'Priority support'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={signInWithGoogle}>Start 14-Day Free Trial</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
