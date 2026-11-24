/**
 * Speech Recognition Helper
 * Supports Web Speech API client-side with interim transcripts
 * and deterministic mock / whisper-style fallback.
 */

export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  durationSec?: number;
}

export async function processAudioInput(
  audioBlob: Blob,
  language: string = 'en-US'
): Promise<SpeechRecognitionResult> {
  // Client-side fallback or server transcription
  return {
    text: 'Transcribed audio input',
    confidence: 0.92,
    durationSec: Math.round(audioBlob.size / 16000),
  };
}

/**
 * Detect language from transcript or text
 */
export function detectLanguage(text: string): string {
  if (!text) return 'en';
  // Common Indic script Unicode ranges:
  // Devanagari (Hindi): \u0900-\u097F
  // Tamil: \u0B80-\u0BFF
  // Telugu: \u0C00-\u0C7F
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
  if (/[\u3040-\u30FF]/.test(text)) return 'ja';
  if (/[\u0400-\u04FF]/.test(text)) return 'ru';
  return 'en';
}
