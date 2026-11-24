'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MessageList } from '@/components/chat/MessageList';
import { Composer } from '@/components/composer/Composer';
import { InsightPanel } from '@/components/insight/InsightPanel';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { PipelineVisualizer } from '@/components/pipeline/PipelineVisualizer';
import { useAppStore } from '@/store/useAppStore';
import { Workflow, Sparkles, HelpCircle } from 'lucide-react';

export default function AppWorkspace() {
  const { messages, activeConversationId, sendMessage } = useAppStore();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [showVisualizer, setShowVisualizer] = React.useState(false);

  // Check if first-run for onboarding
  React.useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('intentweave_onboarded');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      localStorage.setItem('intentweave_onboarded', 'true');
    }
  }, []);

  const currentMessages = messages[activeConversationId] || [];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-background">
      {/* Left Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Center Chat View */}
      <section className="flex flex-1 flex-col h-full min-w-0 bg-background relative">
        {/* Workspace Sub-header */}
        <div className="flex h-11 items-center justify-between border-b border-border/60 px-4 bg-background/50">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-foreground">Interactive Multimodal Workspace</span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">&bull; Real-time M1 &rarr; M2 &rarr; M3 Execution</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVisualizer(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-secondary hover:bg-muted text-foreground transition-colors"
            >
              <Workflow className="h-3.5 w-3.5 text-primary" />
              <span>Pipeline Visualizer</span>
            </button>

            <button
              onClick={() => setShowOnboarding(true)}
              title="Show onboarding guide"
              className="p-1 rounded-md text-muted-foreground hover:text-foreground"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <MessageList
          messages={currentMessages}
          onQuickReplySelect={(reply) => sendMessage({ text: reply })}
        />

        {/* Multimodal Input Composer */}
        <Composer />
      </section>

      {/* Right Insight Panel */}
      <div className="hidden lg:block">
        <InsightPanel />
      </div>

      {/* Modals */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      <PipelineVisualizer
        isOpen={showVisualizer}
        onClose={() => setShowVisualizer(false)}
      />
    </div>
  );
}
