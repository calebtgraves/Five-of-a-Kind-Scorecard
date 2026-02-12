import { useRef, useEffect } from 'preact/hooks';
import { useState } from 'preact/hooks';
import type { Player, PlayerScores, ScoreCategory } from '../types';
import { UPPER_CATEGORIES, LOWER_CATEGORIES } from '../constants';
import { computeTotals, FIVE_OF_A_KIND_BONUS_VALUE } from '../state/computeTotals';
import { ScoreCell } from './ScoreCell';

const CAT_COL = 'min-w-32 sm:max-w-48 px-3';
const CAT_COL_PX = 192;
const MOBILE_BREAKPOINT = 640;

interface ScorecardProps {
  players: Player[];
  scores: PlayerScores[];
  isGameOver: boolean;
  onCellTap: (playerId: string, category: ScoreCategory) => void;
  bonusPlayerId: string | null;
}

function ScoreTable({
  players,
  scores,
  totals,
  isGameOver,
  onCellTap,
  bonusPlayerId,
}: {
  players: Player[];
  scores: PlayerScores[];
  totals: ReturnType<typeof computeTotals>[];
  isGameOver: boolean;
  onCellTap: (playerId: string, category: ScoreCategory) => void;
  bonusPlayerId: string | null;
}) {
  return (
    <table class={`border-collapse text-sm ${players.length > 1 ? 'w-full' : ''}`}>
      <thead>
        <tr class="border-b border-border">
          <th class={`${CAT_COL} py-3 text-left sticky left-0 bg-surface z-10`}>Category</th>
          {players.map((p) => (
            <th class="px-3 py-2 text-center min-w-48">{p.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <SectionHeader label="Upper Section" playerCount={players.length} />
        {UPPER_CATEGORIES.map((cat) => (
          <tr class="border-b border-border-subtle">
            <td class={`${CAT_COL} py-3 sticky left-0 bg-surface z-10`}>
              <div>{cat.label}</div>
              <div class="text-xs text-text-muted">{cat.shortDescription}</div>
            </td>
            {scores.map((ps, i) => (
              <ScoreCell
                value={ps.categories[cat.key]}
                onTap={() => onCellTap(players[i].id, cat.key)}
                isGameOver={isGameOver}
                highlighted={bonusPlayerId === players[i].id && ps.categories[cat.key] === null}
              />
            ))}
          </tr>
        ))}
        <TotalRow label="Subtotal" values={totals.map((t) => t.upperSubtotal)} />
        <TotalRow label="Bonus (≥63)" values={totals.map((t) => t.upperBonus)} />
        <TotalRow label="Upper Total" values={totals.map((t) => t.upperTotal)} />

        <SectionHeader label="Lower Section" playerCount={players.length} />
        {LOWER_CATEGORIES.map((cat) => {
          const isFiveOfAKind = cat.key === 'fiveOfAKind';
          return (
            <>
              <tr class="border-b border-border-subtle">
                <td class={`${CAT_COL} py-3 sticky left-0 bg-surface z-10`}>
                  <div>{cat.label}</div>
                  <div class="text-xs text-text-muted">{cat.shortDescription}</div>
                </td>
                {scores.map((ps, i) => (
                  <ScoreCell
                    value={ps.categories[cat.key]}
                    onTap={() => onCellTap(players[i].id, cat.key)}
                    isGameOver={isGameOver}
                    reTappable={isFiveOfAKind && ps.categories.fiveOfAKind === 50}
                    highlighted={bonusPlayerId === players[i].id && ps.categories[cat.key] === null}
                  />
                ))}
              </tr>
              {isFiveOfAKind && (
                <tr class="border-b border-border-subtle">
                  <td class={`${CAT_COL} py-1.5 text-xs text-text-muted sticky left-0 bg-surface z-10`}>
                    Bonus (+{FIVE_OF_A_KIND_BONUS_VALUE} ea.)
                  </td>
                  {scores.map((ps) => (
                    <td class="px-3 py-1.5 text-center text-xs">
                      {ps.fiveOfAKindBonusCount > 0 ? (
                        <span class="text-accent font-mono">
                          {'✓ '.repeat(ps.fiveOfAKindBonusCount).trim()}
                        </span>
                      ) : (
                        <span class="text-text-muted">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              )}
            </>
          );
        })}
        <TotalRow label="Lower Total" values={totals.map((t) => t.lowerTotal)} />
        {totals.some((t) => t.fiveOfAKindBonus > 0) && (
          <TotalRow label="5-of-a-Kind Bonus" values={totals.map((t) => t.fiveOfAKindBonus)} />
        )}
        <TotalRow label="Grand Total" values={totals.map((t) => t.grandTotal)} highlight />
      </tbody>
    </table>
  );
}

function TotalRow({ label, values, highlight }: {
  label: string;
  values: number[];
  highlight?: boolean;
}) {
  return (
    <tr class={highlight ? 'bg-accent-muted font-bold' : 'bg-surface-alt'}>
      <td class={`${CAT_COL} py-3 text-sm sticky left-0 bg-surface z-10`}>{label}</td>
      {values.map((v) => (
        <td class="px-3 py-2 text-center font-mono">{v}</td>
      ))}
    </tr>
  );
}

function SectionHeader({ label, playerCount }: { label: string; playerCount: number }) {
  return (
    <tr>
      <td class={`${CAT_COL} pt-3 pb-1 text-xs font-semibold text-text-muted uppercase tracking-wider sticky left-0 bg-surface z-10`}>
        {label}
      </td>
      {Array.from({ length: playerCount }, () => (
        <td />
      ))}
    </tr>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`);
    const onChange = () => setIsMobile(!mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

export function Scorecard({ players, scores, isGameOver, onCellTap, bonusPlayerId }: ScorecardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollRaf = useRef(0);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(0);
  const totals = scores.map((ps) => computeTotals(ps.categories, ps.fiveOfAKindBonusCount));

  const showTabs = isMobile && players.length > 1;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || showTabs) return;

    let target = el.scrollLeft;
    let rafId = 0;

    const step = () => {
      const diff = target - el.scrollLeft;
      if (Math.abs(diff) < 1) {
        el.scrollLeft = target;
        rafId = 0;
        return;
      }
      el.scrollLeft += diff * 0.35;
      rafId = requestAnimationFrame(step);
    };

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      const rect = el.getBoundingClientRect();
      if (e.clientX - rect.left > CAT_COL_PX) {
        e.preventDefault();
        const max = el.scrollWidth - el.clientWidth;
        target = Math.max(0, Math.min(max, target + e.deltaY));
        if (!rafId) rafId = requestAnimationFrame(step);
      }
    };

    const syncTarget = () => {
      if (!rafId) target = el.scrollLeft;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('scroll', syncTarget);
    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', syncTarget);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [showTabs]);

  const visiblePlayers = showTabs ? [players[activeTab]] : players;
  const visibleScores = showTabs ? [scores[activeTab]] : scores;
  const visibleTotals = showTabs ? [totals[activeTab]] : totals;
  const scrollToTab = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const width = el.getBoundingClientRect().width;
    el.scrollTo({ left: width * index, behavior: 'smooth' });
  };

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
    scrollRaf.current = requestAnimationFrame(() => {
      const width = el.getBoundingClientRect().width || 1;
      const next = Math.round(el.scrollLeft / width);
      if (next !== activeTab) setActiveTab(next);
    });
  };

  useEffect(() => {
    if (!showTabs) return;
    scrollToTab(activeTab);
  }, [showTabs]);

  useEffect(() => {
    if (!showTabs) return;
    const tabsEl = tabsRef.current;
    const activeButton = tabsEl?.querySelector(`[data-index="${activeTab}"]`) as HTMLElement | null;
    activeButton?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeTab, showTabs]);

  return (
    <div>
      {showTabs && (
        <div class="sticky top-0 z-20 py-2 -mx-2 px-2 bg-bg">
          <div ref={tabsRef} class="flex gap-1 overflow-x-auto scrollbar-none">
            {players.map((p, i) => (
              <button
                key={p.id}
                data-index={i}
                onClick={() => {
                  setActiveTab(i);
                  scrollToTab(i);
                }}
                class={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  i === activeTab
                    ? 'bg-accent text-on-accent'
                    : 'bg-control text-text-muted hover:bg-control-hover'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {showTabs ? (
        <div
          ref={carouselRef}
          class="flex overflow-x-auto scrollbar-none snap-x-mandatory"
          onScroll={handleCarouselScroll}
        >
          {players.map((p, i) => (
            <div key={p.id} class="w-full flex-shrink-0 snap-start snap-stop px-2 box-border">
              <div class="card overflow-hidden">
                <ScoreTable
                  players={[p]}
                  scores={[scores[i]]}
                  totals={[totals[i]]}
                  isGameOver={isGameOver}
                  onCellTap={onCellTap}
                  bonusPlayerId={bonusPlayerId}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div class="card overflow-hidden mx-auto w-fit max-w-full">
          <div ref={scrollRef} class="overflow-x-auto scrollbar-subtle">
            <ScoreTable
              players={visiblePlayers}
              scores={visibleScores}
              totals={visibleTotals}
              isGameOver={isGameOver}
              onCellTap={onCellTap}
              bonusPlayerId={bonusPlayerId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
