import { useReducer } from 'preact/hooks';
import { gameReducer, initialGameState } from './state/gameReducer';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';

export function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  if (state.phase === 'setup') {
    return <SetupScreen dispatch={dispatch} />;
  }

  return <GameScreen state={state} dispatch={dispatch} />;
}
