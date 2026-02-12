import { useReducer, useEffect, useRef, useCallback, useState } from 'preact/hooks';
import type { GameState, GameAction, ScoreCategory, ScoreEntryTarget } from './types';
import { gameReducer, initialGameState } from './state/gameReducer';
import { useTheme, THEME_COLORS, isLightTheme } from './hooks/useTheme';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { StatusBar, Style } from '@capacitor/status-bar';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

export function App() {
  const [state, rawDispatch] = useReducer(gameReducer, initialGameState);
  const { theme, setTheme } = useTheme();
  const hasGameHistory = useRef(false);
  const undoStack = useRef<GameState[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [undoHighlight, setUndoHighlight] = useState<ScoreEntryTarget | null>(null);
  const pendingUndo = useRef<{ timer: ReturnType<typeof setTimeout>; prevState: GameState } | null>(null);

  const dispatch = useCallback((action: GameAction) => {
    if (action.type === 'SET_SCORE') {
      undoStack.current.push(structuredClone(state));
      setCanUndo(true);
    } else if (action.type === 'START_GAME' || action.type === 'RESET_GAME') {
      undoStack.current = [];
      setCanUndo(false);
      if (pendingUndo.current) {
        clearTimeout(pendingUndo.current.timer);
        pendingUndo.current = null;
      }
    }
    rawDispatch(action);
  }, [state]);

  const undo = useCallback(() => {
    // If there's a pending undo animation, complete it immediately
    if (pendingUndo.current) {
      clearTimeout(pendingUndo.current.timer);
      rawDispatch({ type: 'RESTORE_STATE', state: pendingUndo.current.prevState });
      pendingUndo.current = null;
    }

    const prev = undoStack.current.pop();
    if (!prev) return;

    // Find which cell is being undone
    let highlight: ScoreEntryTarget | null = null;
    for (const ps of state.scores) {
      const prevPs = prev.scores.find((s) => s.playerId === ps.playerId);
      if (!prevPs) continue;
      for (const cat of Object.keys(ps.categories) as ScoreCategory[]) {
        if (ps.categories[cat] !== null && prevPs.categories[cat] === null) {
          highlight = { playerId: ps.playerId, category: cat };
          break;
        }
      }
      if (highlight) break;
    }

    // Set highlight (triggers scroll in Scorecard, animation starts after scroll)
    setUndoHighlight(highlight);
    setCanUndo(undoStack.current.length > 0);
    // Actual RESTORE_STATE is delayed — triggered by onUndoAnimationStart callback
    pendingUndo.current = { timer: 0 as unknown as ReturnType<typeof setTimeout>, prevState: prev };
  }, [state]);

  const handleUndoAnimationStart = useCallback(() => {
    if (!pendingUndo.current) return;
    const prev = pendingUndo.current.prevState;
    pendingUndo.current.timer = setTimeout(() => {
      rawDispatch({ type: 'RESTORE_STATE', state: prev });
      pendingUndo.current = null;
    }, 500);
  }, []);

  // Initialize StatusBar for native platforms
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Enable edge-to-edge mode with proper safe area handling
      if (Capacitor.getPlatform() === 'android') {
        EdgeToEdge.enable();
      }
    }
  }, []);

  // Update status bar and navigation bar colors when theme changes
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const themeColor = THEME_COLORS[theme];
    const isLight = isLightTheme(theme);

    // Update colors for Android
    if (Capacitor.getPlatform() === 'android') {
      EdgeToEdge.setStatusBarColor({ color: themeColor });
      EdgeToEdge.setNavigationBarColor({ color: themeColor });
    }

    // Update status bar style (dark icons for light theme, light icons for dark themes)
    StatusBar.setStyle({ style: isLight ? Style.Light : Style.Dark });
  }, [theme]);

  // Handle Android back button
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listenerHandle: any;

    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (state.phase !== 'setup') {
        // If in game, go back to setup instead of closing app
        dispatch({ type: 'RESET_GAME' });
      } else if (!canGoBack) {
        // If at setup and can't go back, exit the app
        CapacitorApp.exitApp();
      }
    }).then(handle => {
      listenerHandle = handle;
    });

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [state.phase]);

  useEffect(() => {
    const onPopState = () => {
      if (state.phase !== 'setup') dispatch({ type: 'RESET_GAME' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === 'setup') {
      history.replaceState({ phase: 'setup' }, '', window.location.href);
      hasGameHistory.current = false;
      return;
    }

    if (!hasGameHistory.current) {
      history.pushState({ phase: 'game' }, '', window.location.href);
      hasGameHistory.current = true;
    }
  }, [state.phase]);

  if (state.phase === 'setup') {
    return (
      <>
        <div
          class="fixed left-4 z-40"
          style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>
        <SetupScreen dispatch={dispatch} />
      </>
    );
  }

  return (
    <GameScreen
      state={state}
      dispatch={dispatch}
      onUndo={undo}
      canUndo={canUndo}
      undoHighlight={undoHighlight}
      clearUndoHighlight={() => setUndoHighlight(null)}
      onUndoAnimationStart={handleUndoAnimationStart}
    />
  );
}
