'use client';

import React from 'react';
import {
  Coffee,
  ShieldCheck,
  Mic,
  Camera,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = React.useState(1);
  const { settings, updateSettings, sendMessage } = useAppStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      {/* Inspired directly by the top-left splash card in the wireframe design */}
      <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-coffee-elevated space-y-6">
        {/* Step Pill Indicators */}
        <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-muted-foreground font-medium">
          <span>Step {step} of 3</span>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s ? 'w-8 bg-primary' : 'w-2 bg-secondary'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Splash Card Aesthetic (Inspired by Screen 1) */}
        {step === 1 && (
          <div className="space-y-5 text-center">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-secondary text-primary border border-border shadow-coffee-soft">
              <Coffee className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                IntentWeave AI
              </h2>
              <p className="text-xs font-semibold text-primary mt-1 uppercase tracking-wider">
                Multimodal Assistant
              </p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                &ldquo;Say it, type it, or show it. IntentWeave understands, confirms, then acts.&rdquo;
              </p>
            </div>

            <div className="space-y-2 text-left pt-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary border border-border/80">
                <Mic className="h-5 w-5 text-primary" />
                <div className="text-xs">
                  <div className="font-bold text-foreground">Speech & Audio Input</div>
                  <div className="text-[11px] text-muted-foreground">Tap mic for natural spoken instructions.</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary border border-border/80">
                <Camera className="h-5 w-5 text-primary" />
                <div className="text-xs">
                  <div className="font-bold text-foreground">Vision & Document OCR</div>
                  <div className="text-[11px] text-muted-foreground">Upload photos of receipts, notes, or items.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Confirmation Policy (Inspired by Screen 2 & 8) */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary border border-border shadow-sm">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Confirmation Strictness Policy
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose when IntentWeave presents interactive confirmation cards.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {[
                {
                  id: 'smart',
                  title: 'Smart Mode (Recommended)',
                  desc: 'Auto-run safe low-risk actions; prompt for medium/high-risk actions.',
                },
                {
                  id: 'always',
                  title: 'Always Ask',
                  desc: 'Every recognized action must receive manual approval before running.',
                },
                {
                  id: 'auto_safe',
                  title: 'Auto-run Safe Actions',
                  desc: 'Auto-run low/medium actions; prompt only for high-risk deletions or emails.',
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => updateSettings({ confirmationStrictness: opt.id as any })}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                    settings.confirmationStrictness === opt.id
                      ? 'border-primary bg-secondary shadow-sm font-semibold'
                      : 'border-border bg-card hover:bg-secondary/40'
                  }`}
                >
                  <div className="font-bold text-foreground flex items-center justify-between">
                    <span>{opt.title}</span>
                    {settings.confirmationStrictness === opt.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 font-normal">{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Try Sample Benchmark (Inspired by Screen 12) */}
        {step === 3 && (
          <div className="space-y-5 text-center">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
              <Check className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Everything is Ready
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Begin with our CSA1719 capstone benchmark command to observe the 4-stage flow.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary border border-border text-xs font-semibold text-primary">
              &ldquo;Remind me to submit the report tomorrow at 9 am&rdquo;
            </div>
          </div>
        )}

        {/* Pill Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Skip
          </button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-muted-foreground hover:bg-secondary"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-primary text-primary-foreground hover:opacity-95 shadow-coffee-soft"
              >
                Next <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  sendMessage({ text: 'Remind me to submit the report tomorrow at 9 am' });
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-primary text-primary-foreground hover:opacity-95 shadow-coffee-soft"
              >
                Start Exploring <Sparkles className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
