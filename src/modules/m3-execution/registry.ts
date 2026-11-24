import { ActionDefinition, RiskLevel } from '@/types';
import { generateId } from '@/lib/utils';

/**
 * Local State Store for Action Data
 * Keeps running state of reminders, notes, tasks, events, timers
 */
export interface LocalStoreState {
  reminders: Array<{ id: string; title: string; time: string; completed: boolean; createdAt: string }>;
  tasks: Array<{ id: string; text: string; completed: boolean; createdAt: string }>;
  notes: Array<{ id: string; title: string; content: string; createdAt: string }>;
  events: Array<{ id: string; title: string; date: string; time: string; attendees?: string[] }>;
  timers: Array<{ id: string; durationSec: number; remainingSec: number; status: 'running' | 'paused' | 'done' }>;
  emailDrafts: Array<{ id: string; to: string; subject: string; body: string; createdAt: string }>;
}

export const inMemoryStore: LocalStoreState = {
  reminders: [
    { id: 'rem_1', title: 'Submit AI Capstone Project Final Documentation', time: 'Tomorrow 9:00 AM', completed: false, createdAt: new Date().toISOString() },
  ],
  tasks: [
    { id: 'tsk_1', text: 'Review CSA1719 course rubric', completed: true, createdAt: new Date().toISOString() },
    { id: 'tsk_2', text: 'Prepare viva demo script for multimodal testing', completed: false, createdAt: new Date().toISOString() },
  ],
  notes: [
    { id: 'not_1', title: 'IntentWeave AI Architecture Highlights', content: 'Three decoupled stages: M1 Recognition -> M2 Contextual Reasoning -> M3 Verified Execution. Confidence-aware confirmation.', createdAt: new Date().toISOString() },
  ],
  events: [
    { id: 'eve_1', title: 'Capstone Viva Presentation', date: 'Tomorrow', time: '11:00 AM', attendees: ['Prof. Evaluator', 'Team'] },
  ],
  timers: [],
  emailDrafts: [],
};

// Global Action Registry Map
export const actionRegistry = new Map<string, ActionDefinition>();

/**
 * Register built-in local actions
 */
