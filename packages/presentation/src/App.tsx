import './App.css';
import { useState } from 'react';
import { Document } from '@/components/blocks';
import { Home } from '@/components/Home';
import { articles } from '@/articles';

/**
 * Entry point — a home/index that lists the articles and renders the selected
 * one. DO NOT author presentations here: each presentation is a self-contained
 * article under `src/articles/<id>/` (registered in `src/articles/index.ts`).
 * See SKILL.md.
 */
function App() {
  const [openId, setOpenId] = useState<string | null>(null);
  const current = articles.find((a) => a.id === openId);

  const go = (id: string | null) => {
    setOpenId(id);
    window.scrollTo(0, 0);
  };

  if (current) {
    return <Document doc={current.doc} onBack={() => go(null)} />;
  }
  return <Home articles={articles} onOpen={go} />;
}

export default App;
