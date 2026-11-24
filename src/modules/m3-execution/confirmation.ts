import { ActionDefinition, IntentResult, Settings } from '@/types';

export interface ConfirmationDecision {
  requiresConfirmation: boolean;
  reason: string;
  risk: 'low' | 'medium' | 'high';
  formattedSummary: string;
  editableFields: Array<{
    key: string;
    label: string;
    value: any;
    type: 'text' | 'time' | 'date' | 'select';
  }>;
}

/**
 * Determines whether user confirmation is required based on:
 * 1. Action risk level (medium/high -> confirm)
 * 2. Intent confidence (< 0.85 -> confirm)
 * 3. User settings (always | smart | auto_safe)
 */
export function evaluateConfirmationPolicy(
  intentResult: IntentResult,
  actionDef: ActionDefinition,
  settings: Partial<Settings> = {}
): ConfirmationDecision {
  const strictness = settings.confirmationStrictness || 'smart';
  const risk = intentResult.risk || actionDef.risk || 'low';
  const confidence = intentResult.confidence;

  let requiresConfirmation = false;
  let reason = '';

  if (strictness === 'always') {
    requiresConfirmation = true;
    reason = 'Strict mode enabled: All actions require manual confirmation.';
  } else if (strictness === 'auto_safe') {
    if (risk === 'high') {
      requiresConfirmation = true;
      reason = 'High-risk action: Explicit approval mandatory.';
    } else if (confidence < 0.8) {
      requiresConfirmation = true;
      reason = 'Low confidence in intent comprehension: Confirmation required.';
    } else {
      requiresConfirmation = false;
      reason = 'Auto-run safe actions enabled.';
    }
  } else {
    // 'smart' mode default
    if (risk === 'high') {
      requiresConfirmation = true;
      reason = 'High-risk action (external communication or destructive modification).';
    } else if (risk === 'medium') {
      requiresConfirmation = true;
      reason = 'Medium-risk action (schedules or modifies calendar/reminders).';
    } else if (confidence < 0.85) {
      requiresConfirmation = true;
      reason = `Confidence is ${(confidence * 100).toFixed(0)}% (threshold is 85%). Verification recommended.`;
    } else {
      requiresConfirmation = false;
      reason = 'High confidence low-risk action validated.';
    }
  }

  // Format editable fields for the Confirmation Card
  const editableFields: ConfirmationDecision['editableFields'] = [];
  const entities = intentResult.entities;

  if (entities.title !== undefined) {
    editableFields.push({ key: 'title', label: 'Title / Subject', value: entities.title, type: 'text' });
  }
  if (entities.time !== undefined) {
    editableFields.push({ key: 'time', label: 'Time', value: entities.time, type: 'time' });
  }
  if (entities.date !== undefined) {
    editableFields.push({ key: 'date', label: 'Date', value: entities.date, type: 'date' });
  }
  if (entities.dateTime !== undefined && !entities.time && !entities.date) {
    editableFields.push({ key: 'dateTime', label: 'Schedule', value: entities.dateTime, type: 'text' });
  }
  if (entities.items !== undefined) {
    editableFields.push({ key: 'items', label: 'Items', value: Array.isArray(entities.items) ? entities.items.join(', ') : entities.items, type: 'text' });
  }
  if (entities.email !== undefined || entities.person !== undefined) {
    editableFields.push({ key: 'recipient', label: 'Recipient', value: entities.email || entities.person, type: 'text' });
  }

  return {
    requiresConfirmation,
    reason,
    risk,
    formattedSummary: actionDef.formatSummary(entities),
    editableFields,
  };
}
