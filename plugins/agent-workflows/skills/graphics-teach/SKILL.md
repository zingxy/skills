---
name: graphics-teach
description: 生成沉浸式交互教学页来讲解图形学/渲染/游戏引擎概念(Canvas 2D 原理、渲染管线、矩阵变换、曲线、Three.js、WebGL、Bevy ECS 等),风格对标 3Blue1Brown / GeoGebra / Desmos——以连续动画和可拖参数建立直觉。当用户说"给我讲讲 / 解释一下 / 做个页面演示 X"且主题是图形学相关概念时使用。产物默认落当前目录;用户要求沉淀进 wiki 时,归档转交 wiki-html。
---

# graphics-teach

把一个图形学概念**讲清楚**——讲到读者"啊,原来如此"——并做成能动手玩的教学页。核心目标是解释清楚,交互和动画都是手段。页面形态(骨架、控件、版式)以 design-system 的场景模板为准,本技能只管讲解策略。

## 构建前:概念分析

**加载 `design-system` 技能**,先做「表达形式选择」——图形/空间关系为主用 `templates/graphic.md`,数据的排列与流动为主(如顶点属性、buffer 布局)用 `templates/code-data.md`;视觉以所选模板为准。然后先想清楚(几句话,不必成文):

- **它解决什么问题**:从什么问题或反常现象切入,读者才会觉得"这个概念值得被发明"?这就是页面的开头。
- **核心困惑**:学这个概念时最容易卡住的点是什么(反直觉处、常见误解)?整页围绕攻破它设计,不是平均铺开。
- **一个洞察**:一页只讲透一件事。依赖的别的概念,要么当已知前提一句话带过,要么拆成另一页。
- **它出现在哪里**:Three.js 的哪个参数、Canvas 的哪个 API、Bevy 的哪个行为用到了它?结尾要能指回真实世界。

## 讲解手法

1. **动机先行,定义殿后**:开头抛一个具体问题或反常现象;术语和定义在直觉建立之后才出场。
2. **视觉先行**:第一屏必须是会动的东西,不是定义。先看到现象,再给名字——顺序不可颠倒。
3. **具体 → 抽象**:先用一个特例、一组具体数值演示,再给一般公式;公式出现后立刻用颜色在图上指认每一项是谁。
4. **误解显式化**:把最常见的错误直觉摆出来,用 demo 当场证伪——比正面重复一遍正确结论有效得多。
5. **连续动画,不是静态对比**:概念里的「变化过程」(插值、变换、光栅化、调度)用连续播放呈现,配播放/暂停,最好能 scrub。
6. **每个参数都能拨**:概念里真实的自由度都做成滑块或拖拽点,让读者拨一拨验证刚建立的直觉;默认值选最有教学性的情形。
7. **渐进揭示**:复杂概念拆成 3~5 步,一步一个交互状态,每步只新增一个变量。
8. **预测再验证**:关键处让读者先猜再动手——"把 X 调到最大会怎样?"猜错的那一刻就是学习发生的时刻。

## 页面结构

七个环节按此顺序,但**不是线性长页**:每节一屏、布局按内容自由组合(整屏陈述 / 分栏 / 网格),「拆开看」必须和主 demo 同屏——版式细节按 graphic 模板的「版式模式」。

1. **为什么需要它**——一个具体问题或现象,不用任何术语
2. **直觉**——主 demo:完整现象,自动播放 + 核心参数可调
3. **拆开看**——步进式拆解,把主 demo 还原为基本成分,每步新增一个变量;**与主 demo 同屏**
4. **核心原理,给它名字**——趁热打铁:直觉最烫的时候,术语和公式登场——但不是空降,而是从「拆开看」还原出的基本成分**逐项拼出公式**,能推导就当场推导(为什么是这个形式、这一项管什么);每个符号用颜色对照到图上的对应物。目标是让读者感到"公式只是刚才那套观察的压缩写法",不是要背的新东西
5. **亲手验证**——参数实验室:所有自由度放开;常见误解在这里被当场证伪
6. **它出现在哪里**——指回真实世界:哪个 API、哪行代码、哪个引擎行为
7. **小结 + 挑战**——三行以内收束,留 1~2 个预测题

文字服务于图:每段话对应画面上正在发生的事,用 callout 指认,不长篇铺陈;同一数学对象在图、公式、标注里始终用同一个颜色(见 graphic 模板的「教学强调色」)。

## 技术路线

**默认工程形态:Vite + React + TS + Tailwind + shadcn 风格组件**,产物是一个可积累的学习工程,不是一次性文件:

