---
name: design-system
description: 所有 HTML 交互页共享的视觉语言与设计 tokens 单一事实源——奶油纸面 + 珊瑚色 + 深色产品表面的三色体系、衬线展示字体、lucide 图标,外加场景模板(graphic 教学页、code-data 伪数据/代码联动页、log-review 日志排查)与表达形式选择指南。由产出 HTML 的技能(graphics-teach、wiki-html 等)在动手前加载;不直接响应用户请求。
---

# design-system

所有 HTML 交互页共享的视觉语言,单一事实源。**样式一律用 Tailwind**,不手写零散 CSS;颜色、字阶、圆角集中在 `@theme` tokens,组件一律引用 token,**不硬编码颜色、字号、时长**;canvas/WebGL 绘图用 `getComputedStyle` 读同一组变量。

视觉身份:**奶油纸面(cream)+ 珊瑚色品牌电压(coral)+ 深色产品表面(dark surface)**,衬线展示标题配人文无衬线正文——editorial 杂志感,不是 SaaS 模板感,更不是冷灰蓝的"又一个 AI 工具"。

## 场景模板:表达形式选择

本文件只定义 tokens 与跨场景规则;模板只管**页面形态**(骨架、控件、版式、联动规则),**讲解策略**(概念分析、讲解手法)归调用模板的场景技能(graphics-teach 等)。**构建页面前先做表达形式选择**——问"这个概念的最小例子是什么":

| 概念的核心对象 | 最小例子 | 模板 | 文件 |
|---|---|---|---|
| 可见的形、运动、空间关系(变换、曲线、光照) | 一张会动的图 | graphic | `templates/graphic.md` |
| 数据的排列、对齐、流动(顶点属性、内存布局、协议字段、执行栈) | 一小段具体数据 + 几行代码 | code-data | `templates/code-data.md` |
| 事件的时间序列(故障排查、请求链路、部署) | 一串带时间戳的事件 | log-review | `templates/log-review.md` |

判断信号:如果你想画的"图"其实只是装饰、真正的内容全在注释里,说明**表格本身就是可视化**——用 code-data,不要硬画 canvas。形式可组合:主体一种模板,结尾可补另一种(比如数据联动页末尾贴一张渲染结果图)。

新场景先套已有模板;都不合身时才新增模板文件,并在上表登记。

## 交付模式

按产物形态二选一,tokens 值不变:

**A. 自包含单文件**(wiki-html 等要求双击离线可开的场景):把 `vendor/tailwind.browser.js`(v4 浏览器构建,约 280KB)**全文内联**进 `<head>` 的 `<script>`——不引 CDN、不外链,保住自包含;样式写在 `<style type="text/tailwindcss">` 块,开头 `@import "tailwindcss";`,随后照抄下节 tokens,运行时在浏览器里按需生成,任意工具类都可用。页面体积 +280KB 是正常的。字体外链同样禁止——展示字体自动回落 Georgia/系统衬线。

**B. Vite 工程**(graphics-teach 的 graphics-lab 等):`tailwindcss` + `@tailwindcss/vite` 正常接入;`index.css` 里 `@import "tailwindcss";` 后按下节 `@theme` 声明 tokens(本系统单一主题,不需要 `@theme inline` 间接层)。展示/正文字体用 Google Fonts `<link>` 引入 **Cormorant Garamond + Inter + JetBrains Mono**(Copernicus/StyreneB 是授权字体,不可得;这是最接近的开源替代)。

UI 组件用 shadcn 风格(Button / Slider / Card),类名组合遵循「组件配方」。

## Tokens

