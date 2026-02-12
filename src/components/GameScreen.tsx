import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import type { GameState, GameAction, ScoreEntryTarget, ScoreCategory } from '../types';
import { CATEGORIES } from '../constants';
import { Scorecard } from './Scorecard';
import { ScoreEntryModal } from './ScoreEntryModal';
import { GameOverBanner } from './GameOverBanner';

function pickRandom(arr: number[]): number {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface GameScreenProps {
  state: GameState;
  dispatch: (action: GameAction) => void;
}

export function GameScreen({ state, dispatch }: GameScreenProps) {
  const [entryTarget, setEntryTarget] = useState<ScoreEntryTarget | null>(null);
  const [bonusConfirmPlayerId, setBonusConfirmPlayerId] = useState<string | null>(null);
  const [bonusPlayerId, setBonusPlayerId] = useState<string | null>(null);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout>>();

  const isGameOver = state.phase === 'gameOver';

  const debugFill = useCallback(() => {
    const lastPlayer = state.players[state.players.length - 1];
    for (const player of state.players) {
      for (const cat of CATEGORIES) {
        if (player.id === lastPlayer.id && cat.key === 'chance') continue;
        const ps = state.scores.find((s) => s.playerId === player.id);
        if (ps && ps.categories[cat.key] !== null) continue;
        dispatch({
          type: 'SET_SCORE',
          playerId: player.id,
          category: cat.key,
          value: pickRandom(cat.validScores),
        });
      }
    }
  }, [state, dispatch]);

  // Secret debug shortcut: Ctrl+Shift+F
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        debugFill();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [debugFill]);

  // Secret debug gesture: tap top area 5 times within 1 second
  const handleTopTap = () => {
    if (tapCount.current === 0) {
      tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1000);
    }
    tapCount.current++;
    if (tapCount.current >= 5) {
      clearTimeout(tapTimer.current);
      tapCount.current = 0;
      debugFill();
    }
  };

  const handleCellTap = (playerId: string, category: ScoreCategory) => {
    // If tapping Five-of-a-Kind that's already scored 50, start bonus flow
    if (category === 'fiveOfAKind') {
      const ps = state.scores.find((s) => s.playerId === playerId);
      if (ps && ps.categories.fiveOfAKind === 50) {
        setBonusConfirmPlayerId(playerId);
        return;
      }
    }

    // If in bonus placement mode, only allow unfilled categories for the bonus player
    if (bonusPlayerId) {
      if (playerId !== bonusPlayerId) return;
      const ps = state.scores.find((s) => s.playerId === playerId);
      if (ps && ps.categories[category] !== null) return;
    }

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

    // If we were in bonus placement mode, record the bonus
    if (bonusPlayerId) {
      dispatch({ type: 'ADD_FIVE_OF_A_KIND_BONUS', playerId: bonusPlayerId });
      setBonusPlayerId(null);
    }

    setEntryTarget(null);
  };

  const handleCancel = () => {
    setEntryTarget(null);
    // If cancelling during bonus placement, exit bonus mode too
    if (bonusPlayerId) {
      setBonusPlayerId(null);
    }
  };

  const bonusPlayerName = bonusConfirmPlayerId
    ? state.players.find((p) => p.id === bonusConfirmPlayerId)?.name ?? ''
    : '';

  const categoryMeta = entryTarget
    ? CATEGORIES.find((c) => c.key === entryTarget.category)!
    : null;

  const playerName = entryTarget
    ? state.players.find((p) => p.id === entryTarget.playerId)?.name ?? ''
    : '';

  return (
    <div
      class="max-w-[98vw] sm:max-w-[90vw] mx-auto p-4"
      style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}
    >
      {/* Invisible tap target in top padding area */}
      <div class="fixed top-0 left-0 right-0 h-10 z-30" onClick={handleTopTap} />

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
        bonusPlayerId={bonusPlayerId}
      />

      {/* Normal score entry modal */}
      {entryTarget && categoryMeta && (
        <ScoreEntryModal
          categoryMeta={categoryMeta}
          playerName={playerName}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {/* "Another Five-of-a-Kind?" confirmation modal */}
      {bonusConfirmPlayerId && (
        <div class="fixed inset-0 bg-overlay flex items-center justify-center z-50" onClick={() => setBonusConfirmPlayerId(null)}>
          <div class="card p-6 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
            <h3 class="text-lg font-semibold text-center">Another Five-of-a-Kind?</h3>
            <p class="text-text-muted text-sm mt-1 mb-5 text-center">{bonusPlayerName}</p>
            <div class="flex gap-3">
              <button
                onClick={() => setBonusConfirmPlayerId(null)}
                class="flex-1 bg-control hover:bg-control-hover rounded-lg py-4 text-base transition-colors cursor-pointer"
              >
                No
              </button>
              <button
                onClick={() => {
                  setBonusPlayerId(bonusConfirmPlayerId);
                  setBonusConfirmPlayerId(null);
                }}
                class="flex-1 bg-accent hover:bg-accent-hover text-on-accent rounded-lg py-4 text-base font-semibold transition-colors cursor-pointer"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
