import React from 'react';
import { Home, CheckSquare, FileText, Calculator } from 'lucide-react';
import { TabView, Language } from '../types';
import { getTranslation } from '../utils/i18n';

interface NavigationProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
  lang: Language;
  pendingTasksCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  lang,
  pendingTasksCount,
}) => {
  const tabs: { id: TabView; labelKey: keyof typeof import('../utils/i18n').translations['en']; icon: React.ReactNode }[] = [
    {
      id: 'home',
      labelKey: 'homeTab',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'todo',
      labelKey: 'tasksTab',
      icon: (
        <div className="relative">
          <CheckSquare className="w-5 h-5" />
          {pendingTasksCount > 0 && (
            <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
              {pendingTasksCount > 9 ? '9+' : pendingTasksCount}
            </span>
          )}
        </div>
      )
    },
    {
      id: 'notes',
      labelKey: 'notesTab',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'track',
      labelKey: 'trackTab',
      icon: <Calculator className="w-5 h-5" />
    }
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md">
      <div className="clay-nav px-2 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-[#2A534C] to-[#1a3a35] text-white shadow-lg border border-[#88A590]/30 scale-105'
                  : 'text-[#88A590] hover:text-[#B3C1B4] active:scale-95'
              }`}
            >
              {tab.icon}
              <span className={`text-[11px] font-medium mt-1 ${isActive ? 'text-white font-bold' : ''}`}>
                {getTranslation(lang, tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
