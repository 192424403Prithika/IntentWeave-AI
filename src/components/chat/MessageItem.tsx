'use client';

import React from 'react';
import {
  User,
  Bot,
  Mic,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Volume2,
  Copy,
  Check,
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
      className={`group flex gap-3 px-4 py-4 transition-colors ${
        isUser ? 'bg-transparent' : 'bg-secondary/30 border-y border-border/40'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-semibold shadow-sm ${
          isUser
            ? 'bg-primary/20 text-primary border border-primary/30'
            : 'bg-primary text-primary-foreground shadow-glow-primary'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-2 min-w-0">
        {/* Header / Modality Indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-foreground">
            {isUser ? 'You' : 'IntentWeave AI'}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {/* Modality Tag */}
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase font-medium tracking-wide ${
              message.modality === 'voice'
                ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'
                : message.modality === 'image'
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                : message.modality === 'mixed'
                ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                : 'bg-muted text-muted-foreground'
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
              <div key={i} className="relative rounded-lg overflow-hidden border border-border shadow-sm max-w-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={att.url}
                  alt={att.caption || 'Attached image'}
                  className="max-h-48 object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}

        {/* Text body */}
        <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-normal">
          {message.content}
        </div>

        {/* Action Result Card if executed */}
        {message.actionRecord && message.actionRecord.status === 'done' && (
          <div className="mt-2 flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {message.actionRecord.actionName}
                </span>{' '}
                executed successfully in {message.actionRecord.latencyMs || 85}ms.
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground capitalize">
              Approved by: {message.actionRecord.approvedBy}
            </span>
          </div>
        )}

        {/* Interactive Confirmation Card if awaiting confirmation */}
        {isAwaitingThisConfirmation && (
          <div className="pt-2">
            <ConfirmationCard />
          </div>
        )}

        {/* Quick Reply Chips */}
        {message.quickReplies && message.quickReplies.length > 0 && !isAwaitingThisConfirmation && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {message.quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => onQuickReplySelect?.(reply)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary transition-all shadow-sm"
              >
                <Sparkles className="h-3 w-3" />
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
              className="p-1 text-muted-foreground hover:text-foreground rounded"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </button>
            <button
              onClick={handleSpeak}
              title="Read aloud"
              className="p-1 text-muted-foreground hover:text-foreground rounded"
            >
              <Volume2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
