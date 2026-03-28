import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';

export const Layout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
