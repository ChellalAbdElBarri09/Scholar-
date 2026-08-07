export type Language = 'en' | 'ar';

export type TabView = 'home' | 'todo' | 'notes' | 'track';

export type StreamId = 
  | 'science' 
  | 'math' 
  | 'math_tech' 
  | 'literary' 
  | 'languages' 
  | 'management' 
  | 'custom';

export interface StreamDefinition {
  id: StreamId;
  nameEn: string;
  nameAr: string;
  defaultSubjects: {
    id: string;
    nameEn: string;
    nameAr: string;
    coefficient: number;
  }[];
}

export interface SubjectGrade {
  id: string;
  nameEn: string;
  nameAr: string;
  coefficient: number;
  evaluation?: number | null; // تقويم مستمر (0 - 20)
  test?: number | null;       // فرض (0 - 20)
  exam?: number | null;       // إختبار (0 - 20)
  calculatedAverage?: number | null; // المعدل المسبق للمادة
}

export interface TrimesterData {
  subjects: SubjectGrade[];
  calculatedGpa?: number | null;
}

export interface GradeTrackerState {
  streamId: StreamId;
  trimesters: {
    1: TrimesterData;
    2: TrimesterData;
    3: TrimesterData;
  };
  currentTrimester: 1 | 2 | 3;
  targetGpa: number;
  lastCalculatedGpa: number | null;
  lastSavedAt?: string;
}

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'homework' | 'exam' | 'revision' | 'project';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  subjectName?: string;
  dueDate?: string; // YYYY-MM-DD THH:mm
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
  subtasks: SubTask[];
  createdAt: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  subjectTag?: string;
  pinned: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface CustomTimerConfig {
  studyMinutes: number;
  restMinutes: number;
  mode: 'study' | 'rest';
  remainingSeconds: number;
  isRunning: boolean;
  soundEnabled: boolean;
}
