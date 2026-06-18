import type { Note } from '../types';

export const mockNotes: Note[] = [
  {
    id: '1',
    title: 'React Hooks 学习笔记',
    content: 'useState 和 useEffect 是 React 中最常用的两个 Hook。useState 用于在函数组件中添加状态，useEffect 用于处理副作用。useCallback 和 useMemo 用于性能优化，避免不必要的重渲染。useRef 可以获取 DOM 引用或保存可变值。自定义 Hook 可以将组件逻辑提取到可重用的函数中。',
    tags: ['React', '前端', '学习'],
    createdAt: '2026-06-15T10:00:00',
    updatedAt: '2026-06-15T10:00:00',
    category: '技术学习'
  },
  {
    id: '2',
    title: 'AI 大模型应用架构设计',
    content: '构建 AI 应用时需要考虑模型选择、Prompt 工程、RAG 检索增强生成、Agent 智能体等关键组件。向量数据库用于存储语义嵌入，实现相似度搜索。LangChain 和 LlamaIndex 是流行的 AI 应用开发框架。需要注意 Token 消耗控制和响应延迟优化。',
    tags: ['AI', '架构', '大模型'],
    createdAt: '2026-06-14T14:30:00',
    updatedAt: '2026-06-14T14:30:00',
    category: '技术学习'
  },
  {
    id: '3',
    title: '项目管理会议记录 - 6月',
    content: '本周项目进度：前端界面完成 80%，后端 API 开发完成 60%。下周计划：完成用户认证模块，开始知识图谱功能开发。风险点：第三方 API 调用频率限制可能影响性能。建议：提前申请更高的 API 配额或实现本地缓存机制。',
    tags: ['项目管理', '会议', '工作'],
    createdAt: '2026-06-13T09:00:00',
    updatedAt: '2026-06-13T09:00:00',
    category: '工作记录'
  },
  {
    id: '4',
    title: '读书笔记：《深度工作》',
    content: '深度工作是指在无干扰状态下进行专注的职业活动。作者 Cal Newport 提出了四个深度工作准则：1. 工作要深入 - 培养深度工作的习惯；2. 拥抱无聊 - 减少对浅层刺激的依赖；3. 远离社交媒体 - 谨慎选择网络工具；4. 摒弃浮浅 - 减少浅层工作的时间。',
    tags: ['阅读', '效率', '自我提升'],
    createdAt: '2026-06-12T20:00:00',
    updatedAt: '2026-06-12T20:00:00',
    category: '读书笔记'
  },
  {
    id: '5',
    title: 'TypeScript 高级类型技巧',
    content: 'Conditional Types 允许根据类型关系选择类型：T extends U ? X : Y。Mapped Types 可以基于现有类型创建新类型。Template Literal Types 用于处理字符串类型的模式匹配。Utility Types 如 Pick、Omit、Partial、Required 等提供了常用的类型转换工具。',
    tags: ['TypeScript', '前端', '学习'],
    createdAt: '2026-06-11T16:00:00',
    updatedAt: '2026-06-11T16:00:00',
    category: '技术学习'
  },
  {
    id: '6',
    title: '产品需求分析 - 智汇笔记',
    content: '核心用户画像：25-35岁知识工作者，日均信息摄入量高，有知识管理需求但缺乏有效工具。核心功能：笔记采集、AI分类、关联推荐、智能问答。差异化：主动式AI推荐、零门槛使用、隐私优先。商业模式：基础版免费，高级版订阅。',
    tags: ['产品', '需求分析', '创业'],
    createdAt: '2026-06-10T11:00:00',
    updatedAt: '2026-06-10T11:00:00',
    category: '工作记录'
  }
];

export const mockCategories = ['全部', '技术学习', '工作记录', '读书笔记', '灵感想法'];

export const mockTags = ['React', '前端', '学习', 'AI', '架构', '大模型', '项目管理', '会议', '工作', '阅读', '效率', '自我提升', 'TypeScript', '产品', '需求分析', '创业'];
