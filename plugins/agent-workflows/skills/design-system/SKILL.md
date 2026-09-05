---
name: design-system
description: HTML 交互页的共享设计系统——双主题 tokens(语义色 + manim 系教学强调色)、控件模式(舞台/滑块/播放暂停/拖拽手柄/标注/步进)、动效规则;支持两种交付:自包含单文件(内联 Tailwind v4 浏览器构建)与 Vite 工程(Tailwind + shadcn 风格组件)。任何要构建 HTML 页面的技能(graphics-teach、wiki-html 等)动手前加载本技能;不直接响应用户请求。
---

# design-system

所有 HTML 交互页共享的视觉语言,单一事实源。**样式一律用 Tailwind**,不手写零散 CSS;颜色集中在 CSS 变量,组件一律引用变量,**不硬编码颜色、字号、时长**;canvas/WebGL 绘图用 `getComputedStyle` 读同一组变量,主题切换时重绘。

## 交付模式

按产物形态二选一,tokens 值不变:

**A. 自包含单文件**(wiki-html 等要求双击离线可开的场景):把 `vendor/tailwind.browser.js`(v4 浏览器构建,约 280KB)**全文内联**进 `<head>` 的 `<script>`——不引 CDN、不外链,保住自包含;样式写在 `<style type="text/tailwindcss">` 块,开头 `@import "tailwindcss";`,随后声明 tokens(下节原样照抄),运行时在浏览器里按需生成,任意工具类都可用。页面体积 +280KB 是正常的。

**B. Vite 工程**(graphics-teach 的 graphics-lab 等):`tailwindcss` + `@tailwindcss/vite` 正常接入;`index.css` 里变量定义在 `@theme` **之外**的 `:root`(深色媒体查询直接覆盖),再用 `@theme inline` 映射给工具类:

```css
@import "tailwindcss";

:root {
  --paper: #fafaf7;  /* …下节全部变量,浅色值… */
}
@media (prefers-color-scheme: dark) {
  :root { --paper: #10131a;  /* …深色值… */ }
}

@theme inline {
  --color-paper: var(--paper);
  --color-raised: var(--raised);
  --color-ink: var(--ink);
  --color-ink-dim: var(--ink-dim);
  --color-line: var(--line);
  --color-accent: var(--accent);
  --color-c-blue: var(--c-blue);
  --color-c-teal: var(--c-teal);
  --color-c-green: var(--c-green);
  --color-c-yellow: var(--c-yellow);
  --color-c-red: var(--c-red);
  --color-c-purple: var(--c-purple);
  --font-sans: ui-sans-serif, system-ui, "PingFang SC", "Noto Sans SC", sans-serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, monospace;
}
```

UI 组件用 shadcn 风格(Button / Slider / Card),类名组合遵循「控件模式」。

## Tokens

```css
@import "tailwindcss";

@theme {
  /* 语义色(浅色/纸面) */
  --color-paper: #fafaf7;
  --color-raised: #ffffff;
  --color-ink: #1a1d24;
  --color-ink-dim: #5a6070;
  --color-line: #d9dce3;
  --color-accent: #2890b3;

  /* 教学强调色(manim 系):给图形对象/公式符号上色 */
  --color-c-blue: #2890b3;
  --color-c-teal: #2ba88f;
  --color-c-green: #5f9e46;
  --color-c-yellow: #b98a1d;
  --color-c-red: #d64541;
  --color-c-purple: #7d5ba6;

  --font-sans: ui-sans-serif, system-ui, "PingFang SC", "Noto Sans SC", sans-serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, monospace;
  /* 展示字体:模式 B 用 Google Fonts 引 Space Grotesk;模式 A 零外链,自动回落 sans */
  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
}

/* 深色:直接覆盖变量。v4 工具类引用的是 var(--color-*),变量一变全部跟随,不用 dark: 类 */
@media (prefers-color-scheme: dark) {
  :root {
    --color-paper: #10131a;
    --color-raised: #171b24;
    --color-ink: #e8eaf0;
    --color-ink-dim: #9aa1b2;
    --color-line: #2a3040;
    --color-accent: #58c4dd;
    --color-c-blue: #58c4dd;
    --color-c-teal: #5cd0b3;
    --color-c-green: #83c167;
    --color-c-yellow: #e8c547;
    --color-c-red: #fc6255;
    --color-c-purple: #a98fd4;
  }
}
```

约定:`bg-paper text-ink` 是页面底色/正文;辅助文字 `text-ink-dim`;数值/代码 `font-mono`;**同一数学对象在图、公式、标注里始终用同一个 `--color-c-*`**。间距用 Tailwind 默认刻度(4px 基准),圆角用 `rounded-md`/`rounded-lg`。

## 骨架(模式 A:自包含单文件)

```html
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>…</title>
<script>/* 此处内联 vendor/tailwind.browser.js 全文 */</script>
<style type="text/tailwindcss">/* tokens + 少量页面自定义 */</style>
</head>
<body class="bg-paper text-ink font-sans">
<main class="mx-auto max-w-3xl px-4 py-8">…</main>
<script>/* 页面逻辑 */</script>
</body>
</html>
```

