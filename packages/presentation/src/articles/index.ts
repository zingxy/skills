import type { Article } from '@/lib/document';
import { doc as konvaTransformer } from './konva-transformer';
import { doc as tailwindDesignTokens } from './tailwind-design-tokens';
import { doc as designSystems } from './design-systems';
import { doc as materialDesign3 } from './material-design-3';

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
  { id: 'tailwind-design-tokens', doc: tailwindDesignTokens },
  { id: 'design-systems', doc: designSystems },
  { id: 'material-design-3', doc: materialDesign3 },
  { id: 'konva-transformer', doc: konvaTransformer },
];
