import { useReducer, useEffect, useRef } from 'preact/hooks';
import { gameReducer, initialGameState } from './state/gameReducer';
import { useTheme } from './hooks/useTheme';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';

export function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { theme, setTheme } = useTheme();
  const hasGameHistory = useRef(false);

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
    return <SetupScreen dispatch={dispatch} theme={theme} setTheme={setTheme} />;
  }

  return <GameScreen state={state} dispatch={dispatch} />;
}
