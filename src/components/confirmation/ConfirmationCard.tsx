'use client';

import React from 'react';
import {
  AlertTriangle,
  Check,
  Edit2,
  X,
  ShieldCheck,
  ShieldAlert,
  ThumbsUp,
  Coffee,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function ConfirmationCard() {
  const { activeConfirmation, approveAction, cancelAction } = useAppStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [fieldValues, setFieldValues] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    if (activeConfirmation?.editableFields) {
      const initial: Record<string, any> = {};
      activeConfirmation.editableFields.forEach((f) => {
        initial[f.key] = f.value;
      });
      setFieldValues(initial);
    }
  }, [activeConfirmation]);

  if (!activeConfirmation) return null;

  const { intentResult, editableFields } = activeConfirmation;
  const risk = intentResult.risk || 'medium';

  const handleFieldChange = (key: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleApprove = () => {
    approveAction(fieldValues);
  };

  return (
    <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-coffee-elevated transition-all animate-fade-in space-y-4">
      {/* Top Banner with Coffee Wireframe Thumbs-Up / Shield Motif */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary border border-border shadow-sm">
            <ThumbsUp className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              Verification Required: <span className="text-primary">{intentResult.intent}</span>
            </h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {intentResult.reasoning || 'Verify the proposed values before execution.'}
            </p>
          </div>
        </div>

        {/* Risk Badge - Pill Design */}
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            risk === 'high'
              ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
              : risk === 'medium'
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
              : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
          }`}
        >
          {risk} Risk
        </span>
      </div>

      {/* Field Review / Edit Section - Pill Inputs matching wireframe screen 2 & 8 */}
      <div className="space-y-3">
        {editableFields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
              {field.label}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={fieldValues[field.key] || ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-secondary text-xs text-foreground border border-border focus:border-primary focus:outline-none shadow-sm font-medium"
              />
            ) : (
              <div className="px-4 py-2.5 rounded-2xl bg-secondary/80 text-xs font-semibold text-foreground border border-border/60">
                {String(fieldValues[field.key] || field.value || 'Not specified')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confidence Pill Bar */}
      <div className="flex items-center justify-between text-[11px] py-2 px-3.5 rounded-full bg-secondary border border-border text-muted-foreground">
        <span>Comprehension Confidence</span>
        <span className="font-bold text-primary font-mono">
          {(intentResult.confidence * 100).toFixed(0)}%
        </span>
      </div>

      {/* Action Buttons: Pill buttons matching wireframe screen 1 & 8 */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5" />
          {isEditing ? 'Done Editing' : 'Edit Details'}
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={cancelAction}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-border transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>

          <button
            onClick={handleApprove}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-coffee-soft transition-all"
          >
            <Check className="h-4 w-4" />
            Approve & Execute
          </button>
        </div>
      </div>
    </div>
  );
}
