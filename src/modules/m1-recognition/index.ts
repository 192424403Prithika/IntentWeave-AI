import { ModalityType, ProcessedImage, StandardInput } from '@/types';
import { generateId } from '@/lib/utils';
import { detectModality } from './detector';
import { processImageInput } from './vision';
import { processAudioInput } from './speech';

export interface RawInputPayload {
  text?: string;
  audioBlob?: Blob;
  audioTranscript?: string;
  transcriptConfidence?: number;
  imageFile?: File | Blob;
  imageDataUrl?: string;
  language?: string;
}

/**
 * Module 1: Multimodal Command Recognition
 * Ingests text, speech/audio, and image payloads, identifies modality,
 * performs necessary speech/vision analysis, and standardizes output.
 */
export async function recognizeInput(payload: RawInputPayload): Promise<StandardInput> {
  const modality: ModalityType = detectModality(payload);
  const language = payload.language || 'en';

  let text = (payload.text || '').trim();
  let transcriptConfidence = payload.transcriptConfidence;
  let processedImage: ProcessedImage | undefined = undefined;

  // Process image if present
  if (payload.imageDataUrl || payload.imageFile) {
    processedImage = await processImageInput(payload.imageDataUrl || payload.imageFile!, text);
  }

  // Process audio if audioBlob is provided and text wasn't already supplied
  if (payload.audioBlob && !text) {
    const speechResult = await processAudioInput(payload.audioBlob, language);
    text = speechResult.text;
    transcriptConfidence = speechResult.confidence;
  } else if (payload.audioTranscript && !text) {
    text = payload.audioTranscript;
    transcriptConfidence = payload.transcriptConfidence ?? 0.95;
  }

  // Standardize output
  const standardInput: StandardInput = {
    id: generateId('input'),
    timestamp: new Date().toISOString(),
    modality,
    text,
    transcriptConfidence,
    image: processedImage,
    language,
    rawInput: {
      hasText: Boolean(payload.text),
      hasAudio: Boolean(payload.audioBlob || payload.audioTranscript),
      hasImage: Boolean(payload.imageDataUrl || payload.imageFile),
    },
  };

  return standardInput;
}

export * from './detector';
export * from './speech';
export * from './vision';