## 控件模式

- **舞台**:`<div class="rounded-lg border border-line bg-raised p-3">` 包住 canvas;canvas 的 CSS 尺寸与像素尺寸分离,按 `devicePixelRatio` 缩放,避免高分屏发虚。
- **滑块**:模式 A 用 `<input type="range" class="flex-1 accent-accent">`;模式 B 用 shadcn `<Slider>`。每个可调参数一行 `flex items-center gap-3`——标签(`text-sm text-ink-dim`)+ 滑块 + 当前值(`font-mono text-sm`,随拖动实时更新)。
- **播放/暂停**:`class="rounded-md border border-line bg-raised px-3 py-1.5 text-sm transition hover:border-accent"`,文本 ▶/⏸ 或"播放/暂停"。
- **拖拽手柄**:canvas 里可拖的点,半径 ≥ 8px,`--color-c-yellow` 填充 + 2px `--color-paper` 描边,hover 放大 1.2 倍,拖动时 `cursor: grabbing`。
- **标注 callout**:`class="border-l-[3px] border-accent bg-raised px-3 py-2 text-sm text-ink-dim rounded-r-md"`。内容**随交互状态更新**,指认画面上正在发生的事,不静态贴一排说明。
- **步进**:「上一步 / 下一步」按钮 + `<span class="font-mono text-sm text-ink-dim">3 / 5</span>`,每步只新增一个变量;不用 tab。
- **3D 交互**:OrbitControls **拖拽旋转 + 滚轮缩放都必须开**(`minDistance`/`maxDistance` 限制行程防止飞丢),平移可关。不许禁用缩放——读者要靠拉近看细节、拉远看整体。

## canvas 绘图取色

JS 里通过 CSS 变量取色,保证图形与 UI 同色系、随主题切换:

```js
const css = getComputedStyle(document.documentElement);
const color = (name) => css.getPropertyValue(`--color-${name}`).trim();
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", redraw);
```

## 动效规则

- 连续动画走 `requestAnimationFrame`(全页一个主循环);UI 过渡用 Tailwind 的 `transition` + `duration-150`/`duration-300`,缓动 `ease-out`。
- 尊重 `prefers-reduced-motion`:命中时自动播放的动画默认暂停,保留播放按钮与手动步进。

## 版式模式

视觉身份:「暗房里的坐标纸仪器」——demo 是主角,页面是仪器的面板。

- **每节一屏(Screen)**:页面不是从上往下的长文,而是一屏一节:`min-h-screen snap-start flex flex-col justify-center`,主滚动容器 `snap-y snap-proximity`。内容超一屏时允许自然滚动,不用 snap-mandatory 硬卡。
- **布局自由**:不许所有节都长一个样。按内容选布局——整屏居中陈述(动机/结论)、仪器 + 操控台分栏(demo + 控件 + 步骤)、网格(并列的「出现在哪里」卡片)、左右分栏(小结 ‖ 挑战)。**硬规则:分栏布局里图形/仪器永远在左,文字与控件在右。**「拆解」要和它操控的 demo 同屏,读者看着步骤、旁边仪器在动,不许上下隔开两屏。
- **坐标纸舞台 `.stage`**:包 canvas/WebGL 的容器。`--color-raised` 底 + 顶部 `--color-accent` 8% 径向辉光 + 28px 淡格坐标纸纹理(`--color-ink` 5% 的 1px 网格线);hover 时边框泛 accent、带同色外辉光(box-shadow 两层:1px 环 + 大面积柔光)。
- **eyebrow 标签**:每个章节顶部一行 `font-mono text-xs uppercase tracking-[0.25em] text-ink-dim`,前缀 20px 的 accent 短横线。标签词按教学法命名(动机/直觉/拆解/实验室/回响/挑战),把讲解结构编码进版式,不写装饰性标签。
- **可收折侧栏**:概念导航侧栏支持收起成窄轨(只剩编号),主区让位给仪器;宽度过渡 300ms。3D 场景用 ResizeObserver 跟随容器尺寸变化。
- **深链**:每屏带 id,支持 `?screen=xxx` 直达(测试截图和分享都用得上)。
- **展示字体 `--font-display`**:Space Grotesk(几何技术感),页面标题、章节标题专用(`letter-spacing: -0.01em`)。模式 B 用 Google Fonts `<link>` 引入;模式 A(自包含单文件)零外链,回落到 system 字体栈,**不为字体破例引外链**。
- **概念标题做颜色编码**:标题里的关键术语直接用教学强调色着色(如 CW 用 `text-c-teal`、CCW 用 `text-c-red`),与图中的对象同色。
- **入场 `.reveal`**:`translateY(10px)` 淡入 600ms,只用在页头和首个舞台,不铺满全页;reduced-motion 时关闭。
- **读数放大**:关键实时数值(如投影有向面积)用 `font-mono text-3xl` 大读数卡,不做成小字标签。
