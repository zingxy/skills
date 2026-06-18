import { useState } from 'react';

// Teach §6: the system stays alive through a contribution loop and active
// adoption — not by being "finished". Hover a step to see what happens there.

const steps = [
  { name: '提案', desc: '任何人发现缺口 → 提一个带场景的提案(为什么需要、给谁用)。' },
  { name: '对齐', desc: '和设计 + 工程一起评审:要不要做、做成什么样、和现有 token/组件怎么衔接。' },
  { name: '实现', desc: '在分支(branch)上做,不干扰主系统;大改动可并行(如单独做 dark mode)。' },
  { name: '评审', desc: '检查无障碍、命名、文档是否齐全——文档不齐不算“完成”。' },
  { name: '发版', desc: '合并进一次有计划的 release,按 major/minor/patch 标好版本。' },
  { name: '推广', desc: '上线前就造势:收集各团队痛点、提前演示,让人“等着用”。靠 analytics 跟踪采纳率。' },
];

export function ContributionFlow() {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-y-2">
        {steps.map((s, idx) => (
          <div key={s.name} className="flex items-center">
            <button
              onMouseEnter={() => setI(idx)}
              onClick={() => setI(idx)}
              className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
              style={{
                background: i === idx ? 'var(--primary)' : 'var(--secondary)',
                color: i === idx ? 'var(--primary-foreground)' : 'var(--secondary-foreground)',
              }}
            >
              {idx + 1}. {s.name}
            </button>
            {idx < steps.length - 1 && <span className="px-1.5 text-muted-foreground">→</span>}
          </div>
        ))}
        <span className="px-1.5 text-muted-foreground">↺</span>
      </div>
      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <p className="text-sm"><strong className="text-foreground">{steps[i].name}:</strong>{' '}
          <span className="text-muted-foreground">{steps[i].desc}</span></p>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">末尾的 ↺ 是关键:推广收上来的反馈又变成新的提案——设计系统是一个<strong className="text-foreground">不断转的循环</strong>,不是一锤子买卖。</p>
    </div>
  );
}