- 首次使用 scaffold 一个 `graphics-lab` 工程(`pnpm create vite`);此后**每个新概念作为工程里的一个新页面**加入,共享侧边导航、tokens 和组件,不复制脚手架。
- **渲染库固定:2D 用 PixiJS,3D 用 Three.js(配 OrbitControls)**——不手写原生 WebGL/Canvas 绘图。唯一例外:概念本身就是"Canvas 2D / WebGL 底层 API 原理"时,原生 API 是教学对象,才手写。**动画用 GSAP(或 anime.js)**:相机飞行、分步过渡、数值 tween 都交给它,不手写补间。公式可 KaTeX,状态简单就用 React state。
- 视觉规范(tokens、控件、reduced-motion)按 design-system 的「交付模式 B」与所选场景模板。
- 2D 概念用 Canvas 2D(React 里包一层 canvas 组件);Bevy ECS / 调度这类概念本质是图与流程,用 2D 动画模拟即可。

## 参考素材

动手前先查对应主题的参考,核对公式与术语的标准记法、找讲解角度——不只限这些,按主题扩展:

- **[gamemath.com](https://www.gamemath.com/book/index.html)**(3D Math Primer 全书在线)——向量、矩阵、变换、四元数、几何的**系统推导**,第 4 段「核心原理」的主要素材源。
- **[3blue1brown](https://www.3blue1brown.com/)**——讲解手法的风格标杆:直觉优先、连续动画、一页一个洞察。学它怎么讲,不查它 API。
- **[The Book of Shaders](https://thebookofshaders.com/)**——shader / 程序化图形概念;内嵌可改代码的 live editor 是 code-data 联动的风格参照。
- **[iquilezles.org](https://iquilezles.org/)**——SDF、raymarching、噪声、程序化建模、各类函数的图形学意义,深度文章。
- **[webgpufundamentals.org](https://webgpufundamentals.org/)**(及姊妹站 webgl / webgl2 fundamentals)——WebGPU/WebGL 的管线、buffer/attribute/texture 机制,大量可运行示例;「出现在哪里」段与 code-data 页面的事实源(顶点属性、索引这类概念以它为准)。
- **[LearnOpenGL](https://learnopengl.com/)**——OpenGL 教程,概念顺序组织的范本(管线 → 光照 → 模型 → 高级特性)。
- **[Khronos Wikis](https://wikis.khronos.org/)**——规范级权威定义;术语和 API 语义拿不准时以它为准,不凭记忆写。
- **[ciechanow.ski](https://ciechanow.ski/)**——交互讲解长文的天花板;「仪器 + 操控台」版式与连续动画建直觉的直接参照。
- **[ncase.me](https://ncase.me/)**——可玩解释(explorable explanations),「预测再验证」手法的标杆。
- **[Red Blob Games](https://www.redblobgames.com/)**——游戏算法(A*、网格、程序化生成)交互教程。
- **[Scratchapixel](https://www.scratchapixel.com/)**——渲染原理系统教程:光栅化、光线追踪、相机模型,从零讲起。
- **[Physically Based Rendering](https://pbr-book.com/)**——PBR 全书在线,离线渲染深入参考。
- **[Ray Tracing in One Weekend](https://raytracing.github.io/)**——最小可跟随的光追实现路径,「亲手验证」段的素材。
- **[Catlike Coding](https://catlikecoding.com/unity/tutorials/)**——Unity/C# 图形与数学教程(程序化网格、渲染),步骤极细。
- **[GAMES101](https://games-cn.org/intro-graphics/)**——中文图形学系统课(闫令琪,配 bilibili 视频),概念总览与讲解顺序的参照。
- **[Bevy Cheatbook](https://bevy-cheatbook.github.io/)**——Bevy ECS 实战速查,「出现在哪里」段指回 Bevy 时的事实源。

引用真实 API / 字段名时以 fundamentals 系与 Khronos wiki 为事实源;数学推导以 gamemath 为准;讲解节奏对标 3b1b 与 Book of Shaders。

## 落盘与边界

- 工程固定在 **`~/graphics-lab/`**(除非用户另指定路径):首次使用 scaffold,已存在则往里加页面——任何会话、任何工作目录里触发,都进同一个实验室,侧边栏持续积累。
- 用户说"存进 wiki / 沉淀进知识库"时:wiki 的契约仍是自包含单文件,用 `vite-plugin-singlefile` 构建导出单文件版本后,归档交给 `wiki-html` 技能。

## 验证

起 dev server 实测(playwright / headless Chromium 截图):交互可用、console 无报错、奶油与深色表面对比度可读、reduced-motion 下动画默认暂停;`pnpm build` 必须通过。没有浏览器工具就明说未实测。

## 完成后

简报:文件路径、核心困惑是什么、页面怎么攻破它(主 demo 演示什么、拆了几步、证伪了哪个误解)、留了哪些可调参数和挑战、验证结果;提醒双击即可打开。
