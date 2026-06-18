import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, BookOpen } from 'lucide-react';
import type { Note } from '../types';

interface AIChatProps {
  notes: Note[];
  isMobile: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; snippet: string }[];
}

export default function AIChat({ notes, isMobile }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '你好！我是你的 AI 知识助手。我可以帮你：\n\n1. 基于你的笔记内容回答问题\n2. 发现笔记之间的关联\n3. 总结和提炼知识要点\n\n请直接输入你的问题，我会从你的知识库中寻找答案。',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findRelevantNotes = (query: string): Note[] => {
    const queryLower = query.toLowerCase();
    return notes
      .filter(
        (note) =>
          note.title.toLowerCase().includes(queryLower) ||
          note.content.toLowerCase().includes(queryLower) ||
          note.tags.some((tag) => tag.toLowerCase().includes(queryLower))
      )
      .slice(0, 3);
  };

  const generateAnswer = (query: string, relevantNotes: Note[]): string => {
    if (relevantNotes.length === 0) {
      return '我在你的知识库中没有找到与这个问题直接相关的内容。建议你先将相关知识记录到笔记中，我就能更好地帮助你啦！\n\n你可以尝试问一些与已有笔记相关的问题，比如：\n- "React Hooks 有哪些？"\n- "深度工作的准则是什么？"\n- "AI 应用架构包含哪些组件？"';
    }

    const note = relevantNotes[0];
    const queryLower = query.toLowerCase();

    if (queryLower.includes('react') || queryLower.includes('hook')) {
      return `根据你的笔记《${note.title}》，React 中常用的 Hook 包括：\n\n1. **useState** - 在函数组件中添加状态\n2. **useEffect** - 处理副作用\n3. **useCallback** - 性能优化，避免不必要的重渲染\n4. **useMemo** - 缓存计算结果\n5. **useRef** - 获取 DOM 引用或保存可变值\n\n你还可以创建**自定义 Hook** 来提取可重用的组件逻辑。`;
    }

    if (queryLower.includes('深度工作') || queryLower.includes('deep work')) {
      return `根据你的读书笔记《${note.title}》，Cal Newport 提出的四个深度工作准则是：\n\n1. **工作要深入** - 培养深度工作的习惯\n2. **拥抱无聊** - 减少对浅层刺激的依赖\n3. **远离社交媒体** - 谨慎选择网络工具\n4. **摒弃浮浅** - 减少浅层工作的时间\n\n深度工作是指在无干扰状态下进行专注的职业活动。`;
    }

    if (queryLower.includes('ai') || queryLower.includes('架构')) {
      return `根据你的笔记《${note.title}》，构建 AI 应用时需要考虑以下关键组件：\n\n1. **模型选择** - 根据场景选择合适的 AI 模型\n2. **Prompt 工程** - 优化提示词以获得更好的输出\n3. **RAG 检索增强生成** - 结合外部知识库提升回答质量\n4. **Agent 智能体** - 实现自主决策和任务执行\n5. **向量数据库** - 存储语义嵌入，实现相似度搜索\n\n流行的开发框架包括 **LangChain** 和 **LlamaIndex**。`;
    }

    return `根据你的笔记《${note.title}》，我找到了以下内容：\n\n${note.content.substring(0, 200)}...\n\n这篇笔记还涉及以下标签：${note.tags.join('、')}。\n\n如果你想了解更多细节，可以查看完整的笔记内容。`;
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    setTimeout(() => {
      const relevantNotes = findRelevantNotes(userMessage);
      const answer = generateAnswer(userMessage, relevantNotes);
      const sources = relevantNotes.map((n) => ({
        title: n.title,
        snippet: n.content.substring(0, 100) + '...',
      }));

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: answer,
          sources: sources.length > 0 ? sources : undefined,
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-[var(--color-rule)]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-[var(--color-ink)]">AI 知识助手</h2>
          <p className="text-xs text-[var(--color-muted)]">基于你的笔记库回答问题</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-[var(--color-surface-2)]'
                  : 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)]'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-[var(--color-muted)]" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-ink)]'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--color-rule)]">
                  <p className="text-xs text-[var(--color-muted)] mb-2">参考来源：</p>
                  {msg.sources.map((source, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 mb-1.5 p-2 rounded-lg bg-white/50"
                    >
                      <BookOpen className="w-3 h-3 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-[var(--color-ink)]">{source.title}</p>
                        <p className="text-[10px] text-[var(--color-muted)] line-clamp-1">{source.snippet}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-[var(--color-surface-2)] rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 text-[var(--color-primary)] animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 md:px-6 py-4 border-t border-[var(--color-rule)]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="输入你的问题..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-surface-2)] text-sm border border-transparent focus:border-[var(--color-primary)] focus:outline-none transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white hover:shadow-md hover:shadow-[var(--color-primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-[var(--color-muted)] mt-2 text-center">
          AI 助手会基于你的笔记内容回答问题，不会使用外部知识
        </p>
      </div>
    </div>
  );
}
