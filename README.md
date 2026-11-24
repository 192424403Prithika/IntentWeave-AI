# IntentWeave AI: A Context-Aware Multimodal Assistant

> **"Say it, type it, or show it. IntentWeave understands, confirms, then acts."**  
> *Capstone Project for Course CSA1719 – Artificial Intelligence*

IntentWeave AI is a production-grade, context-aware multimodal assistant engineered with a **strictly decoupled three-module architecture**. The assistant ingests user intent expressed through **text, spoken voice, or uploaded images**, resolves context and conversational anaphora (e.g., *"change it to 10 am"*), verifies action requests against strict Zod schemas, and presents interactive, risk-aware **Confirmation Cards** before safely executing actions.

---

## Architecture Overview

IntentWeave enforces a clear unidirectional pipeline (`pipeline.run(input, context)`):

```
       [ Text ]       [ Voice / Web Speech ]       [ Images / Camera OCR ]
           │                     │                            │
           └─────────────────────┼────────────────────────────┘
                                 ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  MODULE 1: Multimodal Command Recognition (M1)               │
    │  • Modality detection (text | voice | image | mixed)         │
    │  • Web Speech API interim transcript / audio duration        │
    │  • Canvas EXIF stripping, OCR text extraction, vision scene   │
    │  &rarr; Emits: StandardInput                                 │
    └────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  MODULE 2: Contextual Intent Reasoning (M2)                  │
    │  • Entity extraction (dates, times, items, recipients, math) │
    │  • Intent & category classification + confidence estimation  │
    │  • Anaphora resolution across turn history & memory graph    │
    │  • Slot completeness & explainable reasoning                 │
    │  &rarr; Emits: IntentResult                                  │
    └────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  MODULE 3: Verified Action Execution (M3)                    │
    │  • Typed action registry with schema validation              │
    │  • Confirmation policy (Low-risk auto-run vs. Confirm Cards) │
    │  • Targeted clarification prompts for missing slots          │
    │  • Action execution, 10s rollback/undo, immutable audit log  │
    │  &rarr; Emits: ActionExecutionRecord + AuditLogEntry         │
    └──────────────────────────────────────────────────────────────┘
```

---

## Core Modules & Typed Contracts

### Module 1 — Multimodal Command Recognition (`src/modules/m1-recognition`)
Normalizes all raw sensory inputs into a standardized representation:
```typescript
type StandardInput = {
  id: string;
  timestamp: string;
  modality: "text" | "voice" | "image" | "mixed";
  text: string;                 // typed text or transcript
  transcriptConfidence?: number;
  image?: {
    url: string;
    caption: string;
    objects: { label: string; confidence: number }[];
    ocrText?: string;
  };
  language: string;
};
```

### Module 2 — Contextual Intent Reasoning (`src/modules/m2-reasoning`)
Analyzes the `StandardInput` using the conversation context window and user memory graph:
```typescript
type IntentResult = {
  intent: string;
  category: "information" | "explanation" | "action" | "clarification" | "chitchat";
  confidence: number;            // 0.0 – 1.0
  entities: Record<string, any>;
  resolvedReferences: { phrase: string; resolvedTo: string }[];
  missingSlots: string[];        // missing fields requiring clarification
  risk: "low" | "medium" | "high";
  reasoning: string;             // human-friendly explanation of why
};
```

### Module 3 — Verified Action Execution (`src/modules/m3-execution`)
Validates intents against an action registry, manages signature Confirmation Cards, and coordinates reversible execution:
- **Low-risk actions** (e.g., adding to-dos, calculators, searches) can auto-run when enabled in settings.
- **Medium/High-risk actions** (e.g., reminders, events, email drafts, deletions) require confirmation.
- **10-Second Undo Window**: Every executed action provides an undo rollback toast.

---

## Pages & Feature Matrix

