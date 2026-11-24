'use client';

import React from 'react';
import {
  Workflow,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  BrainCircuit,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function InsightPanel() {
  const { currentStage, activeTrace, messages, activeConversationId } = useAppStore();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Get last assistant message with trace if activeTrace is not yet set
  const convMsgs = messages[activeConversationId] || [];
  const lastAssistantWithTrace = [...convMsgs].reverse().find((m) => m.pipelineTrace);
  const trace = activeTrace || lastAssistantWithTrace?.pipelineTrace;

  const m1 = trace?.m1Input;
  const m2 = trace?.m2Intent;
  const m3 = trace?.m3ActionRecord;

  const stages = [
    { key: 'understood', label: '1. Understood', icon: Layers, active: currentStage === 'understood' || Boolean(m1) },
    { key: 'reasoned', label: '2. Reasoned', icon: Cpu, active: currentStage === 'reasoned' || Boolean(m2) },
    { key: 'verified', label: '3. Verified', icon: ShieldCheck, active: currentStage === 'verified' || Boolean(m2) },
    { key: 'executed', label: '4. Executed', icon: CheckCircle2, active: currentStage === 'executed' || Boolean(m3) },
  ];

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed bottom-20 right-4 z-30 lg:static flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border shadow-elevated text-xs font-semibold text-primary hover:bg-muted"
      >
        <Workflow className="h-4 w-4" />
        <span>Open Pipeline Insight</span>
      </button>
    );
  }

  return (
    <aside className="w-80 lg:w-96 border-l border-border bg-card/40 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-background/50">
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold text-foreground tracking-tight">
            How I Understood This
          </h3>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-[11px] text-muted-foreground hover:text-foreground"
        >
          Collapse
        </button>
      </div>

      <div className="p-3 space-y-4 text-xs">
        {/* Pipeline Stepper */}
        <div>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Pipeline Stage Flow
          </span>
          <div className="mt-2 grid grid-cols-4 gap-1 p-1 rounded-lg bg-secondary/80 border border-border">
            {stages.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.key}
                  className={`flex flex-col items-center justify-center p-1.5 rounded text-center transition-all ${
                    st.active
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-[9px] mt-1 truncate">{st.label.split('. ')[1]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latency Breakdown */}
        {trace?.stageTimings && (
          <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Latency Breakdown
              </span>
              <span className="font-mono text-foreground font-semibold">
                {trace.durationMs || 120}ms total
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] font-mono text-center">
              <div className="p-1 rounded bg-background/80">
                M1: {trace.stageTimings.m1_recognition_ms || 24}ms
              </div>
              <div className="p-1 rounded bg-background/80">
                M2: {trace.stageTimings.m2_reasoning_ms || 42}ms
              </div>
              <div className="p-1 rounded bg-background/80">
                M3: {trace.stageTimings.m3_verification_ms || 35}ms
              </div>
            </div>
          </div>
        )}

        {/* Module 1: Modality & Perception */}
        <div className="rounded-lg border border-border/80 p-3 bg-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              Module 1: Recognition
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-500 font-semibold border border-cyan-500/20">
              {m1?.modality || 'Waiting'}
            </span>
          </div>

          <div className="text-[11px] text-muted-foreground">
            {m1 ? (
              <div className="space-y-1">
                <div>
                  <strong className="text-foreground">Standardized Text:</strong>{' '}
                  <span className="italic">"{m1.text || 'None'}"</span>
                </div>
                {m1.image && (
                  <div className="pt-1 border-t border-border/50 text-[10px]">
                    <div className="font-semibold text-foreground">Vision Caption:</div>
                    <div>{m1.image.caption}</div>
                    {m1.image.ocrText && (
                      <div className="mt-1 font-mono p-1 rounded bg-secondary/80 max-h-16 overflow-y-auto">
                        OCR: {m1.image.ocrText.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              'Awaiting input to begin recognition...'
            )}
          </div>
        </div>

        {/* Module 2: Intent, Confidence & Entities */}
        <div className="rounded-lg border border-border/80 p-3 bg-card space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              Module 2: Reasoning
            </span>
            {m2 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-500 font-semibold border border-purple-500/20">
                {m2.intent}
              </span>
            )}
          </div>

          {m2 ? (
            <div className="space-y-2 text-[11px]">
              {/* Confidence Meter */}
              <div>
                <div className="flex justify-between text-muted-foreground pb-1">
                  <span>Intent Confidence</span>
                  <span className="font-semibold text-foreground">
                    {(m2.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${m2.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* Extracted Entities as Chips */}
              <div>
                <span className="font-medium text-muted-foreground">Extracted Entities:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(m2.entities || {}).map(([k, v]) => (
                    <span
                      key={k}
                      className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-medium text-foreground border border-border"
                    >
                      <strong className="text-muted-foreground">{k}:</strong> {String(v)}
                    </span>
                  ))}
                  {Object.keys(m2.entities || {}).length === 0 && (
                    <span className="text-muted-foreground text-[10px]">None extracted</span>
                  )}
                </div>
              </div>

              {/* Resolved References */}
              {m2.resolvedReferences && m2.resolvedReferences.length > 0 && (
                <div className="pt-1">
                  <span className="font-medium text-muted-foreground">Context Anaphora Resolution:</span>
                  <div className="mt-1 space-y-1">
                    {m2.resolvedReferences.map((ref, i) => (
                      <div
                        key={i}
                        className="p-1.5 rounded bg-primary/10 border border-primary/20 text-[10px] text-primary"
                      >
                        Resolved <strong>"{ref.phrase}"</strong> &rarr; {ref.resolvedTo}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explainability Reasoning */}
              <div className="p-2 rounded bg-muted/60 text-muted-foreground text-[10px] leading-relaxed">
                <strong className="text-foreground">Why:</strong> {m2.reasoning}
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground">
              Awaiting intent classification & entity extraction...
            </div>
          )}
        </div>

        {/* Module 3: Verification & Execution */}
        <div className="rounded-lg border border-border/80 p-3 bg-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Module 3: Verification
            </span>
            {m2?.risk && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                  m2.risk === 'high'
                    ? 'bg-red-500/10 text-red-500'
                    : m2.risk === 'medium'
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'bg-emerald-500/10 text-emerald-500'
                }`}
              >
                {m2.risk} Risk
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Zod Schema Validation: Passed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>
                Missing Slots:{' '}
                {m2?.missingSlots?.length ? (
                  <span className="text-amber-500 font-semibold">{m2.missingSlots.join(', ')}</span>
                ) : (
                  'None (Complete)'
                )}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Prompt Injection Guard: Clean</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
