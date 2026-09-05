# log-review 模板:日志排查/故障复盘页

把一次故障排查、一次请求的全链路日志、一次部署/迁移的过程做成交互页——**时间线是主角**,读者沿着时间走、按级别过滤、随时展开日志原文。先读 `../SKILL.md` 的 tokens 与交付模式;本文件定义这个场景特有的结构、组件与色彩语义。

## 构建前:事件梳理

先想清楚(几句话,不必成文):

- **一句话事故卡**:现象是什么、影响面、持续了多久、现在什么状态。这是首屏。
- **事件清单**:按时间排好——时间戳、级别(error/warning/info/debug)、来源(服务/机器/人)、一句话摘要、日志原文。数据驱动,页面顶部一个 `const EVENTS = [...]` 数组装全部,方便替换成真实日志。
- **转折点**:排查过程中的误判、线索、根因确认时刻。复盘页的价值在转折点,不在流水账。
- **行动项**:事后要做什么,checkbox 清单收尾。

## 页面结构

五段按序,每段一屏或自然滚动:

1. **事故卡**——现象一句话 + 大读数行(持续时间 / 影响面 / 错误数,`font-mono text-3xl`)+ 状态徽标
2. **时间线全景**——整条时间轴一屏看完,事件按级别着色,标出转折点;点击任意节点跳到第 3 段的对应事件
3. **逐事件拆解**——主交互屏:左侧时间线(当前事件高亮),右侧日志窗 + 步进控制;级别/来源过滤 chips 在本屏顶部
4. **根因**——整 bleed 的 `callout-coral`:一页里唯一慷慨使用珊瑚色的地方,根因配得上这个排面
5. **行动项**——checkbox 风格清单,每条带 owner/状态徽标

**分栏硬规则同 graphic:时间线永远在左,日志与控件在右。**「逐事件拆解」与时间线同屏,读者看着事件、旁边日志在滚,不许上下隔开两屏。

## 组件模式

- **时间线轨道**:纵轴,2px `bg-hairline` 竖线;事件节点是 12px 圆点按级别着色,当前节点放大 1.5 倍 + 2px `border-primary` 环;节点旁时间戳用 `font-mono text-sm text-muted`。点击节点跳转,`cursor-pointer`。
- **日志窗**:code-window 配方(`bg-dark text-on-dark font-mono rounded-lg p-6`,内部块 `bg-dark-soft`),行号 `text-muted-soft`;**日志行按级别着色**(见下),超长行横向滚动不换行;当前事件的日志行高亮一条 `bg-dark-elevated` 底。
- **级别徽标**:badge 配方按级别着色——error `bg-error text-on-primary`、warning `bg-warning text-on-primary`、info `bg-teal text-on-primary`、debug `bg-surface-card text-muted`。
- **过滤 chips**:tab 配方一行横排,按级别 + 来源多选;选中数 > 0 时在时间线全景上同步隐藏被过滤的事件(节点淡出到 20% 透明度,不删除,保住时间感)。
- **步进控制**:「上一事件 / 下一事件」(button-secondary)+ `font-mono text-sm text-muted` 的 `3 / 17`;可加「自动播放」按真实时间间隔走(可暂停)。
- **当前事件 callout**:`border-l-[3px] border-primary bg-surface-card px-3 py-2 text-sm text-muted rounded-r-md`,内容随步进更新,指认"这一刻排查者在想什么"。
- **lucide 图标**:`alert-triangle`(warning)、`x-circle`(error)、`check-circle`(success/恢复)、`info`、`clock`(时间戳)、`terminal`(日志窗标题栏)、`filter`(过滤)、`search`(搜索高亮)。

## 色彩语义

| 用途 | token |
|---|---|
| error 日志行 / 节点 | `--color-error` |
| warning 日志行 / 节点 | `--color-warning` |
| info / 恢复正常 | `--color-teal`(成功态用 `--color-success`) |
| debug / 次要 | `--color-muted` |
| 根因、关键转折 | `--color-primary`(珊瑚,一页只此一处) |

日志原文里的语法高亮用暖调 muted 色系(blues 例外留给 `teal`),不在深色代码窗里引入新色相。

## 交互要点

- 点击时间线节点 ↔ 步进按钮 ↔ 键盘左右方向键,三条通路同步同一个"当前事件"状态。
- 搜索框(text-input 配方)对日志原文做关键字高亮(`bg-amber/30` 标记),命中行数显示在框旁。
- `prefers-reduced-motion` 命中时自动播放默认关闭,手动步进保留。
- 每屏带 id,支持 `?event=N` 深链直达第 N 个事件——复盘页被分享时经常要指到具体时刻。
