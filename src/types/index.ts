/**
 * IntentWeave AI Core Type Definitions
 * Typed contracts across Module 1, Module 2, Module 3 and Pipeline Orchestrator.
 */

export type ModalityType = 'text' | 'voice' | 'image' | 'mixed';

export type DetectedObject = {
  label: string;
  confidence: number;
  box?: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
};

export type ProcessedImage = {
  url: string;
  caption: string;
  objects: DetectedObject[];
  ocrText?: string;
  metadata?: {
    width?: number;
    height?: number;
    mimeType?: string;
    fileSizeKb?: number;
  };
};

/**
 * MODULE 1 OUTPUT: StandardInput
 */
export type StandardInput = {
  id: string;
  timestamp: string;
  modality: ModalityType;
  text: string;
  transcriptConfidence?: number;
  image?: ProcessedImage;
  language: string;
  audioDurationSec?: number;
  rawInput?: any;
};

/**
 * MODULE 2 OUTPUT: IntentResult
 */
export type IntentCategory = 'information' | 'explanation' | 'action' | 'clarification' | 'chitchat';
export type RiskLevel = 'low' | 'medium' | 'high';

export type ResolvedReference = {
  phrase: string;
  resolvedTo: string;
  targetId?: string;
  field?: string;
};

export type IntentResult = {
  intent: string;
  category: IntentCategory;
  confidence: number; // 0.0 - 1.0
  entities: Record<string, any>;
  resolvedReferences: ResolvedReference[];
  missingSlots: string[]; // fields needed before execution
  risk: RiskLevel;
  reasoning: string; // short, user-safe explanation
  suggestedClarifications?: string[];
  secondaryIntents?: Array<{
    intent: string;
    entities: Record<string, any>;
    risk: RiskLevel;
  }>;
};

/**
 * MODULE 3 TYPES: Action Execution & Registry
 */
export type ActionStatus =
  | 'pending'
  | 'validating'
  | 'awaiting_approval'
  | 'running'
  | 'done'
  | 'failed'
  | 'undone'
  | 'cancelled';

export interface ActionDefinition<TPayload = any, TResult = any> {
  name: string;
  category: string;
  description: string;
  risk: RiskLevel;
  schema: any; // Zod schema or JSON schema descriptor
  requiresConfirmation: boolean;
  handler: (payload: TPayload, context?: any) => Promise<TResult>;
  undoHandler?: (result: TResult, payload: TPayload) => Promise<boolean>;
  formatSummary: (payload: TPayload) => string;
}

export type ActionExecutionRecord = {
  id: string;
  actionName: string;
  payload: Record<string, any>;
  risk: RiskLevel;
  status: ActionStatus;
  approvedBy: 'user' | 'auto_rule' | 'system';
  result?: any;
  undoPayload?: any;
  undoAvailableUntil?: number;
  error?: string;
  createdAt: string;
  executedAt?: string;
  undoneAt?: string;
  latencyMs?: number;
  conversationId?: string;
  messageId?: string;
};

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  modality: ModalityType;
  inputText: string;
  intent: string;
  category: IntentCategory;
  confidence: number;
  risk: RiskLevel;
  actionTaken: string;
  status: ActionStatus;
  executionTimeMs: number;
  reasoning: string;
  resolvedReferencesCount: number;
};

/**
 * PIPELINE TRACING
 */
export type PipelineStage = 'idle' | 'understood' | 'reasoned' | 'verified' | 'executed' | 'error';

export type PipelineTrace = {
  id: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  stageTimings: {
    m1_recognition_ms?: number;
    m2_reasoning_ms?: number;
    m3_verification_ms?: number;
    m3_execution_ms?: number;
  };
  m1Input?: StandardInput;
  m2Intent?: IntentResult;
  m3ActionRecord?: ActionExecutionRecord;
  error?: string;
};

/**
 * CHAT & CONVERSATION
 */
export type MessageRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  modality: ModalityType;
  attachments?: {
    type: 'image' | 'audio';
    url: string;
    thumbnail?: string;
    caption?: string;
    metadata?: any;
  }[];
  standardInput?: StandardInput;
  intentResult?: IntentResult;
  actionRecord?: ActionExecutionRecord;
  pipelineTrace?: PipelineTrace;
  status?: 'sending' | 'streaming' | 'complete' | 'error';
  feedback?: 'like' | 'dislike';
  quickReplies?: string[];
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  tags?: string[];
  summary?: string;
  messageCount: number;
};

export type UserMemoryItem = {
  id: string;
  key: string;
  value: string;
  category: 'preference' | 'entity' | 'relationship' | 'habit';
  source: string;
  confidence: number;
  createdAt: string;
  updatedAt: string;
};

export type Settings = {
  theme: 'light' | 'dark' | 'system';
  demoMode: boolean;
  model: 'gpt-4o' | 'claude-3-5-sonnet' | 'mock-engine';
  apiKey?: string;
  confirmationStrictness: 'always' | 'smart' | 'auto_safe';
  voiceRecognitionLang: string;
  ttsVoice: string;
  ttsSpeed: number;
  ttsAutoPlay: boolean;
  handsFreeMode: boolean;
  piiMasking: boolean;
  maxContextTurns: number;
  hapticFeedback: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
};

export type EvalCase = {
  id: string;
  category: string;
  modality: ModalityType;
  input: string;
  imageUrl?: string;
  context?: string[];
  expectedIntent: string;
  expectedCategory: IntentCategory;
  expectedEntities: Record<string, any>;
  expectedRisk: RiskLevel;
  actualIntent?: string;
  actualCategory?: IntentCategory;
  confidence?: number;
  pass?: boolean;
  latencyMs?: number;
  notes?: string;
};