```css
@import "tailwindcss";

@theme {
  /* 表面:奶油底 + 两级奶油卡 + 深色产品表面 */
  --color-canvas: #faf9f5;           /* 页面底色,暖调奶油,不用纯白 */
  --color-surface-soft: #f5f0e8;     /* 分节带、极浅区块 */
  --color-surface-card: #efe9de;     /* 内容卡,比底色深一步 */
  --color-surface-strong: #e8e0d2;   /* 选中态 tab、强调带 */
  --color-dark: #181715;             /* 深色产品表面:代码窗、mockup、页脚 */
  --color-dark-elevated: #252320;    /* 深色带里的浮起卡 */
  --color-dark-soft: #1f1e1b;        /* 深卡里的代码块底 */

  /* 文字 */
  --color-ink: #141413;              /* 标题与首要文字,暖黑 */
  --color-body: #3d3d3a;             /* 正文 */
  --color-body-strong: #252523;      /* 强调段落 */
  --color-muted: #6c6a64;            /* 次级说明 */
  --color-muted-soft: #8e8b82;       /* Caption、细字 */
  --color-on-primary: #ffffff;       /* 珊瑚底上的文字 */
  --color-on-dark: #faf9f5;          /* 深底上的文字(与 canvas 同色调) */
  --color-on-dark-soft: #a09d96;     /* 深底次级文字 */

  /* 品牌与语义 */
  --color-primary: #cc785c;          /* 珊瑚色,唯一品牌强调色 */
  --color-primary-active: #a9583e;   /* 按压/hover 加深 */
  --color-primary-disabled: #e6dfd8; /* 禁用(与 hairline 同色) */
  --color-hairline: #e6dfd8;         /* 1px 边线,像"高一级台阶"而非墨线 */
  --color-hairline-soft: #ebe6df;    /* 同带内的弱分隔线 */
  --color-teal: #5db8a6;             /* 次级点缀:状态点、连接指示 */
  --color-amber: #e8a55a;            /* 小面积暖色点缀:徽标、行内高亮 */
  --color-success: #5db872;
  --color-warning: #d4a017;
  --color-error: #c64545;

  /* 字体:展示用衬线,正文用人文无衬线,代码用等宽 */
  --font-display: "Tiempos Headline", "Cormorant Garamond", "EB Garamond", Georgia, serif;
  --font-sans: Inter, ui-sans-serif, system-ui, "PingFang SC", "Noto Sans SC", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;

  /* 圆角阶梯:按钮/输入 8,卡片 12,大容器 16,徽标全圆 */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}
```

约定:`bg-canvas text-ink font-sans` 是页面底色/正文;正文段落 `text-body`;辅助文字 `text-muted`;数值/代码 `font-mono`。**单一主题,不做 prefers-color-scheme 暗色**——深色只作为「表面模式」出现在代码窗、产品 mockup 卡、CTA 带与页脚(`bg-dark text-on-dark`),靠奶油↔深色的交替形成页面节奏。

### 字阶

展示字号**永远 weight 400、负字距**,这是衬线展示体的品牌声线,不可加粗:

| 用途 | 类组合 |
|---|---|
| display-xl(首页 h1,64px) | `font-display font-normal text-[64px] leading-[1.05] tracking-[-1.5px]` |
| display-lg(节标题,48px) | `font-display font-normal text-[48px] leading-[1.1] tracking-[-1px]` |
| display-md(子节标题,36px) | `font-display font-normal text-[36px] leading-[1.15] tracking-[-0.5px]` |
| display-sm(卡标题/callout 标题,28px) | `font-display font-normal text-[28px] leading-[1.2] tracking-[-0.3px]` |
| title-lg(22px) | `font-sans font-medium text-[22px] leading-[1.3]` |
| title-md(18px) | `font-sans font-medium text-[18px] leading-[1.4]` |
| title-sm(16px) | `font-sans font-medium text-[16px] leading-[1.4]` |
| body-md(正文 16px) | `font-sans text-[16px] leading-[1.55]` |
| body-sm(14px) | `font-sans text-[14px] leading-[1.55]` |
| caption(徽标 13px) | `font-sans font-medium text-[13px] leading-[1.4]` |
| caption-uppercase(标签 12px) | `font-sans font-medium text-[12px] leading-[1.4] tracking-[1.5px] uppercase` |
| code(14px) | `font-mono text-[14px] leading-[1.6]` |
| button / nav-link(14px) | `font-sans font-medium text-[14px]` |

移动端 display-xl 降到 32px。强调时**先放大衬线字号,再考虑加粗**。

### 间距与圆角

