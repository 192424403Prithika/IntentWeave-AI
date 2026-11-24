import {
  ChatMessage,
  IntentResult,
  PipelineStage,
  PipelineTrace,
  Settings,
  StandardInput,
  UserMemoryItem,
} from '@/types';
import { generateId } from '@/lib/utils';
import { recognizeInput, RawInputPayload } from '@/modules/m1-recognition';
import { reasonIntent, ConversationTurn } from '@/modules/m2-reasoning';
import {
  processActionStage,
  ExecutionModuleResult,
  executeAction,
} from '@/modules/m3-execution';

export interface PipelineOptions {
  history?: ConversationTurn[];
  userMemories?: UserMemoryItem[];
  settings?: Partial<Settings>;
  onStageChange?: (stage: PipelineStage, data: any) => void;
}

export interface PipelineExecutionOutput {
  trace: PipelineTrace;
  standardInput: StandardInput;
  intentResult: IntentResult;
  executionModuleResult: ExecutionModuleResult;
  assistantReply: string;
  quickReplies?: string[];
  status: 'completed' | 'awaiting_confirmation' | 'clarification_needed' | 'error';
}

/**
 * IntentWeave Core Pipeline Orchestrator
 * Integrates Module 1 (Recognition) -> Module 2 (Reasoning) -> Module 3 (Execution)
 * with streaming stage lifecycle events.
 */
export class PipelineOrchestrator {
  async run(
    inputPayload: RawInputPayload,
    options: PipelineOptions = {}
  ): Promise<PipelineExecutionOutput> {
    const startTime = Date.now();
    const traceId = generateId('trc');
    const timings: PipelineTrace['stageTimings'] = {};

    const notify = (stage: PipelineStage, data: any) => {
      options.onStageChange?.(stage, data);
    };

    // ==========================================
    // STAGE 1: Multimodal Command Recognition (M1)
    // ==========================================
    const m1Start = Date.now();
    const standardInput = await recognizeInput(inputPayload);
    timings.m1_recognition_ms = Date.now() - m1Start;
    notify('understood', standardInput);

    // ==========================================
    // STAGE 2: Contextual Intent Reasoning (M2)
    // ==========================================
    const m2Start = Date.now();
    const intentResult = await reasonIntent(standardInput, {
      history: options.history,
      userMemories: options.userMemories,
    });
    timings.m2_reasoning_ms = Date.now() - m2Start;
    notify('reasoned', intentResult);

    // ==========================================
    // STAGE 3: Verified Action Execution (M3)
    // ==========================================
    const m3Start = Date.now();
    const executionModuleResult = await processActionStage(
      intentResult,
      standardInput,
      options.settings
    );
    timings.m3_verification_ms = Date.now() - m3Start;
    notify('verified', executionModuleResult);

    // Determine final assistant reply and status
    let assistantReply = '';
    let quickReplies: string[] | undefined = undefined;
    let finalStatus: PipelineExecutionOutput['status'] = 'completed';

    if (executionModuleResult.status === 'needs_clarification') {
      finalStatus = 'clarification_needed';
      assistantReply = executionModuleResult.validation.followUpQuestion || 'Could you please provide a few more details?';
      quickReplies = executionModuleResult.validation.suggestedOptions;
    } else if (executionModuleResult.status === 'awaiting_confirmation') {
      finalStatus = 'awaiting_confirmation';
      assistantReply = `I've prepared the following action: **${executionModuleResult.confirmationDecision?.formattedSummary}**. Please confirm or edit the details below.`;
    } else if (executionModuleResult.status === 'executed') {
      timings.m3_execution_ms = executionModuleResult.executionRecord?.latencyMs || 50;
      notify('executed', executionModuleResult.executionRecord);
      assistantReply = executionModuleResult.executionRecord?.result?.message || `Successfully executed: ${intentResult.intent}`;
      quickReplies = ['Undo action', 'View all tasks', 'Set another reminder'];
    } else {
      // info_ready (chitchat, general query, explain, search)
      assistantReply = this.generateInfoResponse(intentResult, standardInput);
      quickReplies = ['Tell me more', 'Save this to notes', 'Create task from this'];
      notify('executed', { message: assistantReply });
    }

    const totalDuration = Date.now() - startTime;
    const trace: PipelineTrace = {
      id: traceId,
      startTime,
      endTime: Date.now(),
      durationMs: totalDuration,
      stageTimings: timings,
      m1Input: standardInput,
      m2Intent: intentResult,
      m3ActionRecord: executionModuleResult.executionRecord,
    };

    return {
      trace,
      standardInput,
      intentResult,
      executionModuleResult,
      assistantReply,
      quickReplies,
      status: finalStatus,
    };
  }

  /**
   * Helper to execute an action after user approves a Confirmation Card
   */
  async approveAndExecute(
    intentResult: IntentResult,
    editedEntities: Record<string, any>,
    standardInput: StandardInput
  ) {
    const updatedIntent = {
      ...intentResult,
      entities: {
        ...intentResult.entities,
        ...editedEntities,
      },
    };

    const record = await executeAction(
      updatedIntent.intent,
      updatedIntent.entities,
      {
        approvedBy: 'user',
        risk: updatedIntent.risk,
        modality: standardInput.modality,
        inputText: standardInput.text,
        intentResult: updatedIntent,
      }
    );

    return record;
  }

  /**
   * Natural conversational responses for non-action categories
   */
  private generateInfoResponse(intentResult: IntentResult, input: StandardInput): string {
    const text = input.text.toLowerCase();

    if (intentResult.category === 'chitchat') {
      if (text.includes('who are you') || text.includes('what are you')) {
        return "I am **IntentWeave AI**, your context-aware multimodal assistant. Say it, type it, or show it — I understand your intent, verify and confirm actions with you, and then execute them reliably.";
      }
      return "Hello! I'm ready to assist you. You can type instructions, speak naturally via your microphone, or drag & drop images for visual recognition.";
    }

    if (intentResult.intent === 'calculate') {
      return `Calculated result: **${intentResult.entities.mathExpression || input.text}** is evaluated.`;
    }

    if (intentResult.intent === 'identify_object' && input.image) {
      const topObj = input.image.objects[0];
      return `### Vision Analysis Results\n\n**Scene Description**: ${input.image.caption}\n\n**Detected Objects**:\n${input.image.objects.map(o => `• **${o.label}** (${(o.confidence * 100).toFixed(0)}% confidence)`).join('\n')}\n\n${input.image.ocrText ? `**Extracted Text (OCR)**:\n\`\`\`\n${input.image.ocrText}\n\`\`\`` : ''}`;
    }

    if (intentResult.intent === 'search_web') {
      return `### Knowledge & Search Insight\n\nRegarding "**${intentResult.entities.query || input.text}**":\n\nIntentWeave utilizes context-aware multimodal reasoning. In CSA1719 Artificial Intelligence, multimodal systems integrate decoupled perceptual and cognitive representations to achieve resilient action synthesis.`;
    }

    return `I processed your request as **${intentResult.category}** (intent: \`${intentResult.intent}\`, ${(intentResult.confidence * 100).toFixed(0)}% confidence).\n\n${intentResult.reasoning}`;
  }
}

export const pipeline = new PipelineOrchestrator();
