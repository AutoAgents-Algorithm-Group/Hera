'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent"
      />

      <div className="container mx-auto px-4 pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm hover:bg-accent transition-colors"
            >
              <span>🎉 Introducing Hera AI Platform</span>
              <ArrowRight className="size-3" />
            </Link>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl"
          >
            Build AI Applications
            <br />
            <span className="text-primary">Faster Than Ever</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Powerful AI agent platform with built-in authentication, database, and beautiful UI components. Start building your next AI application in minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="rounded-xl px-8">
              <a 
                href="https://chrome.google.com/webstore" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                Install Extension
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl px-8">
              <Link href="/docs">View Documentation</Link>
            </Button>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-transparent h-1/2 bottom-0" />
              <div className="rounded-xl border border-border bg-muted/30 p-4 backdrop-blur-sm shadow-2xl">
                <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-border flex items-center justify-center">
                  <p className="text-muted-foreground">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

