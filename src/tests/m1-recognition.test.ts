import { describe, it, expect } from 'vitest';
import { detectModality } from '@/modules/m1-recognition/detector';
import { recognizeInput } from '@/modules/m1-recognition';

describe('Module 1: Multimodal Command Recognition', () => {
  it('correctly identifies text modality', () => {
    const modality = detectModality({ text: 'Remind me tomorrow at 9 am' });
    expect(modality).toBe('text');
  });

  it('correctly identifies voice modality', () => {
    const modality = detectModality({ audioTranscript: 'Add milk and eggs to list' });
    expect(modality).toBe('voice');
  });

  it('correctly identifies image modality', () => {
    const modality = detectModality({ imageDataUrl: 'data:image/png;base64,sample' });
    expect(modality).toBe('image');
  });

  it('correctly identifies mixed modality when text and image co-exist', () => {
    const modality = detectModality({
      text: "What's wrong with this plant?",
      imageDataUrl: 'data:image/png;base64,sample',
    });
    expect(modality).toBe('mixed');
  });

  it('standardizes input into typed StandardInput format', async () => {
    const output = await recognizeInput({
      text: 'Remind me to submit the report tomorrow at 9 am',
    });

    expect(output).toHaveProperty('id');
    expect(output).toHaveProperty('timestamp');
    expect(output.modality).toBe('text');
    expect(output.text).toBe('Remind me to submit the report tomorrow at 9 am');
    expect(output.language).toBe('en');
  });
});
