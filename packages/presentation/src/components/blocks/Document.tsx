import { useEffect, useState } from 'react';
import type { PresentationDoc } from '@/lib/document';

/** Track which section is in view, to highlight the TOC. */
function useActiveId(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const num = (i: number) => String(i + 1).padStart(2, '0');

/**
 * The stable presentation shell. One grid aligns everything: a sticky TOC rail on
 * the left, and a content column (cover → overview → numbered sections → summary →
 * glossary/references) on the right. The TOC is derived from the section titles.
 * Pass a PresentationDoc; only section content varies between presentations.
 */
export function Document({ doc }: { doc: PresentationDoc }) {
  const { frontmatter: fm, overview, sections, summary, glossary, references } = doc;

  const toc = [
    { id: 'overview', label: 'Overview' },
    ...sections.map((s, i) => ({ id: s.id, label: `${num(i)} · ${s.title}` })),
    { id: 'summary', label: 'Summary' },
    ...(glossary ? [{ id: 'glossary', label: 'Glossary' }] : []),
    ...(references ? [{ id: 'references', label: 'References' }] : []),
  ];
  const active = useActiveId(toc.map((t) => t.id));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[82rem] px-6 pb-32 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-24 lg:px-12">
        {/* Sticky TOC — left rail */}
        <aside className="hidden lg:block pt-32">
          <nav className="sticky top-12 py-2">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Contents
            </p>
            <ul className="space-y-2.5 text-sm">
              {toc.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className={
                      'block leading-snug transition-colors ' +
                      (active === t.id
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground')
                    }
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Cover + content column */}
        <div className="min-w-0 max-w-3xl">
          <header className="pt-20 pb-14 md:pt-32">
            {fm.tags && fm.tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {fm.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium tracking-wide text-secondary-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-heading text-5xl leading-[1.05] tracking-tight md:text-6xl">
              {fm.title}
            </h1>
            {fm.subtitle && (
              <p className="mt-5 text-xl text-muted-foreground">{fm.subtitle}</p>
            )}
            {(fm.authors?.length || fm.date) && (
              <p className="mt-8 text-sm text-muted-foreground">
                {fm.authors?.join(' · ')}
                {fm.authors?.length && fm.date ? '  —  ' : ''}
                {fm.date}
              </p>
            )}
            {fm.tldr && (
              <p className="mt-10 border-l-2 border-primary pl-5 text-lg text-foreground/90">
                {fm.tldr}
              </p>
            )}
          </header>

          <main className="min-w-0 scroll-mt-12">
            <DocBlock id="overview" label="Overview">
              {overview}
            </DocBlock>

            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-12 border-t border-border py-14">
                <div className="mb-6">
                  <span className="text-sm font-medium text-primary">{num(i)}</span>
                  <h2 className="mt-1 font-heading text-3xl tracking-tight md:text-4xl">{s.title}</h2>
                  {s.intent && <p className="mt-2 text-base text-muted-foreground">{s.intent}</p>}
                </div>
                {s.content}
              </section>
            ))}

            <DocBlock id="summary" label="Summary">
              {summary}
            </DocBlock>

            {glossary && (
              <DocBlock id="glossary" label="Glossary">
                <dl className="space-y-4">
                  {glossary.map((g) => (
                    <div key={g.term}>
                      <dt className="font-medium text-foreground">{g.term}</dt>
                      <dd className="mt-0.5 text-muted-foreground">{g.def}</dd>
                    </div>
                  ))}
                </dl>
              </DocBlock>
            )}

            {references && (
              <DocBlock id="references" label="References">
                {references}
              </DocBlock>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/** A non-numbered structural block (Overview / Summary / Glossary / References). */
function DocBlock({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-12 border-t border-border py-14 first:border-t-0">
      <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </h2>
      {children}
    </section>
  );
}
