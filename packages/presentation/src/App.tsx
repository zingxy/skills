import './App.css';
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
import { CameraStage } from '@/components/visuals/CameraStage';
import { PipelineDiagram } from '@/components/visuals/PipelineDiagram';
import { Equation } from '@/components/visuals/Math';

const doc: PresentationDoc = {
  frontmatter: {
    title: '做一个能拖能缩的画布',
    subtitle: '从 Figma 式的画布出发,一步步想出 World / Camera / Viewport 是怎么回事。',
    authors: ['图形学笔记'],
    date: '2025 年 7 月',
    tags: ['图形学', '2D 渲染', '从问题出发'],
    tldr: '专业渲染引擎处理"拖动、缩放、点选"的秘诀只有一句:别去动画面里的东西,去动一个取景框。看完这篇,你能亲口解释 Figma 拖一下、缩一下、点一下背后到底发生了什么。',
  },

  overview: (
    <Prose
      markdown={`假设你要做一个像 Figma 的画布。用户最起码期待三件事:

- **拖** —— 按住空白往右拖,看到左边的内容。
- **缩** —— 滚轮放大某个角落。
- **点** —— 点中某个图形把它选起来。

这三件事看着简单,**朴素做法会让你越写越痛**。我们就从"痛"开始,一步步逼出专业引擎的解法。下面会有一个能拖能缩能点的实时 demo 一路陪着你。`}
    />
  ),

  sections: [
    {
      id: 'naive-breaks',
      title: '先试试最朴素的做法',
      intent: '用户一拖,你就去动每一个图形——很快就崩。',
      content: (
        <>
          <Prose
            markdown={`最直觉的写法:用户往右拖了 \`dx\`,那就把**每一个图形**的坐标都减掉 \`dx\`。放大?把每个图形围绕中心乘个倍数。代码大概长这样:`}
          />
          <CodeBlock
            lang="js"
            filename="naive.js"
            code={`// 用户拖了 (dx, dy),又围绕中心 c 放大了 k 倍
for (const shape of shapes) {     // shapes 可能上万个
  shape.x = (shape.x - dx - c.x) * k + c.x
  shape.y = (shape.y - dy - c.y) * k + c.y
  // 想支持旋转?每个点再来一遍 sin/cos……
}
// 更糟的是:用户点选时,你还得把上面这一切「反着」算回去`}
            caption="每加一个功能(缩放、旋转、拾取),这段就更长、更脆。"
          />
          <Callout tone="why" title="症结在哪?">
            你把"**怎么看**"(拖了多少、放大多少)和"**画了什么**"(那上万个图形)缠在了一起。
            每次改变看的方式,都要去翻动所有数据。要是能把"怎么看"单独拎出来,只改那**一个**东西就好了——
            这正是下一节的灵感。
          </Callout>
        </>
      ),
    },
    {
      id: 'the-window',
      title: '灵光一现:别动世界,动一个取景框',
      intent: '世界钉死不动,你手里只有一个会移动、缩放的取景框。',
      content: (
        <>
          <Prose
            markdown={`换个画面想:所有图形钉死在一个**无限大的世界**里,**永远不动**。你手里有一个**取景框**,框住世界的一小块。

- 想看右边?**把框往右移**,不用碰任何图形。
- 想放大?**把框缩小**一点,框里的内容自然被放大铺满屏幕。

这个框,就是**相机(Camera)**。先别管任何公式——下面这个 demo,左边是世界(东西都钉着不动),拖动那个高亮的框、点一下"放大",右边"相机拍到的"就实时变了:`}
          />
          <ChartFrame
            title="拖动取景框,感受一下"
            caption="重点:左边的物体从头到尾一个都没动。变的只有那个框。右边 = 框住的那块世界,放大填满。这就是相机的全部。"
          >
            <CameraStage />
          </ChartFrame>
          <Callout tone="note" title="为什么这下子就不痛了?">
            上万个图形依旧躺在世界里没人去动它们。你只维护**一个**东西:框的位置和大小。
            "怎么看"被彻底拎了出来——这就是相机能省掉一切麻烦的根本原因。
          </Callout>
        </>
      ),
    },
    {
      id: 'world-to-screen',
      title: '那代码怎么知道把房子画在屏幕哪里?',
      intent: '拿一个真实的点,把"世界 → 屏幕"亲手算一遍。',
      content: (
        <>
          <Prose
            markdown={`框是直觉,但屏幕上要画像素,总得算个坐标。来个具体的:demo 初始时,相机正框住世界的 \`x ∈ [100, 620]\`(宽 520)。房子在世界 \`x = 200\`。它该画在画面的哪个 x?两步:

1. **减掉框的左边界**:\`200 − 100 = 100\` —— 房子离框左边 100。
2. **按比例放大到画布**:画布宽算 1000 像素,放大倍数 \`1000 ÷ 520 ≈ 1.92\`,于是 \`100 × 1.92 ≈ 192\`。

房子就画在画面 \`x ≈ 192\` 处。y 方向同理。`}
          />
          <Prose
            markdown={`每个图形都做这"**减左边界 + 按比例缩放**"。把这串固定的算术**打包成一个矩阵**,就叫 **View**——于是一行就搞定:`}
          />
          <Equation>{String.raw`\mathbf{p}_{\text{屏幕}} = View \times \mathbf{p}_{\text{世界}}`}</Equation>
          <Callout tone="note" title="矩阵没那么玄">
            View 矩阵不是什么高深符号,它就是上面"减一下、乘一下"那几步算术的**打包**。demo 右边每一帧,
            对每个图形做的就是这件事。
            <span className="mt-2 block text-sm text-muted-foreground">
              (严格说,图形若嵌在组里,要先乘自己的世界变换 W 得到世界坐标;这里房子直接给的就是世界坐标。)
            </span>
          </Callout>
        </>
      ),
    },
    {
      id: 'screen-to-world',
      title: '反过来:点了屏幕,那是世界的哪儿?',
      intent: '把上一步倒着算——逆矩阵就是这么冒出来的。',
      content: (
        <>
          <Prose
            markdown={`点选、拖拽都需要这步:用户点了画面上某个像素,它对应世界的哪个点?把上一节**倒着走**就行:

1. **先除以放大倍数**:\`192 ÷ 1.92 ≈ 100\`。
2. **再加回框的左边界**:\`100 + 100 = 200\` —— 回到世界 \`x = 200\`,正是房子。

正向是"乘 View",反向自然就是"乘 View 的**逆**"。而这个逆,恰好就是相机自己在世界里的位置矩阵——我们叫它 **Camera**:`}
          />
          <Equation>{String.raw`Camera = View^{-1}`}</Equation>
          <Callout tone="why" title="为什么逆就正好是 Camera?">
            View 干的是"世界 → 相机";那"相机 → 世界"当然是它的逆。而"相机在世界里的位置"本来就是一个
            "相机 → 世界"的描述。两件事是同一个矩阵,所以 <strong>相机的位置矩阵 = View 的逆</strong>。
            <span className="mt-2 block">
              去 demo 右边点一下:左边世界会落下一个十字,控制栏显示算出来的世界坐标——就是这步反算在跑。
            </span>
          </Callout>
        </>
      ),
    },
    {
      id: 'the-chain',
      title: '把整条链串起来(顺便说说 retina)',
      intent: '前面都懂了,这里快速收束成一条管线。',
      content: (
        <>
          <Prose
            markdown={`一个点从"图形自己的坐标"到"屏幕像素",其实是被几个矩阵接力变换的。整条链:`}
          />
          <DiagramFrame caption="每段箭头就是乘一个矩阵。前面三节其实已经把中间几段都讲完了。">
            <PipelineDiagram />
          </DiagramFrame>
          <Equation>
            {String.raw`\mathbf{p}_{\text{视口}} = Viewport \times View \times World \times \mathbf{p}_{\text{局部}}`}
          </Equation>
          <Prose
            markdown={`最后那个 **Viewport** 是收尾的一道缩放,和 **dpr**(设备像素比)有关:retina 屏一个 CSS 像素对应 2 个物理像素,所以要再放大一下才清晰。这步浏览器自动帮你做。`}
          />
          <Callout tone="tradeoff" title="和 3D 比,少了什么?">
            少一步**投影**。3D 要把立体空间压成平面,需要投影矩阵;2D 本来就在平面里,所以这条链比 3D
            渲染管线短一截。
          </Callout>
        </>
      ),
    },
    {
      id: 'focus',
      title: '学完露一手:一键把视角对准某物',
      intent: '给相机叠加一个平移就行。',
      content: (
        <>
          <Prose
            markdown={`想把视角对准世界里的某个点 **E**(比如"定位到这个图层")?算出从当前画面中心到 E 需要的平移 **T**,给当前相机**叠加**上去:`}
          />
          <Equation>{String.raw`Camera_{\text{新}} = T \times Camera_{\text{旧}}`}</Equation>
          <Callout tone="note" title="看它动起来">
            点 demo 控制栏里的「把焦点移到 🎯 E」,相机会平滑滑过去,把 E 带到画面中心——跑的就是上面这一行。
          </Callout>
        </>
      ),
    },
  ],

  summary: (
    <>
      <StatGrid>
        <Stat value="动框,不动世界" caption="相机省掉一切麻烦的根本原因" />
        <Stat value="Camera = View⁻¹" caption="拾取(屏幕→世界)就是反着乘" />
        <Stat value="Vp·View·World" caption="2D 管线:比 3D 少一个投影" />
      </StatGrid>
      <Prose
        markdown={`回到开头的 Figma:**拖动** = 移动相机框;**缩放** = 改框的大小;**点选** = 把屏幕坐标乘 View 的逆,反算回世界。世界永远不动,你只摆弄那一个取景框。记住这个画面,矩阵、拾取、MiniMap、定位,全都是它的推论。`}
      />
    </>
  ),

  glossary: [
    { term: 'World(世界)', def: '唯一的、固定不动的全局坐标系,所有图形都活在这里。' },
    { term: 'Camera(相机)', def: '世界里一个会移动、缩放的取景框,决定你看哪块、放多大。' },
    { term: 'View', def: '"世界 → 相机"的变换;Camera(相机在世界的位置)正是它的逆:Camera = View⁻¹。' },
    { term: 'Viewport(视口)', def: '相机到画布像素的最后一道缩放,和 dpr 有关。' },
    { term: 'Local(局部)', def: '图形自己的坐标系;嵌在组里时先乘世界变换 W 才进入 World。' },
    { term: 'dpr', def: '设备像素比。retina 屏一个 CSS 像素对应多个物理像素,影响 Viewport 缩放。' },
    { term: 'Stage(进阶)', def: '工程上常把相机做成一个只缩放/平移的容器,旋转放到下一层,相机矩阵就能由它快速反推——入门可先跳过。' },
  ],
};

function App() {
  return <Document doc={doc} />;
}

export default App;
