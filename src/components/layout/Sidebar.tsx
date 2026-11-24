'use client';

import React from 'react';
import {
  Plus,
  Pin,
  MessageSquare,
  Trash2,
  Search,
  Coffee,
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
    <aside className="w-68 border-r border-border bg-secondary/30 flex flex-col h-[calc(100vh-4rem)] select-none">
      {/* New Chat Button - Pill Wireframe Style */}
      <div className="p-4">
        <button
          onClick={() => createConversation()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-coffee-soft hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          New Session
        </button>
      </div>

      {/* Search Input - Pill Shape */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-full bg-card text-xs text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Conversations List - Rounded Cards matching reference wireframe */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1.5">
        {filteredConversations.map((conv) => {
          const isActive = conv.id === activeConversationId;
          return (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs cursor-pointer transition-all ${
                isActive
                  ? 'bg-card text-primary font-semibold border border-primary/30 shadow-sm'
                  : 'text-muted-foreground hover:bg-card/70 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] ${isActive ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <MessageSquare className="h-3 w-3" />
                </div>
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
                  className="p-1 hover:text-primary rounded-full"
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
                    className="p-1 hover:text-red-500 rounded-full"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Capstone Footer Card */}
      <div className="p-4 border-t border-border bg-card/40">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-medium flex items-center gap-1.5">
            <Coffee className="h-3.5 w-3.5 text-primary" /> CSA1719 Capstone
          </span>
          <span className="px-2 py-0.5 rounded-full bg-secondary text-primary font-mono font-bold text-[10px]">
            v1.0.0
          </span>
        </div>
      </div>
    </aside>
  );
}
