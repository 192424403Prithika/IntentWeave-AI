'use client';

import React from 'react';
import {
  AlertTriangle,
  Check,
  Edit2,
  X,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Sparkles,
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
    <div className="w-full max-w-xl rounded-xl border border-primary/30 bg-card p-4 shadow-elevated transition-all animate-fade-in">
      {/* Top Banner with Risk Level */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          {risk === 'high' ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/15 text-red-500">
              <ShieldAlert className="h-4 w-4" />
            </div>
          ) : risk === 'medium' ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
              <AlertTriangle className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
              <ShieldCheck className="h-4 w-4" />
            </div>
          )}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Verification Required: <span className="text-primary">{intentResult.intent}</span>
            </h4>
            <p className="text-[11px] text-muted-foreground">
              {intentResult.reasoning || 'Verify the proposed values before execution.'}
            </p>
          </div>
        </div>

        {/* Risk Badge */}
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
            risk === 'high'
              ? 'bg-red-500/15 text-red-500 border border-red-500/30'
              : risk === 'medium'
              ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
              : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
          }`}
        >
          {risk} Risk
        </span>
      </div>

      {/* Field Review / Edit Section */}
      <div className="py-3 space-y-2.5">
        {editableFields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              {field.label}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={fieldValues[field.key] || ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className="w-full px-3 py-1.5 rounded-md bg-secondary text-xs text-foreground border border-border focus:border-primary focus:outline-none"
              />
            ) : (
              <div className="px-3 py-1.5 rounded-md bg-secondary/60 text-xs font-medium text-foreground">
                {String(fieldValues[field.key] || field.value || 'Not specified')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confidence & Explainability Indicator */}
      <div className="flex items-center justify-between text-[11px] py-2 px-3 rounded-lg bg-muted/50 border border-border/50 text-muted-foreground">
        <span>Comprehension Confidence</span>
        <span className="font-semibold text-foreground">
          {(intentResult.confidence * 100).toFixed(0)}%
        </span>
      </div>

      {/* Action Buttons: Approve / Edit / Cancel */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-border">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5" />
          {isEditing ? 'Done Editing' : 'Edit Fields'}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={cancelAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>

          <button
            onClick={handleApprove}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-glow-primary transition-all"
          >
            <Check className="h-3.5 w-3.5" />
            Approve & Execute
          </button>
        </div>
      </div>
    </div>
  );
}
