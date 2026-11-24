import { describe, it, expect, beforeEach } from 'vitest';
import {
  actionRegistry,
  registerBuiltinActions,
  inMemoryStore,
} from '@/modules/m3-execution/registry';
import { validateActionRequest } from '@/modules/m3-execution/validator';
import { evaluateConfirmationPolicy } from '@/modules/m3-execution/confirmation';
import { executeAction, undoAction } from '@/modules/m3-execution/executor';
import { IntentResult } from '@/types';

describe('Module 3: Verified Action Execution', () => {
  beforeEach(() => {
    registerBuiltinActions();
  });

  it('validates action requests and confirms schema completeness', () => {
    const intentResult: IntentResult = {
      intent: 'set_reminder',
      category: 'action',
      confidence: 0.96,
      entities: { title: 'Submit assignment', time: '9 am' },
      resolvedReferences: [],
      missingSlots: [],
      risk: 'medium',
      reasoning: 'Valid reminder',
    };

    const validation = validateActionRequest(intentResult);
    expect(validation.isValid).toBe(true);
    expect(validation.missingSlots.length).toBe(0);
  });

  it('requires confirmation card for medium/high-risk actions under smart mode', () => {
    const intentResult: IntentResult = {
      intent: 'set_reminder',
      category: 'action',
      confidence: 0.96,
      entities: { title: 'Submit assignment', time: '9 am' },
      resolvedReferences: [],
      missingSlots: [],
      risk: 'medium',
      reasoning: 'Reminder set',
    };

    const actionDef = actionRegistry.get('set_reminder')!;
    const decision = evaluateConfirmationPolicy(intentResult, actionDef, {
      confirmationStrictness: 'smart',
    });

    expect(decision.requiresConfirmation).toBe(true);
    expect(decision.risk).toBe('medium');
    expect(decision.editableFields.length).toBeGreaterThan(0);
  });

  it('executes reminder action and supports undo rollback', async () => {
    const record = await executeAction(
      'set_reminder',
      { title: 'Test Vitest Reminder', time: 'Tomorrow 9 am' },
      {
        approvedBy: 'user',
        risk: 'medium',
        modality: 'text',
        inputText: 'Test Vitest Reminder',
        intentResult: {
          intent: 'set_reminder',
          category: 'action',
          confidence: 0.98,
          entities: {},
          resolvedReferences: [],
          missingSlots: [],
          risk: 'medium',
          reasoning: 'Test',
        },
      }
    );

    expect(record.status).toBe('done');
    expect(record.result.success).toBe(true);

    // Verify presence in store
    const found = inMemoryStore.reminders.find((r) => r.title === 'Test Vitest Reminder');
    expect(found).toBeDefined();

    // Verify undo rollback
    const undone = await undoAction(record);
    expect(undone).toBe(true);
    expect(record.status).toBe('undone');
    expect(inMemoryStore.reminders.find((r) => r.title === 'Test Vitest Reminder')).toBeUndefined();
  });
});
