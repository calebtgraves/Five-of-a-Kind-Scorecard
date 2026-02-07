interface ScoreCellProps {
  value: number | null;
  onTap: () => void;
  isGameOver: boolean;
}

export function ScoreCell({ value, onTap, isGameOver }: ScoreCellProps) {
  if (value !== null) {
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
      class="px-3 py-2 text-center cursor-pointer border border-dashed border-border-strong hover:bg-surface-alt transition-colors"
      onClick={onTap}
    />
  );
}
