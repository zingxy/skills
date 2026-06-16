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
import { Equation } from '@/components/visuals/Math';
import { TransformerPlayground } from '@/components/visuals/TransformerPlayground';
import { CoordinateSpaces } from '@/components/visuals/CoordinateSpaces';
import { AnchorToBox } from '@/components/visuals/AnchorToBox';
import { RotationHandle } from '@/components/visuals/RotationHandle';
import { MatrixEngine } from '@/components/visuals/MatrixEngine';
import { ConjugationDemo } from '@/components/visuals/ConjugationDemo';
import { BoundBoxDemo } from '@/components/visuals/BoundBoxDemo';

const doc: PresentationDoc = {
  frontmatter: {
    title: 'Konva 的 Transformer 是怎么实现的',
    subtitle: '从拖一个角讲透:一个贴在图形身上的"提线木偶框",怎么把鼠标的位移翻译成 scaleX、rotation。',
    authors: ['源码精读笔记'],
    date: '2026 年 6 月',
    tags: ['Konva', 'Canvas', '坐标变换', '原理'],
    tldr:
      'Transformer 是一个独立的"操控架",自己有 8 个锚点和一根旋转把手。你拖动时它从不直接改图形:而是先把鼠标位置换算到图形的局部坐标系,算出一个新的"框",经 boundBoxFunc 过滤,再用一套变换矩阵把这个新框"投影"回图形身上、分解(decompose)成 scaleX/scaleY/rotation/x/y 存起来。本文用 6 个可亲手拖动的 demo 把这条链路走一遍。',
  },

  overview: (
    <Prose
      markdown={`你在做一个像 Figma 的画布:点中一个图形,周围浮出 8 个小方块和一根旋转把手,拖角能缩放、拖把手能旋转。这层"选择框"在 [Konva](https://konvajs.org) 里就是 **Transformer**。

这篇不讲怎么调它的 API,而是拆开看它**内部到底怎么工作**——尤其是那个核心魔法:

- **目标:** 把"我拖动了几个像素"翻译成图形的 \`scaleX / scaleY / rotation / x / y\`。
- **关键直觉:** Transformer 是一个**独立的木偶框**,它先改自己,再把变化"翻译"回图形。它从不直接拉伸图形。
- **难点:** 鼠标在屏幕坐标系里,图形却活在自己被旋转、被缩放过的**局部坐标系**里——两边怎么对话?

下面每一节都有一个能亲手拖的 demo,边拖边看数字怎么变。`}
    />
  ),

  sections: [
    {
      id: 'playground',
      title: '先别问原理,先拖一下',
      intent: '缩放时变的不是 width/height,而是 scaleX/scaleY——这是拆解一切的第一个线索。',
      content: (
        <>
          <Prose
            markdown={`先建立体感。下面是一个**真正的 Konva Transformer**(用 react-konva 渲染的)。拖角缩放、拖上面的把手旋转、拖整体平移——右边的面板实时显示这个图形当前的属性。

边拖边盯住右边:**缩放的时候,\`width\` 和 \`height\` 一动不动,变的是 \`scaleX / scaleY\`。** 这件事很反直觉,却是理解整个实现的钥匙。`}
          />
          <ChartFrame
            title="可拖动的 Transformer · 实时属性"
            caption="注意:把图形拉大一倍,width 还是原来的数,scaleX 变成了 2。Transformer 改的是缩放系数,不是宽高——记住这点,第 5 节会回收它。"
          >
            <TransformerPlayground />
          </ChartFrame>
          <Callout tone="why" title="为什么改 scaleX 而不是改 width?">
            因为 Transformer 想用<strong>一套统一的机制</strong>同时表达缩放、旋转、平移——而这三者刚好都能塞进一个
            "仿射变换矩阵"里(第 5 节)。宽高是图形自己的事,缩放/旋转/位置才是"变换"。把所有改动都表达成一次变换,
            代码就只有一条路径,而不是给宽高、给旋转各写一套。
          </Callout>
        </>
      ),
    },
    {
      id: 'coordinate-spaces',
      title: '木偶框怎么知道我拖到了哪儿?',
      intent: '鼠标在屏幕坐标系,图形在自己的局部坐标系。靠"绝对变换的逆"把前者翻译成后者。',
      content: (
        <>
          <Prose
            markdown={`这里有个绕不开的坎。你的鼠标事件给出的是**屏幕(绝对)坐标**——画布左上角往右往下数多少像素。但图形被旋转、被缩放之后,它活在自己**歪掉、放大过的局部坐标系**里。

Transformer 要把"鼠标点在屏幕的 (360, 110)"翻译成"在图形自己看来,这是局部坐标的哪一点"。办法是:每个 Konva 节点都能算出自己的**绝对变换矩阵** \`getAbsoluteTransform()\`(局部 → 屏幕),那么反过来走,就用它的**逆矩阵**。`}
          />
          <DiagramFrame
            title="同一个点,两套坐标 · 可拖动"
            caption="拖动那个橙色圆点(屏幕空间),看它在被旋转/缩放过的局部坐标系里是多少。转动 rotation、放大 scale,屏幕坐标没变,局部坐标却跟着变——因为坐标系本身歪了。"
          >
            <CoordinateSpaces />
          </DiagramFrame>
          <Equation>{String.raw`p_{\text{local}} = \text{absTransform}^{-1} \cdot p_{\text{screen}}`}</Equation>
          <Prose
            markdown={`一个仿射变换就是一个矩阵 \`m = [a, b, c, d, e, f]\`,把点 \`(x, y)\` 映射成 \`(a·x + c·y + e,  b·x + d·y + f)\`。"求逆"就是把这步倒过来走。Konva 里 \`point()\` 和 \`invert()\` 就是这两件事(第 5 节看代码)。`}
          />
          <Callout tone="note" title="一句话记住">
            屏幕坐标是<strong>大家共用的语言</strong>,局部坐标是<strong>每个图形自己的方言</strong>。
            Transformer 全程在做翻译:进来时把鼠标翻成图形的方言,出去时再把结果翻回大家的语言。
          </Callout>
        </>
      ),
    },
    {
      id: 'anchor-to-box',
      title: '拖一个角,新的"框"怎么算出来?',
      intent: '只移动被拖的那个锚点,修好相邻锚点,再用 topLeft / bottomRight 两个角反推出 width/height。',
      content: (
        <>
          <Prose
            markdown={`坐标对齐之后,事情就具体了。你拖的是 8 个锚点之一(\`top-left\`、\`bottom-right\`……),Konva 在 \`_handleMouseMove\` 里做的是:

1. 把这**一个**被拖的锚点移到鼠标的局部位置;
2. 修一下相邻锚点,让四个角还是个矩形(拖右下角时,右上角的 y、左下角的 x 要跟着动);
3. 用 \`top-left\` 和 \`bottom-right\` 两个角**反推出新的框**。`}
          />
          <DiagramFrame
            title="拖任意锚点 → 实时反推 width / height"
            caption="你只动了一个白方块,但它的邻居自动跟上,保持矩形。下方公式实时显示:width = bottomRight.x − topLeft.x。框就是这么从两个角“读”出来的。"
          >
            <AnchorToBox />
          </DiagramFrame>
          <CodeBlock
            lang="typescript"
            filename="Transformer.ts · _handleMouseMove(简化)"
            code={`// 1) 把鼠标的屏幕坐标翻译进 Transformer 的局部坐标系
//    (上一节那个 absTransform.invert())
anchorNode.setAbsolutePosition(newAbsPos);

// 2) 用两个对角锚点反推新框
const x = this.findOne('.top-left').x();
const y = this.findOne('.top-left').y();
const width  = this.findOne('.bottom-right').x() - x;
const height = this.findOne('.bottom-right').y() - y;

// 3) 把这个"新框"交给下一步去落到图形上
this._fitNodesInto({ x, y, width, height,
  rotation: Konva.getAngle(this.rotation()) }, e);`}
            caption="重点:这一步只产出一个朴素的 {x, y, width, height, rotation} 盒子。怎么把盒子变成图形的 scaleX,是 _fitNodesInto 的活(第 5 节)。"
          />
        </>
      ),
    },
    {
      id: 'rotation',
      title: '旋转把手怎么变成角度?',
      intent: '把手相对中心的方向角就是 atan2(dy, dx);再做一次"角度吸附"。',
      content: (
        <>
          <Prose
            markdown={`旋转更直白。那根把手就是一个能拖的点。它绕着图形中心(pivot)转,**新角度 = 从中心指向把手的方向角**,也就是经典的 \`Math.atan2\`。

算出原始角度后,Konva 还会做一步**角度吸附(\`rotationSnaps\`)**:如果当前角度离某个预设角(比如 0°/45°/90°)足够近(在容差 \`tol\` 内),就"啪"地吸过去。这就是你拖到差不多水平时它会自己对齐的原因。`}
          />
          <DiagramFrame
            title="拖动旋转把手 · atan2 + 吸附"
            caption="拖把手转圈,看原始 atan2 角度;勾上吸附后靠近 45°的倍数,把手会变绿并锁住——那一刻 Konva 用 snap 角替换了原始角。"
          >
            <RotationHandle />
          </DiagramFrame>
          <CodeBlock
            lang="typescript"
            filename="Transformer.ts · 旋转分支(简化)"
            code={`// 把手相对 pivot 的方向 → 角度增量
let delta = Math.atan2(-y, x) + Math.PI / 2 - rotateAnchorAngleRad;
let newRotation = Konva.getAngle(this.rotation()) + delta;

// 角度吸附:落在某个 snap 的容差内就锁过去
const tol = this.rotationSnapTolerance();
const snappedRot = getSnap(this.rotationSnaps(), newRotation, tol);

this._fitNodesInto({ ...box, rotation: snappedRot }, e);`}
            caption="atan2 给方向,getSnap 给“磁性”。注意旋转和缩放最终都汇进同一个 _fitNodesInto——下一节就是它。"
          />
        </>
      ),
    },
    {
      id: 'matrix-engine',
      title: '有了新框,怎么变回图形的 scaleX / rotation?',
      intent: '核心引擎:delta = newTr × oldTr⁻¹,把变化应用到图形,再 decompose 分解回属性。',
      content: (
        <>
          <Prose
            markdown={`现在到了整篇的心脏:\`_fitNodesInto\`。前面几步产出了一个**新框**,但图形存的是 \`scaleX/scaleY/rotation/x/y\`,不是框。怎么换算?

诀窍是**全程用矩阵说话**。Konva 给"旧框"和"新框"各算一个变换矩阵,两者之差就是这次拖动带来的**变化(delta)**:`}
          />
          <Equation>{String.raw`\text{delta} = \text{newTr} \cdot \text{oldTr}^{-1}`}</Equation>
          <Prose
            markdown={`把 \`delta\` 作用到图形原本的变换上,得到图形的新变换矩阵。最后一步——也是最妙的一步——叫 **\`decompose()\`**:从一个 \`[a, b, c, d, e, f]\` 矩阵里**反解出** \`scaleX、scaleY、rotation、x、y\`。下面这个 demo 把整条链路摊开:拖两个角重塑新框,实时看三个矩阵和分解结果。`}
          />
          <ChartFrame
            title="矩阵引擎全摊开 · 拖角看 decompose"
            caption="拖动 new box 的两个角:newTr 矩阵随之变化,delta = newTr × oldTr⁻¹ 实时更新,decompose(newTr) 把矩阵反解成 scaleX/scaleY/rotation——正是第 1 节面板里看到的那些数。整条链路闭环了。"
          >
            <MatrixEngine />
          </ChartFrame>
          <Prose
            markdown={`矩阵的乘法、求逆、分解都不神秘。Konva 的 \`Transform\` 类就是对 6 个数字 \`[a,b,c,d,e,f]\` 做线性代数:`}
          />
          <CodeBlock
            lang="typescript"
            filename="Util.ts · class Transform(节选)"
            code={`// 把一个点过一遍矩阵:这就是"坐标翻译"的本体
point(p) {
  return {
    x: this.m[0]*p.x + this.m[2]*p.y + this.m[4],  // a·x + c·y + e
    y: this.m[1]*p.x + this.m[3]*p.y + this.m[5],  // b·x + d·y + f
  };
}

// 从矩阵反解出人能读的属性:scaleX/scaleY/rotation
decompose() {
  const { 0:a, 1:b, 2:c, 3:d, 4:e, 5:f } = this.m;
  const det = a*d - b*c;
  const r = Math.sqrt(a*a + b*b);
  return {
    x: e, y: f,
    rotation: b > 0 ? Math.acos(a/r) : -Math.acos(a/r), // 角度
    scaleX: r,                                           // √(a²+b²)
    scaleY: det / r,
  };
}`}
            caption="point() 是第 2 节“翻译坐标”用的;decompose() 是把矩阵变回 scaleX/rotation 的逆操作。rotation 用 acos(a/r) 取出旋转角,scaleX 是第一列向量的长度——纯几何。"
          />
          <Callout tone="why" title="为什么要绕一圈矩阵,而不直接改属性?">
            因为缩放、旋转、平移、甚至父节点自己也在变换——这些<strong>叠在一起</strong>时,直接加加减减必然出错。
            矩阵乘法天生就是"变换的叠加",一行 <span className="font-mono">newTr × oldTr⁻¹</span> 就把"从旧到新的净变化"
            算干净了,再 decompose 回属性。一套机制覆盖所有情况,这就是第 1 节"为什么改 scaleX"的最终答案。
          </Callout>
        </>
      ),
    },
    {
      id: 'multi-node',
      title: '多选 / 嵌套:同一个 Δ,翻译给住在不同坐标系的每个图形',
      intent: '图形们分属不同父容器,各有各被旋转/缩放的坐标系。靠"相似矩阵" W⁻¹·Δ·W 把同一个世界变化翻译进每个图形的父坐标系。',
      content: (
        <>
          <Prose
            markdown={`前面几节都假设只有**一个**图形,而且 Transformer 就贴在它身上。但 Figma 里你常常**框住一堆图形**,它们还分属不同的分组(父容器)——每个图形都活在自己**被旋转、被缩放过的父坐标系**里。

这里要先讲清一个常被搞混的点:图形的 \`x / scaleX / rotation\` 这些属性,**不是相对图形自己、而是相对它的父节点定义的**。所以"翻译到图形所在的坐标系",指的始终是它的**父坐标系**。

你拖一下 Transformer,本质上是在**世界**里产生了一个变化 \`Δ\`(平移、旋转或缩放)。问题来了:这一个 \`Δ\` 不能原样落到每个图形的属性上——图形 A 的父系转了 35°,图形 B 的父系放大了 1.7×,**同一个世界位移,换算进它们各自的父坐标系,数值是不一样的。** 先动手感受这件事:`}
          />
          <DiagramFrame
            title="一个世界 Δ → 换算进每个图形的父坐标系 · 可拖动"
            caption="拖动顶部那一个 Δ 箭头:两个图形在世界里按完全相同的位移移动(粗箭头平行等长),但把这个位移按各自父坐标系的轴去量(虚线),读出的“父系 Δ”却不同——转一转 A 的父系、缩一缩 B 的父系,差别更明显。"
          >
            <ConjugationDemo />
          </DiagramFrame>
          <Prose
            markdown={`怎么把世界里的 \`Δ\` 换算进某个图形的**父坐标系**(也就是它属性所在的坐标系)?用它**父节点的世界变换 \`W\`** 把 Δ 夹一下:`}
          />
          <Equation>{String.raw`\Delta_{\text{child}} = W_{\text{parent}}^{-1} \cdot \Delta \cdot W_{\text{parent}}`}</Equation>
          <Callout tone="why" title="为什么是“夹逼”成 W⁻¹·Δ·W?">
            从右往左读,作用在图形<strong>父坐标系</strong>里的一个点上:<strong>先用 <span className="font-mono">W</span>(父系→世界)把它送到世界</strong>(Δ 就活在那儿)→
            <strong>施加 Δ</strong> → <strong>再用 <span className="font-mono">W⁻¹</span> 送回父坐标系</strong>。三步拼起来就是
            <span className="font-mono"> W⁻¹·Δ·W</span>。它和 Δ 其实是<strong>同一个变换,只是换到父坐标系来表示</strong>——这在线性代数里就叫
            <strong>相似矩阵(similar matrix)</strong>。而图形的 x/scaleX/rotation 本就定义在父坐标系里,所以翻译到这儿就能<strong>直接</strong>落到属性上——这是最自然的落点。父系只旋转时,它把位移“转”进父系;只缩放时,它把位移“除以”缩放系数(demo 里 B 的父系 Δ 正好是世界 Δ ÷ 1.7)。
            <span className="mt-3 block text-sm text-muted-foreground">
              (进阶:父坐标系并非唯一选择。同一个 Δ 也能表示在节点<em>自身</em>的局部坐标系里——<span className="font-mono">A⁻¹·Δ·A</span>(A 是节点的绝对变换 W·L),再右乘到自身变换上,结果一模一样。Konva 选父系只是更顺手:它只依赖父节点,多选时同父的兄弟节点共享同一个增量。)
            </span>
          </Callout>
          <CodeBlock
            lang="typescript"
            filename="Transformer.ts · _fitNodesInto 多节点(示意)"
            code={`// 一次拖动在 Transformer 自身空间算出的净变化(第 5 节的 delta)
const delta = newTr.multiply(oldTr.invert());

this._nodes.forEach((node) => {
  // 每个图形可能挂在不同的父节点下
  const W = node.getParent().getAbsoluteTransform();
  // 把世界变化“夹”进这个图形的父坐标系:W⁻¹ · delta · W
  const parentDelta = W.copy().invert().multiply(delta).multiply(W);
  // 作用到图形原本的变换上,再 decompose 回 scaleX/rotation/x/y
  node._applyTransform(parentDelta);
});`}
            caption="重点是那一行 W⁻¹·delta·W:多选和嵌套分组之所以能正常工作,全靠对每个图形用它父节点的世界变换,把世界变化翻译进该图形的父坐标系。单图形是它的特例(父节点就是 Layer、W≈单位阵时,parentDelta 就等于 delta)。"
          />
          <Callout tone="note" title="一句话收束">
            第 5 节算出的 <span className="font-mono">Δ</span> 是"世界里发生了什么";这一节用{' '}
            <span className="font-mono">W⁻¹·Δ·W</span> 回答"对<strong>这个</strong>图形而言意味着什么"。
            提线木偶框始终只有一个,它把同一句话,翻译成每个图形各自的方言。
          </Callout>
        </>
      ),
    },
    {
      id: 'boundboxfunc',
      title: '怎么不让它缩成负数 / 加自定义约束?',
      intent: 'boundBoxFunc 是新框落地前的唯一关卡:返回什么框,就用什么框。',
      content: (
        <>
          <Prose
            markdown={`最后一块拼图。上一步算出了新框,但你可能不想让它**缩到比 0 还小、翻面、或超出某个范围**。Konva 留了一个钩子:\`boundBoxFunc(oldBox, newBox)\`。

它在新框真正落到图形之前被调用一次。**你返回哪个框,Transformer 就用哪个框。** 想加最小尺寸?当新框太小就返回 \`oldBox\`——相当于"否决"了这一帧的改动,框就卡在上一秒的合法状态。`}
          />
          <DiagramFrame
            title="boundBoxFunc · 亲手感受“约束”"
            caption="勾上约束后把绿框往小拖:到 60px 就卡死,因为函数返回了 oldBox 否决了更小的框。关掉它,框能被你缩成一条线甚至翻面。"
          >
            <BoundBoxDemo />
          </DiagramFrame>
          <CodeBlock
            lang="typescript"
            filename="你自己写的约束"
            code={`transformer.boundBoxFunc((oldBox, newBox) => {
  // newBox 是上一节算出来的"想要的新框"
  if (Math.abs(newBox.width) < 60 || Math.abs(newBox.height) < 60) {
    return oldBox;   // 否决:保持上一个合法框
  }
  return newBox;     // 放行
});`}
            caption="这是整个流水线唯一对外开放的“阀门”。Konva 内部:const bounded = boundBoxFunc(oldAttrs, newAttrs),拿 bounded 去走第 5 节的矩阵分解。"
          />
        </>
      ),
    },
  ],

  summary: (
    <>
      <StatGrid>
        <Stat value="8 + 1" caption="锚点(8 个缩放)+ 旋转把手,各是一个独立的 Konva 形状" />
        <Stat value="absT⁻¹" caption="鼠标进来时:绝对变换求逆,翻译到图形局部坐标" />
        <Stat value="newTr × oldTr⁻¹" caption="出去时:用 delta 矩阵 + decompose 反解出 scaleX/rotation" />
      </StatGrid>
      <Prose
        markdown={`**整条链路:** ① 你拖一个锚点 → ② 鼠标的屏幕坐标经 \`absTransform.invert()\` 翻译成图形局部坐标 → ③ 移动那个锚点、修好邻居,用 \`topLeft/bottomRight\` 反推出新框(旋转把手则走 \`atan2\` + 吸附)→ ④ \`boundBoxFunc\` 放行或否决 → ⑤ \`_fitNodesInto\` 用 \`delta = newTr × oldTr⁻¹\` 把变化作用到图形,\`decompose()\` 分解回 \`scaleX/scaleY/rotation/x/y\` 存起来。

记住那个核心画面就够了:**Transformer 是一个提线木偶框,它从不直接拉图形;它先改自己,再把"我变成了什么样"用一套矩阵翻译回图形身上。** 下次你在 Figma 拖一个角,你就知道屏幕背后那几行线性代数在干什么了。`}
      />
    </>
  ),

  glossary: [
    { term: 'Transformer', def: 'Konva 里那层选择框:8 个缩放锚点 + 1 个旋转把手。它是独立的节点,attach 到目标图形上,不直接修改图形,而是把拖动翻译成图形的属性。' },
    { term: 'anchor(锚点)', def: '选择框上可拖的小方块,每个是一个 Konva Rect。8 个名字:top-left / top-center / … / bottom-right。' },
    { term: '局部坐标 vs 绝对坐标', def: '绝对(屏幕)坐标是全局共用的像素坐标;局部坐标是图形被旋转/缩放后自己的坐标系。靠绝对变换及其逆相互转换。' },
    { term: 'getAbsoluteTransform()', def: '节点的“局部 → 屏幕”变换矩阵。它的逆(invert)把屏幕坐标翻译回该节点的局部坐标。' },
    { term: 'Transform / 仿射矩阵', def: '6 个数 [a,b,c,d,e,f],能同时表达缩放+旋转+平移。point() 应用它,invert() 求逆,multiply() 叠加,decompose() 反解出属性。' },
    { term: 'decompose()', def: '从一个变换矩阵里反解出 scaleX = √(a²+b²)、rotation = acos(a/r)、x/y 等人类可读属性。是 _fitNodesInto 的最后一步。' },
    { term: 'boundBoxFunc', def: '新框落到图形前的唯一钩子:boundBoxFunc(oldBox, newBox),返回的框即最终采用的框。可用来加最小尺寸、对齐、范围等约束。' },
    { term: 'rotationSnaps', def: '一组吸附角度(如 0/45/90…)。旋转角落在某个 snap 的容差内就锁过去,实现“差不多就对齐”。' },
    { term: '相似矩阵 / 共轭 (W⁻¹·Δ·W)', def: '把同一个变换换一个坐标系来表示。多选/嵌套时,用每个图形父节点的世界变换 W 把世界增量 Δ “夹”进它的父坐标系(图形的 x/scale/rotation 就定义在那儿),得到可直接落到属性上的增量。单图形是 W≈单位阵的特例。' },
  ],

  references: (
    <Prose
      markdown={`- Konva 源码:[\`src/shapes/Transformer.ts\`](https://github.com/konvajs/konva/blob/master/src/shapes/Transformer.ts) —— 锚点创建、\`_handleMouseMove\`、\`_fitNodesInto\`、\`boundBoxFunc\`。
- Konva 源码:[\`src/Util.ts\`](https://github.com/konvajs/konva/blob/master/src/Util.ts) —— \`class Transform\` 的 \`point / multiply / invert / decompose\`。
- 官方文档:[Konva Transformer](https://konvajs.org/docs/select_and_transform/Basic_demo.html)。

本文的代码片段为讲解做了删减与重命名,变量名与核心逻辑忠于源码;完整实现以仓库为准。`}
    />
  ),
};

function App() {
  return <Document doc={doc} />;
}

export default App;
