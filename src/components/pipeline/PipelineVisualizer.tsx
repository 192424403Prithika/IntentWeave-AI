'use client';

import React from 'react';
import {
  Workflow,
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  X,
  FileCode,
  Eye,
  Sliders,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface PipelineVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PipelineVisualizer({ isOpen, onClose }: PipelineVisualizerProps) {
  const { currentStage, activeTrace } = useAppStore();

  if (!isOpen) return null;

  const isUnderstood = currentStage === 'understood' || Boolean(activeTrace?.m1Input);
  const isReasoned = currentStage === 'reasoned' || Boolean(activeTrace?.m2Intent);
  const isVerified = currentStage === 'verified' || Boolean(activeTrace?.m2Intent);
  const isExecuted = currentStage === 'executed' || Boolean(activeTrace?.m3ActionRecord);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-4xl rounded-2xl bg-card border border-border p-6 shadow-elevated space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                IntentWeave Architecture Pipeline Visualizer
              </h2>
              <p className="text-xs text-muted-foreground">
                Course CSA1719 – Decoupled Multimodal AI Architecture Inspection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Live Architecture Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Module 1 */}
          <div
            className={`rounded-xl border p-4 transition-all duration-300 ${
              isUnderstood
                ? 'border-cyan-500 bg-cyan-500/10 shadow-glow-voice'
                : 'border-border bg-secondary/40 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                Module 1
              </span>
              <Layers className="h-4 w-4 text-cyan-500" />
            </div>
            <h4 className="text-xs font-bold text-foreground">Recognition</h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              Text normalization, Web Speech API transcripts, EXIF-stripped OCR & Vision heuristics.
            </p>
            <div className="mt-3 font-mono text-[10px] p-2 rounded bg-background/80 border border-border">
              &rarr; StandardInput
            </div>
          </div>

          {/* Module 2 */}
          <div
            className={`rounded-xl border p-4 transition-all duration-300 ${
              isReasoned
                ? 'border-purple-500 bg-purple-500/10 shadow-glow-primary'
                : 'border-border bg-secondary/40 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">
                Module 2
              </span>
              <Cpu className="h-4 w-4 text-purple-500" />
            </div>
            <h4 className="text-xs font-bold text-foreground">Reasoning</h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              Entity extraction, anaphora/context resolution, confidence estimation & slot analysis.
            </p>
            <div className="mt-3 font-mono text-[10px] p-2 rounded bg-background/80 border border-border">
              &rarr; IntentResult
            </div>
          </div>

          {/* Module 3: Verification */}
          <div
            className={`rounded-xl border p-4 transition-all duration-300 ${
              isVerified
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-border bg-secondary/40 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                Module 3A
              </span>
              <ShieldCheck className="h-4 w-4 text-amber-500" />
            </div>
            <h4 className="text-xs font-bold text-foreground">Verification</h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              Action registry validation, missing slot clarification & confirmation card gating.
            </p>
            <div className="mt-3 font-mono text-[10px] p-2 rounded bg-background/80 border border-border">
              &rarr; ConfirmationDecision
            </div>
          </div>

          {/* Module 3: Execution */}
          <div
            className={`rounded-xl border p-4 transition-all duration-300 ${
              isExecuted
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-border bg-secondary/40 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                Module 3B
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <h4 className="text-xs font-bold text-foreground">Execution</h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              Action handler execution, 10s rollback window, and persistent audit logging.
            </p>
            <div className="mt-3 font-mono text-[10px] p-2 rounded bg-background/80 border border-border">
              &rarr; ActionRecord + Audit
            </div>
          </div>
        </div>

        {/* Typed Contracts Code Inspection */}
        <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <FileCode className="h-4 w-4 text-primary" /> Active Pipeline Data Contracts
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">TypeScript strict</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
            <div className="p-2.5 rounded-lg bg-background border border-border overflow-x-auto">
              <div className="text-muted-foreground mb-1">// M1: StandardInput</div>
              <pre className="text-foreground">
                {JSON.stringify(
                  activeTrace?.m1Input || {
                    id: 'input_sample',
                    modality: 'text',
                    text: 'Remind me tomorrow at 9 am',
                    language: 'en',
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="p-2.5 rounded-lg bg-background border border-border overflow-x-auto">
              <div className="text-muted-foreground mb-1">// M2: IntentResult</div>
              <pre className="text-foreground">
                {JSON.stringify(
                  activeTrace?.m2Intent || {
                    intent: 'set_reminder',
                    confidence: 0.98,
                    risk: 'medium',
                    entities: { date: 'tomorrow', time: '9 am' },
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
}
