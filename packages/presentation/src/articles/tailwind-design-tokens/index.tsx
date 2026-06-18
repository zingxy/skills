import {
  Callout,
  ChartFrame,
  CodeBlock,
  DiagramFrame,
  Prose,
  Stat,
  StatGrid,
  type PresentationDoc,
} from '@/components/blocks';
import { ThemeSwitchTeaser } from './visuals/ThemeSwitchTeaser';
import { UtilityGenerator } from './visuals/UtilityGenerator';
import { PrefixSorter } from './visuals/PrefixSorter';
import { TierLadder } from './visuals/TierLadder';
import { WiringFlow } from './visuals/WiringFlow';
import { CvaPlayground } from './visuals/CvaPlayground';

export const doc: PresentationDoc = {
  frontmatter: {
    title: '你天天在用的 design system',
    subtitle: '从一行 className="bg-primary" 出发,把你每天在写的 Tailwind + shadcn,还原成一套完整的三级 design token 系统。',
    authors: ['学习笔记'],
    date: '2026 年 6 月',
    tags: ['Design Token', 'Tailwind', 'shadcn/ui', 'CVA', '前端视角'],
    tldr:
      '“design system”不是设计师的玄学——你写 Tailwind + shadcn 时就在运行一套。把它拆开看:token 是你登记的“回路”,utility(bg-primary)是配电盘自动装出的“带标签插座”,组件只认插座、从不接裸线;换肤=在配电盘背后改回路接哪根线。Tailwind 提供引擎 + reference 层地基,shadcn 补上 system(角色名)和 component(CVA 组合)两层。',
  },

  overview: (
    <Prose
      markdown={`你大概写过几百遍 \`className="bg-primary p-4 rounded-md"\`,但很少把它和“**设计系统**”这个词联系起来——那听上去是设计师在 Figma 里搞的东西。

这门课只想说服你一件事:**你早就在运营一套 design system 了,它就藏在你的 className 里。** 我们不讲设计师视角的理论,而是从你每天真在写的代码出发,把它拆开。

- **驱动问题:** 你写的 \`bg-primary\`,凭什么能一键换肤、整个团队还不会为“到底用哪个蓝”吵架?
- **主线类比——配电盘 + 带标签的插座:** \`token\` 是你在配电盘上登记的一条**回路**(一个名字,接到某个值);\`utility\`(\`bg-primary\`)是配电盘按回路**自动装到墙上的、带标签的插座**;**组件**是电器,只认插座标签、从不直接接裸铜线(hex);**换肤**就是在配电盘背后改“primary 这条回路接哪根线”——所有插座、所有电器,一个都不用动。
- **顺序:** 先给你看爽点(一键换肤),再一层层拆开:谁造的插座 → 为什么只有某些插座 → 插座也分等级 → 角色名和组件谁来定。`}
    />
  ),

  sections: [
    {
      id: 'already',
      title: '你早就在运营一套 design system',
      intent: '先把“爽点”给你:一键换肤。再回头解释它凭什么成立。',
      content: (
        <>
          <Prose
            markdown={`先不解释,先玩。下面是一个迷你打卡 UI。切换浅/深、换个品牌色——注意:**整张卡片的颜色全变了,但它的结构、class、组件代码,一个字都没动。**`}
          />
          <ChartFrame
            title="同一段 UI,一键换肤"
            caption="你切的只是“浅/深”和“品牌色”,本质上就是改了几个语义 token 的值(primary、background、card、border…)。组件只是引用这些名字,所以值一变,它们全部跟上。这就是 design token 的全部威力——而你天天在用。"
          >
            <ThemeSwitchTeaser />
          </ChartFrame>
          <Callout tone="why" title="它真正解决的是“多人 + 多端 + 长期”的一致性">
            一个人做小页面,凭脑子也能保持一致。一旦<strong>多人协作、多个页面、还要浅色深色多套主题</strong>,
            “这个蓝到底用哪个 hex”就会失控。design token 的办法是:<strong>谁都不准写 hex,只准引用一个名字</strong>(<span className="font-mono">primary</span>);
            名字背后的值集中管。于是换肤=改几个值,对齐=大家都指同一个名字。剩下的整门课,就是看这套“名字系统”在 Tailwind + shadcn 里具体长什么样。
          </Callout>
        </>
      ),
    },
    {
      id: 'engine',
      title: 'Tailwind 的真身:一台 token → utility 引擎',
      intent: '那些 bg-primary 是谁造的?utility 就是 token 的“插座/出口”。',
      content: (
        <>
          <Prose
            markdown={`回到那个换肤 demo:组件里写的是 \`bg-primary\`。这个 class 是哪来的?**不是 Tailwind 自带的**——Tailwind 自带的是 \`bg-blue-500\` 这种默认色阶。\`bg-primary\` 是**被生成出来的**。

这就引出 Tailwind 的真身:它本质是**一台“token → utility”的代码生成器**。你用 \`@theme\` 登记一个 token(一条回路),它就自动替你造出一整套配套 utility(墙上的插座)。下面这个生成器,你改“登记的值”,看引擎吐出什么:`}
          />
          <ChartFrame
            title="登记一个 token,看引擎生成一整套 utility"
            caption="你只写了一行 --color-brand: <值>;,Tailwind 就自动产出 bg-brand / text-brand / border-brand / ring-brand…… 全都指向这个值。改值 → 整套 utility 一起变。一个 token,一面墙的插座。"
          >
            <UtilityGenerator />
          </ChartFrame>
          <Prose
            markdown={`这里的 \`@theme\` 是 **Tailwind v4 的一个 CSS at-rule**(v3 是在 \`tailwind.config.js\` 里用 JS 配)。写进 \`@theme\` 的变量有双重身份:既是 Tailwind 用来**生成 utility** 的配置,又是一个**真实的 CSS 变量**(运行时能读、能被 \`.dark\` 覆盖)。

而 utility 本身,就是“**消费/出口层**”——它只负责把某个值搬到 DOM 上。它分两种:`}
          />
          <StatGrid>
            <Stat value="token 型" caption="bg-primary / p-4 / rounded-md —— 取某个 token 的值,可主题化" />
            <Stat value="关键字型" caption="flex / absolute / justify-between —— 固定 CSS 关键字,没 token" />
          </StatGrid>
          <Callout tone="note" title="一句话记住这一层">
            Tailwind = <strong>一套默认 reference token(blue-500、spacing 基准…)+ 一个 @theme 引擎 + 一套 utility 出口</strong>。
            <span className="font-mono">bg-primary</span> 不是它自带的,是你喂了一个 <span className="font-mono">primary</span> 回路、它替你造出来的插座。
          </Callout>
        </>
      ),
    },
    {
      id: 'prefixes',
      title: '为什么只有 color、spacing 有前缀,display 没有?',
      intent: '前缀对应“值得做成共享刻度的维度”——刻度型 vs 关键字型。',
      content: (
        <>
          <Prose
            markdown={`\`@theme\` 里能登记的 token 是按**命名空间前缀**分类的:\`--color-*\`、\`--spacing-*\`、\`--text-*\`、\`--radius-*\`、\`--shadow-*\`、\`--font-*\`、\`--breakpoint-*\`、\`--ease-*\`……

但你**找不到** \`--display-*\`、\`--position-*\`、\`--justify-*\`。为什么?不是 Tailwind 偷懒,而是有条清晰的分水岭——**这个维度的值,是一把可大可小的“刻度”,还是一小撮固定的“关键字”?**

- **刻度型**(颜色、间距、圆角、字号):值是连续的、需要团队统一“取多少”。各写各的就会乱(一个 13px、一个 16px)——所以**值得做成一套共享刻度,配一个前缀**。
- **关键字型**(display、position、overflow):值就是 CSS 规定死的几个词,没有“取多少”,只有“选哪个”。**没有刻度可统一**——所以给 utility(\`flex\`、\`absolute\`)就够了,不配前缀。

自己分一遍试试:`}
          />
          <ChartFrame
            title="刻度型 vs 关键字型:谁该有前缀?"
            caption="判据只有一句:这东西如果大家各写各的会乱、值得收成一套共享刻度吗?是 → 配前缀(成为可登记的 token 维度);不是 → 给个 utility 就够了。"
          >
            <PrefixSorter />
          </ChartFrame>
          <Callout tone="tradeoff" title="两条补充规则">
            <strong>① 一把尺服务多属性:</strong>没有 <span className="font-mono">--width-*</span>、<span className="font-mono">--gap-*</span>——
            宽高、padding、gap 全从同一个 <span className="font-mono">--spacing</span> 基准推;颜色类全吃 <span className="font-mono">--color-*</span> 一套调色板。
            前缀是按<strong>语义维度</strong>切,不是按 CSS 属性切。
            <span className="mt-2 block">
              <strong>② 这套清单不是规范,是策展。</strong>它挑的是“实践中最容易出不一致、最值得 token 化”的维度,而且<strong>会长</strong>——
              比如 <span className="font-mono">--text-shadow-*</span> 是 v4.1 才补的。判据始终没变。
            </span>
          </Callout>
        </>
      ),
    },
    {
      id: 'tiers',
      title: 'blue-500 和 primary,凭什么不同级?',
      intent: '三级 token:reference → system → component。名字决定层,不是前缀。',
      content: (
        <>
          <Prose
            markdown={`\`--color-blue-500\` 和 \`--color-primary\` 用的是**同一个前缀**,长得一模一样。但它们其实处在 design token 的**不同层**。token 经典分三层:

1. **reference(原始值)** —— 按**外观/数值**命名,如 \`blue-500\`、\`spacing-4\`。就是“一个值”。
2. **system / semantic(语义)** —— 按**角色**命名,如 \`primary\`、\`danger\`、\`background\`。主题住这一层。
3. **component(组件)** —— 某组件某部位的具体样式。

关键、也是最反直觉的一点:**前缀(\`--color-*\`)只是“维度/管道”,它不决定层。决定层的,是你给后缀起的名字——外观名 → reference,角色名 → system。** 下面这个 demo 让你亲眼看到差别:`}
          />
          <DiagramFrame
            title="三级阶梯 + “名字会不会撒谎”"
            caption="同一个 --color-* 前缀,blue-500(外观名)是 reference 层、把蓝焊死了,夜间没法变;primary(角色名)是 system 层、换肤时跟着走。component 层根本不是 token——它塌缩进了组件的 className 组合。"
          >
            <TierLadder />
          </DiagramFrame>
          <Prose
            markdown={`所以三层在前端里是这样落地的(顺便说清各层谁负责):`}
          />
          <CodeBlock
            filename="三级 token 在前端的真身"
            lang="css"
            caption="reference 由 Tailwind 自带;system 是你/shadcn 用角色名加的(主题住这);component 不写成 token,而是组件里那串 utility 组合。"
            code={`/* reference —— Tailwind 自带,按外观命名 */
--color-blue-500: oklch(...);     /* 就是“一个蓝”          */

/* system —— 你/shadcn 加,按角色命名,换肤改这层 */
--color-primary: var(--brand);    /* “主色这个角色”        */

/* component —— 不是 token,是组件里的 className 组合 */
<button class="bg-primary text-primary-foreground h-9 px-4" />`}
          />
          <Callout tone="why" title="为什么 component 层在前端“消失”了?">
            因为一个按钮的样子是<strong>颜色 + 尺寸 + 圆角 + 排版</strong>好几个 token 的合体,做成单个 <span className="font-mono">--color-button-bg</span> 反而表达不全。
            前端更划算的做法是<strong>直接堆语义 utility</strong>,用组合表达组件——这串组合,就是 component 层的真身。
            (对比:M3 那种要喂 Android/iOS/Web 多端的体系,才会显式做 <span className="font-mono">md.comp.button.container.color</span> 这种 component token。)
          </Callout>
        </>
      ),
    },
    {
      id: 'shadcn',
      title: 'shadcn 干的:把 system + component 两层补上',
      intent: 'Tailwind 只给 reference 层和引擎,角色名和组件谁来定?shadcn。',
      content: (
        <>
          <Prose
            markdown={`现在能精确回答 shadcn 到底是什么了:**它没有自己的 token 机制,完全骑在 Tailwind 上**,核心只做一件事——**接线**:把 Tailwind 缺的 system 层和 component 层接起来。下面这条流水线,就是你项目里真实的 \`src/index.css\` 的运作方式。改 \`--primary\` 或切 \`.dark\`,看新值怎么一级级"通电"流到组件:`}
          />
          <DiagramFrame
            title="一条会通电的接线流水线:值怎么从 :root 流到组件"
            caption="① :root/.dark 用角色名登记 system 层,每个面色配一个 -foreground(on-color 配对);单个 --radius 还能用 calc 派生整套圆角。② @theme inline 把它接进 Tailwind——inline 让 utility 引用 var() 而非固化成值,所以源头一改、整条管道跟着亮。③ 引擎生成 bg-primary 等插座。④ 组件只把插座组合起来用,绝不碰 hex。换肤,只动最上面那一格。"
          >
            <WiringFlow />
          </DiagramFrame>
          <Prose
            markdown={`第三件事——**组件**(\`button.tsx\` 被 CLI 抄进你的 \`components/ui/\`,代码归你)。组件里永远只写**角色名 utility**(\`bg-primary\`、\`text-muted-foreground\`),绝不写 hex。而“同一个组件的不同变体”由 **CVA**(class-variance-authority)管理——它就是把 \`variant\` / \`size\` 映射到对应的 className 组合。玩一下:`}
          />
          <ChartFrame
            title="CVA:把 variant + size 拼成一串语义 utility"
            caption="选不同 variant / size,看下面的 className 字符串怎么拼出来、真实按钮怎么变。注意:没有新造任何 token——组件只是把 shadcn 在 system 层定义好的“插座”(bg-primary 等)组合起来用。这就是 component 层 = utility 的组合。"
          >
            <CvaPlayground />
          </ChartFrame>
          <Callout tone="decision" title="所以 Tailwind 和 shadcn 的分工是">
            <strong>Tailwind</strong> 给地基(reference 层默认刻度)+ 引擎(<span className="font-mono">@theme</span> 生成 utility)+ 结构 utility(flex/grid)。
            <strong> shadcn</strong> 在它之上补两层:<strong>system 层</strong>(<span className="font-mono">:root</span>/<span className="font-mono">.dark</span> 的角色名 + on-color 配对 + 单旋钮派生)和 <strong>component 层</strong>(CVA 组件)。
            两者合起来,才是一套完整、能换肤的三级 design token 系统——也就是第 1 节那个换肤 demo 背后的全部机关。
          </Callout>
        </>
      ),
    },
  ],

  summary: (
    <>
      <StatGrid>
        <Stat value="按名字,不按值" caption="组件引用角色名,名字背后的值集中管——这就是 token 的内核" />
        <Stat value="utility = 出口" caption="层无关的消费面;喂 reference 出 bg-blue-500,喂 role 出 bg-primary" />
        <Stat value="名字决定层" caption="外观名→reference,角色名→system;前缀只是维度" />
        <Stat value="Tailwind + shadcn" caption="引擎+地基 / 语义+组件,合成完整三级系统" />
      </StatGrid>
      <Prose
        markdown={`**把整条链一次性串起来:**

\`\`\`
token（定义值，分 reference / system / component 三层）
   ↓ 通过
utility（原子 class，把值投递到 DOM —— 消费层，层无关）
   ↓ 组合成
className 字符串（= 组件的实际样式，前端的 component 层）
\`\`\`

1. **reference** —— Tailwind 自带的默认刻度(\`blue-500\`、\`spacing\`),按外观命名。
2. **engine** —— \`@theme\` 登记一个 token,Tailwind 自动生成一整套 \`bg-/text-/border-\` utility。
3. **前缀** —— 只给“值得统一成刻度”的维度(color/spacing/…),关键字型(display/flex)不配。
4. **system** —— 你/shadcn 用角色名(\`primary\`/\`muted\`)在 \`:root\`/\`.dark\` 里加,主题住这层。
5. **component** —— 不写成 token,而是组件里那串语义 utility 的组合,用 CVA 管 variant。

记住那个画面就够了:**你的项目就是一座配电盘——Tailwind 是配电盘和它自带的标准回路,shadcn 在背后接好了“primary/muted”这些带名字的回路,你写组件时只是把电器插进墙上带标签的插座。想换肤?去配电盘背后改回路接哪根线,插座和电器一个都不用动。**`}
      />
    </>
  ),

  glossary: [
    { term: 'Design token', def: '给某个设计决定起的、可复用的名字(如 primary、space-4)。组件引用名字而非值,改名字背后的值,所有引用处一起变。' },
    { term: 'Reference / system / component(三级 token)', def: '原始值(按外观命名)→ 语义角色(按角色命名,主题住这)→ 组件具体样式。前端里 component 层常塌缩成 className 组合。' },
    { term: 'Utility class', def: 'Tailwind 的原子级 class,一个对应一条 CSS 声明(bg-primary、p-4)。是 token 的“消费/出口层”,层无关。' },
    { term: '@theme', def: 'Tailwind v4 的 CSS at-rule,用来登记 token。声明 --color-x 即自动生成 bg-x/text-x… 同时它也是真实 CSS 变量。' },
    { term: '@theme inline', def: '让生成的 utility 内联引用 var() 而非固化成值,这样 .dark 覆盖语义变量时,所有 utility 能跟着变。' },
    { term: '命名空间前缀', def: '--color-* / --spacing-* / --radius-* … 决定一个 token 生成哪类 utility。只给“值得做成共享刻度”的维度,关键字型属性(display)不配。' },
    { term: '语义 / 角色命名', def: '按用途起名(primary、danger)而非外观(blue-500)。外观名换肤时会“撒谎”,角色名不会。' },
    { term: 'on-color(-foreground)', def: 'shadcn 的配对约定:每个面色配一个 -foreground 作为“在它上面的文字色”,保证对比度。等同 M3 的 on-color roles。' },
    { term: 'shadcn/ui', def: '不是 npm 组件库,而是用 CLI 把组件源码抄进你项目(代码归你)。底层 = Radix(交互/无障碍)+ Tailwind(样式),补齐 system+component 两层。' },
    { term: 'CVA(class-variance-authority)', def: '把组件的 variant / size 映射到对应 className 组合的小工具。shadcn 组件内部几乎都用它管理变体。' },
  ],

  references: (
    <Prose
      markdown={`整理自我们关于 Tailwind / shadcn design token 的一次对话(从“shadcn/cva 是什么”一路推到“一套完整的三级 token 系统”),重排为自底向上的前端视角课程。延伸阅读:

- [Tailwind CSS — Theme variables (\`@theme\`)](https://tailwindcss.com/docs/theme)
- [Tailwind CSS — Adding custom styles / colors](https://tailwindcss.com/docs/colors)
- [shadcn/ui — Theming](https://ui.shadcn.com/docs/theming)
- [class-variance-authority](https://cva.style/docs)
- 对照阅读:本站《Material Design 3》一文里的三级 token(reference→system→component),与本文是同一套模型在“跨端设计体系”里的版本。`}
    />
  ),
};

export default doc;
