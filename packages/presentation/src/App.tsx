import './App.css';
import { Callout, Document, Prose, type PresentationDoc } from '@/components/blocks';

/**
 * Entry point — a minimal placeholder. REPLACE this with your presentation.
 *
 * Author your deck as a `PresentationDoc` and render it with `<Document doc={...} />`.
 * Copy `references/example-gradient-descent/App.tsx` as a scaffold (a complete,
 * ELI5-level worked example), and follow the workflow in SKILL.md. Put custom
 * visuals in `src/components/visuals/` and drop them inside `ChartFrame`/`DiagramFrame`.
 */
const doc: PresentationDoc = {
  frontmatter: {
    title: '在这里写标题',
    subtitle: '这是 src/App.tsx 的空白起始模板,把它整篇替换成你的演示。',
    tags: ['起始模板'],
    tldr: '照着 references/example-gradient-descent/ 重写本文件,即可开始制作你的演示。',
  },

  overview: (
    <Prose
      markdown={`这是一个**空白起始模板**——\`pnpm dev\` 现在跑的就是它。

开始制作:把本文件替换成你自己的 \`PresentationDoc\`,参照 \`references/example-gradient-descent/App.tsx\`,并遵循 \`SKILL.md\` 的工作流(先设计课程,再选最生动的表示,最后填进 \`Document\` 壳)。`}
    />
  ),

  sections: [
    {
      id: 'start-here',
      title: '从这里开始',
      intent: '这是一个示例小节——删掉它,换成你自己的内容。',
      content: (
        <Callout tone="note" title="下一步">
          打开 <code>references/example-gradient-descent/</code> 看一个完整范例,
          然后把 <code>src/App.tsx</code> 重写成你的演示。结构(封面 / 目录 / 编号小节 /
          总结)由 <code>Document</code> 壳负责,你只需要填每个小节的 <code>content</code>。
        </Callout>
      ),
    },
  ],

  summary: (
    <Prose markdown={`替换这一段总结。每个演示都以"读者能带走的结论"收尾。`} />
  ),
};

function App() {
  return <Document doc={doc} />;
}

export default App;
