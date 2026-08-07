import React, { useState, useEffect } from 'react';
import { 
  TabView, 
  Language, 
  GradeTrackerState, 
  TaskItem, 
  NoteItem, 
  CustomTimerConfig, 
  StreamId 
} from './types';
import { Storage, getDefaultGradeState } from './utils/storage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/views/HomeView';
import { TasksView } from './components/views/TasksView';
import { NotesView } from './components/views/NotesView';
import { GradeTrackerView } from './components/views/GradeTrackerView';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // 1. Language State
  const [lang, setLang] = useState<Language>(() => Storage.getLanguage());

  // 2. Active Tab State
  const [activeTab, setActiveTab] = useState<TabView>('home');

  // 3. Application Data State
  const [gradeState, setGradeState] = useState<GradeTrackerState>(() => Storage.getGradeState());
  const [tasks, setTasks] = useState<TaskItem[]>(() => Storage.getTasks());
  const [notes, setNotes] = useState<NoteItem[]>(() => Storage.getNotes());
  const [timerConfig, setTimerConfig] = useState<CustomTimerConfig>(() => Storage.getTimerConfig());

  // 4. Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync RTL / LTR document direction with language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    Storage.setLanguage(lang);
  }, [lang]);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('ServiceWorker registration skipped or failed:', err);
      });
    }
  }, []);

  // Handlers for Data Updates & Real-time Persistence
  const handleUpdateGradeState = (newState: GradeTrackerState) => {
    setGradeState(newState);
    Storage.saveGradeState(newState);
  };

  const handleAddTask = (newTaskData: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const newTask: TaskItem = {
      ...newTaskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    Storage.saveTasks(updatedTasks);
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    Storage.saveTasks(updatedTasks);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const updatedSubtasks = t.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      return { ...t, subtasks: updatedSubtasks };
    });
    setTasks(updatedTasks);
    Storage.saveTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);
    Storage.saveTasks(updatedTasks);
  };

  const handleSaveNote = (noteData: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = new Date().toISOString();
    let updatedNotes: NoteItem[];

    if (noteData.id && notes.some((n) => n.id === noteData.id)) {
      updatedNotes = notes.map((n) =>
        n.id === noteData.id
          ? {
              ...n,
              title: noteData.title,
              content: noteData.content,
              subjectTag: noteData.subjectTag,
              pinned: noteData.pinned,
              updatedAt: now,
            }
          : n
      );
    } else {
      const newNote: NoteItem = {
        id: noteData.id || `note_${Date.now()}`,
        title: noteData.title,
        content: noteData.content,
        subjectTag: noteData.subjectTag,
        pinned: noteData.pinned || false,
        createdAt: now,
        updatedAt: now,
      };
      updatedNotes = [newNote, ...notes];
    }

    setNotes(updatedNotes);
    Storage.saveNotes(updatedNotes);
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setNotes(updatedNotes);
    Storage.saveNotes(updatedNotes);
  };

  const handleTogglePinNote = (noteId: string) => {
    const updatedNotes = notes.map((n) =>
      n.id === noteId ? { ...n, pinned: !n.pinned } : n
    );
    setNotes(updatedNotes);
    Storage.saveNotes(updatedNotes);
  };

  const handleUpdateTimer = (config: CustomTimerConfig) => {
    setTimerConfig(config);
    Storage.saveTimerConfig(config);
  };

  const handleStreamChange = (streamId: StreamId) => {
    const newState = getDefaultGradeState(streamId);
    setGradeState(newState);
    Storage.saveGradeState(newState);
  };

  const handleReloadData = () => {
    setGradeState(Storage.getGradeState());
    setTasks(Storage.getTasks());
    setNotes(Storage.getNotes());
    setTimerConfig(Storage.getTimerConfig());
  };

  const handleResetData = () => {
    const defaultState = getDefaultGradeState('science');
    setGradeState(defaultState);
    setTasks([]);
    setNotes([]);
    setTimerConfig(Storage.getTimerConfig());
  };

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#08181C] text-[#B3C1B4] flex flex-col selection:bg-[#446E5F] selection:text-white">
      {/* Top Bar */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container View */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-6 pb-20">
        {activeTab === 'home' && (
          <HomeView
            gradeState={gradeState}
            tasks={tasks}
            timerConfig={timerConfig}
            onUpdateTimer={handleUpdateTimer}
            onToggleTask={handleToggleTask}
            onToggleSubtask={handleToggleSubtask}
            onOpenCalculator={() => setActiveTab('track')}
            onOpenTasks={() => setActiveTab('todo')}
            lang={lang}
          />
        )}

        {activeTab === 'todo' && (
          <TasksView
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onToggleSubtask={handleToggleSubtask}
            onDeleteTask={handleDeleteTask}
            lang={lang}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            notes={notes}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePinNote}
            lang={lang}
          />
        )}

        {activeTab === 'track' && (
          <GradeTrackerView
            gradeState={gradeState}
            onUpdateGradeState={handleUpdateGradeState}
            lang={lang}
          />
        )}
      </main>

      {/* Claymorphic Bottom Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lang={lang}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Settings & Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={lang}
        onLanguageChange={setLang}
        currentStreamId={gradeState.streamId}
        onStreamChange={handleStreamChange}
        onDataReset={handleResetData}
        onDataReload={handleReloadData}
      />
    </div>
  );
}
