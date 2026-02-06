import type { Player, PlayerScores } from '../types';
import { computeTotals } from '../state/computeTotals';

interface GameOverBannerProps {
  players: Player[];
  scores: PlayerScores[];
  onNewGame: () => void;
}

export function GameOverBanner({ players, scores, onNewGame }: GameOverBannerProps) {
  const totals = scores.map((ps) => computeTotals(ps.categories));

  let winnerIndex = 0;
  for (let i = 1; i < totals.length; i++) {
    if (totals[i].grandTotal > totals[winnerIndex].grandTotal) {
      winnerIndex = i;
    }
  }

  const winner = players[winnerIndex];
  const isTie = totals.filter((t) => t.grandTotal === totals[winnerIndex].grandTotal).length > 1;

  return (
    <div class="text-center py-6">
      <h2 class="text-2xl font-bold mb-2">
        {isTie ? "It's a tie!" : `${winner.name} wins!`}
      </h2>
      <p class="text-text-muted mb-4">
        {isTie
          ? `Tied at ${totals[winnerIndex].grandTotal} points`
          : `${totals[winnerIndex].grandTotal} points`
        }
      </p>
      <button
        onClick={onNewGame}
        class="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-8 py-3 text-lg transition-colors cursor-pointer"
      >
        New Game
      </button>
    </div>
  );
}