间距用 Tailwind 默认 4px 刻度:**节间距 96px(`py-24`),卡片内边距 32px(`p-8`),代码窗 24px(`p-6`)**。圆角按 token 阶梯:按钮/输入/tab `rounded-md`(8px),卡片 `rounded-lg`(12px),hero 大容器 `rounded-xl`(16px),徽标 `rounded-full`。

### 层级与深度

**色块优先,阴影稀有**。深度来自奶油↔深色的表面交替,不靠投影:浅色区用 1px `border-hairline` 或 `bg-surface-card` 分一层;深色表面自带产品镀铬(行号、语法高亮、状态栏)提供细节。hover 浮起才允许极淡阴影 `shadow-[0_1px_3px_rgba(20,20,19,0.08)]`。

## 组件配方

全部引用 token;状态变体只做 default 与 active/disabled/focused,**不设计额外 hover 样式**(primary 按压加深除外)。

```text
button-primary    bg-primary text-on-primary rounded-md h-10 px-5 font-medium text-sm
                  active:bg-primary-active  disabled:bg-primary-disabled disabled:text-muted
button-secondary  bg-canvas text-ink border border-hairline rounded-md h-10 px-5 font-medium text-sm
button-on-dark    bg-dark-elevated text-on-dark rounded-md h-10 px-5 font-medium text-sm
text-link         text-primary 行内链接,按压下划线
icon-button       size-9 rounded-full bg-canvas border border-hairline text-ink(放 lucide 图标)
card              bg-surface-card rounded-lg p-8(内容卡)
card-bordered     bg-canvas border border-hairline rounded-lg p-8(定价/对比卡)
code-window       bg-dark text-on-dark font-mono rounded-lg p-6,内部代码块 bg-dark-soft,
                  行号 text-muted-soft;代码横向滚动,不换行
callout-coral     bg-primary text-on-primary rounded-lg p-8/p-12——整 bleed 珊瑚是稀缺的大动作
badge             bg-surface-card text-ink rounded-full px-3 py-1 caption
badge-coral       bg-primary text-on-primary rounded-full px-3 py-1 caption-uppercase
tab               px-3.5 py-2 rounded-md text-muted;active: bg-surface-card text-ink
text-input        bg-canvas border border-hairline rounded-md h-10 px-3.5 text-[16px]
                  focus: border-primary + 3px ring color-mix(primary 15%)
```

## 图标:统一 lucide

- 图标一律来自 **lucide**,不混用其他图标集,不拿 emoji 当图标。
- 模式 A(自包含):从 lucide 复制**用到的**图标 SVG 原文内联,`stroke="currentColor"`,不引 CDN。
- 模式 B(Vite):`lucide-react` 包,`<Icon size={20} strokeWidth={1.75} />`。
- 尺寸阶梯 16 / 20 / 24,`stroke-width` 1.5~2,颜色用 `currentColor` 跟随上下文文字色。

## canvas 绘图取色

JS 里通过 CSS 变量取色,保证图形与 UI 同色系:

```js
const css = getComputedStyle(document.documentElement);
const color = (name) => css.getPropertyValue(`--color-${name}`).trim();
```

单一主题,无需监听主题切换;取色在初始化时读一次即可。

## 动效规则

- 连续动画走 `requestAnimationFrame`(全页一个主循环);UI 过渡用 Tailwind 的 `transition` + `duration-150`/`duration-300`,缓动 `ease-out`。
- 尊重 `prefers-reduced-motion`:命中时自动播放的动画默认暂停,保留播放按钮与手动步进。

## Do / Don't

**Do**
- 每页锚定奶油 canvas;展示标题用衬线 400 + 负字距;正文人文无衬线。
- 珊瑚色稀缺使用:单个元素上克制,只允许在整 bleed 的 callout/CTA 带上慷慨。
- 浅色带与深色表面带交替排布(cream → 奶油卡 → 深色 mockup → cream → coral callout → 深色页脚),这是页面的节奏机制;连续两条带不用同一种表面。

**Don't**
- 不用纯白/冷灰做底色;不用冷蓝、饱和青做强调色;不引入第四种表面色调(紫卡、绿区块)。
- 不给衬线展示体加粗;不用 Inter 做展示标题。
- 不手写 hex、字号、时长到组件里;不从 lucide 之外取图标。
