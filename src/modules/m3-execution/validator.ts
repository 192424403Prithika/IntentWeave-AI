import { ActionDefinition, IntentResult } from '@/types';
import { actionRegistry } from './registry';

export interface ValidationResult {
  isValid: boolean;
  missingSlots: string[];
  actionDef?: ActionDefinition;
  followUpQuestion?: string;
  suggestedOptions?: string[];
  errors: string[];
}

/**
 * Validates whether the action can proceed or if missing slots require follow-up.
 * Never guesses when critical slots are missing.
 */
export function validateActionRequest(
  intentResult: IntentResult
): ValidationResult {
  const actionName = intentResult.intent;
  const actionDef = actionRegistry.get(actionName);

  const errors: string[] = [];
  const missingSlots: string[] = [...intentResult.missingSlots];

  // If intent was marked clarification (e.g. "delete that")
  if (intentResult.category === 'clarification') {
    return {
      isValid: false,
      missingSlots,
      actionDef,
      followUpQuestion: intentResult.suggestedClarifications?.[0] || 'Could you please clarify which item you are referring to?',
      suggestedOptions: intentResult.suggestedClarifications?.slice(1) || [],
      errors: ['Ambiguous reference requires clarification'],
    };
  }

  // If action is not registered in our registry, check if it's general info/chitchat
  if (!actionDef) {
    if (intentResult.category === 'action') {
      return {
        isValid: false,
        missingSlots: ['action_definition'],
        followUpQuestion: `I recognized an action request ("${actionName}"), but it is not currently configured in the action registry.`,
        errors: [`Unregistered action: ${actionName}`],
      };
    }
    // Non-action intents (chitchat, information, explanation) don't need action definition
    return {
      isValid: true,
      missingSlots: [],
      errors: [],
    };
  }

  // Check required fields from actionDef schema
  if (actionDef.schema?.required) {
    for (const field of actionDef.schema.required) {
      if (!intentResult.entities[field] && !missingSlots.includes(field)) {
        missingSlots.push(field);
      }
    }
  }

  if (missingSlots.length > 0) {
    let question = intentResult.suggestedClarifications?.[0];
    if (!question) {
      question = `I need a bit more detail: Please specify the ${missingSlots.join(' and ')} to proceed.`;
    }

    return {
      isValid: false,
      missingSlots,
      actionDef,
      followUpQuestion: question,
      suggestedOptions: intentResult.suggestedClarifications?.slice(1),
      errors: [`Missing required slot(s): ${missingSlots.join(', ')}`],
    };
  }

  return {
    isValid: true,
    missingSlots: [],
    actionDef,
    errors: [],
  };
}
