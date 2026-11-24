'use client';

import React from 'react';
import {
  BrainCircuit,
  Trash2,
  Plus,
  Sliders,
  Sparkles,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function MemoryPage() {
  const { memories, addMemory, deleteMemory, clearAllMemories, settings, updateSettings } = useAppStore();
  const [newKey, setNewKey] = React.useState('');
  const [newValue, setNewValue] = React.useState('');
  const [newCategory, setNewCategory] = React.useState<'preference' | 'entity' | 'relationship' | 'habit'>('entity');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    addMemory(newKey.trim(), newValue.trim(), newCategory);
    setNewKey('');
    setNewValue('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Context & Memory Graph</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Persistent entities, user habits, and conversational context used by Module 2.
          </p>
        </div>

        <button
          onClick={clearAllMemories}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 border border-red-500/30 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" /> Forget Everything
        </button>
      </div>

      {/* Context Window Slider Setting */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Active Context Window Size
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Number of previous turns supplied to Module 2 to resolve follow-ups and references.
            </p>
          </div>
          <span className="font-mono text-sm font-bold text-primary">
            {settings.maxContextTurns} turns
          </span>
        </div>

        <input
          type="range"
          min={3}
          max={25}
          value={settings.maxContextTurns}
          onChange={(e) => updateSettings({ maxContextTurns: parseInt(e.target.value, 10) })}
          className="w-full accent-primary cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>3 turns (Minimal)</span>
          <span>10 turns (Balanced)</span>
          <span>25 turns (Deep Anaphora)</span>
        </div>
      </div>

      {/* How Context is Used Explanation */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground/90 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-primary">
          <Info className="h-4 w-4" />
          <span>How Module 2 Analyzes Context</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          When you say "Change it to 10 am" or "Move it to Friday", the reasoning engine searches backwards across the active context window to identify the target action record. User memories stored below provide permanent grounding (e.g. course code, preferred times, relationships).
        </p>
      </div>

      {/* Add Memory Form */}
      <form onSubmit={handleAdd} className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Add New Memory Item
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Entity / Key (e.g. Course)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="px-3 py-2 rounded-lg bg-secondary text-xs text-foreground border border-border focus:border-primary focus:outline-none"
          />
          <input
            type="text"
            placeholder="Value (e.g. CSA1719 AI)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="px-3 py-2 rounded-lg bg-secondary text-xs text-foreground border border-border focus:border-primary focus:outline-none"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-secondary text-xs text-foreground border border-border focus:border-primary focus:outline-none"
          >
            <option value="entity">Entity</option>
            <option value="preference">Preference</option>
            <option value="habit">Habit</option>
            <option value="relationship">Relationship</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all"
          >
            <Plus className="h-4 w-4" /> Store Memory
          </button>
        </div>
      </form>

      {/* Memory List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Persistent Memory Graph ({memories.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-start justify-between gap-3 hover:border-primary/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-foreground">{mem.key}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-mono bg-secondary text-muted-foreground">
                    {mem.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{mem.value}</p>
                <div className="text-[10px] text-muted-foreground/80 font-mono">
                  Confidence: {(mem.confidence * 100).toFixed(0)}% &bull; Source: {mem.source}
                </div>
              </div>

              <button
                onClick={() => deleteMemory(mem.id)}
                className="p-1.5 text-muted-foreground hover:text-red-500 rounded"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {memories.length === 0 && (
            <div className="col-span-2 text-center py-10 text-muted-foreground text-xs">
              No persistent memories stored. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
