import { BookOpen, MessageCircle, Moon, Nfc, Plus, Search, Settings, Sparkles, Sun, Tag } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewNote: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const navItems = [
  { id: 'notes', label: '我的笔记', icon: BookOpen },
  { id: 'search', label: '智能搜索', icon: Search },
  { id: 'ai-chat', label: 'AI 问答', icon: MessageCircle },
  { id: 'tags', label: '标签管理', icon: Tag },
  { id: 'insights', label: '知识洞察', icon: Sparkles },
  { id: 'nfc', label: 'NFC 工具', icon: Nfc },
];

export default function Sidebar({ activeTab, onTabChange, onNewNote, isDarkMode, onToggleDarkMode }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-[var(--color-rule)] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--color-rule)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary-light)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-[var(--color-ink)] leading-tight">智汇笔记</h1>
            <p className="text-xs text-[var(--color-muted)]">AI 知识管理助手</p>
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
          新建笔记
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
          {isDarkMode ? '浅色模式' : '深色模式'}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] transition-colors">
          <Settings className="w-4 h-4" />
          设置
        </button>
      </div>
    </aside>
  );
}
