import { GradeTrackerState, TaskItem, NoteItem, CustomTimerConfig, Language, StreamId } from '../types';
import { ALGERIAN_STREAMS } from '../constants/algerianStreams';

const STORAGE_KEYS = {
  GRADE_STATE: 'scholar_grade_state_v1',
  TASKS: 'scholar_tasks_v1',
  NOTES: 'scholar_notes_v1',
  TIMER: 'scholar_timer_v1',
  LANGUAGE: 'scholar_language_v1',
};

// Default Initial Grade Tracker State
export function getDefaultGradeState(streamId: StreamId = 'science'): GradeTrackerState {
  const stream = ALGERIAN_STREAMS.find(s => s.id === streamId) || ALGERIAN_STREAMS[0];
  
  const defaultSubjects = stream.defaultSubjects.map(sub => ({
    ...sub,
    evaluation: null,
    test: null,
    exam: null,
    calculatedAverage: null,
  }));

  return {
    streamId: stream.id,
    trimesters: {
      1: { subjects: JSON.parse(JSON.stringify(defaultSubjects)) },
      2: { subjects: JSON.parse(JSON.stringify(defaultSubjects)) },
      3: { subjects: JSON.parse(JSON.stringify(defaultSubjects)) },
    },
    currentTrimester: 1,
    targetGpa: 15.0,
    lastCalculatedGpa: null,
    lastSavedAt: new Date().toISOString(),
  };
}

// Default Tasks
const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 'default_task_1',
    title: 'مراجعة درس العلوم الفيزيائية (الأكسدة والإرجاع)',
    subjectName: 'العلوم الفيزيائية',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
    priority: 'high',
    category: 'revision',
    completed: false,
    subtasks: [
      { id: 'st1', title: 'قراءة الملخص وكتابة القوانين', completed: true },
      { id: 'st2', title: 'حل تمرين البكالوريا 2023', completed: false }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default_task_2',
    title: 'تحضير تمرين الرياضيات ص 120 رقم 45',
    subjectName: 'الرياضيات',
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    priority: 'medium',
    category: 'homework',
    completed: false,
    subtasks: [],
    createdAt: new Date().toISOString(),
  }
];

// Default Notes
const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'default_note_1',
    title: 'ملخص مهم - قوانين الرياضيات (الدوال والاشتقاق)',
    subjectTag: 'الرياضيات',
    content: `• مشتقة (u * v) = u'v + uv'
• مشتقة (u / v) = (u'v - uv') / v²
• المعادلة التماسية: y = f'(x0)(x - x0) + f(x0)
• تذكر دائماً دراسة مجال التعريف قبل البدء في الاشتقاق!`,
    pinned: true,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
];

// Default Timer
const DEFAULT_TIMER: CustomTimerConfig = {
  studyMinutes: 45,
  restMinutes: 15,
  mode: 'study',
  remainingSeconds: 45 * 60,
  isRunning: false,
  soundEnabled: true,
};

// Safe Storage Wrappers
export const Storage = {
  getLanguage(): Language {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return (stored === 'en' || stored === 'ar') ? stored : 'ar'; // Default to Arabic for Algerian students
    } catch {
      return 'ar';
    }
  },

  setLanguage(lang: Language) {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error('Failed to set language:', e);
    }
  },

  getGradeState(): GradeTrackerState {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GRADE_STATE);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.trimesters) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse grade state:', e);
    }
    return getDefaultGradeState('science');
  },

  saveGradeState(state: GradeTrackerState) {
    try {
      localStorage.setItem(STORAGE_KEYS.GRADE_STATE, JSON.stringify({
        ...state,
        lastSavedAt: new Date().toISOString(),
      }));
    } catch (e) {
      console.error('Failed to save grade state:', e);
    }
  },

  getTasks(): TaskItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse tasks:', e);
    }
    return DEFAULT_TASKS;
  },

  saveTasks(tasks: TaskItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  },

  getNotes(): NoteItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse notes:', e);
    }
    return DEFAULT_NOTES;
  },

  saveNotes(notes: NoteItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes:', e);
    }
  },

  getTimerConfig(): CustomTimerConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TIMER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse timer:', e);
    }
  return DEFAULT_TIMER;
  },

  saveTimerConfig(config: CustomTimerConfig) {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMER, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save timer config:', e);
    }
  },

  exportAllDataJSON(): string {
    const data = {
      scholar_version: '1.0',
      exported_at: new Date().toISOString(),
      language: this.getLanguage(),
      gradeState: this.getGradeState(),
      tasks: this.getTasks(),
      notes: this.getNotes(),
      timer: this.getTimerConfig(),
    };
    return JSON.stringify(data, null, 2);
  },

  importAllDataJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.gradeState) this.saveGradeState(parsed.gradeState);
      if (parsed.tasks) this.saveTasks(parsed.tasks);
      if (parsed.notes) this.saveNotes(parsed.notes);
      if (parsed.timer) this.saveTimerConfig(parsed.timer);
      if (parsed.language) this.setLanguage(parsed.language);
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  },

  resetAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.GRADE_STATE);
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.NOTES);
      localStorage.removeItem(STORAGE_KEYS.TIMER);
    } catch (e) {
      console.error('Failed to reset storage:', e);
    }
  }
};
