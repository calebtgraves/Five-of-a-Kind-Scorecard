interface ScoreCellProps {
  value: number | null;
  onTap: () => void;
  isGameOver: boolean;
  reTappable?: boolean;
  highlighted?: boolean;
  undoHighlighted?: boolean;
}

export function ScoreCell({ value, onTap, isGameOver, reTappable, highlighted, undoHighlighted }: ScoreCellProps) {
  if (value !== null) {
    if (undoHighlighted) {
      return (
        <td class="px-3 py-2 text-center font-mono undo-flash">
          {value}
        </td>
      );
    }
    if (reTappable && !isGameOver) {
      return (
        <td
          class="px-3 py-2 text-center font-mono cursor-pointer hover:bg-surface-alt transition-colors"
          onClick={onTap}
        >
          {value}
        </td>
      );
    }
    return (
      <td class="px-3 py-2 text-center font-mono">
        {value}
      </td>
    );
  }

  if (isGameOver) {
    return (
      <td class="px-3 py-2 text-center text-text-muted">—</td>
    );
  }

  return (
    <td
      class={`px-3 py-2 text-center cursor-pointer border border-dashed transition-colors ${
        highlighted
          ? 'border-accent bg-accent-subtle hover:bg-accent-muted'
          : 'border-border-strong hover:bg-surface-alt'
      }`}
      onClick={onTap}
    />
  );
}
