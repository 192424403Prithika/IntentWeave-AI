'use client';

import React from 'react';
import {
  User,
  Coffee,
  Mic,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { ChatMessage } from '@/types';
import { ConfirmationCard } from '@/components/confirmation/ConfirmationCard';
import { useAppStore } from '@/store/useAppStore';

interface MessageItemProps {
  message: ChatMessage;
  onQuickReplySelect?: (reply: string) => void;
}

export function MessageItem({ message, onQuickReplySelect }: MessageItemProps) {
  const isUser = message.role === 'user';
  const { settings, activeConfirmation } = useAppStore();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const clean = message.content.replace(/[*#`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = settings.ttsSpeed;
      window.speechSynthesis.speak(utterance);
    }
  };

  const isAwaitingThisConfirmation =
    activeConfirmation && activeConfirmation.messageId === message.id;

  return (
    <div
      className={`group flex gap-3.5 px-4 sm:px-8 py-5 transition-colors ${
        isUser ? 'bg-transparent' : 'bg-secondary/40 border-y border-border/70'
      }`}
    >
      {/* Avatar in Rich Coffee Espresso */}
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl text-xs font-semibold shadow-sm ${
          isUser
            ? 'bg-secondary text-primary border border-border'
            : 'bg-primary text-primary-foreground shadow-coffee-soft'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Coffee className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-2.5 min-w-0">
        {/* Header / Modality Pill */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-foreground">
            {isUser ? 'You' : 'IntentWeave AI'}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {/* Modality Tag - Pill Design */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
              message.modality === 'voice'
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                : message.modality === 'image'
                ? 'bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-200 border border-orange-300 dark:border-orange-700'
                : message.modality === 'mixed'
                ? 'bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-200 border border-stone-400'
                : 'bg-secondary text-muted-foreground border border-border'
            }`}
          >
            {message.modality === 'voice' && <Mic className="h-2.5 w-2.5" />}
            {message.modality === 'image' && <ImageIcon className="h-2.5 w-2.5" />}
            {message.modality}
          </span>
        </div>

        {/* Attachments if any */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {message.attachments.map((att, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden border border-border shadow-coffee-soft max-w-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={att.url}
                  alt={att.caption || 'Attached image'}
                  className="max-h-48 object-cover rounded-2xl"
                />
              </div>
            ))}
          </div>
        )}

        {/* Text body */}
        <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-normal">
          {message.content}
        </div>

        {/* Action Result Card if executed - Rounded Pill Style */}
        {message.actionRecord && message.actionRecord.status === 'done' && (
          <div className="mt-2.5 flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-foreground shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  {message.actionRecord.actionName}
                </span>{' '}
                executed successfully in {message.actionRecord.latencyMs || 85}ms.
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold capitalize">
              Verified by: {message.actionRecord.approvedBy}
            </span>
          </div>
        )}

        {/* Interactive Confirmation Card if awaiting confirmation */}
        {isAwaitingThisConfirmation && (
          <div className="pt-2">
            <ConfirmationCard />
          </div>
        )}

        {/* Quick Reply Chips - Pill Buttons */}
        {message.quickReplies && message.quickReplies.length > 0 && !isAwaitingThisConfirmation && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {message.quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => onQuickReplySelect?.(reply)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-card text-foreground hover:bg-primary hover:text-primary-foreground border border-border shadow-sm transition-all"
              >
                <Sparkles className="h-3 w-3 text-primary group-hover:text-primary-foreground" />
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Message Utilities (Copy, Speak) */}
        {!isUser && (
          <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              title="Copy message"
              className="p-1 text-muted-foreground hover:text-foreground rounded-full"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </button>
            <button
              onClick={handleSpeak}
              title="Read aloud"
              className="p-1 text-muted-foreground hover:text-foreground rounded-full"
            >
              <Volume2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
