import type { Article } from '@/lib/document';
import { doc as konvaTransformer } from './konva-transformer';

/**
 * The article registry — the home page (App.tsx) lists these in order and
 * renders the selected one. To add a presentation:
 *   1. create `src/articles/<your-id>/index.tsx` exporting a `doc: PresentationDoc`
 *      (copy `src/articles/konva-transformer/` as a scaffold; keep its visuals
 *      inside the folder so the article is self-contained),
 *   2. import it here and append an entry.
 * Do NOT build presentations by editing App.tsx.
 */
export const articles: Article[] = [
  { id: 'konva-transformer', doc: konvaTransformer },
];
