import {
  Callout,
  ChartFrame,
  DiagramFrame,
  Prose,
  Stat,
  StatGrid,
  type PresentationDoc,
} from '@/components/blocks';
import { InconsistencyDemo } from './visuals/InconsistencyDemo';
import { SystemAnatomy } from './visuals/SystemAnatomy';
import { SpacingScale } from './visuals/SpacingScale';
import { SemanticColor } from './visuals/SemanticColor';
import { ComponentInstances } from './visuals/ComponentInstances';
import { AtomicDesign } from './visuals/AtomicDesign';
import { NamingTree } from './visuals/NamingTree';
import { Versioning } from './visuals/Versioning';
import { ContributionFlow } from './visuals/ContributionFlow';

export const doc: PresentationDoc = {
  frontmatter: {
    title: '系统地学会“设计系统”',
    subtitle: '从三个按钮的混乱出发,自底向上把 design system 拆成你能动手搭的几层。',
    authors: ['学习笔记'],
    date: '2026 年 6 月',
    tags: ['Design System', 'Figma', 'UI', '系统学习'],
    tldr:
      '设计系统不是“组件库”,而是一套让一群人做出像一个人做的东西的乐高:看不见的 token 规则当地基,组件是压模出来的积木,文档和治理让它被用对、能长期演进。本文按“该先学什么”的顺序,用 9 个可交互 demo 带你走一遍。',
  },

  overview: (
    <Prose
      markdown={`这门课要回答一个非常具体的问题:**怎么让一群人做出来的东西,看起来像一个人做的?**

- **目标:** 在团队和产品都变大时,仍然保持一致、好维护、做得快。
- **主线类比:** 设计系统 = 一套**乐高** + 一本**说明书** + 一个**管乐高的团队**。看不见的“凸点间距标准”让所有积木能拼到一起。
- **难点(也是新手最容易搞反的):** 不是从画按钮开始,而是从**看不见的规则**(颜色、字号、间距的刻度)开始。

我们不按 Figma 课程的章节顺序走,而是按**“该先学什么”自底向上**重排:痛点 → 是什么 → 地基 → 积木 → 说明书 → 治理。每一节都有能上手拖的 demo。`}
    />
  ),

  sections: [
    {
      id: 'pain',
      title: '先看痛:三个人,三个按钮',
      intent: 'design system 到底解决什么问题——先把痛点摆出来。',
      content: (
        <>
          <Prose
            markdown={`想象你和另外两位设计师在做同一个习惯打卡 app。三个人都画了一个“保存”按钮:一个圆角 4、一个 12;蓝色一个偏深、一个偏亮;内边距也各不相同。**没人画错**,但拼在一起就是不一致;工程师还要追问“到底用哪个?”。`}
          />
          <ChartFrame
            title="打开 / 关掉设计系统,看三个按钮"
            caption="关掉时:三人写的是各自的 hex 和 px(右下角红字),合起来就是三种按钮。打开后:三人都指向同一个名字 color/primary、radius/md,于是一模一样——改这一个名字,三处一起变。"
          >
            <InconsistencyDemo />
          </ChartFrame>
          <Callout tone="why" title="它真正解决的是“人多 + 产品大”的问题">
            一个人做小项目,凭脑子就能保持一致。一旦<strong>多人、多页面、多端</strong>,一致性就靠不住了。
            设计系统带来四样东西:<strong>一致性</strong>(像一个人做的)、<strong>效率</strong>(不重复造轮子、新人上手快)、
            <strong>规模</strong>(产品再大也不乱)、<strong>共同语言</strong>(设计和工程不再为“用哪个”反复扯皮)。
            Figma 把它概括成三个词:讲清 <strong>what</strong>(长什么样)、<strong>how</strong>(怎么交互)、<strong>why</strong>(为什么这么定)。
          </Callout>
        </>
      ),
    },
    {
      id: 'what',
      title: '它到底是什么:不止是组件库',
      intent: '一套分层的东西——从“为什么”一直到“怎么用”。',
      content: (
        <>
          <Prose
            markdown={`很多人以为设计系统 = 一个组件库。组件只是其中**一层**。完整的设计系统是分层的:最底下是**原则**(为什么),往上是**地基/tokens**(颜色、字号、间距等看不见的规则),再往上才是**组件**和**模式**,最外面包着**文档与治理**(怎么用、怎么活)。

点开下面每一层,看看它的职责,以及它对应乐高里的什么。`}
          />
          <DiagramFrame
            title="设计系统的解剖图(点开每一层)"
            caption="注意顺序:越往下越基础,也越该先学。新手常从最上面的“按钮长啥样”入手,结果地基不稳,越往后越乱。这门课从下往上走。"
          >
            <SystemAnatomy />
          </DiagramFrame>
          <Callout tone="note" title="一句话记住">
            设计系统是<strong>一套乐高</strong>:tokens 是让所有积木能互拼的“凸点间距标准”,组件是压模出来的积木,
            模式是官方套装,而文档和治理是说明书 + 那家管乐高的公司。下一节,我们从最底下的“凸点标准”开始。
          </Callout>
        </>
      ),
    },
    {
      id: 'foundations',
      title: '从看不见的规则开始:tokens 与 foundations',
      intent: 'color / type / spacing 这些“地基”决定一切能否对齐——所以先学它。',
      content: (
        <>
          <Prose
            markdown={`这是整门课最关键、也最反直觉的一节。**地基(foundations)不是像素,是规则。** 间距不是“这里空 18px”,而是“一个 base 单位 × 一小撮固定倍数”;字号不是“标题 29px”,而是“一个基准字号 × 一个固定比例(ratio)”。

先把规则定好,具体的数字就自动长出来。拖动下面的两条规则,看 spacing、字号、还有用它们拼的卡片怎么一起重排:`}
          />
          <ChartFrame
            title="8pt 间距 + 字阶 playground"
            caption="你没有逐个改卡片里的数字,只动了两条规则(base 单位、字阶 ratio),间距、字号、整张卡片就一起变了。这就是“先定看不见的规则、再谈按钮长什么样”。8pt 之所以流行:常见屏宽都能被 8 整除,排版也好对齐。"
          >
            <SpacingScale />
          </ChartFrame>
          <Prose
            markdown={`颜色也一样,而且有个更狠的坑:**怎么给颜色起名字。** 别叫 \`red\`、\`blue-500\`——要按**角色**叫 \`primary\`、\`danger\`、\`success\`。换主题时试试:`}
          />
          <ChartFrame
            title="语义命名 + 换主题"
            caption="界面里写的是 color/danger 这种“角色名”,不是 hex。换主题时名字没变、含义没变,只是名字背后的值变了,全界面自动跟上。要是当初叫 red-500,夜间主题里它偏橙了、名字却还是 red,名字就开始撒谎。"
          >
            <SemanticColor />
          </ChartFrame>
          <Prose
            markdown={`foundations 通常包含这几类(都遵循“先定规则”的思路):**颜色、字体、间距、栅格(grid)、层级/阴影(elevation)、图标(icon)、无障碍(a11y)**。它们之间还要互相配合——比如 8pt 间距要和栅格、字号对齐。`}
          />
          <Callout tone="why" title="为什么从看不见的东西学起?">
            因为地基决定了上面一切能不能对齐。<strong>新手从按钮开始,高手从间距和颜色的刻度开始。</strong>
            按钮只是把这些规则“摆出来”的一个结果——规则稳了,组件自然一致;规则乱了,画再多组件也白搭。
          </Callout>
        </>
      ),
    },
    {
      id: 'components',
      title: '把规则凝固成积木:components',
      intent: 'main / instance、variants、properties,以及原子设计。',
      content: (
        <>
          <Prose
            markdown={`地基定好后,把常用的东西**压模成积木**——这就是组件(component)。组件有一个**主体(main)**和无数**实例(instance)**:实例继承主体,改主体一次,所有实例一起更新。这正是组件胜过“复制粘贴”的根本。`}
          />
          <DiagramFrame
            title="改 1 个 main,N 个 instance 一起变"
            caption="只改左边那一个 main,右边三个实例的样式同时变;但它们的文字各不相同——文字是每个实例自己的 text property 覆写。variant 管“状态”(default/primary/danger),boolean/text 这些是 property。"
          >
            <ComponentInstances />
          </DiagramFrame>
          <Prose
            markdown={`积木还能**嵌套**:小积木拼成中积木,再拼成大块。这就是 Brad Frost 的**原子设计(atomic design)**——atoms → molecules → organisms。`}
          />
          <DiagramFrame
            title="atoms → molecules → organisms"
            caption="逐级点开:大的东西不是新画的,而是把上一层拼起来。所以改一个原子(比如 input),所有用到它的分子(搜索框)和组织(顶栏)都跟着变。"
          >
            <AtomicDesign />
          </DiagramFrame>
          <Callout tone="tradeoff" title="variants vs. boolean:别造出“不可能的状态”">
            状态(default / hover / pressed)应该用 <strong>variant</strong> 表达——它保证“同一时刻只处于一种状态”。
            如果改用几个独立的 boolean 开关去拼状态,就可能出现“既 hover 又 pressed”这种<strong>本不该存在的组合</strong>。
            <span className="mt-2 block text-sm text-muted-foreground">
              名词对一下:<strong>styles</strong> = 可复用的属性集合(颜色/文字/阴影);<strong>components</strong> = 可复用的元件;
              <strong>variables</strong>(2023 年起)= 真正的 token,让主题、多品牌等更进一步。
            </span>
          </Callout>
        </>
      ),
    },
    {
      id: 'docs',
      title: '让别人真用对:文档与命名',
      intent: '名字是系统的 API;文档不齐,不算“完成”。',
      content: (
        <>
          <Prose
            markdown={`积木和说明书要一起给人。**文档**可以是 Figma 文件里的标注、组件描述,也可以是 Storybook、Notion,或一个独立网站(像 Material、Atlassian)。两条铁律:**“找不到、用着费劲,就没人用”**;以及**在开发当下就写文档,别事后补**——文档不齐就不算“done”。`}
          />
          <DiagramFrame
            title="命名:category / use / variation"
            caption="切到“坏命名”对比一下:语义命名靠斜杠自动收成文件夹树,一眼知道是什么、干嘛、哪种状态;平铺的 blue2/darkBlue 不分组还会撒谎。"
          >
            <NamingTree />
          </DiagramFrame>
          <Callout tone="why" title="名字是设计系统的 API">
            最该守住的一条:<strong>设计里的名字 = 代码里的名字</strong>。大小写风格(camelCase 还是 underscore)反而次要——
            和工程对齐、保持一致才是关键。名字一旦和代码对上,设计与开发之间那层“翻译”就消失了。
          </Callout>
        </>
      ),
    },
    {
      id: 'govern',
      title: '让它活下去:版本、贡献、推广',
      intent: '设计系统是有用户的产品,不是一次性交付。',
      content: (
        <>
          <Prose
            markdown={`最后一层,也是最容易被忽略的:设计系统**不是做完就完了**,它是一个**有用户的产品**,需要持续运营。先看怎么发版——用**语义化版本 major.minor.patch** 告诉使用者“这次该有多紧张”:`}
          />
          <ChartFrame
            title="语义版本 major.minor.patch"
            caption="点不同类型的改动,看哪个数字进位、哪些清零:patch 修 bug、minor 加新东西(都不破坏),major 是破坏性改动(改名/删组件)。使用者一看版本号就知道升级风险。"
          >
            <Versioning />
          </ChartFrame>
          <Prose
            markdown={`光有版本还不够,还要有**让别人来贡献、并真正用起来**的闭环:`}
          />
          <DiagramFrame
            title="贡献 + 采纳的循环"
            caption="悬停每一步看它干嘛。末尾的 ↺ 是关键:推广收上来的反馈又变成新提案——这是个不断转的循环。"
          >
            <ContributionFlow />
          </DiagramFrame>
          <Callout tone="note" title="几个让它“活”的实操">
            <strong>分支/合并(branching)</strong>:大改动(如 dark mode)在分支上并行做,不打扰主系统,审过再并入有计划的发版。
            <strong> 用数据说话</strong>:Figma 的 Design System Analytics 跟踪库的使用率,衡量采纳是否成功。
            <strong> 用测试说话</strong>:Habitz 让设计师分别“用老办法”和“用设计系统”各做一遍同样的任务,实测快了约 <strong>3 倍</strong>——这种证据是最好的推广。
          </Callout>
        </>
      ),
    },
  ],

  summary: (
    <>
      <StatGrid>
        <Stat value="Why→What→How" caption="一个设计系统要同时回答的三件事" />
        <Stat value="Tokens 优先" caption="先定看不见的规则(色/字/距),再谈组件长什么样" />
        <Stat value="1 main → N" caption="改一次,处处更新——组件胜过复制粘贴" />
        <Stat value="= 一个产品" caption="有版本、有贡献、有用户,需要持续运营" />
      </StatGrid>
      <Prose
        markdown={`**系统学习 / 搭建的顺序(就是本文的顺序):**

1. **认痛点** —— 多人协作下的不一致、低效、难扩展。先想清楚“为什么要做”。
2. **建心智模型** —— 它是分层的:原则 → 地基/tokens → 组件 → 模式 → 文档/治理。
3. **打地基** —— 先把 color(语义命名)、type scale、8pt 间距/栅格这些**规则**定下来。
4. **造积木** —— 把规则凝固成 components,用 variant 管状态,用原子设计搭层级。
5. **写说明书** —— 文档 + 与代码一致的语义命名,让人找得到、用得对。
6. **持续运营** —— 语义版本、贡献流程、推广与数据,把它当成一个长期产品。

记住那个画面就够了:**设计系统是一套乐高——先有能互拼的凸点标准(tokens),才有好用的积木(components),再加说明书和管乐高的人(docs + governance),一群人就能拼出像一个人做的产品。**`}
      />
    </>
  ),

  glossary: [
    { term: 'Design system', def: '让一群人做出一致、连贯产品的整套资源:原则、tokens、组件、模式、文档与流程。比“组件库”大得多。' },
    { term: 'Token(设计令牌)', def: '给某个设计决定起的、可复用的名字,如 color/primary、space/2。改名字背后的值,所有引用处一起变。' },
    { term: 'Foundations(地基)', def: '最底层的规则:颜色、字体、间距、栅格、层级、图标、无障碍。决定上面一切能否对齐。' },
    { term: '语义命名', def: '按“角色/用途”起名(primary、danger)而非外观(red、blue-500)。换主题/重构时名字不会撒谎。' },
    { term: 'Type scale(字阶)', def: '基准字号 × 固定比例(ratio)生成的一组和谐字号,按功能(body/title/heading)而非层级命名。' },
    { term: 'Component / Instance', def: '组件的主体与副本。实例继承主体;改主体一次,所有实例更新。' },
    { term: 'Variant', def: '组件的不同状态(default/hover/pressed)。用 variant 表达可避免“同时两种状态”的非法组合。' },
    { term: 'Property(属性)', def: '实例可单独覆写的部分:text(文字)、boolean(开关)、instance swap(替换子组件)。' },
    { term: 'Atomic design', def: 'Brad Frost 的分层法:atoms(原子)→ molecules(分子)→ organisms(组织)逐级拼装。' },
    { term: 'Library(库)', def: '团队/组织内共享的一组 styles 与 components,发布后他人可引用并接收更新。' },
    { term: '语义化版本', def: 'major.minor.patch:major=破坏性改动,minor=新增(不破坏),patch=修 bug。让使用者评估升级风险。' },
    { term: 'Governance(治理)', def: '让系统持续演进的流程:贡献、评审、发版、推广、用数据衡量采纳。' },
  ],

  references: (
    <Prose
      markdown={`基于 Figma 官方课程 *Introduction to design systems* 重新组织(自底向上的学习顺序、乐高主线类比与可交互 demo 为本文所加):

- [Overview: Introduction to design systems](https://help.figma.com/hc/en-us/articles/14552901442839-Overview-Introduction-to-design-systems)
- [Lesson 1: Welcome to design systems](https://help.figma.com/hc/en-us/articles/14552802134807-Lesson-1-Welcome-to-design-systems)
- [Lesson 2: Define your design system](https://help.figma.com/hc/en-us/articles/14552740206743-Lesson-2-Define-your-design-system)
- [Lesson 3: Build your design system](https://help.figma.com/hc/en-us/articles/14548865734679-Lesson-3-Build-your-design-system)
- [Lesson 4: Document and manage your system](https://help.figma.com/hc/en-us/articles/14552804059927-Lesson-4-Document-and-manage-your-system)`}
    />
  ),
};

export default doc;
