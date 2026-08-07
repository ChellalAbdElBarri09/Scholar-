import React, { useState } from 'react';
import { X, Download, Upload, RotateCcw, ShieldCheck, BookOpen, Globe } from 'lucide-react';
import { Language, StreamId } from '../types';
import { ALGERIAN_STREAMS } from '../constants/algerianStreams';
import { getTranslation } from '../utils/i18n';
import { Storage } from '../utils/storage';
import { ClayButton } from './ClayButton';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currentStreamId: StreamId;
  onStreamChange: (streamId: StreamId) => void;
  onDataReset: () => void;
  onDataReload: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageChange,
  currentStreamId,
  onStreamChange,
  onDataReset,
  onDataReload,
}) => {
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const json = Storage.exportAllDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scholar_dz_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = Storage.importAllDataJSON(content);
        if (ok) {
          setImportSuccess(lang === 'ar' ? 'تمت استعادة البيانات بنجاح!' : 'Data imported successfully!');
          setImportError(null);
          onDataReload();
        } else {
          setImportError(lang === 'ar' ? 'ملف غير صالحة. يرجى اختيار ملف JSON صحيح.' : 'Invalid backup JSON file format.');
          setImportSuccess(null);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    const confirmText = getTranslation(lang, 'resetConfirm');
    if (window.confirm(confirmText)) {
      Storage.resetAllData();
      onDataReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="clay-card w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-[#88A590]/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A534C]/40">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-[#88A590]" />
            <h2>{getTranslation(lang, 'settingsTitle')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#122e31] hover:bg-[#1a3d3f] text-[#88A590] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          {/* Language Selection */}
          <div className="clay-card-flat p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Globe className="w-4 h-4 text-[#88A590]" />
              <h3>{getTranslation(lang, 'languageToggle')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => onLanguageChange('ar')}
                className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                  lang === 'ar'
                    ? 'bg-[#2A534C] text-white border-[#88A590] shadow-md'
                    : 'bg-[#0d2226] text-[#88A590] border-[#2A534C]/40 hover:text-white'
                }`}
              >
                العربية (Algeria)
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                  lang === 'en'
                    ? 'bg-[#2A534C] text-white border-[#88A590] shadow-md'
                    : 'bg-[#0d2226] text-[#88A590] border-[#2A534C]/40 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* High School Stream Preset */}
          <div className="clay-card-flat p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <BookOpen className="w-4 h-4 text-[#88A590]" />
              <h3>{getTranslation(lang, 'streamConfig')}</h3>
            </div>
            <select
              value={currentStreamId}
              onChange={(e) => onStreamChange(e.target.value as StreamId)}
              className="clay-input w-full p-2.5 text-xs text-white"
            >
              {ALGERIAN_STREAMS.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#0d2226]">
                  {lang === 'ar' ? s.nameAr : s.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Data Backup & Restore */}
          <div className="clay-card-flat p-4 space-y-3">
            <h3 className="text-white font-semibold">{getTranslation(lang, 'dataBackup')}</h3>
            <p className="text-xs text-[#88A590]">
              {lang === 'ar'
                ? 'يمكنك تصدير كافة ملاحظاتك ومهامك ومعدلاتك كملف JSON أوفلاين لحفظها أو نقلها لجهاز آخر.'
                : 'Export all your grades, tasks, and notes as a JSON backup file to keep them safe offline.'}
            </p>

            {importSuccess && (
              <p className="text-xs text-emerald-400 bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/30">
                {importSuccess}
              </p>
            )}
            {importError && (
              <p className="text-xs text-rose-400 bg-rose-950/60 p-2 rounded-lg border border-rose-500/30">
                {importError}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <ClayButton variant="secondary" onClick={handleExport} className="w-full text-xs py-2">
                <Download className="w-4 h-4" />
                <span>{getTranslation(lang, 'exportData')}</span>
              </ClayButton>

              <label className="clay-button text-xs py-2 px-3 inline-flex items-center justify-center gap-2 cursor-pointer text-[#e2e8f0]">
                <Upload className="w-4 h-4" />
                <span>{getTranslation(lang, 'importData')}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Danger Zone: Reset Data */}
          <div className="pt-2">
            <ClayButton variant="danger" onClick={handleReset} className="w-full text-xs py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{getTranslation(lang, 'resetData')}</span>
            </ClayButton>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2A534C]/40 flex justify-end">
          <ClayButton variant="secondary" onClick={onClose} size="sm">
            {getTranslation(lang, 'close')}
          </ClayButton>
        </div>
      </div>
    </div>
  );
};
