import { IntentResult, StandardInput, Settings, ActionExecutionRecord } from '@/types';
import { actionRegistry, registerBuiltinActions } from './registry';
import { validateActionRequest, ValidationResult } from './validator';
import { evaluateConfirmationPolicy, ConfirmationDecision } from './confirmation';
import { executeAction, undoAction, auditLogStore } from './executor';

export interface ExecutionModuleResult {
  validation: ValidationResult;
  confirmationDecision?: ConfirmationDecision;
  executionRecord?: ActionExecutionRecord;
  status: 'validated' | 'needs_clarification' | 'awaiting_confirmation' | 'executed' | 'info_ready';
}

/**
 * Module 3: Verified Action Execution
 * Receives IntentResult from Module 2, validates schema & slots,
 * determines confirmation requirements, and safely executes or requests confirmation.
 */
export async function processActionStage(
  intentResult: IntentResult,
  standardInput: StandardInput,
  settings: Partial<Settings> = {}
): Promise<ExecutionModuleResult> {
  // Ensure builtin actions are registered
  registerBuiltinActions();

  // 1. Validate request
  const validation = validateActionRequest(intentResult);

  if (!validation.isValid) {
    return {
      validation,
      status: 'needs_clarification',
    };
  }

  // If this is information/explanation/chitchat, no action execution is required
  if (intentResult.category !== 'action' || !validation.actionDef) {
    return {
      validation,
      status: 'info_ready',
    };
  }

  // 2. Evaluate Confirmation Policy
  const confirmationDecision = evaluateConfirmationPolicy(
    intentResult,
    validation.actionDef,
    settings
  );

  // If confirmation is required, pause and return awaiting_confirmation state
  if (confirmationDecision.requiresConfirmation) {
    return {
      validation,
      confirmationDecision,
      status: 'awaiting_confirmation',
    };
  }

  // 3. Low-risk / Auto-run permitted: Execute immediately
  const executionRecord = await executeAction(
    intentResult.intent,
    intentResult.entities,
    {
      approvedBy: 'auto_rule',
      risk: confirmationDecision.risk,
      modality: standardInput.modality,
      inputText: standardInput.text,
      intentResult,
    }
  );

  return {
    validation,
    confirmationDecision,
    executionRecord,
    status: 'executed',
  };
}

export * from './registry';
export * from './validator';
export * from './confirmation';
export * from './executor';
