# graphic 模板:概念讲解/教学演示页

图形、动画、可调参数是主角的页面(graphics-teach、wiki-html 的概念演示页)。先读 `../SKILL.md` 的 tokens 与交付模式,本文件只定义这个场景特有的:教学强调色、骨架、控件模式、版式模式。

## 教学强调色

给图形对象/公式符号上色的专用色,从设计系统语义色派生——在 `@theme` 里追加:

```css
@theme {
  --color-c-coral: #cc785c;  /* = primary,主角/根因/关键对象 */
  --color-c-teal: #5db8a6;
  --color-c-amber: #e8a55a;
  --color-c-green: #5db872;
  --color-c-red: #c64545;
  --color-c-ink: #141413;    /* 坐标轴、基准线等"中性"对象 */
}
```

约定:**同一数学对象在图、公式、标注里始终用同一个 `--color-c-*`**。coral 稀缺原则在此同样生效:一页里只给真正的主角对象。

## 骨架(模式 A:自包含单文件)

```html
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>…</title>
<script>/* 此处内联 vendor/tailwind.browser.js 全文 */</script>
<style type="text/tailwindcss">/* tokens + 教学强调色 + 下方 .stage 等少量页面自定义 */</style>
</head>
<body class="bg-canvas text-ink font-sans">
<main class="snap-y snap-proximity">…每节一屏…</main>
<script>/* 页面逻辑 */</script>
</body>
</html>
```

## 控件模式

- **舞台**:`<div class="stage rounded-xl border border-hairline p-3">` 包住 canvas(`.stage` 的坐标纸纹理见「版式模式」);canvas 的 CSS 尺寸与像素尺寸分离,按 `devicePixelRatio` 缩放,避免高分屏发虚。
- **滑块**:模式 A 用 `<input type="range" class="flex-1 accent-primary">`;模式 B 用 shadcn `<Slider>`。每个可调参数一行 `flex items-center gap-3`——标签(`text-sm text-muted`)+ 滑块 + 当前值(`font-mono text-sm`,随拖动实时更新)。
- **播放/暂停**:button-secondary 配方 + `transition hover:border-primary`,文本用 lucide 的 `play`/`pause` 图标或"播放/暂停"。
- **拖拽手柄**:canvas 里可拖的点,半径 ≥ 8px,`--color-c-amber` 填充 + 2px `--color-canvas` 描边,hover 放大 1.2 倍,拖动时 `cursor: grabbing`。
- **标注 callout**:`class="border-l-[3px] border-primary bg-surface-card px-3 py-2 text-sm text-muted rounded-r-md"`。内容**随交互状态更新**,指认画面上正在发生的事,不静态贴一排说明。
- **步进**:「上一步 / 下一步」按钮(button-secondary)+ `<span class="font-mono text-sm text-muted">3 / 5</span>`,每步只新增一个变量;不用 tab。
- **3D 交互**:OrbitControls **拖拽旋转 + 滚轮缩放都必须开**(`minDistance`/`maxDistance` 限制行程防止飞丢),平移可关。不许禁用缩放——读者要靠拉近看细节、拉远看整体。

## 版式模式

视觉身份:「暗房里的坐标纸仪器」穿奶油纸面的外衣——demo 是主角,页面是仪器的面板。

- **每节一屏(Screen)**:页面不是从上往下的长文,而是一屏一节:`min-h-screen snap-start flex flex-col justify-center`,主滚动容器 `snap-y snap-proximity`。内容超一屏时允许自然滚动,不用 snap-mandatory 硬卡。
- **布局自由**:不许所有节都长一个样。按内容选布局——整屏居中陈述(动机/结论)、仪器 + 操控台分栏(demo + 控件 + 步骤)、网格(并列的「出现在哪里」卡片)、左右分栏(小结 ‖ 挑战)。**硬规则:分栏布局里图形/仪器永远在左,文字与控件在右。**「拆解」要和它操控的 demo 同屏,读者看着步骤、旁边仪器在动,不许上下隔开两屏。
- **坐标纸舞台 `.stage`**:`--color-canvas` 底 + 顶部 `--color-primary` 8% 径向辉光 + 28px 淡格坐标纸纹理(`--color-ink` 5% 的 1px 网格线);hover 时边框泛 primary、带同色外辉光(box-shadow 两层:1px 环 + 大面积柔光):

  ```css
  .stage {
    background-color: var(--color-canvas);
    background-image:
      radial-gradient(ellipse at top, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 60%),
      linear-gradient(color-mix(in srgb, var(--color-ink) 5%, transparent) 1px, transparent 1px),
      linear-gradient(90deg, color-mix(in srgb, var(--color-ink) 5%, transparent) 1px, transparent 1px);
    background-size: 100% 100%, 28px 28px, 28px 28px;
  }
  .stage:hover {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px var(--color-primary),
                0 8px 40px color-mix(in srgb, var(--color-primary) 18%, transparent);
  }
  ```
- **eyebrow 标签**:每个章节顶部一行 `font-mono text-xs uppercase tracking-[0.25em] text-muted`,前缀 20px 的 primary 短横线。标签词按教学法命名(动机/直觉/拆解/原理/实验室/回响/挑战),把讲解结构编码进版式,不写装饰性标签。
- **可收折侧栏**:概念导航侧栏支持收起成窄轨(只剩编号),主区让位给仪器;宽度过渡 300ms。3D 场景用 ResizeObserver 跟随容器尺寸变化。
- **深链**:每屏带 id,支持 `?screen=xxx` 直达(测试截图和分享都用得上)。
- **展示标题**:`--font-display` 衬线(模式 B 引 Cormorant Garamond,模式 A 回落 Georgia),页面标题、章节标题专用,weight 400 + 负字距(见核心字阶表)。
- **概念标题做颜色编码**:标题里的关键术语直接用教学强调色着色(如顺时针用 `text-c-teal`、逆时针用 `text-c-red`),与图中的对象同色。
- **入场 `.reveal`**:`translateY(10px)` 淡入 600ms,只用在页头和首个舞台,不铺满全页;reduced-motion 时关闭。
- **读数放大**:关键实时数值(如投影有向面积)用 `font-mono text-3xl` 大读数卡,不做成小字标签。
