'use client';

import React from 'react';
import {
  Bell,
  CheckSquare,
  FileText,
  Calendar,
  Clock,
  Calculator,
  Languages,
  Mail,
  Trash2,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function ActionsHubPage() {
  const { localStore, refreshLocalStore, setUndoToast } = useAppStore();
  const [activeTab, setActiveTab] = React.useState<
    'reminders' | 'tasks' | 'notes' | 'events' | 'timers' | 'emails'
  >('reminders');

  // Input states for adding new items manually
  const [newReminderTitle, setNewReminderTitle] = React.useState('');
  const [newReminderTime, setNewReminderTime] = React.useState('');
  const [newTaskText, setNewTaskText] = React.useState('');
  const [newNoteTitle, setNewNoteTitle] = React.useState('');
  const [newNoteContent, setNewNoteContent] = React.useState('');

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;
    localStore.reminders.unshift({
      id: `rem_${Date.now()}`,
      title: newReminderTitle,
      time: newReminderTime || 'Tomorrow 9:00 AM',
      completed: false,
      createdAt: new Date().toISOString(),
    });
    setNewReminderTitle('');
    setNewReminderTime('');
    refreshLocalStore();
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    localStore.tasks.unshift({
      id: `tsk_${Date.now()}`,
      text: newTaskText,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    setNewTaskText('');
    refreshLocalStore();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    localStore.notes.unshift({
      id: `not_${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent || 'Note content',
      createdAt: new Date().toISOString(),
    });
    setNewNoteTitle('');
    setNewNoteContent('');
    refreshLocalStore();
  };

  const toggleTask = (id: string) => {
    const task = localStore.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      refreshLocalStore();
    }
  };

  const deleteItem = (category: 'reminders' | 'tasks' | 'notes', id: string) => {
    if (category === 'reminders') {
      localStore.reminders = localStore.reminders.filter((r) => r.id !== id);
    } else if (category === 'tasks') {
      localStore.tasks = localStore.tasks.filter((t) => t.id !== id);
    } else if (category === 'notes') {
      localStore.notes = localStore.notes.filter((n) => n.id !== id);
    }
    refreshLocalStore();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Local Actions Hub</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real working data generated and managed by Module 3 (Verified Action Execution).
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {localStore.reminders.length} Reminders
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            {localStore.tasks.length} Tasks
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20">
            {localStore.notes.length} Notes
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-border text-xs font-medium">
        {[
          { key: 'reminders', label: 'Reminders', icon: Bell, count: localStore.reminders.length },
          { key: 'tasks', label: 'Tasks & Shopping', icon: CheckSquare, count: localStore.tasks.length },
          { key: 'notes', label: 'Notes & OCR', icon: FileText, count: localStore.notes.length },
          { key: 'events', label: 'Calendar Events', icon: Calendar, count: localStore.events.length },
          { key: 'timers', label: 'Timers', icon: Clock, count: localStore.timers.length },
          { key: 'emails', label: 'Email Drafts', icon: Mail, count: localStore.emailDrafts.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-background/30 text-[10px]">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="py-6">
        {/* Reminders Tab */}
        {activeTab === 'reminders' && (
          <div className="space-y-4">
            <form onSubmit={handleAddReminder} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Reminder title (e.g. Submit Capstone Project Report)"
                value={newReminderTitle}
                onChange={(e) => setNewReminderTitle(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-card text-xs text-foreground border border-border focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Time (e.g. Tomorrow 9:00 AM)"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 rounded-lg bg-card text-xs text-foreground border border-border focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {localStore.reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">{rem.title}</h4>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {rem.time}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteItem('reminders', rem.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-500 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {localStore.reminders.length === 0 && (
                <div className="col-span-2 text-center py-10 text-muted-foreground text-xs">
                  No reminders configured yet. Say "Remind me tomorrow at 9 am" in chat!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add new task or shopping item..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-card text-xs text-foreground border border-border focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Task
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {localStore.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    task.completed
                      ? 'border-border/50 bg-secondary/30 text-muted-foreground'
                      : 'border-border bg-card text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="rounded text-primary focus:ring-0"
                    />
                    <span className={`text-xs ${task.completed ? 'line-through opacity-70' : 'font-medium'}`}>
                      {task.text}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem('tasks', task.id);
                    }}
                    className="p-1.5 text-muted-foreground hover:text-red-500 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <form onSubmit={handleAddNote} className="space-y-2 p-4 rounded-xl bg-card border border-border">
              <input
                type="text"
                placeholder="Note Title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary text-xs text-foreground border border-border focus:border-primary focus:outline-none"
              />
              <textarea
                placeholder="Note Content or OCR extracted text..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-secondary text-xs text-foreground border border-border focus:border-primary focus:outline-none resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Save Note
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localStore.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground">{note.title}</h4>
                    <button
                      onClick={() => deleteItem('notes', note.id)}
                      className="p-1 text-muted-foreground hover:text-red-500 rounded"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            {localStore.events.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{ev.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {ev.date} at {ev.time}
                    </p>
                    {ev.attendees && (
                      <span className="text-[10px] text-primary">
                        Attendees: {ev.attendees.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Email Drafts Tab */}
        {activeTab === 'emails' && (
          <div className="space-y-3">
            {localStore.emailDrafts.map((em) => (
              <div
                key={em.id}
                className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">To: {em.to}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-semibold">
                    Draft Only (Not Sent)
                  </span>
                </div>
                <div className="text-xs font-medium text-primary">Subject: {em.subject}</div>
                <p className="text-xs text-muted-foreground">{em.body}</p>
              </div>
            ))}
            {localStore.emailDrafts.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-xs">
                No email drafts created yet. Try: "Draft an email to supervisor@university.edu"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
