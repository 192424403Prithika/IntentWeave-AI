'use client';

import React from 'react';
import {
  Settings,
  Shield,
  Volume2,
  Mic,
  Moon,
  Sun,
  Eye,
  Key,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Assistant Configuration & Settings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Tune confirmation strictness, voice parameters, AI engine mode, and accessibility.
        </p>
      </div>

      {/* Confirmation Strictness */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Module 3 Confirmation Strictness Policy
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Controls when the interactive Confirmation Card is presented before executing actions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'smart',
              title: 'Smart Mode (Recommended)',
              desc: 'Auto-run low-risk high-confidence actions; prompt confirmation for medium/high risk.',
            },
            {
              id: 'always',
              title: 'Always Ask',
              desc: 'Strict mode: Every recognized action must receive manual user approval.',
            },
            {
              id: 'auto_safe',
              title: 'Auto-run Safe Actions',
              desc: 'Execute low and medium risk tasks automatically; verify only high-risk.',
            },
          ].map((mode) => (
            <div
              key={mode.id}
              onClick={() => updateSettings({ confirmationStrictness: mode.id as any })}
              className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                settings.confirmationStrictness === mode.id
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border bg-secondary/40 hover:bg-muted'
              }`}
            >
              <div className="font-semibold text-foreground flex items-center justify-between">
                <span>{mode.title}</span>
                {settings.confirmationStrictness === mode.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                {mode.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Model & Demo Mode */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            AI Engine & Demo Mode
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Switch between deterministic offline mock engine and LLM cloud providers.
          </p>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/60 border border-border">
          <div>
            <div className="text-xs font-semibold text-foreground">Demo Mode (Zero API Key Required)</div>
            <div className="text-[11px] text-muted-foreground">
              Runs 100% locally with instant deterministic reasoning for capstone demonstration.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.demoMode}
            onChange={(e) => updateSettings({ demoMode: e.target.checked })}
            className="h-4 w-4 text-primary rounded"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">AI Engine Model</label>
          <select
            value={settings.model}
            onChange={(e) => updateSettings({ model: e.target.value as any })}
            className="w-full px-3 py-2 rounded-lg bg-secondary text-xs text-foreground border border-border focus:border-primary focus:outline-none"
          >
            <option value="mock-engine">Deterministic Capstone Mock Engine (Built-in)</option>
            <option value="gpt-4o">OpenAI GPT-4o (Vision + Structured JSON)</option>
            <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
          </select>
        </div>
      </div>

      {/* Voice & Speech Synthesis */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Voice & Multilingual Settings
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure Speech-to-Text language and SpeechSynthesis playback speed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Speech Recognition Language</label>
            <select
              value={settings.voiceRecognitionLang}
              onChange={(e) => updateSettings({ voiceRecognitionLang: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-xs text-foreground border border-border focus:border-primary focus:outline-none"
            >
              <option value="en-US">English (US)</option>
              <option value="hi-IN">Hindi (हिन्दी)</option>
              <option value="ta-IN">Tamil (தமிழ்)</option>
              <option value="te-IN">Telugu (తెలుగు)</option>
              <option value="es-ES">Spanish (Español)</option>
              <option value="fr-FR">French (Français)</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-foreground">Spoken Reply Speed (TTS)</span>
              <span className="font-mono text-muted-foreground">{settings.ttsSpeed}x</span>
            </div>
            <input
              type="range"
              min={0.7}
              max={1.5}
              step={0.1}
              value={settings.ttsSpeed}
              onChange={(e) => updateSettings({ ttsSpeed: parseFloat(e.target.value) })}
              className="w-full accent-primary cursor-pointer mt-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-foreground">Auto-read assistant responses aloud</span>
          <input
            type="checkbox"
            checked={settings.ttsAutoPlay}
            onChange={(e) => updateSettings({ ttsAutoPlay: e.target.checked })}
            className="h-4 w-4 text-primary rounded"
          />
        </div>
      </div>

      {/* Accessibility & Shortcuts */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Keyboard Shortcuts
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Navigate IntentWeave quickly without lifting your fingers from the keyboard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/40 border border-border/50">
            <span>Send command</span>
            <kbd className="px-2 py-0.5 rounded bg-card border border-border font-mono text-[10px]">Enter</kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/40 border border-border/50">
            <span>Multiline newline</span>
            <kbd className="px-2 py-0.5 rounded bg-card border border-border font-mono text-[10px]">Shift + Enter</kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/40 border border-border/50">
            <span>Toggle Voice Recording</span>
            <kbd className="px-2 py-0.5 rounded bg-card border border-border font-mono text-[10px]">Ctrl + M</kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/40 border border-border/50">
            <span>Approve Confirmation Card</span>
            <kbd className="px-2 py-0.5 rounded bg-card border border-border font-mono text-[10px]">Ctrl + Enter</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
