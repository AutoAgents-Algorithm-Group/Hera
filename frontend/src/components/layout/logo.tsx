'use client';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`size-8 bg-primary rounded-lg flex items-center justify-center ${className || ''}`}>
      <span className="text-primary-foreground font-bold text-lg">H</span>
    </div>
  );
}

