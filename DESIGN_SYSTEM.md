# 🎨 WebUtils 设计系统

**版本**: 1.0.0
**更新日期**: 2026-01-03
**适用范围**: 全部 1001 个工具

---

## 📋 目录

1. [设计原则](#设计原则)
2. [CSS 变量规范](#css-变量规范)
3. [颜色系统](#颜色系统)
4. [字体系统](#字体系统)
5. [间距系统](#间距系统)
6. [圆角系统](#圆角系统)
7. [组件样式](#组件样式)
8. [响应式设计](#响应式设计)
9. [主题切换](#主题切换)
10. [可访问性](#可访问性)
11. [使用示例](#使用示例)

---

## 🎯 设计原则

### 核心理念
- **赛博朋克风格**: 暗色背景 + 霓虹色强调 + 发光效果
- **简洁高效**: 专注功能，减少视觉干扰
- **响应式优先**: 移动端和桌面端同等重要
- **可访问性**: WCAG 2.1 AA 级标准

### 视觉特征
- 🌃 深色背景为主，浅色为辅
- 🌈 霓虹青色 (#00f5d4) 作为主强调色
- ✨ 紫色渐变作为次要强调色
- 💎 高对比度确保可读性

---

## 📐 CSS 变量规范

### 完整变量列表

```css
:root {
  /* ========== 颜色系统 - 暗色主题 ========== */

  /* 背景色 */
  --color-bg-deep: #0a0a0f;        /* 最深层背景 */
  --color-bg-surface: #12121a;     /* 表面背景 */
  --color-bg-card: #1a1a24;        /* 卡片背景 */
  --color-bg-elevated: #22222e;    /* 悬浮元素背景 */

  /* 文本色 */
  --color-text-primary: #e8e8ed;   /* 主要文本 */
  --color-text-secondary: #a8a8b3; /* 次要文本 */
  --color-text-muted: #707080;     /* 弱化文本 */
  --color-text-inverse: #0a0a0f;   /* 反色文本（浅色背景上） */

  /* 强调色 */
  --color-accent-cyan: #00f5d4;    /* 主强调色 - 霓虹青 */
  --color-accent-purple: #a78bfa;  /* 次强调色 - 紫色 */
  --color-accent-pink: #f472b6;    /* 第三强调色 - 粉色 */

  /* 语义色 */
  --color-success: #10b981;        /* 成功 */
  --color-warning: #f59e0b;        /* 警告 */
  --color-error: #ef4444;          /* 错误 */
  --color-info: #3b82f6;           /* 信息 */

  /* 边框色 */
  --color-border-subtle: #2a2a38;  /* 微妙边框 */
  --color-border-default: #3a3a48; /* 默认边框 */
  --color-border-strong: #4a4a58;  /* 强调边框 */

  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px rgba(0, 245, 212, 0.3);

  /* ========== 字体系统 ========== */

  --font-sans: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  /* 字体大小 - 使用 clamp() 实现响应式 */
  --font-size-xs: clamp(0.75rem, 1.5vw, 0.875rem);   /* 12-14px */
  --font-size-sm: clamp(0.875rem, 1.8vw, 1rem);      /* 14-16px */
  --font-size-base: clamp(1rem, 2vw, 1.125rem);      /* 16-18px */
  --font-size-lg: clamp(1.125rem, 2.5vw, 1.25rem);   /* 18-20px */
  --font-size-xl: clamp(1.25rem, 3vw, 1.5rem);       /* 20-24px */
  --font-size-2xl: clamp(1.5rem, 4vw, 2rem);         /* 24-32px */
  --font-size-3xl: clamp(2rem, 5vw, 3rem);           /* 32-48px */

  /* 行高 */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* 字重 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* ========== 间距系统 ========== */

  --space-xs: 0.5rem;    /* 8px */
  --space-sm: 0.75rem;   /* 12px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */

  /* ========== 圆角系统 ========== */

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* ========== Z-index 层级 ========== */

  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-tooltip: 600;

  /* ========== 过渡动画 ========== */

  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;

  /* ========== 断点 ========== */

  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* ========== 浅色主题 ========== */
[data-theme="light"] {
  /* 背景色 */
  --color-bg-deep: #fafafa;
  --color-bg-surface: #ffffff;
  --color-bg-card: #f5f5f5;
  --color-bg-elevated: #ececec;

  /* 文本色 */
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #4a4a4a;
  --color-text-muted: #8a8a8a;
  --color-text-inverse: #fafafa;

  /* 强调色保持不变（确保可见性） */
  --color-accent-cyan: #00d4b8;
  --color-accent-purple: #8b5cf6;

  /* 边框色 */
  --color-border-subtle: #e5e5e5;
  --color-border-default: #d4d4d8;
  --color-border-strong: #a1a1aa;

  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
  --shadow-glow: 0 0 20px rgba(0, 212, 184, 0.3);
}
```

---

## 🎨 颜色系统

### 主色板

#### 背景色渐变
```css
/* 从深到浅 */
--color-bg-deep    (#0a0a0f)  /* 页面底色 */
    ↓
--color-bg-surface (#12121a)  /* 主要内容区 */
    ↓
--color-bg-card    (#1a1a24)  /* 卡片 */
    ↓
--color-bg-elevated(#22222e)  /* 悬浮元素 */
```

#### 文本色层级
```css
--color-text-primary   (#e8e8ed)  /* 标题、重要文本 */
--color-text-secondary (#a8a8b3)  /* 正文、描述 */
--color-text-muted     (#707080)  /* 辅助信息、时间戳 */
```

#### 强调色使用场景

**霓虹青色** (`--color-accent-cyan: #00f5d4`)
- ✅ 主要按钮
- ✅ 链接
- ✅ 重要操作
- ✅ 焦点状态
- ✅ 成功状态提示

**紫色** (`--color-accent-purple: #a78bfa`)
- 次要按钮
- 装饰性元素
- 渐变背景

**粉色** (`--color-accent-pink: #f472b6`)
- 特殊标记
- 促销/新功能标签

### 语义色使用

```css
/* 成功 - 绿色 */
.success { color: var(--color-success); }

/* 警告 - 橙色 */
.warning { color: var(--color-warning); }

/* 错误 - 红色 */
.error { color: var(--color-error); }

/* 信息 - 蓝色 */
.info { color: var(--color-info); }
```

### 颜色对比度要求

**WCAG AA 级标准**:
- 正文文本: 至少 4.5:1
- 大文本 (18px+): 至少 3:1
- UI 组件: 至少 3:1

**验证**:
```css
/* ✅ 通过 - 对比度 15.8:1 */
background: var(--color-bg-deep);    /* #0a0a0f */
color: var(--color-text-primary);     /* #e8e8ed */

/* ❌ 不通过 - 对比度 2.1:1 */
background: var(--color-bg-card);     /* #1a1a24 */
color: var(--color-text-muted);       /* #707080 */
```

---

## 🔤 字体系统

### 字体加载（必须）

```html
<!-- 在所有工具的 <head> 中添加 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 字体使用规则

```css
/* ✅ 正确 - 使用 CSS 变量 */
body {
  font-family: var(--font-sans);
}

code, pre, input[type="text"], textarea {
  font-family: var(--font-mono);
}

/* ❌ 错误 - 硬编码字体 */
body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### 字体大小阶梯

| 用途 | 变量 | 尺寸范围 |
|------|------|----------|
| 小号文本 | `--font-size-xs` | 12-14px |
| 次要文本 | `--font-size-sm` | 14-16px |
| 正文 | `--font-size-base` | 16-18px |
| 子标题 | `--font-size-lg` | 18-20px |
| 标题 H3 | `--font-size-xl` | 20-24px |
| 标题 H2 | `--font-size-2xl` | 24-32px |
| 标题 H1 | `--font-size-3xl` | 32-48px |

### 响应式字体示例

```css
/* ✅ 推荐 - 使用预定义变量 */
h1 {
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-tight);
}

/* ✅ 也可以 - 自定义 clamp() */
.custom-heading {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}

/* ❌ 不推荐 - 固定尺寸 + 媒体查询 */
h1 {
  font-size: 32px;
}
@media (max-width: 768px) {
  h1 { font-size: 24px; }
}
```

---

## 📏 间距系统

### 使用规则

```css
/* ✅ 使用变量 */
.card {
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
}

/* ❌ 硬编码数值 */
.card {
  padding: 24px;
  margin-bottom: 16px;
}
```

### 间距映射表

| 变量 | 值 | 使用场景 |
|------|-----|----------|
| `--space-xs` | 8px | 图标间距、紧凑布局 |
| `--space-sm` | 12px | 按钮内边距、小间隙 |
| `--space-md` | 16px | 标准内边距、段落间距 |
| `--space-lg` | 24px | 卡片内边距、区块间距 |
| `--space-xl` | 32px | 页面分区、大间隔 |
| `--space-2xl` | 48px | 章节分隔 |
| `--space-3xl` | 64px | 页面顶部/底部留白 |

---

## 🔘 组件样式

### 按钮

```css
/* 主要按钮 */
.btn-primary {
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-accent-cyan);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary:hover {
  background: #00d4b8;
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
}

/* 次要按钮 */
.btn-secondary {
  padding: var(--space-sm) var(--space-lg);
  background: transparent;
  color: var(--color-accent-cyan);
  border: 2px solid var(--color-accent-cyan);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  background: rgba(0, 245, 212, 0.1);
  box-shadow: var(--shadow-glow);
}
```

### 输入框

```css
input, textarea, select {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  transition: all var(--transition-base);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--color-accent-cyan);
  box-shadow: 0 0 0 3px rgba(0, 245, 212, 0.2);
}

input::placeholder {
  color: var(--color-text-muted);
}
```

### 卡片

```css
.card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.card:hover {
  border-color: var(--color-border-default);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}
```

---

## 📱 响应式设计

### 断点使用

```css
/* ✅ 推荐 - 移动优先 */
.container {
  padding: var(--space-md);
}

@media (min-width: 768px) {
  .container {
    padding: var(--space-xl);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--space-2xl);
  }
}
```

### 响应式网格

```css
.grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
```

### 触摸目标

```css
/* 最小触摸目标 44×44px (WCAG 2.5.5) */
button, a.btn, input[type="checkbox"], input[type="radio"] {
  min-width: 44px;
  min-height: 44px;
}
```

---

## 🌓 主题切换

### HTML 结构

```html
<!-- 主题切换按钮 -->
<button id="theme-toggle" aria-label="切换主题">
  <span class="theme-icon">🌙</span>
</button>
```

### JavaScript 实现

```javascript
// 主题切换逻辑
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const html = document.documentElement;

// 从 localStorage 读取主题
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

// 切换主题
themeToggle?.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
});
```

---

## ♿ 可访问性

### 键盘导航

```css
/* 焦点样式 */
*:focus-visible {
  outline: 3px solid var(--color-accent-cyan);
  outline-offset: 2px;
}

/* 跳过导航链接 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-accent-cyan);
  color: var(--color-text-inverse);
  padding: var(--space-sm) var(--space-md);
  z-index: var(--z-tooltip);
}

.skip-link:focus {
  top: 0;
}
```

### ARIA 标签

```html
<!-- ✅ 正确 - 带标签的输入框 -->
<label for="username">用户名</label>
<input id="username" type="text" aria-label="用户名输入框">

<!-- ✅ 按钮带 aria-label -->
<button aria-label="复制到剪贴板">
  📋 复制
</button>

<!-- ✅ 表单分组 -->
<fieldset>
  <legend>个人信息</legend>
  <!-- 表单字段 -->
</fieldset>
```

### 语义化 HTML

```html
<!-- ✅ 正确 -->
<header role="banner">
  <nav aria-label="主导航"></nav>
</header>

<main id="main-content">
  <article>
    <h1>标题</h1>
    <section>内容</section>
  </article>
</main>

<footer role="contentinfo"></footer>
```

---

## 📝 使用示例

### 完整工具模板

```html
<!DOCTYPE html>
<html lang="zh" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>工具名 - WebUtils</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    /* ========== CSS 变量 ========== */
    :root {
      /* 颜色 */
      --color-bg-deep: #0a0a0f;
      --color-bg-surface: #12121a;
      --color-bg-card: #1a1a24;
      --color-text-primary: #e8e8ed;
      --color-text-secondary: #a8a8b3;
      --color-accent-cyan: #00f5d4;

      /* 字体 */
      --font-sans: 'Space Grotesk', -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --font-size-base: clamp(1rem, 2vw, 1.125rem);

      /* 间距 */
      --space-sm: 0.75rem;
      --space-md: 1rem;
      --space-lg: 1.5rem;

      /* 圆角 */
      --radius-md: 10px;

      /* 阴影 */
      --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
      --shadow-glow: 0 0 20px rgba(0, 245, 212, 0.3);
    }

    [data-theme="light"] {
      --color-bg-deep: #fafafa;
      --color-bg-surface: #ffffff;
      --color-bg-card: #f5f5f5;
      --color-text-primary: #1a1a1a;
      --color-text-secondary: #4a4a4a;
    }

    /* ========== 基础样式 ========== */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-sans);
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      background: var(--color-bg-deep);
      line-height: 1.6;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--space-lg);
    }

    /* ========== 组件样式 ========== */
    .btn-primary {
      padding: var(--space-sm) var(--space-lg);
      background: var(--color-accent-cyan);
      color: #0a0a0f;
      border: none;
      border-radius: var(--radius-md);
      font-family: var(--font-sans);
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .btn-primary:hover {
      box-shadow: var(--shadow-glow);
      transform: translateY(-2px);
    }

    input, textarea {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      background: var(--color-bg-card);
      color: var(--color-text-primary);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius-md);
      font-family: var(--font-mono);
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: var(--color-accent-cyan);
      box-shadow: 0 0 0 3px rgba(0, 245, 212, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>工具名称</h1>
      <button id="theme-toggle" aria-label="切换主题">🌙</button>
    </header>

    <main>
      <label for="input">输入</label>
      <input id="input" type="text" placeholder="请输入...">

      <button class="btn-primary">处理</button>

      <div id="output"></div>
    </main>
  </div>

  <script>
    // 主题切换
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
  </script>
</body>
</html>
```

---

## 🔍 设计审查清单

使用此清单审查每个工具：

- [ ] 使用标准 CSS 变量（不硬编码颜色/字体）
- [ ] 加载 Google Fonts (Space Grotesk + JetBrains Mono)
- [ ] 支持明暗主题切换
- [ ] 颜色对比度符合 WCAG AA 标准
- [ ] 输入框有关联的 `<label>`
- [ ] 按钮有 `aria-label`
- [ ] 焦点样式可见 (`:focus-visible`)
- [ ] 触摸目标 ≥ 44×44px
- [ ] 响应式设计（移动端可用）
- [ ] 字体使用 `clamp()` 或预定义变量

---

## 📚 参考资源

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Variables (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Clamp Calculator](https://clamp.font-size.app/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**版本历史**:
- v1.0.0 (2026-01-03): 初始版本，基于现有工具分析制定

**维护者**: WebUtils 设计团队
**更新频率**: 每季度审查
