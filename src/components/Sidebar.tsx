import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, TrendingUp, Target, Settings, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: Receipt },
  { name: 'Insights', path: '/insights', icon: TrendingUp },
  { name: 'Goals', path: '/goals', icon: Target },
  { name: 'Billing', path: '/billing', icon: CreditCard },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { signOut, profile } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white/50 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/50">
      <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">F</div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">FinTrack Pro</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4 px-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate w-24">{profile?.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{profile?.plan} Plan</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>
    </div>
  );
};
