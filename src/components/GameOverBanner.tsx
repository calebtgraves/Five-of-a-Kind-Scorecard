import type { Player, PlayerScores } from '../types';
import { computeTotals } from '../state/computeTotals';

interface GameOverBannerProps {
  players: Player[];
  scores: PlayerScores[];
  onNewGame: () => void;
}

export function GameOverBanner({ players, scores, onNewGame }: GameOverBannerProps) {
  const ranked = players
    .map((player, i) => ({
      player,
      totals: computeTotals(scores[i].categories, scores[i].fiveOfAKindBonusCount),
    }))
    .sort((a, b) => b.totals.grandTotal - a.totals.grandTotal);

  const topScore = ranked[0].totals.grandTotal;
  const isTie = ranked.filter((r) => r.totals.grandTotal === topScore).length > 1;

  return (
    <div class="fixed inset-0 bg-overlay flex items-center justify-center z-50">
      <div class="card p-6 w-full max-w-xs max-h-[80vh] flex flex-col">
        <h2 class="text-2xl font-bold text-center mb-1">
          {isTie ? "It's a tie!" : `${ranked[0].player.name} wins!`}
        </h2>
        <p class="text-text-muted text-sm text-center mb-5">
          {isTie
            ? `Tied at ${topScore} points`
            : `${topScore} points`}
        </p>

        <div class="space-y-2 mb-6 overflow-y-auto min-h-0 scrollbar-subtle">
          {ranked.map((r, i) => {
            const isWinner = r.totals.grandTotal === topScore;
            return (
              <div
                key={r.player.id}
                class={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  isWinner ? 'bg-accent-muted' : 'bg-control'
                }`}
              >
                <span
                  class={`text-sm font-bold w-6 text-center shrink-0 ${
                    isWinner ? 'text-accent' : 'text-text-muted'
                  }`}
                >
                  {i + 1}
                </span>
                <span class={`flex-1 truncate ${isWinner ? 'font-semibold' : ''}`}>
                  {r.player.name}
                </span>
                <span
                  class={`text-sm font-mono tabular-nums ${
                    isWinner ? 'text-accent font-semibold' : 'text-text-muted'
                  }`}
                >
                  {r.totals.grandTotal}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={onNewGame}
          class="w-full bg-accent hover:bg-accent-hover text-on-accent rounded-lg py-3 text-lg font-semibold transition-colors cursor-pointer"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
