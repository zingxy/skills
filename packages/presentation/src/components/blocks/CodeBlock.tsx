import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

/**
 * Shiki-highlighted code with editor-accurate colors. Dual light/dark themes are
 * emitted as CSS variables (see index.css) so code follows the deck's mode.
 * Styling is fixed across the deck; pass `filename` for context and `caption` to
 * explain the load-bearing lines — a junior reader needs the "what to notice".
 */
export function CodeBlock({
  code,
  lang = 'tsx',
  filename,
  caption,
}: {
  code: string;
  lang?: string;
  filename?: string;
  caption?: string;
}) {
  const [html, setHtml] = useState('');
  useEffect(() => {
    let alive = true;
    codeToHtml(code.trim(), {
      lang,
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: 'light',
    }).then((out) => {
      if (alive) setHtml(out);
    });
    return () => {
      alive = false;
    };
  }, [code, lang]);

  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-border">
      {filename && (
        <div className="border-b border-border bg-muted px-4 py-2 font-mono text-xs text-muted-foreground">
          {filename}
        </div>
      )}
      <div
        className="shiki-block overflow-x-auto text-sm [&_pre]:m-0 [&_pre]:p-4 [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {caption && (
        <figcaption className="border-t border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
