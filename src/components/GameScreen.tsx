import { useState } from 'preact/hooks';
import type { GameState, GameAction, ScoreEntryTarget, ScoreCategory } from '../types';
import { CATEGORIES } from '../constants';
import { Scorecard } from './Scorecard';
import { ScoreEntryModal } from './ScoreEntryModal';
import { GameOverBanner } from './GameOverBanner';

interface GameScreenProps {
  state: GameState;
  dispatch: (action: GameAction) => void;
}

export function GameScreen({ state, dispatch }: GameScreenProps) {
  const [entryTarget, setEntryTarget] = useState<ScoreEntryTarget | null>(null);

  const isGameOver = state.phase === 'gameOver';

  const handleCellTap = (playerId: string, category: ScoreCategory) => {
    setEntryTarget({ playerId, category });
  };

  const handleConfirm = (value: number) => {
    if (!entryTarget) return;
    dispatch({
      type: 'SET_SCORE',
      playerId: entryTarget.playerId,
      category: entryTarget.category,
      value,
    });
    setEntryTarget(null);
  };

  const categoryMeta = entryTarget
    ? CATEGORIES.find((c) => c.key === entryTarget.category)!
    : null;

  const playerName = entryTarget
    ? state.players.find((p) => p.id === entryTarget.playerId)?.name ?? ''
    : '';

  return (
    <div class="max-w-2xl mx-auto p-4">
      {isGameOver && (
        <GameOverBanner
          players={state.players}
          scores={state.scores}
          onNewGame={() => dispatch({ type: 'RESET_GAME' })}
        />
      )}

      <Scorecard
        players={state.players}
        scores={state.scores}
        isGameOver={isGameOver}
        onCellTap={handleCellTap}
      />

      {entryTarget && categoryMeta && (
        <ScoreEntryModal
          categoryMeta={categoryMeta}
          playerName={playerName}
          onConfirm={handleConfirm}
          onCancel={() => setEntryTarget(null)}
        />
      )}
    </div>
  );
}
