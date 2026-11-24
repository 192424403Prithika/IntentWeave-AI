import { IntentResult, StandardInput, UserMemoryItem } from '@/types';
import { extractEntities } from './entity-extractor';
import { detectIntent } from './intent-detector';
import { analyzeContext, ConversationTurn } from './context-analyzer';
import { synthesizeDecision } from './decision-engine';

export interface ReasoningContext {
  history?: ConversationTurn[];
  userMemories?: UserMemoryItem[];
}

/**
 * Module 2: Contextual Intent Reasoning
 * Takes StandardInput from M1 + conversation context + user memory,
 * and emits structured JSON: IntentResult
 */
export async function reasonIntent(
  standardInput: StandardInput,
  context: ReasoningContext = {}
): Promise<IntentResult> {
  const text = standardInput.text;
  const modality = standardInput.modality;
  const hasImage = Boolean(standardInput.image);

  // 1. Keyword & Entity Extraction
  const entities = extractEntities(text);

  // If OCR text exists on image and text is sparse, extract from OCR text
  if (standardInput.image?.ocrText && (!entities.items || entities.items.length === 0)) {
    const ocrEntities = extractEntities(standardInput.image.ocrText);
    if (ocrEntities.items) entities.items = ocrEntities.items;
  }

  // 2. Intent Detection
  const classification = detectIntent(text, modality, hasImage);

  // 3. Context & Anaphora Analysis
  const contextAnalysis = analyzeContext(
    text,
    context.history || [],
    context.userMemories || []
  );

  // 4. Decision Making & Slot Synthesis
  const intentResult = synthesizeDecision(
    { text, modality, imagePresent: hasImage },
    classification,
    entities,
    contextAnalysis
  );

  return intentResult;
}

export * from './entity-extractor';
export * from './intent-detector';
export * from './context-analyzer';
export * from './decision-engine';
