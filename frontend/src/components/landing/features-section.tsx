'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Database, Lock, Zap, Code, Globe, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with Next.js 16 and modern technologies for optimal performance.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Database,
    title: 'Database Ready',
    description: 'PostgreSQL with Drizzle ORM. Type-safe queries out of the box.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Lock,
    title: 'Secure Authentication',
    description: 'Better Auth integration with GitHub OAuth and email/password support.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Code,
    title: 'Developer Friendly',
    description: 'TypeScript, ESLint, and comprehensive documentation included.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Globe,
    title: 'Internationalization',
    description: 'Multi-language support with next-intl. English and Chinese included.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Shield,
    title: 'Production Ready',
    description: 'Docker support, error handling, and best practices baked in.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to build
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A comprehensive platform with all the tools and features you need to create amazing AI applications.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="h-full border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}>
                    <feature.icon className={`size-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

