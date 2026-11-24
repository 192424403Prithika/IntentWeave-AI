import { ActionExecutionRecord, AuditLogEntry, ModalityType, IntentResult, StandardInput } from '@/types';
import { generateId } from '@/lib/utils';
import { actionRegistry } from './registry';

// In-memory audit log storage with persistence capability
export const auditLogStore: AuditLogEntry[] = [
  {
    id: 'aud_sample_1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    modality: 'text',
    inputText: 'Remind me to submit the report tomorrow at 9 am',
    intent: 'set_reminder',
    category: 'action',
    confidence: 0.98,
    risk: 'medium',
    actionTaken: 'set_reminder',
    status: 'done',
    executionTimeMs: 142,
    reasoning: 'Detected reminder request for "submit the report" scheduled for tomorrow at 9 am.',
    resolvedReferencesCount: 0,
  },
  {
    id: 'aud_sample_2',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    modality: 'voice',
    inputText: 'Add milk and eggs to my shopping list',
    intent: 'create_task',
    category: 'action',
    confidence: 0.96,
    risk: 'low',
    actionTaken: 'create_task',
    status: 'done',
    executionTimeMs: 98,
    reasoning: 'Identified intent to add 2 item(s) to tasks/to-do list.',
    resolvedReferencesCount: 0,
  },
];

/**
 * Executes the registered action handler, logs audit entry, and supports undo.
 */
export async function executeAction(
  actionName: string,
  payload: Record<string, any>,
  meta: {
    approvedBy: 'user' | 'auto_rule' | 'system';
    risk: 'low' | 'medium' | 'high';
    modality: ModalityType;
    inputText: string;
    intentResult: IntentResult;
  }
): Promise<ActionExecutionRecord> {
  const startTime = Date.now();
  const actionDef = actionRegistry.get(actionName);

  const record: ActionExecutionRecord = {
    id: generateId('act'),
    actionName,
    payload,
    risk: meta.risk,
    status: 'running',
    approvedBy: meta.approvedBy,
    createdAt: new Date().toISOString(),
  };

  if (!actionDef) {
    record.status = 'failed';
    record.error = `Action ${actionName} not found in registry`;
    return record;
  }

  try {
    const result = await actionDef.handler(payload);
    const latencyMs = Date.now() - startTime;

    record.status = 'done';
    record.result = result;
    record.executedAt = new Date().toISOString();
    record.latencyMs = latencyMs;
    // 10-second undo window
    record.undoAvailableUntil = Date.now() + 10000;
    record.undoPayload = result;

    // Log to Audit Trail
    const auditEntry: AuditLogEntry = {
      id: generateId('aud'),
      timestamp: new Date().toISOString(),
      modality: meta.modality,
      inputText: meta.inputText,
      intent: meta.intentResult.intent,
      category: meta.intentResult.category,
      confidence: meta.intentResult.confidence,
      risk: meta.risk,
      actionTaken: actionName,
      status: 'done',
      executionTimeMs: latencyMs,
      reasoning: meta.intentResult.reasoning,
      resolvedReferencesCount: meta.intentResult.resolvedReferences.length,
    };
    auditLogStore.unshift(auditEntry);

    return record;
  } catch (err: any) {
    record.status = 'failed';
    record.error = err.message || 'Action execution failed';
    return record;
  }
}

/**
 * Undo action within the 10-second window
 */
export async function undoAction(record: ActionExecutionRecord): Promise<boolean> {
  const actionDef = actionRegistry.get(record.actionName);
  if (!actionDef || !actionDef.undoHandler || !record.undoPayload) {
    return false;
  }

  try {
    const success = await actionDef.undoHandler(record.undoPayload, record.payload);
    if (success) {
      record.status = 'undone';
      record.undoneAt = new Date().toISOString();
    }
    return success;
  } catch {
    return false;
  }
}
