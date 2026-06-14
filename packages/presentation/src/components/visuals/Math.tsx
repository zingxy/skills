import 'katex/dist/katex.min.css';
import katex from 'katex';

const render = (tex: string, displayMode: boolean) =>
  katex.renderToString(tex, { displayMode, throwOnError: false, output: 'html' });

/** Inline math, e.g. <M>{String.raw`\eta`}</M>. */
export function M({ children }: { children: string }) {
  return <span dangerouslySetInnerHTML={{ __html: render(children, false) }} />;
}

/** Displayed (centered) equation. */
export function Equation({ children }: { children: string }) {
  return (
    <div
      className="my-6 overflow-x-auto text-foreground"
      dangerouslySetInnerHTML={{ __html: render(children, true) }}
    />
  );
}
