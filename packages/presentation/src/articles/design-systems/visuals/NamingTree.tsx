import { useState } from 'react';

// Teach §5: names are the API of the system. A 3-part semantic name
// (category / use / variation) groups into a sensible tree and survives change.
// Descriptive/technical names (blue, btn2) don't group and start lying.

const good = [
  { cat: 'color', use: 'primary', vars: ['default', 'hover', 'pressed'] },
  { cat: 'color', use: 'danger', vars: ['default', 'hover'] },
  { cat: 'space', use: 'inset', vars: ['sm', 'md', 'lg'] },
];
const bad = ['blue', 'blue2', 'darkBlue', 'red', 'redHover', 'pad8', 'pad16', 'gap_lg'];

export function NamingTree() {
  const [semantic, setSemantic] = useState(true);

  return (
    <div>
      <div className="mb-5 flex items-center gap-3 text-sm">
        <button onClick={() => setSemantic((s) => !s)} className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground">
          {semantic ? '看看“坏命名”长啥样' : '换回语义命名'}
        </button>
        <span className="text-muted-foreground">{semantic ? '语义命名:category / use / variation' : '描述/技术命名:平铺、会撒谎'}</span>
      </div>

      {/* the 3-part anatomy */}
      {semantic && (
        <div className="mb-5 flex flex-wrap items-center gap-2 font-mono text-sm">
          {[['category', '是什么', 'var(--chart-1)'], ['use', '干什么用', 'var(--chart-2)'], ['variation', '哪种状态', 'var(--chart-3)']].map(([k, cn, c], i) => (
            <span key={k as string} className="flex items-center gap-2">
              {i > 0 && <span className="text-muted-foreground">/</span>}
              <span className="rounded-md px-2.5 py-1" style={{ background: `color-mix(in oklab, ${c} 16%, transparent)`, color: c as string }}>
                {k}<span className="ml-1 text-[10px] text-muted-foreground">{cn}</span>
              </span>
            </span>
          ))}
          <span className="ml-2 text-muted-foreground">例: <span className="text-foreground">color / primary / hover</span></span>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-4 font-mono text-sm">
        {semantic ? (
          <ul className="space-y-1">
            {good.map((g) => (
              <li key={g.cat + g.use}>
                <span className="text-[var(--chart-1)]">{g.cat}</span>/<span className="text-[var(--chart-2)]">{g.use}</span>
                <ul className="ml-6 mt-1 space-y-0.5">
                  {g.vars.map((v) => <li key={v} className="text-muted-foreground">└ <span className="text-[var(--chart-3)]">{v}</span></li>)}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-wrap gap-2">
            {bad.map((b) => <span key={b} className="rounded bg-secondary px-2 py-1 text-destructive">{b}</span>)}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {semantic ? (
          <>斜杠把名字自动收成<strong className="text-foreground">文件夹树</strong>,一眼就知道每个 token 是什么、干嘛的、哪种状态。
          关键铁律:<strong className="text-foreground">设计里的名字 = 代码里的名字</strong>,大小写风格(camelCase / underscore)反而次要。</>
        ) : (
          <>一堆平铺的名字:不分组、靠记忆、还会撒谎(<span className="font-mono">darkBlue</span> 哪天变绿了名字也不会改)。
          换主题或重构时,这种命名是灾难的源头。</>
        )}
      </p>
    </div>
  );
}
