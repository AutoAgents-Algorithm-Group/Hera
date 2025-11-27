'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 sm:px-16 sm:py-24"
        >
          {/* Background pattern */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
              Ready to get started?
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of developers building amazing AI applications with Hera. Start your journey today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-xl px-8"
              >
                <a 
                  href="https://chrome.google.com/webstore" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Install Extension Now
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl px-8 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/docs">Read Documentation</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

