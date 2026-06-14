import type { ReactNode } from 'react';

/** Cover metadata shown at the top of every presentation. */
export interface Frontmatter {
  title: string;
  subtitle?: string;
  authors?: string[];
  date?: string;
  tags?: string[];
  /** One-line gist, shown on the cover. */
  tldr?: string;
}

/** A body topic. Content is flexible JSX; everything else is structural. */
export interface DocSection {
  /** Anchor id for the TOC link; kebab-case. */
  id: string;
  title: string;
  /** Optional one-line statement of what the section covers. */
  intent?: string;
  content: ReactNode;
}

export interface GlossaryEntry {
  term: string;
  def: ReactNode;
}

/**
 * The stable document skeleton. The shell renders these in a fixed order —
 * cover → (sticky TOC) → overview → numbered sections → summary → glossary/refs —
 * and derives the TOC from the section titles. Only `content` varies per topic.
 */
export interface PresentationDoc {
  frontmatter: Frontmatter;
  /** Required up-front summary / key takeaways. */
  overview: ReactNode;
  /** Required body topics. */
  sections: DocSection[];
  /** Required closing takeaways. */
  summary: ReactNode;
  /** Optional terms aside — useful for a junior-engineer audience. */
  glossary?: GlossaryEntry[];
  /** Optional references / appendix. */
  references?: ReactNode;
}
