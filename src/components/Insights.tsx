import { BookOpen, Clock, Hash, Lightbulb, TrendingUp } from 'lucide-react';
import type { Note } from '../types';

interface InsightsProps {
  notes: Note[];
}

export default function Insights({ notes }: InsightsProps) {
  const totalNotes = notes.length;
  const totalTags = new Set(notes.flatMap((n) => n.tags)).size;
  const categories = new Set(notes.map((n) => n.category)).size;

  // Calculate tag frequency
  const tagFreq: Record<string, number> = {};
  notes.forEach((note) => {
    note.tags.forEach((tag) => {
      tagFreq[tag] = (tagFreq[tag] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Category distribution
  const catDist: Record<string, number> = {};
  notes.forEach((note) => {
    catDist[note.category] = (catDist[note.category] || 0) + 1;
  });

  // Recent activity (mock)
  const recentDays = [
    { day: '周一', count: 2 },
    { day: '周二', count: 1 },
    { day: '周三', count: 3 },
    { day: '周四', count: 0 },
    { day: '周五', count: 2 },
    { day: '周六', count: 1 },
    { day: '周日', count: 0 },
  ];
  const maxCount = Math.max(...recentDays.map((d) => d.count), 1);

  // Knowledge connections (mock)
  const connections = [
    { from: 'React Hooks', to: 'TypeScript', strength: 85 },
    { from: 'AI 架构', to: '产品需求', strength: 72 },
    { from: '深度工作', to: '项目管理', strength: 60 },
    { from: 'React', to: '前端', strength: 95 },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color-rule)]">
        <h2 className="font-semibold text-[var(--color-ink)]">知识洞察</h2>
        <p className="text-xs text-[var(--color-muted)]">AI 分析你的知识库，发现隐藏关联</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--color-surface-2)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-xs text-[var(--color-muted)]">笔记总数</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-ink)]">{totalNotes}</p>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-xs text-[var(--color-muted)]">标签数量</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-ink)]">{totalTags}</p>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[var(--color-primary-light)]" />
              <span className="text-xs text-[var(--color-muted)]">知识分类</span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-ink)]">{categories}</p>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white border border-[var(--color-rule)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[var(--color-primary)]" />
            <h3 className="font-semibold text-sm">本周记录活跃度</h3>
          </div>
          <div className="flex items-end gap-3 h-32">
            {recentDays.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-lg bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/30 transition-colors"
                  style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: day.count > 0 ? '8px' : '4px' }}
                />
                <span className="text-[10px] text-[var(--color-muted)]">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tags */}
        <div className="bg-white border border-[var(--color-rule)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-4 h-4 text-[var(--color-accent)]" />
            <h3 className="font-semibold text-sm">热门标签</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-surface-2)] rounded-lg text-xs"
              >
                <span className="font-medium text-[var(--color-ink)]">{tag}</span>
                <span className="text-[var(--color-muted)]">{count}</span>
              </span>
            ))}
            {topTags.length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">暂无标签数据</p>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white border border-[var(--color-rule)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[var(--color-primary-light)]" />
            <h3 className="font-semibold text-sm">分类分布</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(catDist).map(([cat, count]) => {
              const percentage = (count / totalNotes) * 100;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--color-ink)]">{cat}</span>
                    <span className="text-[var(--color-muted)]">{count} 篇 ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Knowledge Connections */}
        <div className="bg-white border border-[var(--color-rule)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-[var(--color-accent)]" />
            <h3 className="font-semibold text-sm">AI 发现的知识关联</h3>
          </div>
          <div className="space-y-3">
            {connections.map((conn, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-[var(--color-surface-2)] rounded-lg"
              >
                <span className="text-xs font-medium text-[var(--color-ink)] px-2 py-1 bg-white rounded-md">
                  {conn.from}
                </span>
                <div className="flex-1 h-1 bg-[var(--color-rule)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"
                    style={{ width: `${conn.strength}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-[var(--color-ink)] px-2 py-1 bg-white rounded-md">
                  {conn.to}
                </span>
                <span className="text-[10px] text-[var(--color-muted)]">{conn.strength}%</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[var(--color-muted)] mt-3">
            AI 基于笔记内容的语义相似度自动发现知识间的关联
          </p>
        </div>
      </div>
    </div>
  );
}
