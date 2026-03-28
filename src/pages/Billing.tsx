import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Billing: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your subscription and payment methods.</p>
      </div>

      <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-none shadow-lg">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Current Plan: <span className="capitalize">{profile?.plan || 'Free'}</span></h2>
            <p className="text-emerald-100">You are currently on the {profile?.plan || 'Free'} plan. Upgrade to unlock premium features.</p>
          </div>
          {profile?.plan === 'free' && (
            <Button className="bg-white text-emerald-700 hover:bg-gray-100 whitespace-nowrap">
              Upgrade to Pro
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
        <Card className={profile?.plan === 'free' ? 'border-2 border-emerald-500 relative' : ''}>
          {profile?.plan === 'free' && (
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">Current Plan</div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <p className="text-gray-500 dark:text-gray-400">Perfect for getting started.</p>
            <div className="text-4xl font-bold mt-4">₹0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 mb-8">
              {['Basic expense tracking', 'Up to 2 goals', 'Standard charts', 'Community support'].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" variant={profile?.plan === 'free' ? 'secondary' : 'outline'} disabled={profile?.plan === 'free'}>
              {profile?.plan === 'free' ? 'Current Plan' : 'Downgrade'}
            </Button>
          </CardContent>
        </Card>

        <Card className={profile?.plan === 'pro' ? 'border-2 border-emerald-500 relative' : 'border-2 border-transparent'}>
          {profile?.plan === 'pro' && (
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">Current Plan</div>
          )}
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">Pro</CardTitle>
              <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">For serious wealth builders.</p>
            <div className="text-4xl font-bold mt-4">₹199<span className="text-lg text-gray-500 font-normal">/mo</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 mb-8">
              {['Unlimited tracking & goals', 'AI-powered insights', 'Advanced analytics', 'Export reports', 'Priority support'].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" disabled={profile?.plan === 'pro'}>
              {profile?.plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
