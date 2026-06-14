import {
  Callout,
  ChartFrame,
  CodeBlock,
  DiagramFrame,
  Document,
  Prose,
  Stat,
  StatGrid,
  type PresentationDoc,
} from '@/components/blocks';
import { GradientDescent1D } from './visuals/GradientDescent1D';
import { LossCurve } from './visuals/LossCurve';
import { NetworkDiagram } from './visuals/NetworkDiagram';
import { Equation, M } from './visuals/Math';

const doc: PresentationDoc = {
  frontmatter: {
    title: '神经网络是怎么学习的',
    subtitle: '从一个念头讲透梯度下降:沿着山坡往下滚,直到谷底。',
    authors: ['学习笔记'],
    date: '2026 年 6 月',
    tags: ['机器学习', '直觉优先', '入门'],
    tldr: '网络的"学习",就是把自己内部的一堆数字,朝着"让错误变小"的方向轻轻挪一点——就像小球滚向山谷的最低点。就这么简单。剩下的全是细节:它怎么知道哪边是"下坡",以及每一步该迈多大。',
  },

  overview: (
    <Prose
      markdown={`我们会用你真正能理解的方式来讲梯度下降——先有画面,再上公式。

- **目标:** 让网络少犯错。
- **窍门:** 把"错得有多离谱"看成一片地形,然后往低处走。
- **难点:** 步子迈太大会冲出山坡,迈太小又得等到天荒地老。

最后这一点你可以亲自玩——下面有一个可拖动的滑块。`}
    />
  ),

  sections: [
    {
      id: 'the-goal',
      title: '学习,就是让错误变小',
      intent: '网络无非是一堆数字(权重),外加一个"它表现有多糟"的分数。',
      content: (
        <>
          <Prose
            markdown={`神经网络是一摞叫做**权重(weight)**的数字。给它一个输入,这些权重就把输入变成一个猜测。一开始权重是随机的,所以猜出来的全是胡话。

我们用一个数字来衡量"有多胡话"——叫做**损失(loss)**,也就是猜测离正确答案有多远。所谓学习,不过是调整这些权重,让这一个数字变小。`}
          />
          <DiagramFrame
            title="一次猜测,从左到右流过权重"
            caption="每个亮点是一束沿连线向前流动的信号。连线就是权重——也是我们唯一能改的东西。"
          >
            <NetworkDiagram />
          </DiagramFrame>
          <Callout tone="note" title="记住这句话">
            先把"层""神经元"这些词放一边。整件事就是:<em>拧一下旋钮,看一眼分数,再来一遍。</em>
            其余的,只是怎么把这件事同时对几百万个旋钮高效地做完而已。
          </Callout>
        </>
      ),
    },
    {
      id: 'the-landscape',
      title: '错误是一片地形,你要往下滚',
      intent: '把损失对某个权重画出来,会得到一个山谷。学习 = 找到谷底。',
      content: (
        <>
          <Prose
            markdown={`关键画面来了。挑一个权重,问:它取每一个可能的值时,损失分别是多少?把这个画出来,你会得到一个**碗状的山谷**。谷底那个权重,就是犯错最少的那个。

于是学习变成了一个很有体感的问题:*我们是斜坡上某处的一颗小球,想滚到谷底。* 点 Replay,看小球一步步往下走。`}
          />
          <ChartFrame
            title="梯度下降·实况"
            caption="注意:坡陡的地方步子大,接近谷底时步子自动变小——是山坡本身在给下降“调速”。现在把学习率拖到 1.0 以上试试。"
          >
            <GradientDescent1D />
          </ChartFrame>
          <Callout tone="why" title="为什么步子会自己变小?">
            越靠近谷底,坡度越平缓,所以每一步往下走的距离自然就小——这个方法会"滑"进最低点,而不是
            一头撞上去。没人专门写这条规则;它是"步长正比于坡度"自动带出来的结果。
          </Callout>
        </>
      ),
    },
    {
      id: 'the-gradient',
      title: '哪边是下坡?——梯度',
      intent: '脚下的坡度指向上坡,所以朝相反方向迈步就对了。',
      content: (
        <>
          <Prose
            markdown={`要往下滚,小球得先知道哪边是"下"。这就是**梯度(gradient)**:损失在小球当前位置的坡度。梯度指向损失*上升*最快的方向——也就是正上坡。`}
          />
          <Prose markdown={`所以我们反着走就行。单个权重的更新规则是:`} />
          <Equation>{String.raw`w_{\text{new}} = w - \eta \, \frac{\partial L}{\partial w}`}</Equation>
          <Prose
            markdown={`用大白话读:*新权重 = 老权重,朝坡度的反方向挪一下。* 其中 **η**(eta)就是**学习率**——挪多大。`}
          />
          <Callout tone="note">
            <M>{String.raw`\frac{\partial L}{\partial w}`}</M> 的意思就是"如果我把这个权重轻轻动一下,
            损失会变多少?"。坡度为正 → 我们在山谷右壁 → 减去它就往左移 → 也就是下坡。那个减号,就是整条
            "往下走"规则的全部。
          </Callout>
        </>
      ),
    },
    {
      id: 'the-loop',
      title: '训练循环',
      intent: '五行代码,重复成千上万遍。这就是"训练"。',
      content: (
        <>
          <CodeBlock
            lang="python"
            filename="train.py"
            code={`w = random()                      # 模型的旋钮,初始是一堆胡话

for epoch in range(1000):
    pred = model(x, w)            # 前向:做一次猜测
    loss = (pred - target) ** 2  # 我们错得有多离谱?
    g    = gradient(loss, w)     # 哪边是上坡?
    w    = w - lr * g            # 朝反方向迈一步(下坡)`}
            caption="所谓“学习”,就是最后四行不停重复。真实网络会同时对几百万个权重这么做,但循环是一模一样的。"
          />
          <Prose
            markdown={`每跑一遍循环,就是在山坡上走一步。走得够多,损失会先快速下降、再慢慢变平,因为小球越来越接近谷底:`}
          />
          <ChartFrame
            title="训练过程中的损失"
            caption="前期陡降,随后边际递减——和你刚才看小球“滑入谷底”是同一种节奏,只不过这里是一整轮训练。"
          >
            <LossCurve />
          </ChartFrame>
        </>
      ),
    },
    {
      id: 'learning-rate',
      title: '那个能毁掉一切的旋钮',
      intent: '学习率就是步长——而且特别容易调错。',
      content: (
        <>
          <Prose
            markdown={`学习率 **η** 决定小球每一步迈多远。它是训练里最难伺候的一个设置,上面那个实况 demo 正好说明了原因——滚回去拖一拖两个极端:`}
          />
          <Callout tone="warning" title="太大">
            在 demo 里超过 1.0 左右,每一步都会冲过谷底,落到对面更高的坡上。下一步冲得更远。小球爬出山谷,
            损失爆炸——模型越学越差,而不是越学越好。
          </Callout>
          <Callout tone="tradeoff" title="太小">
            很小的学习率绝对安全,但慢得让人发指——要几百个小碎步才能横穿山谷。换成真实模型,那就是白白
            烧掉好几个小时算力。
          </Callout>
          <Prose
            markdown={`训练的手艺,就是找到那个*在不冲过头的前提下尽量大*的学习率——又快又稳。后面你会听到的各种花活
(momentum、Adam、学习率调度)都只是对这同一个问题更聪明的回答。`}
          />
        </>
      ),
    },
  ],

  summary: (
    <>
      <StatGrid>
        <Stat value="1" caption="我们要最小化的数字:损失" />
        <Stat value="−η∇L" caption="每个权重的全部更新规则" />
        <Stat value="↔ η" caption="太大就发散,太小就龟速" />
      </StatGrid>
      <Prose
        markdown={`**整个故事:** 网络的错误在它的权重上形成一片山谷;梯度告诉你哪边是上坡,于是你朝反方向迈一个
"学习率大小"的步子,一遍遍重复,直到滚到谷底。下次再看到某个模型"训练",你就清楚里头到底在发生
什么了:一颗小球,沿着山坡,一步一个脚印地往下滚。`}
      />
    </>
  ),

  glossary: [
    { term: '权重 (weight)', def: '网络内部可调的数字。训练就是调整它们来降低损失。' },
    { term: '损失 (loss)', def: '衡量网络错得有多离谱的一个数字,越小越好。' },
    { term: '梯度 (gradient)', def: '损失对某权重的坡度——指向上坡,所以我们朝反方向迈步。' },
    { term: '学习率 (η)', def: '每次更新迈多大步。关键旋钮:太大发散,太小太慢。' },
    { term: '轮次 (epoch)', def: '训练循环在数据上跑完一整遍。训练会重复很多轮。' },
  ],
};

function App() {
  return <Document doc={doc} />;
}

export default App;
