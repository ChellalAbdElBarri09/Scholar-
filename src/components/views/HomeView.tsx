import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Circle, 
  ArrowRight,
  Sparkles,
  Trophy,
  Sliders,
  Calendar,
  Flame
} from 'lucide-react';
import { GradeTrackerState, TaskItem, CustomTimerConfig, Language } from '../../types';
import { getTranslation } from '../../utils/i18n';
import { getAlgerianHonorBadge } from '../../constants/algerianStreams';
import { soundEffects } from '../../utils/audio';
import { ClayCard } from '../ClayCard';
import { ClayButton } from '../ClayButton';

interface HomeViewProps {
  gradeState: GradeTrackerState;
  tasks: TaskItem[];
  timerConfig: CustomTimerConfig;
  onUpdateTimer: (config: CustomTimerConfig) => void;
  onToggleTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onOpenCalculator: () => void;
  onOpenTasks: () => void;
  lang: Language;
}

export const HomeView: React.FC<HomeViewProps> = ({
  gradeState,
  tasks,
  timerConfig,
  onUpdateTimer,
  onToggleTask,
  onToggleSubtask,
  onOpenCalculator,
  onOpenTasks,
  lang,
}) => {
  // Live Local Clock State
  const [nowTime, setNowTime] = useState(new Date());

  // Custom Timer Local Input Controls
  const [customMinutes, setCustomMinutes] = useState(timerConfig.studyMinutes);
  const [showCustomInputs, setShowCustomInputs] = useState(false);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Timer Tick Effect
  useEffect(() => {
    let interval: any = null;
    if (timerConfig.isRunning) {
      interval = setInterval(() => {
        if (timerConfig.remainingSeconds > 1) {
          onUpdateTimer({
            ...timerConfig,
            remainingSeconds: timerConfig.remainingSeconds - 1,
          });
        } else {
          // Timer finished!
          if (timerConfig.soundEnabled) {
            soundEffects.playTimerFinishChime();
          }
          // Switch mode between study and rest
          const nextMode = timerConfig.mode === 'study' ? 'rest' : 'study';
          const nextMins = nextMode === 'study' ? timerConfig.studyMinutes : timerConfig.restMinutes;
          onUpdateTimer({
            ...timerConfig,
            mode: nextMode,
            remainingSeconds: nextMins * 60,
            isRunning: false,
          });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerConfig, onUpdateTimer]);

  // Current GPA calculation from active gradeState
  const currentTrimesterData = gradeState.trimesters[gradeState.currentTrimester];
  const gpa = gradeState.lastCalculatedGpa;
  const honorBadge = gpa !== null ? getAlgerianHonorBadge(gpa, lang) : null;

  // Find Nearest Pending Task
  const pendingTasks = tasks.filter(t => !t.completed && t.dueDate);
  pendingTasks.sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  const nearestTask = pendingTasks[0] || tasks.find(t => !t.completed);

  // Time remaining calculation for nearest task
  const getTimeRemainingStr = (dueDateStr?: string) => {
    if (!dueDateStr) return null;
    const dueTime = new Date(dueDateStr).getTime();
    const diff = dueTime - nowTime.getTime();
    if (diff <= 0) return { expired: true, text: lang === 'ar' ? 'انتهى موعد التسليم!' : 'Overdue!' };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return {
      expired: false,
      days,
      hours,
      mins,
    };
  };

  const taskTimeRemaining = nearestTask?.dueDate ? getTimeRemainingStr(nearestTask.dueDate) : null;

  // Timer Helper Formatting
  const formatTimerTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const setTimerPreset = (mins: number) => {
    onUpdateTimer({
      ...timerConfig,
      studyMinutes: mins,
      remainingSeconds: mins * 60,
      isRunning: false,
      mode: 'study',
    });
    setCustomMinutes(mins);
  };

  const handleApplyCustomTime = () => {
    const mins = Math.max(1, Math.min(300, customMinutes));
    onUpdateTimer({
      ...timerConfig,
      studyMinutes: mins,
      remainingSeconds: mins * 60,
      isRunning: false,
      mode: 'study',
    });
    setShowCustomInputs(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#1d4742] via-[#163737] to-[#122e2b] p-4 rounded-3xl border border-[#88A590]/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold text-white">
              {lang === 'ar' ? 'مرحباً بك في Scholar' : 'Welcome to Scholar'}
            </h2>
          </div>
          <p className="text-xs text-[#88A590]">
            {lang === 'ar'
              ? 'مُرافقك الشخصي للتحصيل الدراسي العالي في الثانوية'
              : 'Your dedicated Algerian secondary school study companion.'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#0d2226] px-3 py-1.5 rounded-2xl border border-[#2A534C]">
          <Calendar className="w-3.5 h-3.5 text-[#88A590]" />
          <span className="text-[#B3C1B4] font-mono">
            {nowTime.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* 1. REAL-TIME GPA WIDGET */}
      <ClayCard variant="accent" className="relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-white text-base">
                {getTranslation(lang, 'gpaWidgetTitle')}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#122e31] text-[#88A590] border border-[#2A534C]">
                {lang === 'ar' ? `الفصل ${gradeState.currentTrimester}` : `Trimester ${gradeState.currentTrimester}`}
              </span>
            </div>
            <p className="text-xs text-[#88A590]">
              {getTranslation(lang, 'gpaWidgetSubtitle')}
            </p>

            {honorBadge && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${honorBadge.bg}`}>
                <span>{honorBadge.title}</span>
              </div>
            )}
          </div>

          {/* Big GPA Badge */}
          <div className="flex flex-col items-center sm:items-end justify-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2A534C]/40">
            {gpa !== null ? (
              <div className="text-center sm:text-right">
                <div className="text-4xl font-extrabold font-mono text-white tracking-tight flex items-baseline gap-1">
                  <span className="text-emerald-400">{gpa.toFixed(2)}</span>
                  <span className="text-lg text-[#88A590]">/ 20</span>
                </div>
                <div className="text-[11px] text-[#88A590] mt-0.5">
                  {getTranslation(lang, 'targetGpa')}: <span className="text-amber-300 font-bold">{gradeState.targetGpa.toFixed(1)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center sm:text-right py-2">
                <p className="text-xs text-amber-200/90 max-w-xs">
                  {getTranslation(lang, 'noGradesYet')}
                </p>
              </div>
            )}

            <ClayButton
              onClick={onOpenCalculator}
              size="sm"
              variant="accent"
              className="mt-3 text-xs w-full sm:w-auto"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{getTranslation(lang, 'calculateNow')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </ClayButton>
          </div>
        </div>

        {/* Target Progress Bar */}
        {gpa !== null && (
          <div className="mt-4 pt-3 border-t border-[#2A534C]/30">
            <div className="flex justify-between text-[11px] text-[#88A590] mb-1">
              <span>0.00</span>
              <span>
                {lang === 'ar' ? 'الهدق' : 'Target'}: {gradeState.targetGpa.toFixed(1)} / 20
              </span>
              <span>20.00</span>
            </div>
            <div className="w-full h-2.5 bg-[#0d2226] rounded-full overflow-hidden p-0.5 border border-[#2A534C]/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min(100, (gpa / 20) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </ClayCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. TOP REMINDER WIDGET */}
        <ClayCard className="flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2A534C]/30">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-white text-sm">
                {getTranslation(lang, 'reminderWidgetTitle')}
              </h3>
            </div>
            <button
              onClick={onOpenTasks}
              className="text-xs text-[#88A590] hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>{getTranslation(lang, 'allTasks')}</span>
              <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </button>
          </div>

          {nearestTask ? (
            <div className="space-y-3">
              {/* Task Header */}
              <div className="p-3 rounded-2xl bg-[#0d2226] border border-[#2A534C]/40 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#163737] text-emerald-300 border border-[#2A534C]">
                      {nearestTask.subjectName || (lang === 'ar' ? 'مهمة عامة' : 'General Task')}
                    </span>
                    <h4 className="font-semibold text-white text-sm leading-snug">
                      {nearestTask.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => onToggleTask(nearestTask.id)}
                    className="p-1 rounded-full text-[#88A590] hover:text-emerald-400 transition-colors"
                    title={getTranslation(lang, 'markComplete')}
                  >
                    <Circle className="w-5 h-5" />
                  </button>
                </div>

                {/* Deadline Countdown */}
                {taskTimeRemaining && (
                  <div className="pt-2 border-t border-[#2A534C]/30 flex items-center justify-between text-xs">
                    <span className="text-[#88A590] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      {getTranslation(lang, 'timeRemaining')}:
                    </span>

                    {taskTimeRemaining.expired ? (
                      <span className="text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded">
                        {taskTimeRemaining.text}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 font-mono font-bold text-amber-300 bg-[#122e31] px-2 py-0.5 rounded border border-[#2A534C]">
                        {taskTimeRemaining.days! > 0 && <span>{taskTimeRemaining.days}{getTranslation(lang, 'daysShort')}</span>}
                        <span>{taskTimeRemaining.hours}{getTranslation(lang, 'hoursShort')}</span>
                        <span>{taskTimeRemaining.mins}{getTranslation(lang, 'minsShort')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Subtask Prep Checklist */}
              {nearestTask.subtasks && nearestTask.subtasks.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-semibold text-[#88A590]">
                    {getTranslation(lang, 'quickPrepChecklist')}:
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {nearestTask.subtasks.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => onToggleSubtask(nearestTask.id, st.id)}
                        className="w-full text-left rtl:text-right flex items-center gap-2 text-xs p-2 rounded-xl bg-[#122e31]/60 hover:bg-[#122e31] border border-[#2A534C]/20 text-[#B3C1B4] transition-all"
                      >
                        {st.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#88A590] shrink-0" />
                        )}
                        <span className={st.completed ? 'line-through text-[#88A590]' : ''}>
                          {st.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-2 text-[#88A590]">
              <p className="text-xs">{getTranslation(lang, 'noUpcomingTasks')}</p>
              <ClayButton size="sm" onClick={onOpenTasks} variant="secondary">
                {getTranslation(lang, 'addTask')}
              </ClayButton>
            </div>
          )}
        </ClayCard>

        {/* 3. CUSTOM STUDY & REST TIMER WIDGET */}
        <ClayCard className="space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#2A534C]/30">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-300" />
                <h3 className="font-bold text-white text-sm">
                  {getTranslation(lang, 'timerWidgetTitle')}
                </h3>
              </div>
              
              {/* Local Clock Header Badge */}
              <div className="text-[11px] font-mono text-emerald-300 bg-[#0d2226] px-2 py-0.5 rounded-full border border-[#2A534C]">
                {nowTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
            <p className="text-[11px] text-[#88A590] mt-1">
              {getTranslation(lang, 'timerWidgetSubtitle')}
            </p>
          </div>

          {/* Mode Badge & Timer Display */}
          <div className="bg-[#0d2226] rounded-2xl p-4 border border-[#2A534C]/40 text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                timerConfig.mode === 'study'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : 'bg-teal-950 text-teal-300 border-teal-500/40'
              }`}>
                {timerConfig.mode === 'study' ? getTranslation(lang, 'studyMode') : getTranslation(lang, 'restMode')}
              </span>

              <button
                onClick={() => onUpdateTimer({ ...timerConfig, soundEnabled: !timerConfig.soundEnabled })}
                className="p-1.5 rounded-full bg-[#163737] text-[#88A590] hover:text-white border border-[#2A534C]"
                title={getTranslation(lang, 'soundAlert')}
              >
                {timerConfig.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
              </button>
            </div>

            {/* Big Countdown Clock Display */}
            <div className="text-5xl font-mono font-extrabold text-white tracking-widest text-shadow-lg">
              {formatTimerTime(timerConfig.remainingSeconds)}
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <ClayButton
                variant={timerConfig.isRunning ? 'secondary' : 'accent'}
                size="md"
                onClick={() => onUpdateTimer({ ...timerConfig, isRunning: !timerConfig.isRunning })}
                className="px-6"
              >
                {timerConfig.isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>{getTranslation(lang, 'pauseTimer')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{getTranslation(lang, 'startTimer')}</span>
                  </>
                )}
              </ClayButton>

              <button
                onClick={() => {
                  const mins = timerConfig.mode === 'study' ? timerConfig.studyMinutes : timerConfig.restMinutes;
                  onUpdateTimer({
                    ...timerConfig,
                    remainingSeconds: mins * 60,
                    isRunning: false,
                  });
                }}
                className="p-2.5 rounded-xl bg-[#163737] hover:bg-[#1f4848] text-[#88A590] hover:text-white border border-[#2A534C] transition-all active:scale-95"
                title={getTranslation(lang, 'resetTimer')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Duration Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#88A590]">
              <span>{getTranslation(lang, 'quickPresets')}:</span>
              <button
                onClick={() => setShowCustomInputs(!showCustomInputs)}
                className="text-emerald-400 hover:underline text-[11px] flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>{getTranslation(lang, 'customDuration')}</span>
              </button>
            </div>

            {showCustomInputs ? (
              <div className="flex items-center gap-2 bg-[#0d2226] p-2 rounded-xl border border-[#2A534C]/40">
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(Number(e.target.value))}
                  className="clay-input p-1.5 text-xs text-center w-20 text-white font-bold"
                />
                <span className="text-xs text-[#88A590]">{getTranslation(lang, 'minutes')}</span>
                <ClayButton size="sm" variant="accent" onClick={handleApplyCustomTime}>
                  Set
                </ClayButton>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTimerPreset(m)}
                    className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                      timerConfig.studyMinutes === m
                        ? 'bg-[#2A534C] text-white border-[#88A590] shadow-md'
                        : 'bg-[#0d2226] text-[#88A590] border-[#2A534C]/40 hover:text-white'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            )}
          </div>
        </ClayCard>
      </div>
    </div>
  );
};
