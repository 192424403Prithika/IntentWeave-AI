import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { UndoToast } from '@/components/common/UndoToast';

export const metadata: Metadata = {
  title: 'IntentWeave AI – Context-Aware Multimodal Assistant',
  description:
    'Say it, type it, or show it. IntentWeave understands, confirms, then acts. A production-grade multimodal assistant built with decoupled recognition, reasoning, and verified execution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <UndoToast />
        </div>
      </body>
    </html>
  );
}
