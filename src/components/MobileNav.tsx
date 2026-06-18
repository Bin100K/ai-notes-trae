import { BookOpen, MessageCircle, Nfc, Plus, Search, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewNote: () => void;
}

export default function MobileNav({ activeTab, onTabChange, onNewNote }: MobileNavProps) {
  const { t } = useI18n();

  const navItems = [
    { id: 'notes', label: t('mobileNavNotes'), icon: BookOpen },
    { id: 'search', label: t('mobileNavSearch'), icon: Search },
    { id: 'new', label: t('newNote'), icon: Plus, isAction: true },
    { id: 'ai-chat', label: t('mobileNavAI'), icon: MessageCircle },
    { id: 'nfc', label: t('mobileNavNFC'), icon: Nfc },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-rule)] z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={onNewNote}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center gap-1 py-2 px-3"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'
                }`}
              />
              <span
                className={`text-[10px] transition-colors ${
                  isActive ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-muted)]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
