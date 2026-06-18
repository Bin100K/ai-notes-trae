# ZhiHui Notes - AI-Powered Knowledge Manager

> **TRAE AI Creativity Contest Entry** | 智汇笔记 - AI 智能知识管理助手

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-teal)](https://bin100k.github.io/ai-notes-trae/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-cyan)](https://tailwindcss.com/)

A lightweight, AI-integrated knowledge management app designed for modern knowledge workers. Built entirely with **TRAE IDE** and **TRAE Work**.

[中文介绍](#中文介绍) | [繁體中文介紹](#繁體中文介紹)

---

## Features

### Core Note-Taking
- Create, edit, delete notes with rich categorization and tagging
- Full-text search across titles, content, and tags
- Favorite notes for quick access
- Daily review: randomly surfaces older notes to reactivate "cold data"

### AI Knowledge Assistant
- Ask questions about your notes in natural language
- AI retrieves relevant content from your knowledge base
- Smart tag auto-generation based on note content

### NFC Deep Linking
- Generate unique NFC URLs for any note
- Write URLs directly to NFC tags via Web NFC API
- Tap a tag with your phone to instantly open the linked note
- Copy NFC links for sharing or manual writing

### Handwriting Annotations
- Freehand drawing on HTML5 Canvas
- 6 colors + 4 brush thicknesses
- Undo / clear / save
- Touch and stylus support for mobile devices
- Annotations persist in localStorage

### Knowledge Insights Dashboard
- Note count, tag count, category distribution
- Weekly activity bar chart
- Hot tags ranking
- AI-discovered knowledge connections with similarity scores

### Design & UX
- Clean, minimal interface with teal + stone color palette
- Dark mode support
- Multi-language: Chinese (Simplified), Chinese (Traditional), English
- Responsive design: desktop sidebar + mobile bottom navigation
- Smooth animations and micro-interactions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| State | React Hooks + localStorage |
| Data | Mock data + localStorage persistence |

---

## Live Demo

**https://bin100k.github.io/ai-notes-trae/**

> Open on your phone to experience the mobile layout and NFC features (requires Chrome Android with NFC support).

---

## Screenshots

| Desktop - Note List | Desktop - Note Detail | Mobile - Bottom Nav |
|---|---|---|
| *Clean sidebar + card list* | *NFC info + annotations + related notes* | *5-tab bottom navigation* |

| Dark Mode | Handwriting Canvas | Daily Review |
|---|---|---|
| *Full dark theme* | *6 colors, 4 thicknesses, touch support* | *Random old note surfacing* |

---

## Development with TRAE

This project was built from scratch using **TRAE IDE** and **TRAE Work**:

- **TRAE Work** generated the initial project scaffold, component architecture, and mock data
- **TRAE IDE** handled iterative refinement, bug fixes, and feature additions
- Key development sessions included:
  - NFC Web API integration and error handling
  - Canvas-based handwriting with touch event normalization
  - Multi-language i18n system design
  - Responsive layout for desktop/mobile dual modes

---

## Project Structure

```
src/
  components/          # 10 React components
    Sidebar.tsx        # Desktop navigation
    MobileNav.tsx      # Mobile bottom nav
    NoteList.tsx       # Searchable note cards
    NoteDetail.tsx     # Note viewer + NFC + annotations
    NoteEditor.tsx     # Create/edit notes
    NoteAnnotations.tsx # Annotation manager
    HandwritingCanvas.tsx # Canvas drawing board
    AIChat.tsx         # AI Q&A interface
    Insights.tsx       # Knowledge dashboard
    NFCTools.tsx       # NFC tag tools
    DailyReview.tsx    # Daily review modal
  i18n/
    translations.ts    # zh-CN / zh-TW / en
    I18nContext.tsx    # React context for i18n
  data/
    mockData.ts        # Sample notes & categories
  App.tsx              # Root component
  types.ts             # TypeScript interfaces
  index.css            # Tailwind + custom theme
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## License

MIT License - feel free to fork, modify, and share!

---

## 中文介绍

**智汇笔记** 是一款轻量级 AI 知识管理应用，专为现代知识工作者设计。完全使用 **TRAE IDE** 和 **TRAE Work** 开发。

### 核心功能
- **笔记管理**：创建、编辑、分类、标签、收藏、全文搜索
- **AI 知识助手**：自然语言问答，从笔记库检索相关内容
- **NFC 深度链接**：为每篇笔记生成唯一 NFC URL，写入标签后手机贴近即可直达
- **手写批注**：Canvas 自由绘画，6 色 4 粗细，支持触屏和手写笔
- **每日回顾**：随机推送旧笔记，激活"冷数据"
- **知识洞察**：统计仪表盘、活跃度图表、知识关联发现

### 设计亮点
- 清爽极简界面，teal + stone 配色
- 深色模式、三语言切换（简中/繁中/英文）
- 桌面端侧边栏 + 移动端底部导航双适配

---

## 繁體中文介紹

**智匯筆記** 是一款輕量級 AI 知識管理應用，專為現代知識工作者設計。完全使用 **TRAE IDE** 和 **TRAE Work** 開發。

### 核心功能
- **筆記管理**：創建、編輯、分類、標籤、收藏、全文搜尋
- **AI 知識助手**：自然語言問答，從筆記庫檢索相關內容
- **NFC 深度連結**：為每篇筆記生成唯一 NFC URL，寫入標籤後手機貼近即可直達
- **手寫批註**：Canvas 自由繪畫，6 色 4 粗細，支援觸屏和手寫筆
- **每日回顧**：隨機推送舊筆記，激活"冷數據"
- **知識洞察**：統計儀表盤、活躍度圖表、知識關聯發現

---

*Built with TRAE. For the love of knowledge.*
