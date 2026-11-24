'use client';

import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Mic,
  Camera,
  Check,
  ChevronRight,
  ArrowRight,
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
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-elevated space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-muted-foreground">
          <span>Step {step} of 3</span>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  step === s ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Modality Permissions */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Say it, type it, or show it.
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                IntentWeave AI understands text, voice transcripts, and image OCR. Microphone and camera access are used only locally when you tap them.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60 border border-border/60">
                <Mic className="h-5 w-5 text-cyan-500" />
                <div className="text-xs">
                  <div className="font-semibold text-foreground">Voice Recognition</div>
                  <div className="text-[11px] text-muted-foreground">Tap mic for hands-free command input.</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60 border border-border/60">
                <Camera className="h-5 w-5 text-amber-500" />
                <div className="text-xs">
                  <div className="font-semibold text-foreground">Vision & OCR</div>
                  <div className="text-[11px] text-muted-foreground">Drag & drop photos of receipts, notes, or items.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Confirmation Strictness */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Choose Confirmation Strictness
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Decide when you want IntentWeave to verify actions before executing.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {[
                {
                  id: 'smart',
                  title: 'Smart (Recommended)',
                  desc: 'Auto-run safe actions; verify medium and high-risk actions.',
                },
                {
                  id: 'always',
                  title: 'Always Ask',
                  desc: 'Show a Confirmation Card for every action before executing.',
                },
                {
                  id: 'auto_safe',
                  title: 'Auto-run Safe',
                  desc: 'Only verify high-risk actions like emails and deletions.',
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => updateSettings({ confirmationStrictness: opt.id as any })}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    settings.confirmationStrictness === opt.id
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border bg-secondary/40 hover:bg-muted'
                  }`}
                >
                  <div className="font-semibold text-foreground flex items-center justify-between">
                    <span>{opt.title}</span>
                    {settings.confirmationStrictness === opt.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Try Sample Prompt */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                You're Ready to Begin
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Try sending our benchmark capstone sample command to see the pipeline in action.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-secondary border border-border text-xs font-medium text-foreground">
              "Remind me to submit the report tomorrow at 9 am"
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <button
            onClick={onClose}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Skip Onboarding
          </button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-glow-primary"
              >
                Next <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  sendMessage({ text: 'Remind me to submit the report tomorrow at 9 am' });
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-glow-primary"
              >
                Try Sample & Start <Sparkles className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
