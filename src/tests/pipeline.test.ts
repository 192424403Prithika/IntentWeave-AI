import { describe, it, expect } from 'vitest';
import { pipeline } from '@/pipeline';

describe('Pipeline Orchestrator (M1 -> M2 -> M3 Integration)', () => {
  it('runs complete pipeline flow from text input to verified execution', async () => {
    const stagesVisited: string[] = [];

    const output = await pipeline.run(
      {
        text: 'Add milk and eggs to my shopping list',
      },
      {
        settings: { confirmationStrictness: 'smart' },
        onStageChange: (stage) => {
          stagesVisited.push(stage);
        },
      }
    );

    expect(stagesVisited).toContain('understood');
    expect(stagesVisited).toContain('reasoned');
    expect(stagesVisited).toContain('verified');
    expect(stagesVisited).toContain('executed');

    expect(output.standardInput.modality).toBe('text');
    expect(output.intentResult.intent).toBe('create_task');
    expect(output.executionModuleResult.executionRecord?.status).toBe('done');
    expect(output.trace.stageTimings.m1_recognition_ms).toBeDefined();
    expect(output.trace.stageTimings.m2_reasoning_ms).toBeDefined();
    expect(output.trace.stageTimings.m3_verification_ms).toBeDefined();
  });
});
