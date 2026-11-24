/**
 * Entity Extractor for Module 2
 * Extracts dates, times, people, places, quantities, email addresses, and items.
 */

export interface ExtractedEntities {
  dateTime?: string;
  date?: string;
  time?: string;
  target?: string;
  person?: string;
  email?: string;
  items?: string[];
  quantity?: number;
  location?: string;
  language?: string;
  query?: string;
  mathExpression?: string;
  duration?: number;
  durationUnit?: string;
  title?: string;
  notes?: string;
  [key: string]: any;
}

export function extractEntities(text: string, context?: any): ExtractedEntities {
  const entities: ExtractedEntities = {};
  if (!text) return entities;

  const lower = text.toLowerCase();

  // 1. Time extraction: "at 9 am", "at 10:30pm", "at 6", "tomorrow morning", "at 10 am"
  const timeRegex = /\b(?:at\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm)|\d{1,2}\s*(?:am|pm)|(?:at\s+(\d{1,2})(?::(\d{2}))?))\b/i;
  const timeMatch = text.match(timeRegex);
  if (timeMatch) {
    entities.time = timeMatch[0].replace(/^at\s+/i, '').trim();
  }

  // 2. Relative date extraction: "tomorrow", "today", "next Friday", "on Monday"
  if (lower.includes('tomorrow')) {
    entities.date = 'tomorrow';
  } else if (lower.includes('today') || lower.includes('tonight')) {
    entities.date = 'today';
  } else {
    const dayMatch = lower.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
    if (dayMatch) {
      entities.date = dayMatch[1];
    }
  }

  if (entities.date || entities.time) {
    entities.dateTime = [entities.date, entities.time].filter(Boolean).join(' ');
  }

  // 3. Email extraction
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    entities.email = emailMatch[1];
  }

  // 4. Person name extraction ("to mom", "to John Doe", "call Sarah")
  const personMatch = text.match(/\b(?:to|call|email|meet|with|text)\s+([A-Z][a-z]+|\bmom\b|\bdad\b|\bboss\b|\bdoctor\b)/i);
  if (personMatch) {
    entities.person = personMatch[1];
  }

  // 5. Items extraction (for shopping lists, tasks: "add milk and eggs", "buy groceries")
  const addItemsMatch = text.match(/\b(?:add|buy|get|purchase)\s+(.*?)(?:\s+to\s+my|\s+to\s+the|\s+in\s+my|$)/i);
  if (addItemsMatch && addItemsMatch[1]) {
    const rawItems = addItemsMatch[1].replace(/\b(?:and)\b/g, ',');
    entities.items = rawItems.split(',').map(s => s.trim()).filter(Boolean);
  }

  // 6. Math expression extraction ("calculate 25 * 4", "what is 15% of 240", "120 / 4")
  const mathRegex = /(?:calculate|what is|compute)?\s*([0-9\.\s\+\-\*\/\(\)\^\%]+(?:\s*(?:plus|minus|times|divided by|\% of)\s*[0-9\.]+)*)/i;
  if (/[\+\-\*\/\%]/.test(text) || lower.includes('calculate') || lower.includes('plus') || lower.includes('minus')) {
    const match = text.match(mathRegex);
    if (match && match[1] && match[1].trim().length > 1) {
      entities.mathExpression = match[1].trim();
    }
  }

  // 7. Timer duration ("for 5 minutes", "10 min timer", "set a timer for 15 minutes")
  const durationMatch = text.match(/(\d+)\s*(seconds?|secs?|minutes?|mins?|hours?|hrs?)/i);
  if (durationMatch) {
    entities.duration = parseInt(durationMatch[1], 10);
    entities.durationUnit = durationMatch[2].toLowerCase();
  }

  // 8. Translation target language ("translate ... to Spanish / French / Hindi")
  const translateMatch = text.match(/\b(?:in|into|to)\s+(spanish|french|german|hindi|tamil|telugu|japanese|chinese|italian|russian|portuguese)\b/i);
  if (translateMatch) {
    entities.language = translateMatch[1].toLowerCase();
  }

  // 9. Reminder / Task subject title
  const remindActionMatch = text.match(/remind me\s+(?:to\s+)?(.*?)(?:\s+(?:tomorrow|today|at|on|next|\bin\b)|$)/i);
  if (remindActionMatch && remindActionMatch[1]) {
    entities.title = remindActionMatch[1].trim();
  } else if (!entities.title && (lower.includes('todo') || lower.includes('task') || lower.includes('note'))) {
    const noteMatch = text.match(/(?:note|task|todo):\s*(.*)/i) || text.match(/(?:create|add|take|save)\s+(?:a\s+)?(?:note|task)\s+(?:about|for|to)?\s*(.*)/i);
    if (noteMatch && noteMatch[1]) {
      entities.title = noteMatch[1].trim();
    }
  }

  return entities;
}
