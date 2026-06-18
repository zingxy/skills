import {
  Callout,
  ChartFrame,
  DiagramFrame,
  Prose,
  Stat,
  StatGrid,
  type PresentationDoc,
} from '@/components/blocks';
import { TokenTiers } from './visuals/TokenTiers';
import { ThemeGenerator } from './visuals/ThemeGenerator';
import { StyleTokens } from './visuals/StyleTokens';
import { AdaptiveLayout } from './visuals/AdaptiveLayout';

export const doc: PresentationDoc = {
  frontmatter: {
    title: 'Material Design 3 是怎么运作的',
    subtitle: '从一颗种子色讲透 M3:design tokens、tonal palette、color roles、动态配色与自适应布局。',
    authors: ['学习笔记'],
    date: '2026 年 6 月',
    tags: ['Material Design 3', '设计系统', 'UI', '动态配色'],
    tldr:
      'M3 的核心是一条“自动配色流水线”:一颗种子色经 HCT 调出 0–100 色阶,分配到 color roles,组件只问角色要色——于是浅色/深色/壁纸主题全自动产出。再加上三级 design tokens 和基于 breakpoints 的自适应布局,一套定义就能适配千万种设备。',
  },

  overview: (
    <Prose
      markdown={`Material Design 3(M3)是 Google 的设计系统。如果你还不清楚“设计系统”是什么,建议先看《系统地学会“设计系统”》——这里我们假设你已经懂了分层、token、组件那套,专门看 **M3 把它做成了什么样、特别在哪**。

- **目标:** 一套定义,自动适配**浅色/深色**、**用户壁纸的主题色**、**手机到桌面各种屏幕**。
- **主线类比:** M3 是一台**自动配色流水线**——投进一颗种子色(或壁纸),它调出整条色阶、分配到角色、产出浅/深主题,组件只管“问角色要色”。
- **学习顺序:** 我们仍自底向上——先看 token 这个中枢,再看颜色凭什么能自动适配,然后是其它样式,最后是布局。`}
    />
  ),

  sections: [
    {
      id: 'why-m3',
      title: 'M3 想多解决一件事:一次定义,自动适配',
      intent: '通用设计系统讲“分层”;M3 痴迷于“同一套定义自动适配千变万化的环境”。',
      content: (
        <>
          <Prose
            markdown={`通用设计系统告诉你“要分层、要 token、要组件”。M3 在此之上,把全部精力压在一个更狠的目标上:

> 我只想定义**一次**,然后它要在浅色和深色模式下都好看、能跟着用户手机壁纸自动换主题色(这就是 **Material You**)、还要从手机一路适配到平板和桌面。

手动给每种组合都画一版,是不可能维护的。M3 的整套设计,都是为了把这件事变成**算法和规则**自动产出。`}
          />
          <Callout tone="why" title="它靠三样东西做到这点">
            <strong>① 三级 design tokens</strong>——让“换主题”只需动一层;<strong>② 算法化的颜色系统</strong>(tonal palette + color roles)——
            从一颗种子色算出整套浅/深配色;<strong>③ 基于 breakpoints 的自适应布局</strong>——同一界面按屏幕宽度自动改形态。
            接下来三节就拆这三样。
          </Callout>
        </>
      ),
    },
    {
      id: 'tokens',
      title: '中枢:三级 design tokens',
      intent: 'reference → system → component。组件永远不写死颜色,只指向角色。',
      content: (
        <>
          <Prose
            markdown={`M3 把 token 显式分成**三级**,这是它能“一次定义、处处适配”的地基:

- **reference(ref)**——所有原始值,比如整条色阶里的某个色调 \`palette.primary40\`。
- **system(sys)**——角色 / 选择,比如 \`sys.color.primary\`。**主题就活在这一层。**
- **component(comp)**——某个组件的具体属性,比如 \`filledButton.container.color\`,它只指向 sys 角色。

意义是:设计和代码**共享同一个真相源**。下面追踪一个值怎么从 ref 流到组件,再切深色看看哪一段变了:`}
          />
          <DiagramFrame
            title="追踪一个 token:ref → sys → comp"
            caption="切到深色:变的只有 sys→ref 这一段指向(primary40 → primary80);组件 token 一个字没改。换主题 = 只动中间那层——这就是三级 token 的全部意义。"
          >
            <TokenTiers />
          </DiagramFrame>
        </>
      ),
    },
    {
      id: 'color',
      title: '颜色凭什么自动适配:tonal palette + color roles',
      intent: '别存颜色,存“配方”:一颗种子色 → HCT → 0–100 色阶 → 角色 → 浅/深 scheme。',
      content: (
        <>
          <Prose
            markdown={`这是 M3 最精彩、也最“黑科技”的一节。诀窍一句话:**别存颜色,存配方。**

你只给系统**一颗种子色**。M3 在 **HCT** 色彩空间里(Hue 色相 / Chroma 彩度 / Tone 色调,一个让“亮度”在感知上均匀的空间)把它展开成一条 **0–100 的 tonal palette**(0 是黑、100 是白)。然后把不同的 tone 分配给不同的 **color roles**(primary、surface……)。浅色和深色,只是从同一条色阶里**挑不同的 tone**。

动手试:换一颗种子色(就当是换了张壁纸),看整套色阶、角色、右边整个界面、连深/浅色一起重算:`}
          />
          <ChartFrame
            title="Material You 配色生成器(Google 官方算法)"
            caption="界面里没有任何 hex,只写了 primary、onPrimaryContainer 这些角色名。换种子色 → 全套重算。这就是 dynamic color:从壁纸取一颗色,算法配齐一切。用的是 Google 官方 material-color-utilities。"
          >
            <ThemeGenerator />
          </ChartFrame>
          <Callout tone="why" title="为什么角色总是成对出现(primary / on-primary)?">
            每个“底色”角色都配一个 <strong>on-</strong> 角色,专门放在它上面的文字/图标。M3 在生成时让这两者的 tone 拉开足够距离,
            <strong>自动满足对比度</strong>(无障碍)。所以你只要“底色用 primary、上面的字用 onPrimary”,就不可能配出看不清的组合——
            换任何种子色、切深浅色都成立。
          </Callout>
        </>
      ),
    },
    {
      id: 'styles',
      title: '不止颜色:shape / type / elevation / motion 也都 token 化',
      intent: '同一套“先定规则、组件取用”的思路,贯穿所有视觉维度。',
      content: (
        <>
          <Prose
            markdown={`颜色只是最亮眼的一个。M3 把**形状、文字、高度、动效**也都做成了 token 刻度——组件一律“按角色取用”,而不是各写各的。点开四个标签感受一下:`}
          />
          <DiagramFrame
            title="四种样式 token:Shape / Type / Elevation / Motion"
            caption="注意 Elevation 标签:M3 的高度不只靠阴影,层级越高叠的“主色染色(tint)”越重——所以深色模式下没有阴影也能分清高低(tone-based surfaces)。"
          >
            <StyleTokens />
          </DiagramFrame>
          <Callout tone="note" title="一个反复出现的模式">
            每一种样式都是“一组按角色命名的刻度”:shape 有 none→full,type 有 display→label,motion 有 short/medium/long。
            <strong>定义在刻度上、组件按角色取用</strong>——这正是上一篇“先定看不见的规则”的同一套思路,M3 把它贯彻到了每个维度。
          </Callout>
        </>
      ),
    },
    {
      id: 'adaptive',
      title: '自适应布局:一套界面,多种屏幕',
      intent: 'breakpoints 在固定阈值切换布局;导航形态 bar → rail → drawer。',
      content: (
        <>
          <Prose
            markdown={`最后一块:同一套界面怎么从手机适配到桌面。M3 用 **breakpoints**(早期叫 window size classes)在几个固定宽度阈值处切换布局:**compact → medium → expanded → large → extra-large**。导航也跟着换形态:手机底部导航栏 → 平板侧边 rail → 桌面展开 drawer。拖一拖宽度:`}
          />
          <DiagramFrame
            title="拖动窗口宽度,看布局与导航自适应"
            caption="同一个屏幕,只改了宽度:到了阈值,导航形态和内容列数就整体切换。这是规则化的自适应,而不是为每种设备各画一版(M3 还给常见场景定了 canonical layouts:列表-详情、信息流等)。"
          >
            <AdaptiveLayout />
          </DiagramFrame>
        </>
      ),
    },
  ],

  summary: (
    <>
      <StatGrid>
        <Stat value="1 颗种子色" caption="经 HCT 算出整套配色 + 浅/深 scheme" />
        <Stat value="ref→sys→comp" caption="三级 token:换主题只动中间层" />
        <Stat value="成对 on-color" caption="primary / on-primary 配对,自动达标对比度" />
        <Stat value="breakpoints" caption="compact→xl,导航与布局规则化自适应" />
      </StatGrid>
      <Prose
        markdown={`**M3 到底特别在哪(相对通用设计系统):**

1. **把 token 显式分三级**(ref / sys / comp),让“换主题”只动中间一层。
2. **颜色是算出来的,不是挑出来的**——一颗种子色经 HCT 展开成 0–100 色阶,分配到成对的 color roles,浅/深主题与壁纸主题(Material You)全自动产出。
3. **on-color 配对**让对比度自动达标,无障碍内建。
4. **所有视觉维度都 token 化**(shape/type/elevation/motion),高度还用“主色染色”而非纯阴影。
5. **breakpoints 驱动自适应布局**,一套界面适配手机到桌面。

记住那台**自动配色流水线**:种子色进去,整套主题出来,组件只问角色要色。理解了它,你就抓住了 M3 的精髓。`}
      />
      <Callout tone="note" title="彩蛋:M3 Expressive(2025)">
        M3 的最新演进,把“情感和重点”也系统化了:更强的<strong>视觉强调(emphasis)</strong>层级、更有弹性的
        <strong>物理感动效(springy motion)</strong>、以及组件按下时的<strong>形状变形(shape morph)</strong>。
        内核没变——依旧是 token + 角色;只是把“表现力”也变成了可调的系统参数。入门阶段了解到这一层即可。
      </Callout>
    </>
  ),

  glossary: [
    { term: 'Design token(三级)', def: 'M3 把 token 分 reference(原始值)/ system(角色)/ component(组件属性)三级。组件指向角色,角色指向原始值;换主题只动中间层。' },
    { term: 'HCT', def: 'Hue(色相)/ Chroma(彩度)/ Tone(色调)色彩空间。Tone 在感知上均匀,所以能可靠地生成对比度达标的配色。' },
    { term: 'Tonal palette(色阶)', def: '由一颗种子色在 HCT 里展开出的 0–100 共 13 级色调(0 黑、100 白)。一切角色颜色都从这里挑。' },
    { term: 'Color role(颜色角色)', def: '语义化的颜色槽:primary / secondary / tertiary(强调)、surface(背景)、container(前景填充)等。组件只引用角色名。' },
    { term: 'on-color', def: '与某底色配对、放在它上面的文字/图标颜色(如 on-primary)。M3 保证它与底色对比度达标。' },
    { term: 'Scheme(配色方案)', def: '一整套角色→颜色的映射。同一条 tonal palette 能生成 light 和 dark 两套 scheme。' },
    { term: 'Dynamic color / Material You', def: '从用户壁纸(或品牌色)算法生成完整配色方案的能力,兼顾个性化与无障碍。' },
    { term: 'Tone-based surface(高度)', def: 'M3 用叠加“主色染色(tint)”的深浅表达 elevation,而非只靠阴影——深色模式也能区分层级。' },
    { term: 'Type scale / Shape scale', def: '按角色命名的字号刻度(display→label)与圆角刻度(none→full)。组件按角色取用。' },
    { term: 'Breakpoint(窗口尺寸级)', def: '布局需要改变的窗口宽度阈值:compact / medium / expanded / large / extra-large。曾称 window size class。' },
    { term: 'Canonical layout', def: 'M3 为常见场景预设的布局范式(列表-详情、支撑面板、信息流),配合 breakpoints 自适应。' },
  ],

  references: (
    <Prose
      markdown={`基于 Material Design 3 官方文档重新组织(自底向上的学习顺序、流水线主线类比与可交互 demo 为本文所加;配色 demo 使用 Google 官方 \`@material/material-color-utilities\`):

- [Color system overview](https://m3.material.io/styles/color/system/overview)
- [Color roles](https://m3.material.io/styles/color/roles)
- [Dynamic color](https://m3.material.io/styles/color/dynamic/user-generated-source)
- [Design tokens](https://m3.material.io/foundations/design-tokens/overview)
- [Adaptive design / breakpoints](https://m3.material.io/foundations/layout/applying-layout/window-size-classes)`}
    />
  ),
};

export default doc;
