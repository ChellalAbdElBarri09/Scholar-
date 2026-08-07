import React, { useState, useEffect } from 'react';
import { GraduationCap, Languages, Settings, Wifi, WifiOff, Download, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/i18n';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  onOpenSettings,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#08181C]/90 backdrop-blur-md border-b border-[#2A534C]/30 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2A534C] to-[#163737] p-2 flex items-center justify-center border border-[#88A590]/30 shadow-lg shadow-black/40">
            <GraduationCap className="w-6 h-6 text-[#88A590]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                {getTranslation(lang, 'appName')}
              </h1>
              {/* Algerian Flag Green/Red Subtle Emblem */}
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-[#163737] border border-[#446E5F]/40 text-[#88A590]">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                DZ
              </span>
            </div>
            <p className="text-xs text-[#88A590] hidden sm:block">
              {getTranslation(lang, 'appSubtitle')}
            </p>
          </div>
        </div>

        {/* Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online/Offline Status */}
          <div className="hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#122e31] border border-[#2A534C]">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">{getTranslation(lang, 'onlineStatus')}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">{getTranslation(lang, 'offlineStatus')}</span>
              </>
            )}
          </div>

          {/* Install PWA Button */}
          {deferredPrompt && !isInstalled && (
            <button
              onClick={handleInstallClick}
              className="clay-button-accent text-xs px-2.5 py-1.5 flex items-center gap-1 text-white font-medium shadow-md animate-pulse"
              title={getTranslation(lang, 'installApp')}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{getTranslation(lang, 'installApp')}</span>
            </button>
          )}

          {isInstalled && (
            <div className="hidden xs:flex items-center gap-1 text-xs text-[#88A590] bg-[#163737] px-2.5 py-1 rounded-full border border-[#2A534C]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>PWA</span>
            </div>
          )}

          {/* Global Language Toggle Switch */}
          <button
            onClick={() => onLanguageChange(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#122d2f] hover:bg-[#1a3d3f] border border-[#446E5F]/40 text-xs text-white font-semibold shadow-inner transition-all active:scale-95"
            title="Toggle Language / تغيير اللغة"
          >
            <Languages className="w-4 h-4 text-[#88A590]" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[#122d2f] hover:bg-[#1a3d3f] border border-[#446E5F]/40 text-[#88A590] hover:text-white transition-all active:scale-95 shadow-inner"
            title={getTranslation(lang, 'settings')}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
