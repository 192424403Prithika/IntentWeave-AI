'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coffee,
  Bot,
  Layers,
  BarChart3,
  BrainCircuit,
  Settings,
  CheckCircle2,
  Workflow,
  Sun,
  Moon,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Navbar() {
  const pathname = usePathname();
  const { settings, updateSettings } = useAppStore();

  const navLinks = [
    { href: '/', label: 'Overview', icon: Coffee },
    { href: '/app', label: 'Assistant', icon: Bot },
    { href: '/actions', label: 'Actions Hub', icon: Layers },
    { href: '/insights', label: 'Insights', icon: BarChart3 },
    { href: '/memory', label: 'Memory', icon: BrainCircuit },
    { href: '/evaluate', label: 'Eval Bench', icon: CheckCircle2 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Brand with Coffee Cup Motif */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-coffee-soft transition-transform group-hover:scale-105">
              <Coffee className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-foreground text-sm flex items-center gap-1.5">
                IntentWeave <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-primary font-bold border border-border">AI</span>
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline">Context-Aware Multimodal Assistant</span>
            </div>
          </Link>
        </div>

        {/* Pill Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-secondary/80 border border-border shadow-sm">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Strictness badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] bg-secondary border border-border text-foreground font-medium">
            <span className="h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-400" />
            Policy: <strong className="text-primary capitalize">{settings.confirmationStrictness}</strong>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border"
          >
            {settings.theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