| Route | Page | Key Features |
|---|---|---|
| `/` | **Landing Page** | Product promise, animated pipeline preview, 3-module breakdown, interactive mini-demo, technical FAQ. |
| `/app` | **Assistant Workspace** | 3-pane responsive layout: conversation sidebar, streaming chat thread, multiline composer (mic, webcam, file upload), signature **Confirmation Card**, and collapsible **"How I understood this"** pipeline insight panel. |
| `/actions` | **Actions Hub** | Working local state manager for Reminders, Tasks, Notes, Calendar Events, Timers, and Email Drafts. |
| `/insights` | **Audit Trail & Analytics** | Immutable execution log table with filtering and CSV/JSON export; Recharts charts for modality mix and module latencies. |
| `/memory` | **Memory & Context** | Persistent user entity/habit graph, context window slider (3 to 25 turns), and "Forget everything" button. |
| `/evaluate` | **Evaluation Test Bench** | Built-in test harness with **30 multimodal test cases** testing intent accuracy, anaphora resolution, and safety guards (designed for capstone viva/presentation). |
| `/settings` | **Settings** | Strictness policy toggle (*Smart* / *Always Ask* / *Auto-run safe*), Demo Mode toggle, speech synthesis speed, and shortcuts. |

---

## Getting Started

### Prerequisites
- Node.js `v18.0+` or `v20.0+` (Tested on Node `v24.13.1`)
- Package manager: `pnpm` (recommended) or `npm`

### Installation
```bash
# Clone the repository and navigate into the workspace
git clone https://github.com/your-username/intentweave-ai.git
cd intentweave-ai

# Install dependencies
pnpm install
```

### Running Locally
```bash
# Start Next.js development server
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> **Zero API Keys Required**: IntentWeave ships with a deterministic **Demo Mode** enabled by default. It runs locally in the browser with Web Speech API, image OCR simulation, and context resolution out of the box!

### Running Unit Tests
```bash
pnpm test
```
Runs the 14 Vitest unit tests verifying Module 1, Module 2, Module 3, and the Pipeline Orchestrator.

### Building for Production
```bash
pnpm run build
pnpm start
```

---

## Demo Script for Viva & Presentation

Follow this sequence to demonstrate end-to-end multimodal intelligence:

1. **Typing Command (Single Action)**:
   - Type: *"Remind me to submit the report tomorrow at 9 am"*
   - **Observed**: Modality detected as `text` &rarr; Intent `set_reminder` &rarr; Interactive Confirmation Card displayed &rarr; User clicks **Approve & Execute** &rarr; Reminder added to store with 10s undo toast.
2. **Voice Recognition Command**:
   - Tap mic and speak (or type transcript): *"Add milk and eggs to my shopping list"*
   - **Observed**: Modality detected as `voice` &rarr; Intent `create_task` &rarr; Low-risk action auto-executed &rarr; Tasks added to Actions Hub.
3. **Multimodal Vision & OCR**:
   - Upload receipt photo or prompt: *"Save these items in a note"* with image attached.
   - **Observed**: Modality `image` &rarr; OCR text extracted &rarr; Structured note created.
4. **Context & Anaphora Follow-up**:
   - Type: *"Change it to 10 am"*
   - **Observed**: Module 2 resolves `"it"` to the previous reminder (`"submit the report"`) &rarr; Updates time to 10:00 AM.
5. **Ambiguous Command & Targeted Clarification**:
   - Type: *"Delete that"*
   - **Observed**: Confidence drops below threshold &rarr; Assistant triggers a targeted follow-up question with tappable options instead of hallucinating.
6. **Evaluation Test Bench**:
   - Visit `/evaluate` and click **"Run All 30 Tests"** &rarr; Live progress bar verifies benchmark accuracy across all 30 test cases.

---

## Environment Variables (Optional)

Create a `.env.local` file if you wish to connect external LLM providers:
```env
# Optional external provider keys (leave empty to use built-in Demo Mode)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

---

## Academic Accreditation

- **Course**: CSA1719 – Artificial Intelligence
- **Project Title**: IntentWeave AI: A Context-Aware Multimodal Assistant
- **Framework**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Zustand + Recharts + Vitest
