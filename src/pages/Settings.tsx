import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

export const Settings: React.FC = () => {
  const { profile, user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account preferences.</p>
      </div>

      <div className="grid gap-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input defaultValue={profile?.name} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input defaultValue={profile?.email} disabled className="bg-gray-50 dark:bg-gray-900" />
              <p className="text-xs text-gray-500 mt-1">Email is managed by your Google account.</p>
            </div>
            <div className="pt-4">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Currency</p>
                <p className="text-sm text-gray-500">Select your primary currency.</p>
              </div>
              <select className="h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-950">
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive weekly summaries and alerts.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
            <Button variant="danger">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
