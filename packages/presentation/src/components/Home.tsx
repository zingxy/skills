import type { Article } from '@/lib/document';

const num = (i: number) => String(i + 1).padStart(2, '0');

/**
 * The home / index page. Lists every registered article (from `src/articles`)
 * as an editorial table of contents; clicking one opens it. The cards are
 * driven entirely by each article's `frontmatter`, so adding an article to the
 * registry makes it appear here automatically.
 */
export function Home({ articles, onOpen }: { articles: Article[]; onOpen: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <header className="mb-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Presentations
          </p>
          <h1 className="font-heading text-5xl leading-[1.05] tracking-tight md:text-6xl">
            演示文稿合集
          </h1>
          <p className="mt-5 max-w-xl text-xl text-muted-foreground">
            把复杂的东西讲到“一看就懂”。点开任意一篇开始阅读。
          </p>
        </header>

        <ul className="border-t border-border">
          {articles.map((a, i) => {
            const fm = a.doc.frontmatter;
            return (
              <li key={a.id} className="border-b border-border">
                <button
                  onClick={() => onOpen(a.id)}
                  className="group flex w-full items-baseline gap-4 py-8 text-left"
                >
                  <span className="pt-1 font-mono text-sm text-primary">{num(i)}</span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-heading text-2xl tracking-tight transition-colors group-hover:text-primary md:text-3xl">
                      {fm.title}
                    </h2>
                    {fm.subtitle && <p className="mt-2 text-muted-foreground">{fm.subtitle}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {fm.date && <span>{fm.date}</span>}
                      {fm.tags?.map((t) => (
                        <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-secondary-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="self-center text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary">
                    →
                  </span>
                </button>
              </li>
            );
          })}
          {articles.length === 0 && (
            <li className="border-b border-border py-8 text-muted-foreground">
              还没有文章。在 <code>src/articles/</code> 下新建一篇,并在 <code>src/articles/index.ts</code> 注册。
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
