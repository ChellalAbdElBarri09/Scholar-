import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Search, 
  Clock, 
  Tag, 
  CheckCircle2, 
  Circle, 
  Calendar,
  AlertCircle,
  Filter,
  X
} from 'lucide-react';
import { TaskItem, TaskPriority, TaskCategory, Language, SubTask } from '../../types';
import { getTranslation } from '../../utils/i18n';
import { soundEffects } from '../../utils/audio';
import { ClayCard } from '../ClayCard';
import { ClayButton } from '../ClayButton';

interface TasksViewProps {
  tasks: TaskItem[];
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  onToggleTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  lang: Language;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onToggleSubtask,
  onDeleteTask,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed' | 'high'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Task Form State
  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('homework');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `st_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`, title: newSubtaskTitle.trim(), completed: false },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      subjectName: subjectName.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
      category,
      completed: false,
      subtasks,
    });

    // Reset Form
    setTitle('');
    setSubjectName('');
    setDueDate('');
    setPriority('medium');
    setCategory('homework');
    setSubtasks([]);
    setShowAddForm(false);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.subjectName && t.subjectName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (filterTab === 'pending') return !t.completed;
    if (filterTab === 'completed') return t.completed;
    if (filterTab === 'high') return t.priority === 'high';
    return true;
  });

  const getPriorityBadge = (p: TaskPriority) => {
    if (p === 'high') return { text: getTranslation(lang, 'highPriority'), style: 'bg-rose-950 text-rose-300 border-rose-500/40' };
    if (p === 'medium') return { text: getTranslation(lang, 'mediumPriority'), style: 'bg-amber-950 text-amber-300 border-amber-500/40' };
    return { text: getTranslation(lang, 'lowPriority'), style: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' };
  };

  const getCategoryBadge = (c: TaskCategory) => {
    if (c === 'exam') return getTranslation(lang, 'examCat');
    if (c === 'revision') return getTranslation(lang, 'revisionCat');
    if (c === 'project') return getTranslation(lang, 'projectCat');
    return getTranslation(lang, 'homeworkCat');
  };

  return (
    <div className="space-y-6 pb-28 animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            {getTranslation(lang, 'tasksHeading')}
          </h2>
          <p className="text-xs text-[#88A590] mt-0.5">
            {lang === 'ar' ? 'نظّم دروسك، واجبياتك، وتحضيرات الفروض والاختبارات بسهولة.' : 'Organize your homework, revision, and exam preparation schedule.'}
          </p>
        </div>

        <ClayButton
          variant="accent"
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{getTranslation(lang, 'addTask')}</span>
        </ClayButton>
      </div>

      {/* Add Task Form Collapsible */}
      {showAddForm && (
        <ClayCard className="p-5 border border-[#88A590]/40 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#2A534C]/40">
            <h3 className="font-bold text-white text-sm">{getTranslation(lang, 'addTask')}</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 rounded-lg text-[#88A590] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#88A590] font-semibold mb-1">
                {lang === 'ar' ? 'عنوان المهمة *' : 'Task Title *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={getTranslation(lang, 'taskTitlePlaceholder')}
                className="clay-input w-full p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#88A590] font-semibold mb-1">
                  {lang === 'ar' ? 'المادة الدراسية' : 'Subject'}
                </label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder={getTranslation(lang, 'subjectPlaceholder')}
                  className="clay-input w-full p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[#88A590] font-semibold mb-1">
                  {getTranslation(lang, 'dueDateLabel')}
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="clay-input w-full p-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#88A590] font-semibold mb-1">
                  {getTranslation(lang, 'priorityLabel')}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="clay-input w-full p-2.5 text-xs text-white"
                >
                  <option value="high" className="bg-[#0d2226]">{getTranslation(lang, 'highPriority')}</option>
                  <option value="medium" className="bg-[#0d2226]">{getTranslation(lang, 'mediumPriority')}</option>
                  <option value="low" className="bg-[#0d2226]">{getTranslation(lang, 'lowPriority')}</option>
                </select>
              </div>

              <div>
                <label className="block text-[#88A590] font-semibold mb-1">
                  {getTranslation(lang, 'categoryLabel')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="clay-input w-full p-2.5 text-xs text-white"
                >
                  <option value="homework" className="bg-[#0d2226]">{getTranslation(lang, 'homeworkCat')}</option>
                  <option value="exam" className="bg-[#0d2226]">{getTranslation(lang, 'examCat')}</option>
                  <option value="revision" className="bg-[#0d2226]">{getTranslation(lang, 'revisionCat')}</option>
                  <option value="project" className="bg-[#0d2226]">{getTranslation(lang, 'projectCat')}</option>
                </select>
              </div>
            </div>

            {/* Subtasks Builder */}
            <div className="space-y-2 pt-2 border-t border-[#2A534C]/30">
              <label className="block text-[#88A590] font-semibold">
                {getTranslation(lang, 'quickPrepChecklist')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder={getTranslation(lang, 'addSubtask')}
                  className="clay-input flex-1 p-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3 py-1.5 rounded-xl bg-[#163737] hover:bg-[#1e4848] text-white border border-[#2A534C]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {subtasks.length > 0 && (
                <div className="space-y-1 pt-1">
                  {subtasks.map((st) => (
                    <div key={st.id} className="flex items-center justify-between p-1.5 rounded-lg bg-[#0d2226] text-xs text-[#B3C1B4]">
                      <span>• {st.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(st.id)}
                        className="text-rose-400 p-0.5 hover:text-rose-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-[#122e31] text-[#88A590] hover:text-white"
              >
                {getTranslation(lang, 'close')}
              </button>
              <ClayButton type="submit" variant="accent">
                {getTranslation(lang, 'addTask')}
              </ClayButton>
            </div>
          </form>
        </ClayCard>
      )}

      {/* Filters & Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 rtl:right-3 rtl:left-auto top-3 text-[#88A590]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getTranslation(lang, 'searchTasks')}
            className="clay-input w-full pl-9 rtl:pr-9 rtl:pl-3 p-2.5 text-xs text-white"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'all', label: getTranslation(lang, 'allTasks') },
            { id: 'pending', label: getTranslation(lang, 'pendingTasks') },
            { id: 'completed', label: getTranslation(lang, 'completedTasks') },
            { id: 'high', label: getTranslation(lang, 'highPriority') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`py-1.5 px-3.5 rounded-xl border font-medium whitespace-nowrap transition-all ${
                filterTab === tab.id
                  ? 'bg-[#2A534C] text-white border-[#88A590] shadow-md'
                  : 'bg-[#0d2226] text-[#88A590] border-[#2A534C]/40 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-[#0d2226] rounded-3xl border border-[#2A534C]/30 space-y-2">
            <CheckSquare className="w-8 h-8 text-[#88A590] mx-auto opacity-50" />
            <p className="text-xs text-[#88A590]">
              {lang === 'ar' ? 'لا توجد مهام في هذه القائمة حالياً.' : 'No tasks found.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const pBadge = getPriorityBadge(task.priority);
            return (
              <ClayCard
                key={task.id}
                className={`transition-all ${task.completed ? 'opacity-60 bg-[#122e2b]' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => {
                        onToggleTask(task.id);
                        if (!task.completed) soundEffects.playTaskCompleteSound();
                      }}
                      className="mt-0.5 text-[#88A590] hover:text-emerald-400 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full border font-semibold ${pBadge.style}`}>
                          {pBadge.text}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#163737] text-teal-300 border border-[#2A534C]">
                          {getCategoryBadge(task.category)}
                        </span>
                        {task.subjectName && (
                          <span className="px-2 py-0.5 rounded-full bg-[#122e31] text-[#88A590] border border-[#2A534C]">
                            {task.subjectName}
                          </span>
                        )}
                      </div>

                      <h3 className={`font-semibold text-sm text-white leading-snug ${task.completed ? 'line-through text-[#88A590]' : ''}`}>
                        {task.title}
                      </h3>

                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-[11px] text-[#88A590]">
                          <Calendar className="w-3.5 h-3.5 text-amber-300" />
                          <span>
                            {new Date(task.dueDate).toLocaleString(lang === 'ar' ? 'ar-DZ' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(getTranslation(lang, 'deleteTaskConfirm'))) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="p-1.5 rounded-xl text-[#88A590] hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtask Prep Checklist Steps */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#2A534C]/30 space-y-1.5">
                    {task.subtasks.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          onToggleSubtask(task.id, st.id);
                          if (!st.completed) soundEffects.playTaskCompleteSound();
                        }}
                        className="w-full text-left rtl:text-right flex items-center gap-2 text-xs p-1.5 rounded-lg bg-[#0d2226] hover:bg-[#122e31] border border-[#2A534C]/20 text-[#B3C1B4] transition-all"
                      >
                        {st.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-[#88A590] shrink-0" />
                        )}
                        <span className={st.completed ? 'line-through text-[#88A590]' : ''}>
                          {st.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </ClayCard>
            );
          })
        )}
      </div>
    </div>
  );
};
