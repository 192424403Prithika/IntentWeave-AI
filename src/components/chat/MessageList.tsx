'use client';

import React from 'react';
import { ChatMessage } from '@/types';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: ChatMessage[];
  onQuickReplySelect?: (reply: string) => void;
}

export function MessageList({ messages, onQuickReplySelect }: MessageListProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto divide-y divide-border/20">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          onQuickReplySelect={onQuickReplySelect}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
