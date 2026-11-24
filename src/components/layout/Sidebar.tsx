'use client';

import React from 'react';
import {
  Plus,
  Pin,
  MessageSquare,
  Trash2,
  Tag,
  Search,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Sidebar() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    createConversation,
    deleteConversation,
    pinConversation,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 border-r border-border bg-card/40 flex flex-col h-[calc(100vh-3.5rem)] select-none">
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={() => createConversation()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow hover:opacity-90 transition-all"
        >
          <Plus className="h-4 w-4" />
          New Assistant Chat
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md bg-secondary text-xs text-foreground placeholder:text-muted-foreground border border-transparent focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        {filteredConversations.map((conv) => {
          const isActive = conv.id === activeConversationId;
          return (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`group relative flex items-center justify-between px-2.5 py-2 rounded-md text-xs cursor-pointer transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{conv.title}</span>
              </div>

              {/* Actions on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    pinConversation(conv.id);
                  }}
                  title={conv.pinned ? 'Unpin' : 'Pin'}
                  className="p-1 hover:text-primary rounded"
                >
                  <Pin className={`h-3 w-3 ${conv.pinned ? 'fill-current text-primary' : ''}`} />
                </button>
                {conversations.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    title="Delete"
                    className="p-1 hover:text-red-500 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Capstone Footer Tag */}
      <div className="p-3 border-t border-border bg-background/50">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>CSA1719 AI Capstone</span>
          <span className="font-mono text-emerald-500">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
