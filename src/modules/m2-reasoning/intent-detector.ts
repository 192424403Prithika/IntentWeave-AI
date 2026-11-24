import { IntentCategory, RiskLevel } from '@/types';

export interface IntentClassification {
  intent: string;
  category: IntentCategory;
  confidence: number;
  risk: RiskLevel;
  secondaryIntents?: Array<{
    intent: string;
    entities: Record<string, any>;
    risk: RiskLevel;
  }>;
}

/**
 * Classifies input text + modality into Intent and Category
 */
export function detectIntent(
  text: string,
  modality: string = 'text',
  hasImage: boolean = false
): IntentClassification {
  const lower = text.toLowerCase().trim();

  // Multi-intent check: "Remind me at 6 to call mom and add milk to my list"
  if (
    (lower.includes('remind') && (lower.includes('and add') || lower.includes('and buy') || lower.includes('and also add'))) ||
    (lower.includes('note') && lower.includes('and remind'))
  ) {
    return {
      intent: 'multi_action_batch',
      category: 'action',
      confidence: 0.95,
      risk: 'medium',
      secondaryIntents: [
        { intent: 'set_reminder', entities: {}, risk: 'medium' },
        { intent: 'create_task', entities: {}, risk: 'low' },
      ],
    };
  }

  // Modality: Image-driven intents
  if (hasImage) {
    if (lower.includes('note') || lower.includes('save') || lower.includes('receipt') || lower.includes('item')) {
      return {
        intent: 'create_note_from_image',
        category: 'action',
        confidence: 0.94,
        risk: 'low',
      };
    }
    if (lower.includes('what is') || lower.includes("what's") || lower.includes('identify') || lower.includes('diagnose') || lower.includes('plant') || lower.includes('wrong')) {
      return {
        intent: 'identify_object',
        category: 'information',
        confidence: 0.93,
        risk: 'low',
      };
    }
    if (lower.includes('ocr') || lower.includes('read') || lower.includes('extract text')) {
      return {
        intent: 'extract_text_ocr',
        category: 'action',
        confidence: 0.96,
        risk: 'low',
      };
    }
    return {
      intent: 'analyze_image',
      category: 'explanation',
      confidence: 0.90,
      risk: 'low',
    };
  }

  // Contextual follow-up modifications
  if (
    lower.startsWith('change it to') ||
    lower.startsWith('move it to') ||
    lower.startsWith('reschedule it') ||
    lower.startsWith('make it')
  ) {
    return {
      intent: 'modify_item',
      category: 'action',
      confidence: 0.94,
      risk: 'medium',
    };
  }

  // Ambiguous deletion: "Delete that", "Remove it"
  if (lower === 'delete that' || lower === 'remove that' || lower === 'delete it' || lower === 'cancel it') {
    return {
      intent: 'delete_ambiguous',
      category: 'clarification',
      confidence: 0.65, // Low confidence triggers targeted clarification!
      risk: 'high',
    };
  }

  // Action: Reminders
  if (lower.includes('remind me') || lower.startsWith('set reminder') || lower.startsWith('remind')) {
    return {
      intent: 'set_reminder',
      category: 'action',
      confidence: 0.96,
      risk: 'medium',
    };
  }

  // Action: Tasks / To-dos / Shopping List
  if (
    lower.startsWith('add ') ||
    lower.includes('to my list') ||
    lower.includes('shopping list') ||
    lower.includes('todo') ||
    lower.includes('to-do') ||
    lower.startsWith('buy ')
  ) {
    return {
      intent: 'create_task',
      category: 'action',
      confidence: 0.95,
      risk: 'low',
    };
  }

  // Action: Notes
  if (lower.includes('take a note') || lower.includes('create note') || lower.includes('save note') || lower.startsWith('note:')) {
    return {
      intent: 'create_note',
      category: 'action',
      confidence: 0.95,
      risk: 'low',
    };
  }

  // Action: Timer
  if (lower.includes('timer') || lower.includes('stopwatch')) {
    return {
      intent: 'set_timer',
      category: 'action',
      confidence: 0.96,
      risk: 'low',
    };
  }

  // Action: Calendar Event
  if (lower.includes('schedule') || lower.includes('calendar') || lower.includes('set meeting') || lower.includes('book meeting')) {
    return {
      intent: 'schedule_event',
      category: 'action',
      confidence: 0.93,
      risk: 'medium',
    };
  }

  // Action: Email / Message Draft
  if (lower.includes('send email') || lower.includes('draft email') || lower.includes('write email') || lower.includes('send a message')) {
    return {
      intent: 'send_email_draft',
      category: 'action',
      confidence: 0.92,
      risk: 'high', // Sending communication is high risk!
    };
  }

  // Action/Info: Calculator
  if (lower.includes('calculate') || lower.includes('what is 15%') || /^[0-9\s\+\-\*\/\(\)\.\%]+$/.test(text)) {
    return {
      intent: 'calculate',
      category: 'action',
      confidence: 0.98,
      risk: 'low',
    };
  }

  // Action/Info: Translate
  if (lower.startsWith('translate') || lower.includes('in spanish') || lower.includes('in hindi') || lower.includes('in french')) {
    return {
      intent: 'translate',
      category: 'action',
      confidence: 0.94,
      risk: 'low',
    };
  }

  // Action/Info: Summarize
  if (lower.startsWith('summarize') || lower.startsWith('tl;dr') || lower.includes('summary of')) {
    return {
      intent: 'summarize',
      category: 'action',
      confidence: 0.93,
      risk: 'low',
    };
  }

  // Information: Web search style query
  if (
    lower.startsWith('who is') ||
    lower.startsWith('what is') ||
    lower.startsWith('where is') ||
    lower.startsWith('when did') ||
    lower.startsWith('search for') ||
    lower.startsWith('search web')
  ) {
    return {
      intent: 'search_web',
      category: 'information',
      confidence: 0.91,
      risk: 'low',
    };
  }

  // Explanation
  if (lower.startsWith('how to') || lower.startsWith('explain') || lower.startsWith('why do') || lower.startsWith('why did')) {
    return {
      intent: 'explain_concept',
      category: 'explanation',
      confidence: 0.89,
      risk: 'low',
    };
  }

  // Chitchat
  if (
    lower.includes('hello') ||
    lower.includes('hi') ||
    lower.includes('hey') ||
    lower.includes('how are you') ||
    lower.includes('thank you') ||
    lower.includes('thanks') ||
    lower.includes('who are you')
  ) {
    return {
      intent: 'chitchat',
      category: 'chitchat',
      confidence: 0.98,
      risk: 'low',
    };
  }

  // Fallback
  return {
    intent: 'general_query',
    category: 'information',
    confidence: 0.75,
    risk: 'low',
  };
}
