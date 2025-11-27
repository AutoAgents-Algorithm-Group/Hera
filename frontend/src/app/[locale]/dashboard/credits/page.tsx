'use client';

import { Header } from '@/components/dashboard/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCreditBalance } from '@/lib/hooks/use-credits';
import { authClient } from '@/lib/auth/client';
import { Coins, Wallet, Star, Building2, Check } from 'lucide-react';
import { addCredits } from '@/lib/db/services/credits';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const creditPackages = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 100,
    price: 9,
    pricePerCredit: '0.09',
    icon: Wallet,
    features: ['100 API calls', 'Basic support', 'Valid for 30 days'],
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 500,
    price: 39,
    pricePerCredit: '0.078',
    icon: Star,
    features: ['500 API calls', 'Priority support', 'Valid for 90 days', 'Save 13%'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 2000,
    price: 129,
    pricePerCredit: '0.065',
    icon: Building2,
    features: ['2000 API calls', '24/7 support', 'Valid for 1 year', 'Save 28%'],
  },
];

export default function CreditsPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const { data: balance = 0, isLoading } = useCreditBalance(userId);
  const queryClient = useQueryClient();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const handlePurchase = async (pkg: typeof creditPackages[0]) => {
    if (!userId) return;
    
    setPurchasingId(pkg.id);
    try {
      await addCredits({
        userId,
        amount: pkg.credits,
        type: 'earn',
        description: `Purchased ${pkg.name} package`,
      });
      queryClient.invalidateQueries({ queryKey: ['credits', userId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Credits" description="Purchase credits to use our services" />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-8">
          {/* Current Balance */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-background shadow-sm">
                    <Coins className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-primary">Available Balance</p>
                    <p className="text-4xl font-bold text-foreground">
                      {isLoading ? '---' : balance.toLocaleString()}
                      <span className="text-lg font-normal text-primary ml-2">credits</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Packages */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Choose a Plan</h2>
                <p className="text-sm text-muted-foreground mt-1">Select the package that fits your needs</p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {creditPackages.map((pkg) => (
                <Card 
                  key={pkg.id} 
                  className={`bg-card border-border relative transition-all hover:shadow-lg ${
                    pkg.popular ? 'ring-2 ring-primary shadow-md' : ''
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full shadow-sm">
                        Best Value
                      </span>
                    </div>
                  )}
                  <CardContent className="p-6 pt-8">
                    {/* Icon & Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2.5 rounded-xl ${
                        pkg.popular ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <pkg.icon className={`size-5 ${
                          pkg.popular ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{pkg.name}</h3>
                    </div>

                    {/* Credits */}
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-foreground">{pkg.credits.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-1">credits</span>
                    </div>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-border">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-foreground">${pkg.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${pkg.pricePerCredit} per credit
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-6">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className={`size-4 flex-shrink-0 ${
                            pkg.popular ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Button */}
                    <Button 
                      className={`w-full h-11 font-medium ${
                        pkg.popular
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
                          : 'bg-foreground hover:bg-foreground/90 text-background'
                      }`}
                      disabled={purchasingId !== null || !userId}
                      onClick={() => handlePurchase(pkg)}
                    >
                      {purchasingId === pkg.id ? 'Processing...' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ or Note */}
          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>Credits never expire once purchased. Need more? Contact us for custom plans.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

