'use client';

import React from 'react';
import Link from 'next/link';
import {
  Coffee,
  Sparkles,
  ArrowRight,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Bot,
  Zap,
  ChevronDown,
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
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col bg-coffee-pattern overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-16 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        {/* Capstone Badge - Pill wireframe style */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border text-xs font-bold text-primary mb-6 shadow-sm animate-fade-in">
          <Coffee className="h-3.5 w-3.5" />
          <span>Capstone Project CSA1719 – Artificial Intelligence</span>
        </div>

        {/* Hero Title with warm espresso and roasted caramel tones */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          A Context-Aware <br />
          <span className="text-primary underline decoration-amber-600/30 underline-offset-8">
            Multimodal Assistant
          </span>
        </h1>

        {/* Core Promise Copy */}
        <p className="mt-6 text-lg sm:text-xl font-medium text-foreground/80 max-w-2xl mx-auto">
          &ldquo;Say it, type it, or show it. <br className="hidden sm:inline" />
          <span className="text-primary font-bold">IntentWeave understands, confirms, then acts.</span>&rdquo;
        </p>

        <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
          Architected into three decoupled, testable modules: Multimodal Recognition &rarr; Contextual Reasoning &rarr; Verified Execution.
        </p>

        {/* CTA Buttons - Rounded Pill Shapes matching reference image */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/app"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-coffee-soft hover:opacity-95 transition-all"
          >
            <Bot className="h-4 w-4" />
            Launch Assistant
          </Link>

          <button
            onClick={() => setShowArchitectureModal(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-card border border-border text-foreground font-semibold text-sm hover:bg-secondary shadow-sm transition-all"
          >
            <Coffee className="h-4 w-4 text-primary" />
            Inspect Architecture
          </button>

          <Link
            href="/evaluate"
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-secondary text-foreground font-semibold text-sm hover:bg-muted border border-border transition-all"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            30-Case Test Bench
          </Link>
        </div>
      </section>

      {/* Interactive Mini-Demo Section - Styled like wireframe screen 3 & 4 */}
      <section className="px-4 py-6 max-w-3xl mx-auto w-full">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-coffee-elevated space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Coffee className="h-3.5 w-3.5 text-primary" /> Pipeline Interactive Preview
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] bg-secondary text-primary font-bold border border-border">
              M1 &rarr; M2 &rarr; M3
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full bg-secondary text-xs sm:text-sm text-foreground border border-border focus:border-primary focus:outline-none shadow-sm"
            />
            <button
              onClick={runMiniDemo}
              disabled={demoStage === 'running'}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-coffee-soft"
            >
              <Zap className="h-3.5 w-3.5" />
              {demoStage === 'running' ? 'Processing...' : 'Run Pipeline'}
            </button>
          </div>

          {/* Stepper Display in Pill Wireframe Style */}
          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-2xl border transition-all ${demoStage !== 'idle' ? 'border-primary bg-secondary text-primary font-bold shadow-sm' : 'border-border bg-secondary/40 text-muted-foreground'}`}>
              1. Understood
            </div>
            <div className={`p-2.5 rounded-2xl border transition-all ${demoStage !== 'idle' ? 'border-primary bg-secondary text-primary font-bold shadow-sm' : 'border-border bg-secondary/40 text-muted-foreground'}`}>
              2. Reasoned
            </div>
            <div className={`p-2.5 rounded-2xl border transition-all ${demoStage === 'done' ? 'border-primary bg-secondary text-primary font-bold shadow-sm' : 'border-border bg-secondary/40 text-muted-foreground'}`}>
              3. Verified
            </div>
            <div className={`p-2.5 rounded-2xl border transition-all ${demoStage === 'done' ? 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold shadow-sm' : 'border-border bg-secondary/40 text-muted-foreground'}`}>
              4. Executed
            </div>
          </div>

          {demoStage === 'done' && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-foreground flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>
                  Intent <strong>set_reminder</strong> verified & scheduled for tomorrow at 9:00 AM.
                </span>
              </div>
              <Link href="/app" className="font-bold text-primary hover:underline">
                Open in Full Chat &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3 Core Architecture Modules Grid - Styled like wireframe screens 5, 6 & 9 */}
      <section className="px-4 py-14 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Three Decoupled Architecture Modules
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Strict boundaries, typed TypeScript contracts, and complete explainability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1 */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-coffee-soft hover:border-primary/50 transition-all space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary border border-border shadow-sm">
              <Layers className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Module 1
            </span>
            <h3 className="text-base font-bold text-foreground">
              Multimodal Command Recognition
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Detects input modality (text, voice, image, mixed). Performs live speech recognition and image OCR/object analysis, standardizing into a single typed <code>StandardInput</code>.
            </p>
            <ul className="space-y-2 text-xs text-foreground/80 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" /> Web Speech API with interim streaming
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" /> Client EXIF strip & Vision heuristics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" /> Multilingual detection (EN/HI/TA/TE)
              </li>
            </ul>
          </div>

          {/* Module 2 */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-coffee-soft hover:border-primary/50 transition-all space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary border border-border shadow-sm">
              <Cpu className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Module 2
            </span>
            <h3 className="text-base font-bold text-foreground">
              Contextual Intent Reasoning
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Analyzes commands, extracts entities (dates, times, items), resolves anaphora follow-ups ("change it to 10 am"), and evaluates completeness into a structured <code>IntentResult</code>.
            </p>
            <ul className="space-y-2 text-xs text-foreground/80 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" /> Temporal slot and item extraction
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" /> Anaphora resolution across history
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" /> Multi-intent batch command splitting
              </li>
            </ul>
          </div>

          {/* Module 3 */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-coffee-soft hover:border-primary/50 transition-all space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary border border-border shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Module 3
            </span>
            <h3 className="text-base font-bold text-foreground">
              Verified Action Execution
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dispatches to action registry with strict schema validation. Employs risk-based confirmation cards, rollback handlers, 10-second undo, and immutable audit logs.
            </p>
            <ul className="space-y-2 text-xs text-foreground/80 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" /> Signature editable Confirmation Cards
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" /> 10-second rollback toast & handlers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" /> Immutable audit logging & analytics
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="mt-1 text-xs text-muted-foreground">Technical answers for examiners and developers.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-foreground hover:bg-secondary/40"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border bg-secondary/20">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8 px-4 text-center text-xs text-muted-foreground bg-secondary/20">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-primary" />
            <span className="font-bold text-foreground">IntentWeave AI</span>
            <span>&bull; CSA1719 Artificial Intelligence Capstone Project</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
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
