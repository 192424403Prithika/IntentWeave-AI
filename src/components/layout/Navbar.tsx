'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Bot,
  Layers,
  BarChart3,
  BrainCircuit,
  Settings,
  CheckCircle2,
  Workflow,
  Sun,
  Moon,
  Github,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Navbar() {
  const pathname = usePathname();
  const { settings, updateSettings } = useAppStore();

  const navLinks = [
    { href: '/', label: 'Overview', icon: Sparkles },
    { href: '/app', label: 'Assistant', icon: Bot },
    { href: '/actions', label: 'Actions Hub', icon: Layers },
    { href: '/insights', label: 'Audit & Insights', icon: BarChart3 },
    { href: '/memory', label: 'Memory', icon: BrainCircuit },
    { href: '/evaluate', label: 'Eval Bench', icon: CheckCircle2 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow-primary transition-transform group-hover:scale-105">
              <Workflow className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-foreground text-sm flex items-center gap-1.5">
                IntentWeave <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">AI</span>
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline">Multimodal Assistant</span>
            </div>
          </Link>
        </div>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/15 text-primary font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Strictness badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-secondary border border-border text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Strictness: <strong className="text-foreground capitalize">{settings.confirmationStrictness}</strong>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {settings.theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
