import { ResolvedReference, UserMemoryItem, MessageRole } from '@/types';

export interface ConversationTurn {
  role: MessageRole;
  content: string;
  intentResult?: any;
  actionRecord?: any;
  timestamp?: string;
}

export interface ContextAnalysisResult {
  resolvedReferences: ResolvedReference[];
  contextEntityUpdates: Record<string, any>;
  referencedItem?: {
    type: string;
    id?: string;
    summary?: string;
    currentValues?: Record<string, any>;
  };
  matchedMemoryItems: UserMemoryItem[];
}

/**
 * Resolves pronoun references and follow-ups:
 * - "that one" / "delete that"
 * - "move it to Friday" / "change it to 10 am"
 * - "what about the second image?"
 * Reads previous turns and user persistent memories.
 */
export function analyzeContext(
  currentText: string,
  history: ConversationTurn[] = [],
  userMemories: UserMemoryItem[] = []
): ContextAnalysisResult {
  const resolvedReferences: ResolvedReference[] = [];
  const contextEntityUpdates: Record<string, any> = {};
  const lower = currentText.toLowerCase();

  // Find last action or assistant proposal from history
  const recentTurns = [...history].reverse();
  const lastActionTurn = recentTurns.find(t => t.actionRecord || (t.intentResult && t.intentResult.category === 'action'));
  const lastAssistantTurn = recentTurns.find(t => t.role === 'assistant');

  let referencedItem: ContextAnalysisResult['referencedItem'] = undefined;

  if (lastActionTurn?.actionRecord) {
    const act = lastActionTurn.actionRecord;
    referencedItem = {
      type: act.actionName,
      id: act.id,
      summary: act.payload?.title || act.payload?.query || act.actionName,
      currentValues: act.payload,
    };
  }

  // 1. Check for "it" reference: "change it to 10 am", "move it to Friday"
  if (/\b(?:it|that|the reminder|the task|the event)\b/i.test(currentText)) {
    if (referencedItem) {
      resolvedReferences.push({
        phrase: 'it',
        resolvedTo: `${referencedItem.type}: "${referencedItem.summary}"`,
        targetId: referencedItem.id,
      });

      // If text mentions modifying time: "change it to 10 am"
      const timeMatch = currentText.match(/\b(?:to|at)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i);
      if (timeMatch) {
        contextEntityUpdates.time = timeMatch[1].trim();
        contextEntityUpdates.targetItem = referencedItem;
      }
      // If text mentions modifying date: "move it to Friday"
      const dateMatch = lower.match(/\b(?:to|on)\s+(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
      if (dateMatch) {
        contextEntityUpdates.date = dateMatch[1].trim();
        contextEntityUpdates.targetItem = referencedItem;
      }
    }
  }

  // 2. Ambiguous references: "Delete that", "Cancel that"
  if (lower === 'delete that' || lower === 'cancel that' || lower === 'remove it') {
    if (referencedItem) {
      resolvedReferences.push({
        phrase: 'that',
        resolvedTo: `${referencedItem.type}: "${referencedItem.summary}"`,
        targetId: referencedItem.id,
      });
    }
  }

  // 3. User Memory integration (e.g. user preferred language, names)
  const matchedMemories: UserMemoryItem[] = [];
  for (const mem of userMemories) {
    if (lower.includes(mem.key.toLowerCase()) || lower.includes(mem.value.toLowerCase())) {
      matchedMemories.push(mem);
    }
  }

  return {
    resolvedReferences,
    contextEntityUpdates,
    referencedItem,
    matchedMemoryItems: matchedMemories,
  };
}
