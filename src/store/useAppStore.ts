import { create } from 'zustand';
import {
  ChatMessage,
  Conversation,
  IntentResult,
  PipelineStage,
  PipelineTrace,
  Settings,
  StandardInput,
  UserMemoryItem,
  ActionExecutionRecord,
} from '@/types';
import { generateId } from '@/lib/utils';
import { pipeline } from '@/pipeline';
import { inMemoryStore } from '@/modules/m3-execution/registry';
import { undoAction } from '@/modules/m3-execution/executor';

export interface AppState {
  // Theme & Settings
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;

  // Conversations
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversation: (id: string) => void;
  createConversation: (title?: string) => string;
  deleteConversation: (id: string) => void;
  pinConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;

  // Messages
  messages: Record<string, ChatMessage[]>; // keyed by conversationId
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<ChatMessage>) => void;

  // Active Pipeline
  currentStage: PipelineStage;
  activeTrace: PipelineTrace | null;
  activeConfirmation: {
    messageId: string;
    conversationId: string;
    intentResult: IntentResult;
    standardInput: StandardInput;
    editableFields: Array<{ key: string; label: string; value: any; type: string }>;
  } | null;

  // User Memory
  memories: UserMemoryItem[];
  addMemory: (key: string, value: string, category?: UserMemoryItem['category']) => void;
  deleteMemory: (id: string) => void;
  clearAllMemories: () => void;

  // Local Actions Store Sync
  localStore: typeof inMemoryStore;
  refreshLocalStore: () => void;

  // Undo Toast
  undoToast: {
    visible: boolean;
    record: ActionExecutionRecord | null;
    timeLeftSec: number;
  } | null;
  setUndoToast: (toast: AppState['undoToast']) => void;
  triggerUndo: () => Promise<boolean>;

  // Pipeline Actions
  sendMessage: (payload: { text?: string; audioBlob?: Blob; audioTranscript?: string; imageFile?: File; imageDataUrl?: string }) => Promise<void>;
  approveAction: (editedEntities?: Record<string, any>) => Promise<void>;
  cancelAction: () => void;
}

const defaultSettings: Settings = {
  theme: 'dark',
  demoMode: true,
  model: 'mock-engine',
  confirmationStrictness: 'smart',
  voiceRecognitionLang: 'en-US',
  ttsVoice: 'default',
  ttsSpeed: 1.0,
  ttsAutoPlay: false,
  handsFreeMode: false,
  piiMasking: false,
  maxContextTurns: 10,
  hapticFeedback: true,
  highContrast: false,
  reducedMotion: false,
};

const initialConversationId = 'conv_default';

const initialConversations: Conversation[] = [
  {
    id: initialConversationId,
    title: 'Multimodal Capstone Demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pinned: true,
    tags: ['capstone', 'csa1719'],
    summary: 'Testing M1 recognition, M2 intent reasoning, and M3 verified action execution.',
    messageCount: 2,
  },
];

const initialMessages: Record<string, ChatMessage[]> = {
  conv_default: [
    {
      id: 'msg_welcome',
      conversationId: 'conv_default',
      role: 'assistant',
      content: `### Welcome to IntentWeave AI
**"Say it, type it, or show it. IntentWeave understands, confirms, then acts."**

I am built as three decoupled, testable modules:
1. **Module 1**: Multimodal Recognition (Text, Voice transcripts, Image OCR & Vision)
2. **Module 2**: Contextual Intent Reasoning (Resolves entities, context & follow-ups)
3. **Module 3**: Verified Action Execution (Schema validation, confirmation cards & audit trail)

Try one of the prompts below or speak / upload an image to begin!`,
      timestamp: new Date().toISOString(),
      modality: 'text',
      quickReplies: [
        'Remind me to submit the report tomorrow at 9 am',
        'Add milk and eggs to my shopping list',
        'Change it to 10 am',
        'Delete that',
      ],
    },
  ],
};

