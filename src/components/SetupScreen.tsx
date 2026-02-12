import { useState } from 'preact/hooks';
import type { Player, GameAction } from '../types';
import { MIN_PLAYERS, MAX_PLAYERS } from '../constants';

interface SetupScreenProps {
  dispatch: (action: GameAction) => void;
}

export function SetupScreen({ dispatch }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerCountInput, setPlayerCountInput] = useState('2');
  const [names, setNames] = useState<string[]>(Array(MAX_PLAYERS).fill(''));

  const clampPlayerCount = (value: number) => Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, value));

  const adjustCount = (delta: number) => {
    setPlayerCount((c) => {
      const next = clampPlayerCount(c + delta);
      setPlayerCountInput(String(next));
      return next;
    });
  };

  const updateName = (index: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const startGame = () => {
    const players: Player[] = Array.from({ length: playerCount }, (_, i) => ({
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      name: names[i].trim() || `Player ${i + 1}`,
    }));
    dispatch({ type: 'START_GAME', players });
    window.scrollTo(0, 0);
  };

  return (
    <div
      class="h-screen overflow-hidden flex items-start justify-center p-4"
      style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}
    >
      <div class="card p-6 w-full max-w-sm h-[80vh] flex flex-col">
        <h1 class="text-3xl font-bold text-center mb-8 tracking-tight">Five-of-a-Kind Scorecard</h1>

        <label class="block text-sm text-text-muted mb-2 text-center">Number of Players</label>
        <div class="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => adjustCount(-1)}
            disabled={playerCount <= MIN_PLAYERS}
            class="w-10 h-10 rounded-lg bg-control hover:bg-control-hover disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold transition-colors cursor-pointer"
          >
            −
          </button>
          <input
            type="number"
            min={MIN_PLAYERS}
            max={MAX_PLAYERS}
            value={playerCountInput}
            onInput={(e) => {
              const raw = (e.target as HTMLInputElement).value;
              setPlayerCountInput(raw);
              const parsed = Number.parseInt(raw, 10);
              if (!Number.isNaN(parsed)) setPlayerCount(clampPlayerCount(parsed));
            }}
            onBlur={() => setPlayerCountInput(String(playerCount))}
            class="w-16 text-2xl font-mono text-center bg-control border border-border-strong rounded-lg px-2 py-1 focus:outline-none focus:border-accent no-spin"
          />
          <button
            onClick={() => adjustCount(1)}
            disabled={playerCount >= MAX_PLAYERS}
            class="w-10 h-10 rounded-lg bg-control hover:bg-control-hover disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold transition-colors cursor-pointer"
          >
            +
          </button>
        </div>

        <div class="space-y-3 mb-8 flex-1 overflow-y-auto min-h-0 pr-1">
          {Array.from({ length: playerCount }, (_, i) => (
            <input
              key={i}
              type="text"
              value={names[i]}
              onInput={(e) => updateName(i, (e.target as HTMLInputElement).value)}
              placeholder={`Player ${i + 1}`}
              class="w-full bg-control border border-border-strong rounded-lg px-4 py-3 focus:outline-none focus:border-accent placeholder:text-text-muted/50 transition-colors"
            />
          ))}
        </div>

        <button
          onClick={startGame}
          class="w-full bg-accent hover:bg-accent-hover text-on-accent rounded-lg py-3 text-lg font-semibold transition-colors cursor-pointer"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
