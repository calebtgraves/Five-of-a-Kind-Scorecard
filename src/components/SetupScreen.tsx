import { useState } from 'preact/hooks';
import type { Player, GameAction } from '../types';
import { MIN_PLAYERS, MAX_PLAYERS } from '../constants';

interface SetupScreenProps {
  dispatch: (action: GameAction) => void;
}

export function SetupScreen({ dispatch }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState<string[]>(Array(MAX_PLAYERS).fill(''));

  const adjustCount = (delta: number) => {
    setPlayerCount((c) => Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, c + delta)));
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
    <div class="max-w-sm mx-auto p-4">
      <h1 class="text-3xl font-bold text-center mb-8">Yahtzee Tracker</h1>

      <label class="block text-sm text-text-muted mb-2">Number of Players</label>
      <div class="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => adjustCount(-1)}
          disabled={playerCount <= MIN_PLAYERS}
          class="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold transition-colors cursor-pointer"
        >
          −
        </button>
        <span class="text-2xl font-mono w-8 text-center">{playerCount}</span>
        <button
          onClick={() => adjustCount(1)}
          disabled={playerCount >= MAX_PLAYERS}
          class="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold transition-colors cursor-pointer"
        >
          +
        </button>
      </div>

      <div class="space-y-3 mb-8">
        {Array.from({ length: playerCount }, (_, i) => (
          <input
            key={i}
            type="text"
            value={names[i]}
            onInput={(e) => updateName(i, (e.target as HTMLInputElement).value)}
            placeholder={`Player ${i + 1}`}
            class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 placeholder:text-text-muted/50"
          />
        ))}
      </div>

      <button
        onClick={startGame}
        class="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 text-lg font-semibold transition-colors cursor-pointer"
      >
        Start Game
      </button>
    </div>
  );
}
