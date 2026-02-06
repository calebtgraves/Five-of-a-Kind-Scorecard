import { useRef, useEffect } from 'preact/hooks';
import type { Player, PlayerScores, ScoreCategory } from '../types';
import { UPPER_CATEGORIES, LOWER_CATEGORIES } from '../constants';
import { computeTotals } from '../state/computeTotals';
import { ScoreCell } from './ScoreCell';

const CAT_COL = 'min-w-56 px-1';
const CAT_COL_PX = 224;

interface ScorecardProps {
  players: Player[];
  scores: PlayerScores[];
  isGameOver: boolean;
  onCellTap: (playerId: string, category: ScoreCategory) => void;
}

function TotalRow({ label, values, highlight }: {
  label: string;
  values: number[];
  highlight?: boolean;
}) {
  return (
    <tr class={highlight ? 'bg-purple-600/20 font-bold' : 'bg-white/5'}>
      <td class={`${CAT_COL} py-2 text-sm sticky left-0 bg-bg z-10`}>{label}</td>
      {values.map((v) => (
        <td class="px-3 py-2 text-center font-mono">{v}</td>
      ))}
    </tr>
  );
}

function SectionHeader({ label, playerCount }: { label: string; playerCount: number }) {
  return (
    <tr>
      <td class={`${CAT_COL} pt-3 pb-1 text-xs font-semibold text-text-muted uppercase tracking-wider sticky left-0 bg-bg z-10`}>
        {label}
      </td>
      {Array.from({ length: playerCount }, () => (
        <td />
      ))}
    </tr>
  );
}

export function Scorecard({ players, scores, isGameOver, onCellTap }: ScorecardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const totals = scores.map((ps) => computeTotals(ps.categories));

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let target = el.scrollLeft;
    let rafId = 0;

    const step = () => {
      const diff = target - el.scrollLeft;
      if (Math.abs(diff) < 1) {
        el.scrollLeft = target;
        rafId = 0;
        return;
      }
      el.scrollLeft += diff * 0.35;
      rafId = requestAnimationFrame(step);
    };

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      const rect = el.getBoundingClientRect();
      if (e.clientX - rect.left > CAT_COL_PX) {
        e.preventDefault();
        const max = el.scrollWidth - el.clientWidth;
        target = Math.max(0, Math.min(max, target + e.deltaY));
        if (!rafId) rafId = requestAnimationFrame(step);
      }
    };

    const syncTarget = () => {
      if (!rafId) target = el.scrollLeft;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('scroll', syncTarget);
    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', syncTarget);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={scrollRef} class="overflow-x-auto scrollbar-subtle">
      <table class="border-collapse text-sm">
        <thead>
          <tr class="border-b border-white/10">
            <th class={`${CAT_COL} py-2 text-left sticky left-0 bg-bg z-10`}>Category</th>
            {players.map((p) => (
              <th class="px-3 py-2 text-center min-w-48">{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <SectionHeader label="Upper Section" playerCount={players.length} />
          {UPPER_CATEGORIES.map((cat) => (
            <tr class="border-b border-white/5">
              <td class={`${CAT_COL} py-2 sticky left-0 bg-bg z-10`}>
                <div>{cat.label}</div>
                <div class="text-xs text-text-muted">{cat.shortDescription}</div>
              </td>
              {scores.map((ps, i) => (
                <ScoreCell
                  value={ps.categories[cat.key]}
                  onTap={() => onCellTap(players[i].id, cat.key)}
                  isGameOver={isGameOver}
                />
              ))}
            </tr>
          ))}
          <TotalRow label="Subtotal" values={totals.map((t) => t.upperSubtotal)} />
          <TotalRow label="Bonus (≥63)" values={totals.map((t) => t.upperBonus)} />
          <TotalRow label="Upper Total" values={totals.map((t) => t.upperTotal)} />

          <SectionHeader label="Lower Section" playerCount={players.length} />
          {LOWER_CATEGORIES.map((cat) => (
            <tr class="border-b border-white/5">
              <td class={`${CAT_COL} py-2 sticky left-0 bg-bg z-10`}>
                <div>{cat.label}</div>
                <div class="text-xs text-text-muted">{cat.shortDescription}</div>
              </td>
              {scores.map((ps, i) => (
                <ScoreCell
                  value={ps.categories[cat.key]}
                  onTap={() => onCellTap(players[i].id, cat.key)}
                  isGameOver={isGameOver}
                />
              ))}
            </tr>
          ))}
          <TotalRow label="Lower Total" values={totals.map((t) => t.lowerTotal)} />
          <TotalRow label="Grand Total" values={totals.map((t) => t.grandTotal)} highlight />
        </tbody>
      </table>
    </div>
  );
}