const initialMemories: UserMemoryItem[] = [
  {
    id: 'mem_1',
    key: 'Course Name',
    value: 'CSA1719 – Artificial Intelligence',
    category: 'entity',
    source: 'system',
    confidence: 1.0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_2',
    key: 'Preferred Confirmation Strictness',
    value: 'Smart (Auto-confirm low-risk actions; prompt for medium/high-risk)',
    category: 'preference',
    source: 'user',
    confidence: 0.95,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  settings: defaultSettings,
  updateSettings: (newSettings) =>
    set((state) => {
      const merged = { ...state.settings, ...newSettings };
      if (typeof window !== 'undefined') {
        if (merged.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { settings: merged };
    }),

  conversations: initialConversations,
  activeConversationId: initialConversationId,
  setActiveConversation: (id) => set({ activeConversationId: id }),

  createConversation: (title = 'New Assistant Session') => {
    const id = generateId('conv');
    const newConv: Conversation = {
      id,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };
    set((state) => ({
      conversations: [newConv, ...state.conversations],
      activeConversationId: id,
      messages: { ...state.messages, [id]: [] },
    }));
    return id;
  },

  deleteConversation: (id) =>
    set((state) => {
      const filtered = state.conversations.filter((c) => c.id !== id);
      const nextActive = filtered[0]?.id || '';
      return {
        conversations: filtered,
        activeConversationId: nextActive,
      };
    }),

  pinConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, pinned: !c.pinned } : c
      ),
    })),

  renameConversation: (id, newTitle) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title: newTitle } : c
      ),
    })),

  messages: initialMessages,
  addMessage: (conversationId, message) =>
    set((state) => {
      const convMsgs = state.messages[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...convMsgs, message],
        },
      };
    }),

  updateMessage: (conversationId, messageId, updates) =>
    set((state) => {
      const convMsgs = state.messages[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: convMsgs.map((m) =>
            m.id === messageId ? { ...m, ...updates } : m
          ),
        },
      };
    }),

  currentStage: 'idle',
  activeTrace: null,
  activeConfirmation: null,

  memories: initialMemories,
  addMemory: (key, value, category = 'entity') =>
    set((state) => ({
      memories: [
        {
          id: generateId('mem'),
          key,
          value,
          category,
          source: 'conversation',
          confidence: 0.9,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...state.memories,
      ],
    })),

  deleteMemory: (id) =>
    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id),
    })),

  clearAllMemories: () => set({ memories: [] }),

  localStore: inMemoryStore,
  refreshLocalStore: () => set({ localStore: { ...inMemoryStore } }),

  undoToast: null,
  setUndoToast: (toast) => set({ undoToast: toast }),

  triggerUndo: async () => {
    const { undoToast, refreshLocalStore } = get();
    if (!undoToast?.record) return false;
    const success = await undoAction(undoToast.record);
    if (success) {
      refreshLocalStore();
      set({ undoToast: null });
    }
    return success;
  },

  sendMessage: async (payload) => {
    const { activeConversationId, messages, settings, memories, addMessage, updateSettings } = get();
    const convId = activeConversationId;
    const convHistory = messages[convId] || [];

    // Format user message
    const userMsgId = generateId('usr_msg');
    let modality: ChatMessage['modality'] = 'text';
    if (payload.imageDataUrl || payload.imageFile) {
      modality = (payload.text || payload.audioTranscript) ? 'mixed' : 'image';
    } else if (payload.audioBlob || payload.audioTranscript) {
      modality = 'voice';
    }

    const attachments: ChatMessage['attachments'] = [];
    if (payload.imageDataUrl) {
      attachments.push({
        type: 'image',
        url: payload.imageDataUrl,
      });
    }

    const userMessage: ChatMessage = {
      id: userMsgId,
      conversationId: convId,
      role: 'user',
      content: payload.text || payload.audioTranscript || (payload.imageDataUrl ? '[Uploaded Image]' : ''),
      timestamp: new Date().toISOString(),
      modality,
      attachments: attachments.length > 0 ? attachments : undefined,
    };
    addMessage(convId, userMessage);

    // Set initial pipeline stage
    set({ currentStage: 'idle', activeConfirmation: null });

    // Build context history for Module 2
    const historyTurns = convHistory.slice(-settings.maxContextTurns).map((m) => ({
      role: m.role,
      content: m.content,
      intentResult: m.intentResult,
      actionRecord: m.actionRecord,
      timestamp: m.timestamp,
    }));

    // Run orchestrator
    try {
      const output = await pipeline.run(payload, {
        history: historyTurns,
        userMemories: memories,
        settings,
        onStageChange: (stage, data) => {
          set({ currentStage: stage });
        },
      });

      set({ activeTrace: output.trace });

      // Create assistant reply message
      const assistantMsgId = generateId('asst_msg');
      const assistantMessage: ChatMessage = {
        id: assistantMsgId,
        conversationId: convId,
        role: 'assistant',
        content: output.assistantReply,
        timestamp: new Date().toISOString(),
        modality: output.standardInput.modality,
        standardInput: output.standardInput,
        intentResult: output.intentResult,
        actionRecord: output.executionModuleResult.executionRecord,
        pipelineTrace: output.trace,
        quickReplies: output.quickReplies,
      };
      addMessage(convId, assistantMessage);

      // Refresh in-memory store so UI updates immediately
      get().refreshLocalStore();

      // If confirmation is required, mount confirmation card
      if (output.status === 'awaiting_confirmation') {
        const editableFields = output.executionModuleResult.confirmationDecision?.editableFields || [];
        set({
          activeConfirmation: {
            messageId: assistantMsgId,
            conversationId: convId,
            intentResult: output.intentResult,
            standardInput: output.standardInput,
            editableFields,
          },
        });
      }

      // If action was executed, show 10-second Undo Toast
      if (output.executionModuleResult.executionRecord?.status === 'done') {
        const record = output.executionModuleResult.executionRecord;
        set({
          undoToast: {
            visible: true,
            record,
            timeLeftSec: 10,
          },
        });
      }

      // Audio feedback if TTS enabled
      if (settings.ttsAutoPlay && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(output.assistantReply.replace(/[*#`_]/g, ''));
          utterance.rate = settings.ttsSpeed;
          window.speechSynthesis.speak(utterance);
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      set({ currentStage: 'error' });
      addMessage(convId, {
        id: generateId('err_msg'),
        conversationId: convId,
        role: 'assistant',
        content: `Error in pipeline processing: ${err.message || 'An unexpected failure occurred'}`,
        timestamp: new Date().toISOString(),
        modality: 'text',
        status: 'error',
      });
    }
  },

  approveAction: async (editedEntities = {}) => {
    const { activeConfirmation, activeConversationId, refreshLocalStore, updateMessage } = get();
    if (!activeConfirmation) return;

    try {
      const record = await pipeline.approveAndExecute(
        activeConfirmation.intentResult,
        editedEntities,
        activeConfirmation.standardInput
      );

      refreshLocalStore();

      // Update assistant message with execution confirmation
      updateMessage(activeConfirmation.conversationId, activeConfirmation.messageId, {
        content: `Action approved and executed: **${record.result?.message || record.actionName}**`,
        actionRecord: record,
      });

      // Show Undo Toast
      set({
        activeConfirmation: null,
        currentStage: 'executed',
        undoToast: {
          visible: true,
          record,
          timeLeftSec: 10,
        },
      });
    } catch (err: any) {
      set({ currentStage: 'error' });
    }
  },

  cancelAction: () => {
    const { activeConfirmation, updateMessage } = get();
    if (!activeConfirmation) return;

    updateMessage(activeConfirmation.conversationId, activeConfirmation.messageId, {
      content: `Action cancelled by user. No modifications were made.`,
    });

    set({ activeConfirmation: null, currentStage: 'idle' });
  },
}));
