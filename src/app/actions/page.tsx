'use client';

import React from 'react';
import {
  Bell,
  CheckSquare,
  FileText,
  Calendar,
  Clock,
  Mail,
  Trash2,
  Plus,
  Coffee,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function ActionsHubPage() {
  const { localStore, refreshLocalStore } = useAppStore();
  const [activeTab, setActiveTab] = React.useState<
    'reminders' | 'tasks' | 'notes' | 'events' | 'timers' | 'emails'
  >('reminders');

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
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
            <Coffee className="h-6 w-6 text-primary" /> Local Actions Hub
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real working data generated and executed by Module 3 (Verified Action Execution).
          </p>
        </div>

        {/* Quick summary badges - Pill Shapes */}
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-secondary text-primary border border-border shadow-sm">
            {localStore.reminders.length} Reminders
          </span>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-secondary text-primary border border-border shadow-sm">
            {localStore.tasks.length} Tasks
          </span>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-secondary text-primary border border-border shadow-sm">
            {localStore.notes.length} Notes
          </span>
        </div>
      </div>

      {/* Segmented Pill Tabs matching wireframe screen 3 & 4 */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-full bg-secondary border border-border text-xs font-semibold">
        {[
          { key: 'reminders', label: 'Reminders', icon: Bell, count: localStore.reminders.length },
          { key: 'tasks', label: 'Tasks', icon: CheckSquare, count: localStore.tasks.length },
          { key: 'notes', label: 'Notes & OCR', icon: FileText, count: localStore.notes.length },
          { key: 'events', label: 'Calendar', icon: Calendar, count: localStore.events.length },
          { key: 'timers', label: 'Timers', icon: Clock, count: localStore.timers.length },
          { key: 'emails', label: 'Email Drafts', icon: Mail, count: localStore.emailDrafts.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm font-bold'
                  : 'text-muted-foreground hover:bg-card hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-black/20 text-white' : 'bg-card text-foreground'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="py-2">
        {/* Reminders Tab */}
        {activeTab === 'reminders' && (
          <div className="space-y-4">
            <form onSubmit={handleAddReminder} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder="Reminder title (e.g. Submit Capstone Documentation)"
                value={newReminderTitle}
                onChange={(e) => setNewReminderTitle(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-full bg-card text-xs text-foreground border border-border focus:border-primary focus:outline-none shadow-sm"
              />
              <input
                type="text"
                placeholder="Time (e.g. Tomorrow 9:00 AM)"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className="w-full sm:w-56 px-4 py-2.5 rounded-full bg-card text-xs text-foreground border border-border focus:border-primary focus:outline-none shadow-sm"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-95 shadow-coffee-soft flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Reminder
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {localStore.reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="flex items-center justify-between p-4 rounded-3xl border border-border bg-card shadow-coffee-soft hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary border border-border shadow-sm">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{rem.title}</h4>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5 font-medium">
                        <Clock className="h-3 w-3" /> {rem.time}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteItem('reminders', rem.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 rounded-full hover:bg-secondary"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {localStore.reminders.length === 0 && (
                <div className="col-span-2 text-center py-12 text-muted-foreground text-xs">
                  No reminders configured. Say &ldquo;Remind me tomorrow at 9 am&rdquo; in chat!
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
                className="flex-1 px-4 py-2.5 rounded-full bg-card text-xs text-foreground border border-border focus:border-primary focus:outline-none shadow-sm"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-95 shadow-coffee-soft flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Task
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {localStore.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    task.completed
                      ? 'border-border bg-secondary/40 text-muted-foreground'
                      : 'border-border bg-card text-foreground shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="rounded-full text-primary focus:ring-0 h-4 w-4"
                    />
                    <span className={`text-xs ${task.completed ? 'line-through opacity-70' : 'font-semibold'}`}>
                      {task.text}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem('tasks', task.id);
                    }}
                    className="p-1.5 text-muted-foreground hover:text-red-500 rounded-full"
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
            <form onSubmit={handleAddNote} className="space-y-2.5 p-5 rounded-3xl bg-card border border-border shadow-coffee-soft">
              <input
                type="text"
                placeholder="Note Title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-secondary text-xs text-foreground border border-border focus:border-primary focus:outline-none"
              />
              <textarea
                placeholder="Note Content or OCR extracted text..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-2xl bg-secondary text-xs text-foreground border border-border focus:border-primary focus:outline-none resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-95 shadow-sm"
                >
                  Save Note
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localStore.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-3xl border border-border bg-card shadow-coffee-soft space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground">{note.title}</h4>
                    <button
                      onClick={() => deleteItem('notes', note.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 rounded-full"
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
                className="flex items-center justify-between p-4 rounded-3xl border border-border bg-card shadow-coffee-soft"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary border border-border">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{ev.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {ev.date} at {ev.time}
                    </p>
                    {ev.attendees && (
                      <span className="text-[10px] text-primary font-semibold">
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
                className="p-5 rounded-3xl border border-border bg-card shadow-coffee-soft space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">To: {em.to}</span>
                  <span className="text-[10px] px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-200 font-bold border border-amber-500/30">
                    Draft Only (Not Sent)
                  </span>
                </div>
                <div className="text-xs font-bold text-primary">Subject: {em.subject}</div>
                <p className="text-xs text-muted-foreground">{em.body}</p>
              </div>
            ))}
            {localStore.emailDrafts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-xs">
                No email drafts created yet. Try: &ldquo;Draft an email to supervisor@university.edu&rdquo;
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
