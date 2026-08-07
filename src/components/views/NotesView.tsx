import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Pin, 
  PinOff, 
  Search, 
  Save, 
  Tag, 
  Calendar,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { NoteItem, Language } from '../../types';
import { getTranslation } from '../../utils/i18n';
import { ClayCard } from '../ClayCard';
import { ClayButton } from '../ClayButton';

interface NotesViewProps {
  notes: NoteItem[];
  onSaveNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  lang: Language;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  onTogglePin,
  lang,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Editor State
  const activeNote = notes.find(n => n.id === selectedNoteId);

  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorTag, setEditorTag] = useState('');

  const handleSelectNote = (note: NoteItem) => {
    setSelectedNoteId(note.id);
    setEditorTitle(note.title);
    setEditorContent(note.content);
    setEditorTag(note.subjectTag || '');
  };

  const handleCreateNew = () => {
    const newId = `note_${Date.now()}`;
    const newNoteObj = {
      title: lang === 'ar' ? 'ملاحظة جديدة' : 'New Note',
      content: '',
      subjectTag: '',
      pinned: false,
    };
    onSaveNote({ ...newNoteObj, id: newId });
    setSelectedNoteId(newId);
    setEditorTitle(newNoteObj.title);
    setEditorContent(newNoteObj.content);
    setEditorTag('');
  };

  // Instant Auto-Save Handler
  const handleTitleChange = (val: string) => {
    setEditorTitle(val);
    if (selectedNoteId) {
      onSaveNote({
        id: selectedNoteId,
        title: val,
        content: editorContent,
        subjectTag: editorTag,
        pinned: activeNote?.pinned || false,
      });
    }
  };

  const handleContentChange = (val: string) => {
    setEditorContent(val);
    if (selectedNoteId) {
      onSaveNote({
        id: selectedNoteId,
        title: editorTitle,
        content: val,
        subjectTag: editorTag,
        pinned: activeNote?.pinned || false,
      });
    }
  };

  const handleTagChange = (val: string) => {
    setEditorTag(val);
    if (selectedNoteId) {
      onSaveNote({
        id: selectedNoteId,
        title: editorTitle,
        content: editorContent,
        subjectTag: val,
        pinned: activeNote?.pinned || false,
      });
    }
  };

  // Filter Notes
  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.subjectTag && n.subjectTag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.pinned);

  return (
    <div className="space-y-6 pb-28 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-400" />
            {getTranslation(lang, 'notesHeading')}
          </h2>
          <p className="text-xs text-[#88A590] mt-0.5">
            {lang === 'ar' ? 'كراس الملاحظات والملخصات مع حفظ تلقائي فور الكتابة.' : 'Apple Notes style distraction-free study writing pad with instant auto-save.'}
          </p>
        </div>

        <ClayButton variant="accent" onClick={handleCreateNew} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>{getTranslation(lang, 'addNote')}</span>
        </ClayButton>
      </div>

      {/* Editor View vs List View */}
      {selectedNoteId ? (
        /* DISTRACTION-FREE EDITOR */
        <ClayCard className="p-5 border border-[#88A590]/30 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A534C]/40">
            <button
              onClick={() => setSelectedNoteId(null)}
              className="flex items-center gap-1.5 text-xs text-[#88A590] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{lang === 'ar' ? 'الرجوع للملاحظات' : 'Back to Notes'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                {getTranslation(lang, 'autoSaved')}
              </span>

              <button
                onClick={() => onTogglePin(selectedNoteId)}
                className={`p-1.5 rounded-xl border transition-all ${
                  activeNote?.pinned
                    ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                    : 'bg-[#122e31] text-[#88A590] border-[#2A534C]'
                }`}
                title={activeNote?.pinned ? getTranslation(lang, 'unpinNote') : getTranslation(lang, 'pinNote')}
              >
                {activeNote?.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  if (window.confirm(getTranslation(lang, 'deleteNoteConfirm'))) {
                    onDeleteNote(selectedNoteId);
                    setSelectedNoteId(null);
                  }
                }}
                className="p-1.5 rounded-xl bg-rose-950/60 text-rose-300 hover:text-rose-100 border border-rose-500/30 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Note Title & Tag Inputs */}
          <div className="space-y-3">
            <input
              type="text"
              value={editorTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={getTranslation(lang, 'noteTitlePlaceholder')}
              className="clay-input w-full p-3 text-base font-bold text-white placeholder-[#88A590]/60"
            />

            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#88A590]" />
              <input
                type="text"
                value={editorTag}
                onChange={(e) => handleTagChange(e.target.value)}
                placeholder={getTranslation(lang, 'subjectTagPlaceholder')}
                className="clay-input flex-1 p-2 text-xs text-white"
              />
            </div>

            {/* Note Content Textarea */}
            <textarea
              rows={12}
              value={editorContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={getTranslation(lang, 'noteContentPlaceholder')}
              className="clay-input w-full p-4 text-xs leading-relaxed text-white placeholder-[#88A590]/50 font-sans resize-y"
            />
          </div>
        </ClayCard>
      ) : (
        /* NOTES GRID & SEARCH */
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 rtl:right-3 rtl:left-auto top-3 text-[#88A590]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getTranslation(lang, 'searchNotes')}
              className="clay-input w-full pl-9 rtl:pr-9 rtl:pl-3 p-2.5 text-xs text-white"
            />
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 bg-[#0d2226] rounded-3xl border border-[#2A534C]/30 space-y-3">
              <FileText className="w-8 h-8 text-[#88A590] mx-auto opacity-50" />
              <p className="text-xs text-[#88A590]">
                {lang === 'ar' ? 'لا توجد ملاحظات سابقة. اضغط زر إضافة ملاحظة جديدة للبدء.' : 'No notes found. Click new note to start writing.'}
              </p>
              <ClayButton variant="accent" size="sm" onClick={handleCreateNew}>
                {getTranslation(lang, 'addNote')}
              </ClayButton>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Pinned Notes Section */}
              {pinnedNotes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                    <Pin className="w-3.5 h-3.5" />
                    <span>{getTranslation(lang, 'pinnedNotes')}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        lang={lang}
                        onSelect={() => handleSelectNote(note)}
                        onTogglePin={() => onTogglePin(note.id)}
                        onDelete={() => onDeleteNote(note.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Notes Section */}
              {unpinnedNotes.length > 0 && (
                <div className="space-y-2">
                  {pinnedNotes.length > 0 && (
                    <h3 className="text-xs font-semibold text-[#88A590]">
                      {getTranslation(lang, 'otherNotes')}
                    </h3>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {unpinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        lang={lang}
                        onSelect={() => handleSelectNote(note)}
                        onTogglePin={() => onTogglePin(note.id)}
                        onDelete={() => onDeleteNote(note.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface NoteCardProps {
  note: NoteItem;
  lang: Language;
  onSelect: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  lang,
  onSelect,
  onTogglePin,
  onDelete,
}) => {
  return (
    <ClayCard
      onClick={onSelect}
      className="cursor-pointer hover:border-[#88A590]/50 transition-all flex flex-col justify-between space-y-3 group"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-emerald-300 transition-colors">
            {note.title || (lang === 'ar' ? 'ملاحظة جديدة' : 'Untitled')}
          </h4>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className={`p-1 rounded-lg text-[#88A590] hover:text-white ${note.pinned ? 'text-amber-300' : ''}`}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-[#B3C1B4] line-clamp-3 leading-relaxed whitespace-pre-line">
          {note.content || (lang === 'ar' ? '(ملاحظة فارغة)' : '(Empty note)')}
        </p>
      </div>

      <div className="pt-2 border-t border-[#2A534C]/30 flex items-center justify-between text-[10px] text-[#88A590]">
        <div className="flex items-center gap-2">
          {note.subjectTag && (
            <span className="px-2 py-0.5 rounded-full bg-[#122e31] text-emerald-300 border border-[#2A534C]">
              {note.subjectTag}
            </span>
          )}
          <span className="font-mono">
            {new Date(note.updatedAt).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(getTranslation(lang, 'deleteNoteConfirm'))) {
              onDelete();
            }
          }}
          className="p-1 rounded text-[#88A590] hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </ClayCard>
  );
};
