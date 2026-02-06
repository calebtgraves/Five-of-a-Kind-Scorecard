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
      <td class="px-3 py-2 text-sm sticky left-0 bg-bg z-10">{label}</td>
      {values.map((v) => (
        <td class="px-3 py-2 text-center font-mono">{v}</td>
      ))}
    </tr>
  );
}

export function Scorecard({ players, scores, isGameOver, onCellTap }: ScorecardProps) {
  const totals = scores.map((ps) => computeTotals(ps.categories));

  return (
    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="border-b border-white/10">
            <th class="px-3 py-2 text-left sticky left-0 bg-bg z-10">Category</th>
            {players.map((p) => (
              <th class="px-3 py-2 text-center min-w-[80px]">{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Upper Section */}
          <tr>
            <td colSpan={players.length + 1} class="px-3 pt-3 pb-1 text-xs font-semibold text-text-muted uppercase tracking-wider">
              Upper Section
            </td>
          </tr>
          {UPPER_CATEGORIES.map((cat) => (
            <tr class="border-b border-white/5">
              <td class="px-3 py-2 sticky left-0 bg-bg z-10">{cat.label}</td>
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

          {/* Lower Section */}
          <tr>
            <td colSpan={players.length + 1} class="px-3 pt-4 pb-1 text-xs font-semibold text-text-muted uppercase tracking-wider">
              Lower Section
            </td>
          </tr>
          {LOWER_CATEGORIES.map((cat) => (
            <tr class="border-b border-white/5">
              <td class="px-3 py-2 sticky left-0 bg-bg z-10">{cat.label}</td>
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
