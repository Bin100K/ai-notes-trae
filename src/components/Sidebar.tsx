import { BookOpen, MessageCircle, Moon, Nfc, Plus, Search, Settings, Sparkles, Sun, Tag } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import type { Language } from '../i18n/translations';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewNote: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const langLabels: Record<Language, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en': 'English',
};

export default function Sidebar({ activeTab, onTabChange, onNewNote, isDarkMode, onToggleDarkMode }: SidebarProps) {
  const { t, lang, setLang } = useI18n();

  const navItems = [
    { id: 'notes', label: t('myNotes'), icon: BookOpen },
    { id: 'search', label: t('search'), icon: Search },
    { id: 'ai-chat', label: t('aiChat'), icon: MessageCircle },
    { id: 'tags', label: t('tags'), icon: Tag },
    { id: 'insights', label: t('insights'), icon: Sparkles },
    { id: 'nfc', label: t('nfcTools'), icon: Nfc },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[var(--color-rule)] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--color-rule)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary-light)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-[var(--color-ink)] leading-tight">{t('appName')}</h1>
            <p className="text-xs text-[var(--color-muted)]">{t('appSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* New Note Button */}
      <div className="p-4">
        <button
          onClick={onNewNote}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] hover:from-[var(--color-primary-dark)] hover:to-[var(--color-primary)] text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-md shadow-[var(--color-primary)]/20 hover:shadow-lg hover:shadow-[var(--color-primary)]/30"
        >
          <Plus className="w-4 h-4" />
          {t('newNote')}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                isActive
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-[var(--color-rule)] space-y-1">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDarkMode ? t('lightMode') : t('darkMode')}
        </button>
        {/* Language Switcher */}
        <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-muted)]">
          <Settings className="w-4 h-4" />
          <span className="text-xs">{t('settings')}</span>
          <div className="flex-1" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
            className="text-xs bg-[var(--color-surface-2)] rounded-md px-2 py-1 border border-[var(--color-rule)] text-[var(--color-ink)] cursor-pointer"
          >
            <option value="zh-CN">{langLabels['zh-CN']}</option>
            <option value="zh-TW">{langLabels['zh-TW']}</option>
            <option value="en">{langLabels['en']}</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
