import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Themed long-form text. Pass a markdown string; rendering is fixed and on-brand,
 * so prose looks identical across every presentation. For inline code-heavy or
 * highlighted code, use CodeBlock instead.
 */
export function Prose({ markdown }: { markdown: string }) {
  return (
    <div className="space-y-4 text-base leading-relaxed text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({ children }) => (
            <h3 className="mt-8 font-heading text-2xl tracking-tight text-foreground">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-6 text-lg font-medium text-foreground">{children}</h4>
          ),
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-2 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-2 pl-5">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          a: ({ children, href }) => (
            <a href={href} className="text-primary underline underline-offset-2">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary pl-5 text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
              {children}
            </code>
          ),
          hr: () => <hr className="border-border" />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
