import { IntentResult, RiskLevel } from '@/types';
import { IntentClassification } from './intent-detector';
import { ExtractedEntities } from './entity-extractor';
import { ContextAnalysisResult } from './context-analyzer';

/**
 * Validates slot completeness and computes final reasoning, risk, and confidence
 */
export function synthesizeDecision(
  input: { text: string; modality: string; imagePresent: boolean },
  classification: IntentClassification,
  entities: ExtractedEntities,
  contextAnalysis: ContextAnalysisResult
): IntentResult {
  const mergedEntities: Record<string, any> = {
    ...entities,
    ...contextAnalysis.contextEntityUpdates,
  };

  const missingSlots: string[] = [];
  const suggestedClarifications: string[] = [];
  let risk: RiskLevel = classification.risk;
  let confidence = classification.confidence;
  let reasoning = '';

  const intent = classification.intent;

  // Slot requirements by intent
  switch (intent) {
    case 'set_reminder':
      if (!mergedEntities.title && !mergedEntities.dateTime) {
        missingSlots.push('title', 'dateTime');
        suggestedClarifications.push('What would you like to be reminded of, and when?');
      } else if (!mergedEntities.title) {
        missingSlots.push('title');
        suggestedClarifications.push('What should the reminder say?');
      } else if (!mergedEntities.dateTime && !mergedEntities.time && !mergedEntities.date) {
        missingSlots.push('dateTime');
        suggestedClarifications.push('When should I remind you? (e.g. tomorrow at 9 AM, in 1 hour)');
      }
      reasoning = `Detected reminder request for "${mergedEntities.title || 'untitled'}" scheduled for ${mergedEntities.dateTime || 'unspecified time'}.`;
      break;

    case 'create_task':
      if (!mergedEntities.items && !mergedEntities.title) {
        missingSlots.push('items');
        suggestedClarifications.push('What items should I add to your task list?');
      }
      const itemCount = mergedEntities.items?.length || 1;
      reasoning = `Identified intent to add ${itemCount} item(s) to tasks/to-do list.`;
      break;

    case 'create_note':
    case 'create_note_from_image':
      if (!mergedEntities.title && !input.text && !input.imagePresent) {
        missingSlots.push('content');
        suggestedClarifications.push('What content should be saved in the note?');
      }
      reasoning = input.imagePresent
        ? `Identified intent to convert image OCR data into a structured note.`
        : `Identified intent to capture a note with content: "${mergedEntities.title || input.text}".`;
      break;

    case 'modify_item':
      if (contextAnalysis.referencedItem) {
        reasoning = `Resolved follow-up reference to update ${contextAnalysis.referencedItem.type} ("${contextAnalysis.referencedItem.summary}") to ${mergedEntities.time || mergedEntities.date || 'new value'}.`;
      } else {
        missingSlots.push('targetItem');
        suggestedClarifications.push('Which recent item or reminder would you like to update?');
        confidence = 0.6;
      }
      break;

    case 'delete_ambiguous':
      missingSlots.push('specificTarget');
      confidence = 0.6;
      suggestedClarifications.push('Which item would you like to delete?');
      if (contextAnalysis.referencedItem) {
        suggestedClarifications.push(`1. Delete recent ${contextAnalysis.referencedItem.type} ("${contextAnalysis.referencedItem.summary}")`);
        suggestedClarifications.push('2. Cancel and keep everything');
      } else {
        suggestedClarifications.push('1. Recent reminder');
        suggestedClarifications.push('2. Recent note');
        suggestedClarifications.push('3. Cancel request');
      }
      reasoning = 'Request was ambiguous ("Delete that"). Requesting targeted clarification before performing destructive action.';
      break;

    case 'send_email_draft':
      if (!mergedEntities.person && !mergedEntities.email) {
        missingSlots.push('recipient');
        suggestedClarifications.push('Who is the recipient for this email?');
      }
      risk = 'high'; // Email sending is high-risk
      reasoning = `Drafting communication to ${mergedEntities.email || mergedEntities.person || 'unspecified recipient'}. Explicit verification required.`;
      break;

    case 'set_timer':
      if (!mergedEntities.duration) {
        missingSlots.push('duration');
        suggestedClarifications.push('How long should the timer run? (e.g. 5 minutes, 30 seconds)');
      }
      reasoning = `Setting countdown timer for ${mergedEntities.duration || '?'} ${mergedEntities.durationUnit || 'minutes'}.`;
      break;

    case 'calculate':
      reasoning = `Evaluating mathematical expression: ${mergedEntities.mathExpression || input.text}.`;
      break;

    case 'translate':
      reasoning = `Translating input into ${mergedEntities.language || 'requested language'}.`;
      break;

    default:
      reasoning = `Interpreted query as ${classification.category} (${intent}) with ${(confidence * 100).toFixed(0)}% confidence.`;
  }

  // Adjust confidence if critical slots are missing
  if (missingSlots.length > 0 && confidence > 0.8) {
    confidence = 0.72;
  }

  return {
    intent,
    category: classification.category,
    confidence: Number(confidence.toFixed(2)),
    entities: mergedEntities,
    resolvedReferences: contextAnalysis.resolvedReferences,
    missingSlots,
    risk,
    reasoning,
    suggestedClarifications: suggestedClarifications.length > 0 ? suggestedClarifications : undefined,
    secondaryIntents: classification.secondaryIntents,
  };
}
