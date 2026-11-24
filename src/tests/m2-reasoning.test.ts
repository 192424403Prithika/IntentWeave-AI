import { describe, it, expect } from 'vitest';
import { extractEntities } from '@/modules/m2-reasoning/entity-extractor';
import { detectIntent } from '@/modules/m2-reasoning/intent-detector';
import { reasonIntent } from '@/modules/m2-reasoning';
import { StandardInput } from '@/types';

describe('Module 2: Contextual Intent Reasoning', () => {
  it('extracts temporal entities (date and time) accurately', () => {
    const entities = extractEntities('Remind me to submit the report tomorrow at 9 am');
    expect(entities.date).toBe('tomorrow');
    expect(entities.time).toBe('9 am');
  });

  it('extracts list items from shopping instructions', () => {
    const entities = extractEntities('Add milk and eggs to my shopping list');
    expect(entities.items).toContain('milk');
    expect(entities.items).toContain('eggs');
  });

  it('classifies reminder intent with medium risk', () => {
    const classification = detectIntent('Remind me to submit report tomorrow at 9 am');
    expect(classification.intent).toBe('set_reminder');
    expect(classification.category).toBe('action');
    expect(classification.risk).toBe('medium');
    expect(classification.confidence).toBeGreaterThan(0.9);
  });

  it('resolves anaphora follow-up reference ("change it to 10 am")', async () => {
    const mockInput: StandardInput = {
      id: 'inp_1',
      timestamp: new Date().toISOString(),
      modality: 'text',
      text: 'Change it to 10 am',
      language: 'en',
    };

    const result = await reasonIntent(mockInput, {
      history: [
        {
          role: 'user',
          content: 'Remind me to submit the report tomorrow at 9 am',
        },
        {
          role: 'assistant',
          content: 'Reminder set for 9 am',
          actionRecord: {
            id: 'rem_123',
            actionName: 'set_reminder',
            payload: { title: 'submit the report', time: 'tomorrow at 9 am' },
          },
        },
      ],
    });

    expect(result.intent).toBe('modify_item');
    expect(result.resolvedReferences.length).toBeGreaterThan(0);
    expect(result.resolvedReferences[0].phrase).toBe('it');
    expect(result.entities.time).toBe('10 am');
  });

  it('flags ambiguous deletion for targeted clarification', async () => {
    const mockInput: StandardInput = {
      id: 'inp_del',
      timestamp: new Date().toISOString(),
      modality: 'text',
      text: 'Delete that',
      language: 'en',
    };

    const result = await reasonIntent(mockInput);
    expect(result.intent).toBe('delete_ambiguous');
    expect(result.category).toBe('clarification');
    expect(result.missingSlots).toContain('specificTarget');
  });
});
