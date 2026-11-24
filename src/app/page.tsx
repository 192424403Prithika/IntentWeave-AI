'use client';

import React from 'react';
import Link from 'next/link';
import {
  Workflow,
  Sparkles,
  ArrowRight,
  Mic,
  Camera,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  RotateCcw,
  Bot,
  Zap,
  Lock,
  ChevronDown,
  BarChart2,
  FileCheck,
} from 'lucide-react';
import { PipelineVisualizer } from '@/components/pipeline/PipelineVisualizer';

export default function LandingPage() {
  const [showArchitectureModal, setShowArchitectureModal] = React.useState(false);
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  // Mini interactive demo state
  const [demoInput, setDemoInput] = React.useState('Remind me to submit the report tomorrow at 9 am');
  const [demoStage, setDemoStage] = React.useState<'idle' | 'running' | 'done'>('idle');

  const runMiniDemo = () => {
    setDemoStage('running');
    setTimeout(() => {
      setDemoStage('done');
    }, 1200);
  };

  const faqs = [
    {
      q: 'How does IntentWeave prevent AI hallucinations and unintended actions?',
      a: 'IntentWeave decouples reasoning from execution. Before any modification occurs, Module 3 validates required parameters against strict schemas. If confidence is below 85% or an action carries medium/high risk, an interactive Confirmation Card is presented for approval.',
    },
    {
      q: 'Does IntentWeave require paid API keys to function?',
      a: 'No! IntentWeave includes a fully deterministic Demo Mode with built-in speech transcription, computer vision heuristics, OCR extraction, and context reasoning that runs 100% locally out of the box with zero external dependencies.',
    },
    {
      q: 'How does multimodal fusion work when combining images and voice?',
      a: 'Module 1 ingests visual media (via upload, paste, drag & drop, or camera snapshot) alongside audio transcripts. Module 2 contextualizes the extracted OCR/objects against the spoken prompt (e.g. "Add items on this receipt to my notes") into a unified intent.',
    },
    {
      q: 'How are follow-up references like "change it to 10 am" resolved?',
      a: 'Module 2 maintains a rolling context window and anaphora graph of previous turns and user memory items. When phrases like "it", "that", or "move to Friday" occur, they are resolved to the most recent matching action record.',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col bg-weave-pattern overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        {/* Capstone Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Capstone Project CSA1719 – Artificial Intelligence</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          A Context-Aware <br />
          <span className="bg-gradient-to-r from-primary-400 via-primary to-purple-500 bg-clip-text text-transparent">
            Multimodal Assistant
          </span>
        </h1>

        {/* Core Promise Copy */}
        <p className="mt-6 text-lg sm:text-xl font-medium text-foreground/80 max-w-2xl mx-auto">
          &ldquo;Say it, type it, or show it. <br className="hidden sm:inline" />
          <span className="text-primary font-bold">IntentWeave understands, confirms, then acts.</span>&rdquo;
        </p>

        <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
          Built as three independently testable architectural modules: Multimodal Recognition &rarr; Contextual Reasoning &rarr; Verified Execution.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/app"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-glow-primary hover:opacity-95 transition-all"
          >
            <Bot className="h-4 w-4" />
            Launch Assistant Workspace
          </Link>

          <button
            onClick={() => setShowArchitectureModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:bg-muted transition-all"
          >
            <Workflow className="h-4 w-4 text-primary" />
            Inspect Architecture Pipeline
          </button>

          <Link
            href="/evaluate"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary/80 text-secondary-foreground font-semibold text-sm hover:bg-secondary transition-all"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            30-Case Test Bench
          </Link>
        </div>
      </section>

      {/* Interactive Mini-Demo Section */}
      <section className="px-4 py-8 max-w-3xl mx-auto w-full">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Live Pipeline Interactive Preview
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-semibold">
              Module 1 &rarr; Module 2 &rarr; Module 3
            </span>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-secondary text-xs sm:text-sm text-foreground border border-border focus:border-primary focus:outline-none"
            />
            <button
              onClick={runMiniDemo}
              disabled={demoStage === 'running'}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
            >
              <Zap className="h-3.5 w-3.5" />
              {demoStage === 'running' ? 'Processing...' : 'Run Pipeline'}
            </button>
          </div>

          {/* Stepper Display */}
          <div className="mt-6 grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2 rounded-lg border ${demoStage !== 'idle' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold' : 'border-border bg-secondary/40 text-muted-foreground'}`}>
              1. Understood
            </div>
            <div className={`p-2 rounded-lg border ${demoStage !== 'idle' ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold' : 'border-border bg-secondary/40 text-muted-foreground'}`}>
              2. Reasoned
            </div>
            <div className={`p-2 rounded-lg border ${demoStage === 'done' ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold' : 'border-border bg-secondary/40 text-muted-foreground'}`}>
              3. Verified
            </div>
            <div className={`p-2 rounded-lg border ${demoStage === 'done' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold' : 'border-border bg-secondary/40 text-muted-foreground'}`}>
              4. Executed
            </div>
          </div>

          {demoStage === 'done' && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-foreground flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>
                  Intent <strong>set_reminder</strong> verified & reminder created for tomorrow at 9:00 AM.
                </span>
              </div>
              <Link href="/app" className="font-semibold text-primary hover:underline">
                Open in Full Chat &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3 Core Architecture Modules Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Three Decoupled Architecture Modules
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Strict boundaries, typed TypeScript contracts, and no hidden black boxes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1 */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-cyan-500/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">
              Module 1
            </span>
            <h3 className="text-base font-bold text-foreground mt-1">
              Multimodal Command Recognition
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Detects input modality (text, voice, image, mixed). Performs live speech recognition and image OCR/object analysis, standardizing into a single typed <code>StandardInput</code>.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-foreground/80">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500" /> Web Speech API with live interim streaming
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500" /> Client EXIF strip & Vision heuristics
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500" /> Language auto-detection (EN/HI/TA/TE)
              </li>
            </ul>
          </div>

          {/* Module 2 */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-purple-500/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 mb-4">
              <Cpu className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
              Module 2
            </span>
            <h3 className="text-base font-bold text-foreground mt-1">
              Contextual Intent Reasoning
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Analyzes commands, extracts entities (dates, times, items), resolves anaphora follow-ups ("change it to 10 am"), and evaluates completeness into a structured <code>IntentResult</code>.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-foreground/80">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-500" /> Entity & temporal slot extraction
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-500" /> Anaphora resolution across turn history
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-500" /> Multi-intent batch command splitting
              </li>
            </ul>
          </div>

          {/* Module 3 */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-emerald-500/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
              Module 3
            </span>
            <h3 className="text-base font-bold text-foreground mt-1">
              Verified Action Execution
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Dispatches to action registry with strict schema validation. Employs risk-based confirmation cards, rollback handlers, 10-second undo, and immutable audit logs.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-foreground/80">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Signature editable Confirmation Cards
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 10-second rollback toast & handlers
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Immutable audit logging & analytics
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="mt-1 text-xs text-muted-foreground">Technical answers for examiners and developers.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-card overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-foreground hover:bg-muted/50"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/50 bg-secondary/30">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8 px-4 text-center text-xs text-muted-foreground bg-card/40">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Workflow className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">IntentWeave AI</span>
            <span>&bull; CSA1719 Artificial Intelligence Capstone Project</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/app" className="hover:text-primary">Assistant</Link>
            <Link href="/actions" className="hover:text-primary">Actions Hub</Link>
            <Link href="/insights" className="hover:text-primary">Insights</Link>
            <Link href="/evaluate" className="hover:text-primary">Evaluation Bench</Link>
          </div>
        </div>
      </footer>

      {/* Architecture Visualizer Modal */}
      <PipelineVisualizer
        isOpen={showArchitectureModal}
        onClose={() => setShowArchitectureModal(false)}
      />
    </div>
  );
}
