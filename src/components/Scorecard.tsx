import { useState, useRef, useEffect } from 'preact/hooks';
import type { Player, PlayerScores, ScoreCategory } from '../types';
import { UPPER_CATEGORIES, LOWER_CATEGORIES } from '../constants';
import { computeTotals } from '../state/computeTotals';
import { ScoreCell } from './ScoreCell';

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
      <td class="px-2 py-2 text-sm sticky left-0 bg-bg z-10 w-32">{label}</td>
      {values.map((v) => (
        <td class="px-3 py-2 text-center font-mono">{v}</td>
      ))}
    </tr>
  );
}

export function Scorecard({ players, scores, isGameOver, onCellTap }: ScorecardProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabBarRef = useRef<HTMLDivElement>(null);

  const showTabs = players.length > 1;

  useEffect(() => {
    const el = tabBarRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [showTabs]);
  const visiblePlayers = showTabs ? [players[activeTab]] : players;
  const visibleScores = showTabs ? [scores[activeTab]] : scores;
  const totals = visibleScores.map((ps) => computeTotals(ps.categories));

  return (
    <div>
      {showTabs && (
        <div ref={tabBarRef} class="flex gap-1 overflow-x-auto scrollbar-subtle mb-3 pb-1">
          {players.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveTab(i)}
              class={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors cursor-pointer ${
                i === activeTab
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-white/10 text-text-muted hover:bg-white/15'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="border-b border-white/10">
              <th class="px-2 py-2 text-left sticky left-0 bg-bg z-10 w-32">Category</th>
              {visiblePlayers.map((p) => (
                <th class="px-3 py-2 text-center min-w-24">{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Upper Section */}
            <tr>
              <td colSpan={visiblePlayers.length + 1} class="px-3 pt-3 pb-1 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Upper Section
              </td>
            </tr>
            {UPPER_CATEGORIES.map((cat) => (
              <tr class="border-b border-white/5">
                <td class="px-2 py-2 sticky left-0 bg-bg z-10 w-32">
                  <div>{cat.label}</div>
                  <div class="text-xs text-text-muted">{cat.shortDescription}</div>
                </td>
                {visibleScores.map((ps, i) => (
                  <ScoreCell
                    value={ps.categories[cat.key]}
                    onTap={() => onCellTap(visiblePlayers[i].id, cat.key)}
                    isGameOver={isGameOver}
                  />
                ))}
              </tr>
            ))}
            <TotalRow label="Subtotal" values={totals.map((t) => t.upperSubtotal)} />
            <TotalRow label="Bonus (≥63)" values={totals.map((t) => t.upperBonus)} />
            <TotalRow label="Upper Total" values={totals.map((t) => t.upperTotal)} />

            {/* Lower Section */}
            <tr>
              <td colSpan={visiblePlayers.length + 1} class="px-3 pt-4 pb-1 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Lower Section
              </td>
            </tr>
            {LOWER_CATEGORIES.map((cat) => (
              <tr class="border-b border-white/5">
                <td class="px-2 py-2 sticky left-0 bg-bg z-10 w-32">
                  <div>{cat.label}</div>
                  <div class="text-xs text-text-muted">{cat.shortDescription}</div>
                </td>
                {visibleScores.map((ps, i) => (
                  <ScoreCell
                    value={ps.categories[cat.key]}
                    onTap={() => onCellTap(visiblePlayers[i].id, cat.key)}
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
    </div>
  );
}
