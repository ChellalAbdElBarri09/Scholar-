import React, { useState } from 'react';
import { 
  Calculator, 
  Save, 
  Plus, 
  Trash2, 
  Trophy, 
  Award, 
  Sparkles, 
  BookOpen, 
  BarChart3,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { GradeTrackerState, SubjectGrade, Language, StreamId } from '../../types';
import { ALGERIAN_STREAMS, calculateSubjectAverage, calculateTrimesterGpa, getAlgerianHonorBadge } from '../../constants/algerianStreams';
import { getTranslation } from '../../utils/i18n';
import { ClayCard } from '../ClayCard';
import { ClayButton } from '../ClayButton';

interface GradeTrackerViewProps {
  gradeState: GradeTrackerState;
  onUpdateGradeState: (newState: GradeTrackerState) => void;
  lang: Language;
}

export const GradeTrackerView: React.FC<GradeTrackerViewProps> = ({
  gradeState,
  onUpdateGradeState,
  lang,
}) => {
  const [saveBannerMessage, setSaveBannerMessage] = useState<string | null>(null);

  // Active Trimester Subjects
  const currentTrimester = gradeState.currentTrimester;
  const trimesterData = gradeState.trimesters[currentTrimester] || { subjects: [] };
  const subjects = trimesterData.subjects || [];

  // Calculation Results
  const { gpa, totalPoints, totalCoeffs } = calculateTrimesterGpa(subjects);
  const honorBadge = gpa !== null ? getAlgerianHonorBadge(gpa, lang) : null;

  // Stream Switching
  const handleStreamSelect = (streamId: StreamId) => {
    const streamDef = ALGERIAN_STREAMS.find(s => s.id === streamId) || ALGERIAN_STREAMS[0];
    const defaultSubjects: SubjectGrade[] = streamDef.defaultSubjects.map(sub => ({
      ...sub,
      evaluation: null,
      test: null,
      exam: null,
      calculatedAverage: null,
    }));

    onUpdateGradeState({
      ...gradeState,
      streamId: streamDef.id,
      trimesters: {
        1: { subjects: JSON.parse(JSON.stringify(defaultSubjects)) },
        2: { subjects: JSON.parse(JSON.stringify(defaultSubjects)) },
        3: { subjects: JSON.parse(JSON.stringify(defaultSubjects)) },
      },
      lastCalculatedGpa: null,
    });
  };

  // Trimester Tab Switch
  const handleTrimesterTab = (t: 1 | 2 | 3) => {
    onUpdateGradeState({
      ...gradeState,
      currentTrimester: t,
    });
  };

  // Grade Input Change
  const handleSubjectFieldChange = (
    subjectId: string,
    field: 'evaluation' | 'test' | 'exam' | 'coefficient' | 'nameAr' | 'nameEn',
    val: string | number | null
  ) => {
    const updatedSubjects = subjects.map(sub => {
      if (sub.id !== subjectId) return sub;

      const updatedSub = { ...sub };
      if (field === 'coefficient') {
        updatedSub.coefficient = typeof val === 'number' ? Math.max(1, val) : 1;
      } else if (field === 'evaluation' || field === 'test' || field === 'exam') {
        if (val === '' || val === null || isNaN(Number(val))) {
          updatedSub[field] = null;
        } else {
          // Clamp grade between 0 and 20
          updatedSub[field] = Math.min(20, Math.max(0, Number(val)));
        }
      } else if (field === 'nameAr' || field === 'nameEn') {
        updatedSub[field] = String(val);
      }

      // Pre-calculate average for row
      updatedSub.calculatedAverage = calculateSubjectAverage(updatedSub);
      return updatedSub;
    });

    onUpdateGradeState({
      ...gradeState,
      trimesters: {
        ...gradeState.trimesters,
        [currentTrimester]: {
          ...trimesterData,
          subjects: updatedSubjects,
        }
      }
    });
  };

  // Add Custom Subject
  const handleAddCustomSubject = () => {
    const newId = `custom_sub_${Date.now()}`;
    const newSub: SubjectGrade = {
      id: newId,
      nameEn: 'Custom Subject',
      nameAr: 'مادة مخصصة جديدة',
      coefficient: 2,
      evaluation: null,
      test: null,
      exam: null,
      calculatedAverage: null,
    };

    onUpdateGradeState({
      ...gradeState,
      trimesters: {
        ...gradeState.trimesters,
        [currentTrimester]: {
          ...trimesterData,
          subjects: [...subjects, newSub],
        }
      }
    });
  };

  // Remove Subject
  const handleRemoveSubject = (subId: string) => {
    onUpdateGradeState({
      ...gradeState,
      trimesters: {
        ...gradeState.trimesters,
        [currentTrimester]: {
          ...trimesterData,
          subjects: subjects.filter(s => s.id !== subId),
        }
      }
    });
  };

  // Calculate & Save to Dashboard
  const handleCalculateAndSave = () => {
    const calc = calculateTrimesterGpa(subjects);
    onUpdateGradeState({
      ...gradeState,
      lastCalculatedGpa: calc.gpa,
      trimesters: {
        ...gradeState.trimesters,
        [currentTrimester]: {
          subjects,
          calculatedGpa: calc.gpa,
        }
      }
    });

    setSaveBannerMessage(getTranslation(lang, 'saveSuccess'));
    setTimeout(() => setSaveBannerMessage(null), 3500);
  };

  // Annual GPA calculation across Trimesters 1, 2, and 3
  const t1Gpa = calculateTrimesterGpa(gradeState.trimesters[1]?.subjects || []).gpa;
  const t2Gpa = calculateTrimesterGpa(gradeState.trimesters[2]?.subjects || []).gpa;
  const t3Gpa = calculateTrimesterGpa(gradeState.trimesters[3]?.subjects || []).gpa;

  const validGpas = [t1Gpa, t2Gpa, t3Gpa].filter((g): g is number => g !== null);
  const annualGpa = validGpas.length > 0 ? Math.round((validGpas.reduce((a, b) => a + b, 0) / validGpas.length) * 100) / 100 : null;

  return (
    <div className="space-y-6 pb-28 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-[#88A590]" />
            {getTranslation(lang, 'trackerHeading')}
          </h2>
          <p className="text-xs text-[#88A590] mt-0.5 max-w-xl">
            {getTranslation(lang, 'trackerSubtitle')}
          </p>
        </div>

        <ClayButton
          variant="accent"
          onClick={handleCalculateAndSave}
          className="w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          <span>{getTranslation(lang, 'saveToDashboard')}</span>
        </ClayButton>
      </div>

      {saveBannerMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs rounded-2xl flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveBannerMessage}</span>
        </div>
      )}

      {/* Stream Selector & Trimester Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stream Selector Card */}
        <ClayCard className="p-4 space-y-2">
          <label className="block text-xs font-semibold text-[#88A590] flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-teal-300" />
            <span>{getTranslation(lang, 'selectStream')}</span>
          </label>
          <select
            value={gradeState.streamId}
            onChange={(e) => handleStreamSelect(e.target.value as StreamId)}
            className="clay-input w-full p-2.5 text-xs text-white font-medium"
          >
            {ALGERIAN_STREAMS.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0d2226]">
                {lang === 'ar' ? s.nameAr : s.nameEn}
              </option>
            ))}
          </select>
        </ClayCard>

        {/* Trimester Tabs */}
        <ClayCard className="p-4 flex flex-col justify-between">
          <label className="block text-xs font-semibold text-[#88A590] mb-2">
            {getTranslation(lang, 'currentTrimester')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((t) => (
              <button
                key={t}
                onClick={() => handleTrimesterTab(t as 1 | 2 | 3)}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                  currentTrimester === t
                    ? 'bg-gradient-to-r from-[#2A534C] to-[#1e443e] text-white border-[#88A590] shadow-md'
                    : 'bg-[#0d2226] text-[#88A590] border-[#2A534C]/40 hover:text-white'
                }`}
              >
                {lang === 'ar' ? `الفصل ${t}` : `Trimester ${t}`}
              </button>
            ))}
          </div>
        </ClayCard>
      </div>

      {/* OVERALL GPA & STATS SUMMARY BANNER */}
      <ClayCard variant="accent" className="p-5 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Main GPA */}
          <div className="space-y-1 text-center md:text-left rtl:md:text-right">
            <span className="text-xs text-[#88A590]">
              {getTranslation(lang, 'overallAverage')} ({lang === 'ar' ? `الفصل ${currentTrimester}` : `Trimester ${currentTrimester}`}):
            </span>
            <div className="text-4xl font-extrabold font-mono text-white flex items-baseline justify-center md:justify-start rtl:md:justify-end gap-1">
              <span className="text-emerald-300">{gpa !== null ? gpa.toFixed(2) : '--.--'}</span>
              <span className="text-base text-[#88A590]">/ 20</span>
            </div>
            {honorBadge && (
              <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${honorBadge.bg}`}>
                <Trophy className="w-3 h-3 text-amber-300" />
                <span>{honorBadge.title}</span>
              </div>
            )}
          </div>

          {/* Points & Coefficients */}
          <div className="grid grid-cols-2 gap-2 text-center bg-[#0d2226]/80 p-3 rounded-2xl border border-[#2A534C]/40">
            <div>
              <span className="block text-[10px] text-[#88A590]">{getTranslation(lang, 'totalPoints')}</span>
              <span className="text-base font-bold text-white font-mono">{totalPoints.toFixed(2)}</span>
            </div>
            <div>
              <span className="block text-[10px] text-[#88A590]">{getTranslation(lang, 'totalCoefficients')}</span>
              <span className="text-base font-bold text-amber-300 font-mono">{totalCoeffs}</span>
            </div>
          </div>

          {/* Annual Average Summary */}
          <div className="text-center md:text-right rtl:md:text-left space-y-1 bg-[#122e31]/80 p-3 rounded-2xl border border-[#2A534C]/40">
            <span className="text-[11px] text-[#88A590] flex items-center justify-center md:justify-end rtl:md:justify-start gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-teal-300" />
              {lang === 'ar' ? 'المعدل السنوي التقريبي' : 'Approx Annual GPA'}:
            </span>
            <div className="text-xl font-bold font-mono text-teal-300">
              {annualGpa !== null ? `${annualGpa.toFixed(2)} / 20` : '--.--'}
            </div>
            <p className="text-[10px] text-[#88A590]">
              {lang === 'ar' ? 'معدل الفصول الثلاثة المجتمعة' : 'Average of all 3 trimesters'}
            </p>
          </div>
        </div>
      </ClayCard>

      {/* SUBJECTS & GRADES TABLE */}
      <ClayCard className="p-4 overflow-x-auto space-y-4 border border-[#88A590]/30">
        <div className="flex items-center justify-between pb-2 border-b border-[#2A534C]/40 min-w-[600px]">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? `مواد ونقاط الفصل ${currentTrimester}` : `Trimester ${currentTrimester} Subjects & Grades`}</span>
          </h3>

          <div className="flex items-center gap-2 text-xs text-[#88A590]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'العلامة من 20' : 'Grades out of 20'}</span>
          </div>
        </div>

        {/* Grades Table */}
        <div className="min-w-[650px] space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-[#88A590] px-2 py-1 bg-[#0d2226] rounded-xl border border-[#2A534C]/30 text-center">
            <div className="col-span-3 text-left rtl:text-right">{getTranslation(lang, 'subjectName')}</div>
            <div className="col-span-1">{getTranslation(lang, 'coefficient')}</div>
            <div className="col-span-2">{getTranslation(lang, 'evaluationGrade')}</div>
            <div className="col-span-2">{getTranslation(lang, 'testGrade')}</div>
            <div className="col-span-2">{getTranslation(lang, 'examGrade')}</div>
            <div className="col-span-1">{getTranslation(lang, 'subjectAverage')}</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Rows */}
          {subjects.map((sub) => {
            const avg = calculateSubjectAverage(sub);
            return (
              <div
                key={sub.id}
                className="grid grid-cols-12 gap-2 items-center p-2 rounded-2xl bg-[#122e31]/60 hover:bg-[#122e31] border border-[#2A534C]/30 text-xs transition-colors"
              >
                {/* Subject Name */}
                <div className="col-span-3">
                  <input
                    type="text"
                    value={lang === 'ar' ? sub.nameAr : sub.nameEn}
                    onChange={(e) => handleSubjectFieldChange(sub.id, lang === 'ar' ? 'nameAr' : 'nameEn', e.target.value)}
                    className="clay-input w-full p-1.5 text-xs text-white font-medium"
                  />
                </div>

                {/* Coefficient */}
                <div className="col-span-1">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={sub.coefficient}
                    onChange={(e) => handleSubjectFieldChange(sub.id, 'coefficient', Number(e.target.value))}
                    className="clay-input w-full p-1.5 text-xs text-center font-mono font-bold text-amber-300"
                  />
                </div>

                {/* Evaluation Grade (0 - 20) */}
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    placeholder="--/20"
                    value={sub.evaluation !== null && sub.evaluation !== undefined ? sub.evaluation : ''}
                    onChange={(e) => handleSubjectFieldChange(sub.id, 'evaluation', e.target.value)}
                    className="clay-input w-full p-1.5 text-xs text-center font-mono text-white placeholder-[#88A590]/40"
                  />
                </div>

                {/* Test Grade (0 - 20) */}
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    placeholder="--/20"
                    value={sub.test !== null && sub.test !== undefined ? sub.test : ''}
                    onChange={(e) => handleSubjectFieldChange(sub.id, 'test', e.target.value)}
                    className="clay-input w-full p-1.5 text-xs text-center font-mono text-white placeholder-[#88A590]/40"
                  />
                </div>

                {/* Exam Grade (0 - 20) */}
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    placeholder="--/20"
                    value={sub.exam !== null && sub.exam !== undefined ? sub.exam : ''}
                    onChange={(e) => handleSubjectFieldChange(sub.id, 'exam', e.target.value)}
                    className="clay-input w-full p-1.5 text-xs text-center font-mono text-white placeholder-[#88A590]/40"
                  />
                </div>

                {/* Subject Calculated Average */}
                <div className="col-span-1 text-center font-mono font-bold">
                  {avg !== null ? (
                    <span className={avg >= 10 ? 'text-emerald-400' : 'text-rose-400'}>
                      {avg.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-[#88A590]/50">--.--</span>
                  )}
                </div>

                {/* Delete Subject Button */}
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => handleRemoveSubject(sub.id)}
                    className="p-1 rounded-lg text-[#88A590] hover:text-rose-400 transition-colors"
                    title="Remove subject"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Subject & Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#2A534C]/40 min-w-[600px]">
          <ClayButton size="sm" variant="secondary" onClick={handleAddCustomSubject}>
            <Plus className="w-3.5 h-3.5" />
            <span>{getTranslation(lang, 'addCustomSubject')}</span>
          </ClayButton>

          <ClayButton variant="accent" onClick={handleCalculateAndSave}>
            <Calculator className="w-4 h-4" />
            <span>{getTranslation(lang, 'calculateGpa')} & {getTranslation(lang, 'saveToDashboard')}</span>
          </ClayButton>
        </div>
      </ClayCard>
    </div>
  );
};
