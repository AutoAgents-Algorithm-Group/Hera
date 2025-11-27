'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for trying out Hera',
    features: [
      '100 credits included',
      'Basic features',
      'Community support',
      'Email notifications',
    ],
    cta: 'Install Extension',
    href: 'https://chrome.google.com/webstore',
    popular: false,
    external: true,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For professional developers',
    features: [
      '1000 credits/month',
      'All features',
      'Priority support',
      'Advanced analytics',
      'API access',
      'Custom integrations',
    ],
    cta: 'Upgrade to Pro',
    href: '/dashboard/credits',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large teams',
    features: [
      'Unlimited credits',
      'Dedicated support',
      'Custom solutions',
      'SLA guarantee',
      'On-premise option',
      'Training & onboarding',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the perfect plan for your needs. Always flexible, always fair.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`h-full relative ${
                  plan.popular
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="pb-8 pt-8">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground ml-1">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    className="w-full mb-6"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.external ? (
                      <a 
                        href={plan.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        {plan.cta}
                      </a>
                    ) : (
                      <Link href={plan.href}>{plan.cta}</Link>
                    )}
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="size-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

