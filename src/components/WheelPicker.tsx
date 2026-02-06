import { useRef, useEffect, useCallback } from 'preact/hooks';

interface WheelPickerProps {
  values: number[];
  value: number;
  onChange: (value: number) => void;
}

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;

export function WheelPicker({ values, value, onChange }: WheelPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const paddingItems = Math.floor(VISIBLE_ITEMS / 2);

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({
      top: index * ITEM_HEIGHT,
      behavior: smooth ? 'smooth' : 'instant',
    });
  }, []);

  useEffect(() => {
    const index = values.indexOf(value);
    if (index >= 0) scrollToIndex(index, false);
  }, []);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    if (isScrollingRef.current) return;
    isScrollingRef.current = true;

    requestAnimationFrame(() => {
      const index = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clamped = Math.min(Math.max(index, 0), values.length - 1);
      if (values[clamped] !== value) {
        onChange(values[clamped]);
      }
      isScrollingRef.current = false;
    });
  };

  return (
    <div class="relative" style={{ height: `${VISIBLE_ITEMS * ITEM_HEIGHT}px` }}>
      {/* Selection highlight */}
      <div
        class="absolute left-0 right-0 border-y border-purple-500/50 bg-purple-600/10 pointer-events-none z-10"
        style={{
          top: `${paddingItems * ITEM_HEIGHT}px`,
          height: `${ITEM_HEIGHT}px`,
        }}
      />

      {/* Fade edges */}
      <div class="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-[#16213e] to-transparent pointer-events-none z-10" />
      <div class="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#16213e] to-transparent pointer-events-none z-10" />

      {/* Scrollable list */}
      <div
        ref={containerRef}
        class="h-full overflow-y-scroll"
        style={{
          scrollSnapType: 'y mandatory',
          scrollPaddingTop: `${paddingItems * ITEM_HEIGHT}px`,
          WebkitOverflowScrolling: 'touch',
        }}
        onScroll={handleScroll}
      >
        {/* Top padding */}
        {Array.from({ length: paddingItems }, (_, i) => (
          <div key={`pad-top-${i}`} style={{ height: `${ITEM_HEIGHT}px` }} />
        ))}

        {/* Items */}
        {values.map((item, idx) => {
          const isSelected = item === value;
          return (
            <div
              key={item}
              class={`flex items-center justify-center font-mono text-2xl transition-colors ${
                isSelected ? 'text-white' : 'text-text-muted/50'
              }`}
              style={{
                height: `${ITEM_HEIGHT}px`,
                scrollSnapAlign: 'start',
              }}
              onClick={() => {
                onChange(item);
                scrollToIndex(idx);
              }}
            >
              {item}
            </div>
          );
        })}

        {/* Bottom padding */}
        {Array.from({ length: paddingItems }, (_, i) => (
          <div key={`pad-bot-${i}`} style={{ height: `${ITEM_HEIGHT}px` }} />
        ))}
      </div>
    </div>
  );
}