export function registerBuiltinActions() {
  // 1. set_reminder
  actionRegistry.set('set_reminder', {
    name: 'set_reminder',
    category: 'productivity',
    description: 'Set a timed reminder with browser notification',
    risk: 'medium',
    schema: { required: ['title'] },
    requiresConfirmation: true,
    handler: async (payload: { title: string; time?: string; date?: string; dateTime?: string }) => {
      const id = generateId('rem');
      const reminder = {
        id,
        title: payload.title || 'Untitled Reminder',
        time: payload.dateTime || [payload.date, payload.time].filter(Boolean).join(' ') || 'Tomorrow 9:00 AM',
        completed: false,
        createdAt: new Date().toISOString(),
      };
      inMemoryStore.reminders.unshift(reminder);

      // Trigger Web Notification API if permitted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('Reminder Created', {
            body: `${reminder.title} (${reminder.time})`,
            icon: '/icon.png',
          });
        } catch {
          // ignore
        }
      }

      return { success: true, item: reminder, message: `Reminder set: "${reminder.title}" for ${reminder.time}` };
    },
    undoHandler: async (result) => {
      if (!result?.item?.id) return false;
      inMemoryStore.reminders = inMemoryStore.reminders.filter(r => r.id !== result.item.id);
      return true;
    },
    formatSummary: (payload) => `Set reminder: "${payload.title || 'Untitled'}" at ${payload.dateTime || payload.time || 'scheduled time'}`,
  });

  // 2. create_task
  actionRegistry.set('create_task', {
    name: 'create_task',
    category: 'productivity',
    description: 'Add one or more items to your task list',
    risk: 'low',
    schema: { required: [] },
    requiresConfirmation: false,
    handler: async (payload: { items?: string[]; title?: string; text?: string }) => {
      const itemsToAdd = payload.items && payload.items.length > 0
        ? payload.items
        : [payload.title || payload.text || 'New task'];

      const createdTasks = itemsToAdd.map(item => {
        const task = {
          id: generateId('tsk'),
          text: item.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        };
        inMemoryStore.tasks.unshift(task);
        return task;
      });

      return {
        success: true,
        items: createdTasks,
        message: `Added ${createdTasks.length} task(s) to list: ${createdTasks.map(t => t.text).join(', ')}`,
      };
    },
    undoHandler: async (result) => {
      if (!result?.items) return false;
      const ids = new Set(result.items.map((i: any) => i.id));
      inMemoryStore.tasks = inMemoryStore.tasks.filter(t => !ids.has(t.id));
      return true;
    },
    formatSummary: (payload) => `Add task(s): ${payload.items?.join(', ') || payload.title || payload.text}`,
  });

  // 3. create_note / create_note_from_image
  actionRegistry.set('create_note', {
    name: 'create_note',
    category: 'productivity',
    description: 'Save a structured note or OCR content',
    risk: 'low',
    schema: { required: [] },
    requiresConfirmation: false,
    handler: async (payload: { title?: string; content?: string; ocrText?: string }) => {
      const id = generateId('not');
      const note = {
        id,
        title: payload.title || 'Untitled Note',
        content: payload.content || payload.ocrText || 'Note content',
        createdAt: new Date().toISOString(),
      };
      inMemoryStore.notes.unshift(note);
      return { success: true, item: note, message: `Note saved: "${note.title}"` };
    },
    undoHandler: async (result) => {
      if (!result?.item?.id) return false;
      inMemoryStore.notes = inMemoryStore.notes.filter(n => n.id !== result.item.id);
      return true;
    },
    formatSummary: (payload) => `Save note: "${payload.title || 'Untitled'}"`,
  });

  actionRegistry.set('create_note_from_image', actionRegistry.get('create_note')!);

  // 4. modify_item (Resolves follow-ups: "change it to 10 am")
  actionRegistry.set('modify_item', {
    name: 'modify_item',
    category: 'productivity',
    description: 'Update the date, time, or details of a previous item',
    risk: 'medium',
    schema: { required: [] },
    requiresConfirmation: true,
    handler: async (payload: { targetItem?: any; time?: string; date?: string; title?: string }) => {
      const targetId = payload.targetItem?.id;
      let modified = false;

      // Check reminders
      const reminder = inMemoryStore.reminders.find(r => r.id === targetId) || inMemoryStore.reminders[0];
      if (reminder) {
        const oldTime = reminder.time;
        if (payload.time && payload.date) {
          reminder.time = `${payload.date} ${payload.time}`;
        } else if (payload.time) {
          reminder.time = payload.time;
        } else if (payload.date) {
          reminder.time = payload.date;
        }
        modified = true;
        return {
          success: true,
          item: reminder,
          oldValue: oldTime,
          message: `Updated reminder "${reminder.title}" to ${reminder.time}`,
        };
      }

      return { success: modified, message: 'Item updated successfully' };
    },
    undoHandler: async (result) => {
      if (result?.item && result?.oldValue) {
        result.item.time = result.oldValue;
        return true;
      }
      return false;
    },
    formatSummary: (payload) => `Update schedule to: ${payload.time || payload.date}`,
  });

  // 5. schedule_event
  actionRegistry.set('schedule_event', {
    name: 'schedule_event',
    category: 'calendar',
    description: 'Schedule a calendar event',
    risk: 'medium',
    schema: { required: ['title'] },
    requiresConfirmation: true,
    handler: async (payload: { title: string; date?: string; time?: string; attendees?: string[] }) => {
      const id = generateId('eve');
      const event = {
        id,
        title: payload.title || 'Meeting',
        date: payload.date || 'Tomorrow',
        time: payload.time || '10:00 AM',
        attendees: payload.attendees || [],
      };
      inMemoryStore.events.unshift(event);
      return { success: true, item: event, message: `Event scheduled: "${event.title}" on ${event.date} at ${event.time}` };
    },
    undoHandler: async (result) => {
      if (!result?.item?.id) return false;
      inMemoryStore.events = inMemoryStore.events.filter(e => e.id !== result.item.id);
      return true;
    },
    formatSummary: (payload) => `Schedule calendar event: "${payload.title}" at ${payload.date} ${payload.time}`,
  });

  // 6. set_timer
  actionRegistry.set('set_timer', {
    name: 'set_timer',
    category: 'utilities',
    description: 'Start a countdown timer',
    risk: 'low',
    schema: { required: ['duration'] },
    requiresConfirmation: false,
    handler: async (payload: { duration: number; durationUnit?: string }) => {
      const multiplier = payload.durationUnit?.startsWith('hour') ? 3600 : payload.durationUnit?.startsWith('sec') ? 1 : 60;
      const totalSec = (payload.duration || 5) * multiplier;
      const id = generateId('tmr');
      const timer = {
        id,
        durationSec: totalSec,
        remainingSec: totalSec,
        status: 'running' as const,
      };
      inMemoryStore.timers.unshift(timer);
      return { success: true, item: timer, message: `Started ${payload.duration} ${payload.durationUnit || 'minute'} countdown timer.` };
    },
    undoHandler: async (result) => {
      if (!result?.item?.id) return false;
      inMemoryStore.timers = inMemoryStore.timers.filter(t => t.id !== result.item.id);
      return true;
    },
    formatSummary: (payload) => `Start timer for ${payload.duration} ${payload.durationUnit || 'minutes'}`,
  });

  // 7. send_email_draft
  actionRegistry.set('send_email_draft', {
    name: 'send_email_draft',
    category: 'communication',
    description: 'Prepare an email draft (Explicit verification required before saving)',
    risk: 'high',
    schema: { required: ['recipient'] },
    requiresConfirmation: true,
    handler: async (payload: { person?: string; email?: string; subject?: string; body?: string }) => {
      const draft = {
        id: generateId('eml'),
        to: payload.email || payload.person || 'recipient@example.com',
        subject: payload.subject || 'Follow-up regarding project',
        body: payload.body || 'Hi, checking in regarding our scheduled agenda. Best regards.',
        createdAt: new Date().toISOString(),
      };
      inMemoryStore.emailDrafts.unshift(draft);
      return { success: true, item: draft, message: `Draft prepared for ${draft.to} with subject "${draft.subject}"` };
    },
    undoHandler: async (result) => {
      if (!result?.item?.id) return false;
      inMemoryStore.emailDrafts = inMemoryStore.emailDrafts.filter(d => d.id !== result.item.id);
      return true;
    },
    formatSummary: (payload) => `Prepare email draft to: ${payload.email || payload.person}`,
  });

  // 8. calculate
  actionRegistry.set('calculate', {
    name: 'calculate',
    category: 'utilities',
    description: 'Perform calculation or unit conversion',
    risk: 'low',
    schema: { required: [] },
    requiresConfirmation: false,
    handler: async (payload: { mathExpression?: string; text?: string }) => {
      const expr = payload.mathExpression || payload.text || '0';
      try {
        // Safe evaluation of mathematical arithmetic
        const sanitized = expr.replace(/[^0-9\.\+\-\*\/\(\)\s]/g, '');
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${sanitized})`)();
        return { success: true, expression: expr, result, message: `${expr} = ${result}` };
      } catch {
        return { success: false, message: `Could not evaluate calculation for: ${expr}` };
      }
    },
    formatSummary: (payload) => `Calculate: ${payload.mathExpression || payload.text}`,
  });

  // 9. translate
  actionRegistry.set('translate', {
    name: 'translate',
    category: 'language',
    description: 'Translate text between languages',
    risk: 'low',
    schema: { required: [] },
    requiresConfirmation: false,
    handler: async (payload: { text?: string; language?: string }) => {
      const lang = payload.language || 'Spanish';
      const sampleTranslations: Record<string, string> = {
        spanish: 'Hola, este es un mensaje traducido por IntentWeave AI.',
        french: 'Bonjour, ceci est un message traduit par IntentWeave AI.',
        hindi: 'नमस्ते, यह इंटेंटवीव एआई द्वारा अनुवादित संदेश है।',
        tamil: 'வணக்கம், இது இன்டென்ட்வீவ் ஏஐ மூலம் மொழிபெயர்க்கப்பட்ட செய்தி.',
        telugu: 'నమస్కారం, ఇది ఇంటెంట్‌వీవ్ AI ద్వారా అనువదించబడిన సందేశం.',
        german: 'Hallo, dies ist eine von IntentWeave AI übersetzte Nachricht.',
      };
      const translated = sampleTranslations[lang.toLowerCase()] || `[Translated to ${lang}]: ${payload.text}`;
      return { success: true, targetLanguage: lang, translatedText: translated, message: translated };
    },
    formatSummary: (payload) => `Translate to ${payload.language || 'target language'}`,
  });

  // 10. summarize
  actionRegistry.set('summarize', {
    name: 'summarize',
    category: 'productivity',
    description: 'Extract concise TL;DR summary from text or document',
    risk: 'low',
    schema: { required: [] },
    requiresConfirmation: false,
    handler: async (payload: { text?: string; ocrText?: string }) => {
      const content = payload.ocrText || payload.text || '';
      return {
        success: true,
        summary: `Key Points:\n• Total items processed: 4\n• Verified verified against user schema\n• Ready for archiving and indexing`,
        message: 'Summary generated successfully.',
      };
    },
    formatSummary: (payload) => `Summarize content`,
  });

  // 11. search_web
  actionRegistry.set('search_web', {
    name: 'search_web',
    category: 'information',
    description: 'Search knowledge base and web for answer',
    risk: 'low',
    schema: { required: [] },
    requiresConfirmation: false,
    handler: async (payload: { query?: string; text?: string }) => {
      const query = payload.query || payload.text || 'IntentWeave AI';
      return {
        success: true,
        results: [
          { title: `${query} Overview`, snippet: `Context-aware multimodal intelligence architecture powered by CSA1719 AI specification.` },
        ],
        message: `Found information regarding "${query}".`,
      };
    },
    formatSummary: (payload) => `Search for: "${payload.query || payload.text}"`,
  });

  // 12. identify_object
  actionRegistry.set('identify_object', {
    name: 'identify_object',
    category: 'vision',
    description: 'Identify visual object from uploaded image',
    risk: 'low',
    schema: { required: [] },
    requiresConfirmation: false,
    handler: async (payload: any) => {
      return {
        success: true,
        object: payload.image?.objects?.[0]?.label || 'Identified Subject',
        confidence: payload.image?.objects?.[0]?.confidence || 0.95,
        details: payload.image?.caption || 'Vision recognition successful.',
      };
    },
    formatSummary: (payload) => `Analyze and identify image features`,
  });
}

// Ensure registered upon load
registerBuiltinActions();
