import { ModalityType } from '@/types';
import { RawInputPayload } from './index';

/**
 * Identifies input modality: text | voice | image | mixed
 */
export function detectModality(payload: RawInputPayload): ModalityType {
  const hasText = Boolean(payload.text && payload.text.trim().length > 0);
  const hasVoice = Boolean(payload.audioBlob || payload.audioTranscript);
  const hasImage = Boolean(payload.imageFile || payload.imageDataUrl);

  const activeCount = (hasText ? 1 : 0) + (hasVoice ? 1 : 0) + (hasImage ? 1 : 0);

  if (activeCount > 1 || (hasImage && (hasText || hasVoice))) {
    return 'mixed';
  }

  if (hasImage) {
    return 'image';
  }

  if (hasVoice) {
    return 'voice';
  }

  return 'text';
}
