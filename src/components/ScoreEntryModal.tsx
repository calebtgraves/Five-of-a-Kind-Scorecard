import { useState } from 'preact/hooks';
import type { CategoryMeta } from '../types';
import { WheelPicker } from './WheelPicker';

interface ScoreEntryModalProps {
  categoryMeta: CategoryMeta;
  playerName: string;
  onConfirm: (value: number) => void;
  onCancel: () => void;
}

function FixedScoreModal({ categoryMeta, playerName, onConfirm, onCancel }: ScoreEntryModalProps) {
  return (
    <div class="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50" onClick={onCancel}>
      <div
        class="bg-[#16213e] rounded-t-xl sm:rounded-xl p-6 w-full max-w-xs shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 class="text-lg font-semibold mb-1 text-center">{categoryMeta.label}</h3>
        <p class="text-text-muted text-sm mb-6 text-center">{playerName}</p>

        <div class="flex gap-3">
          <button
            onClick={() => onConfirm(0)}
            class="flex-1 bg-white/10 hover:bg-white/15 rounded-lg py-4 text-base transition-colors cursor-pointer"
          >
            No — Score 0
          </button>
          <button
            onClick={() => onConfirm(categoryMeta.maxScore)}
            class="flex-1 bg-purple-600 hover:bg-purple-700 rounded-lg py-4 text-base font-semibold transition-colors cursor-pointer"
          >
            Yes — {categoryMeta.maxScore} pts
          </button>
        </div>
      </div>
    </div>
  );
}

export function ScoreEntryModal({ categoryMeta, playerName, onConfirm, onCancel }: ScoreEntryModalProps) {
  const [value, setValue] = useState(categoryMeta.validScores[0]);

  if (categoryMeta.fixedScore) {
    return (
      <FixedScoreModal
        categoryMeta={categoryMeta}
        playerName={playerName}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div class="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50" onClick={onCancel}>
      <div
        class="bg-[#16213e] rounded-t-xl sm:rounded-xl p-6 w-full max-w-xs shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 class="text-lg font-semibold mb-1 text-center">{categoryMeta.label}</h3>
        <p class="text-text-muted text-sm mb-4 text-center">{playerName}</p>

        <div class="mb-4">
          <WheelPicker
            values={categoryMeta.validScores}
            value={value}
            onChange={setValue}
          />
        </div>

        <div class="flex gap-2">
          <button
            onClick={onCancel}
            class="flex-1 bg-white/10 hover:bg-white/15 rounded-lg py-3 text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(value)}
            class="flex-1 bg-purple-600 hover:bg-purple-700 rounded-lg py-3 text-sm font-semibold transition-colors cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
