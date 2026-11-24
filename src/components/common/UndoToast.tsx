'use client';

import React from 'react';
import { RotateCcw, Check, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function UndoToast() {
  const { undoToast, triggerUndo, setUndoToast } = useAppStore();
  const [secondsLeft, setSecondsLeft] = React.useState(10);

  React.useEffect(() => {
    if (!undoToast?.visible) return;

    setSecondsLeft(10);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setUndoToast(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [undoToast?.visible, setUndoToast]);

  if (!undoToast?.visible || !undoToast.record) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border shadow-elevated animate-fade-in">
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/15 text-emerald-500">
        <Check className="h-4 w-4" />
      </div>

      <div className="flex flex-col">
        <span className="text-xs font-medium text-foreground">
          Action Executed: <span className="font-semibold">{undoToast.record.actionName}</span>
        </span>
        <span className="text-[11px] text-muted-foreground">
          Undo available for {secondsLeft}s
        </span>
      </div>

      <div className="flex items-center gap-1.5 ml-2">
        <button
          onClick={triggerUndo}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm transition-all"
        >
          <RotateCcw className="h-3 w-3" />
          Undo
        </button>

        <button
          onClick={() => setUndoToast(null)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
