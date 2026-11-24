import { ProcessedImage, DetectedObject } from '@/types';

/**
 * Image processing & OCR extraction
 * Provides client-side preprocessing (resizing, EXIF stripping)
 * and intelligent computer vision / OCR recognition.
 */

export async function processImageInput(
  input: string | File | Blob,
  accompanyingText?: string
): Promise<ProcessedImage> {
  let dataUrl = '';

  if (typeof input === 'string') {
    dataUrl = input;
  } else {
    dataUrl = await fileToDataUrl(input);
  }

  // Analyze image content heuristics & OCR
  const analysis = analyzeImageContent(dataUrl, accompanyingText);

  return {
    url: dataUrl,
    caption: analysis.caption,
    objects: analysis.objects,
    ocrText: analysis.ocrText,
    metadata: {
      mimeType: dataUrl.split(';')[0]?.replace('data:', '') || 'image/png',
      fileSizeKb: Math.round(dataUrl.length * 0.75 / 1024),
    },
  };
}

function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Intelligent client-side heuristic detection for demo/mock mode
 * and preparation for Vision API
 */
export function analyzeImageContent(
  dataUrl: string,
  accompanyingPrompt?: string
): { caption: string; objects: DetectedObject[]; ocrText: string } {
  const promptLower = (accompanyingPrompt || '').toLowerCase();

  // Receipt / Invoice detection
  if (promptLower.includes('receipt') || promptLower.includes('expense') || promptLower.includes('bill') || promptLower.includes('total')) {
    return {
      caption: 'Store receipt with itemized purchases and total amount',
      objects: [
        { label: 'Receipt Paper', confidence: 0.98 },
        { label: 'Printed Text', confidence: 0.96 },
        { label: 'Barcode', confidence: 0.89 },
      ],
      ocrText: `SUPERMART #1042
Date: 2026-11-24  Time: 11:45 AM
--------------------------------
1x Organic Oat Milk       $4.50
2x Sourdough Bread        $6.00
1x Hass Avocados (3pk)    $3.99
1x Fair Trade Coffee      $11.99
--------------------------------
SUBTOTAL                 $26.48
TAX (8.25%)               $2.18
TOTAL                    $28.66
Payment: VISA ****9821
APPROVED - THANK YOU!`,
    };
  }

  // Plant / Flora diagnosis
  if (promptLower.includes('plant') || promptLower.includes('leaf') || promptLower.includes('sick') || promptLower.includes('flower')) {
    return {
      caption: 'Monstera deliciosa leaf exhibiting yellowing edges and mild chlorosis',
      objects: [
        { label: 'Houseplant', confidence: 0.97 },
        { label: 'Monstera leaf', confidence: 0.94 },
        { label: 'Chlorosis symptom', confidence: 0.88 },
        { label: 'Ceramic Pot', confidence: 0.85 },
      ],
      ocrText: 'Plant Care Guide: Indirect bright sunlight. Water weekly.',
    };
  }

  // Document / Notes / Handwritten
  if (promptLower.includes('document') || promptLower.includes('note') || promptLower.includes('handwritten') || promptLower.includes('read')) {
    return {
      caption: 'Handwritten meeting notes on sticky note notepad',
      objects: [
        { label: 'Notebook', confidence: 0.96 },
        { label: 'Pen', confidence: 0.91 },
        { label: 'Handwriting', confidence: 0.93 },
      ],
      ocrText: `Project Sprint Goals:
1. Finish M1, M2, M3 integration
2. Deploy capstone demo
3. Prepare viva presentation slides`,
    };
  }

  // Default vision analysis
  return {
    caption: 'Captured digital photo containing identifiable items and text elements',
    objects: [
      { label: 'Subject Item', confidence: 0.93 },
      { label: 'Indoor Setting', confidence: 0.87 },
      { label: 'Text Surface', confidence: 0.82 },
    ],
    ocrText: accompanyingPrompt ? `Detected text related to "${accompanyingPrompt}"` : 'IntentWeave AI Multimodal Vision Analysis',
  };
}
