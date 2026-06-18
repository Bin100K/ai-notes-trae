import { useState, useCallback, useEffect } from 'react';
import type { Note } from './types';
import { mockNotes } from './data/mockData';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import AIChat from './components/AIChat';
import Insights from './components/Insights';
import NFCTools from './components/NFCTools';
import NoteDetail from './components/NoteDetail';
import DailyReview from './components/DailyReview';
import { FileText } from 'lucide-react';

function AppContent() {
  const { t } = useI18n();
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('zhihuinotes-data');
    return saved ? JSON.parse(saved) : mockNotes;
  });
  const [activeTab, setActiveTab] = useState('notes');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('zhihuinotes-dark-mode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showDailyReview, setShowDailyReview] = useState(false);

  // Persist notes to localStorage
  useEffect(() => {
    localStorage.setItem('zhihuinotes-data', JSON.stringify(notes));
  }, [notes]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('zhihuinotes-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Daily review: auto show on first visit of the day
  useEffect(() => {
    const lastReviewDate = localStorage.getItem('zhihuinotes-last-review');
    const today = new Date().toDateString();
    if (lastReviewDate !== today && notes.length > 0) {
      setShowDailyReview(true);
      localStorage.setItem('zhihuinotes-last-review', today);
    }
  }, []);

  // Handle URL params for NFC deep linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get('note');
    const tab = params.get('tab');
    
    if (noteId) {
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        setSelectedNote(note);
        setActiveTab('notes');
      }
    }
    if (tab) {
      setActiveTab(tab);
    }
  }, [notes]);

  const handleSaveNote = useCallback((note: Note) => {
    setNotes((prev) => {
      const exists = prev.find((n) => n.id === note.id);
      if (exists) {
        return prev.map((n) => (n.id === note.id ? note : n));
      }
      return [note, ...prev];
    });
    setSelectedNote(note);
    setIsEditing(false);
  }, []);

  const handleUpdateNote = useCallback((note: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
    setSelectedNote(note);
  }, []);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
  }, [selectedNote]);

  const handleToggleFavorite = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  }, [selectedNote]);

  const handleNewNote = () => {
    setSelectedNote(null);
    setIsEditing(true);
    setActiveTab('notes');
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  const getSelectedNoteId = (): string | null => {
    return selectedNote ? selectedNote.id : null;
  };

  // Render main content based on active tab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'notes':
        if (isEditing) {
          return (
            <NoteEditor
              note={selectedNote}
              onSave={handleSaveNote}
              onCancel={() => {
                setIsEditing(false);
              }}
              isMobile={isMobile}
            />
          );
        }
        if (selectedNote) {
          return (
            <NoteDetail
              note={selectedNote}
              notes={notes}
              onEdit={() => setIsEditing(true)}
              onSelectNote={handleSelectNote}
              onBack={() => setSelectedNote(null)}
              onUpdateNote={handleUpdateNote}
              onToggleFavorite={handleToggleFavorite}
              isMobile={isMobile}
            />
          );
        }
        return (
          <div className="flex flex-col items-center justify-center h-full text-[var(--color-muted)] px-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-light)]/20 flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <p className="text-lg font-medium">{t('selectNote')}</p>
            <p className="text-sm mt-2">{t('orCreate')}</p>
          </div>
        );

      case 'ai-chat':
        return <AIChat notes={notes} isMobile={isMobile} />;

      case 'insights':
        return <Insights notes={notes} />;

      case 'nfc':
        return <NFCTools notes={notes} />;

      case 'search':
        return (
          <div className="flex flex-col h-full bg-white">
            <div className="px-4 md:px-6 py-4 border-b border-[var(--color-rule)]">
              <h2 className="font-semibold text-[var(--color-ink)]">{t('search')}</h2>
              <p className="text-xs text-[var(--color-muted)]">{t('searchPlaceholder')}</p>
            </div>
            <NoteList
              notes={notes}
              onSelectNote={(note) => {
                setSelectedNote(note);
                setActiveTab('notes');
              }}
              onDeleteNote={handleDeleteNote}
              onToggleFavorite={handleToggleFavorite}
              selectedNoteId={getSelectedNoteId()}
            />
          </div>
        );

      case 'tags': {
        const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));
        return (
          <div className="flex flex-col h-full bg-white overflow-y-auto">
            <div className="px-4 md:px-6 py-4 border-b border-[var(--color-rule)]">
              <h2 className="font-semibold text-[var(--color-ink)]">{t('tags')}</h2>
              <p className="text-xs text-[var(--color-muted)]">{t('noteCount', { count: allTags.length })}</p>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex flex-wrap gap-3">
                {allTags.map((tag) => {
                  const count = notes.filter((n) => n.tags.includes(tag)).length;
                  return (
                    <button
                      key={tag}
                      onClick={() => setActiveTab('search')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-2)] rounded-xl hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-colors"
                    >
                      <span className="text-sm font-medium">#{tag}</span>
                      <span className="text-xs text-[var(--color-muted)]">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[var(--color-surface)] overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onNewNote={handleNewNote}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Note List (desktop split view) */}
        {!isMobile && activeTab === 'notes' && !isEditing && (
          <div className="w-80 border-r border-[var(--color-rule)] bg-white flex-shrink-0">
            <NoteList
              notes={notes}
              onSelectNote={handleSelectNote}
              onDeleteNote={handleDeleteNote}
              onToggleFavorite={handleToggleFavorite}
              selectedNoteId={getSelectedNoteId()}
            />
          </div>
        )}

        {/* Main Panel */}
        <div className="flex-1 overflow-hidden">
          {renderMainContent()}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <MobileNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onNewNote={handleNewNote}
        />
      )}

      {/* Daily Review Modal */}
      {showDailyReview && (
        <DailyReview
          notes={notes}
          onSelectNote={(note) => {
            setSelectedNote(note);
            setActiveTab('notes');
            setShowDailyReview(false);
          }}
          onClose={() => setShowDailyReview(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
