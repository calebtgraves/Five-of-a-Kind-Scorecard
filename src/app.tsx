import { useReducer, useEffect, useRef } from 'preact/hooks';
import { gameReducer, initialGameState } from './state/gameReducer';
import { useTheme, THEME_COLORS } from './hooks/useTheme';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

export function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { theme, setTheme } = useTheme();
  const hasGameHistory = useRef(false);

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
    const isLightTheme = theme === 'light-soft';

    // Update colors for Android
    if (Capacitor.getPlatform() === 'android') {
      EdgeToEdge.setStatusBarColor({ color: themeColor });
      EdgeToEdge.setNavigationBarColor({ color: themeColor });
    }

    // Update status bar style (dark icons for light theme, light icons for dark themes)
    StatusBar.setStyle({ style: isLightTheme ? Style.Light : Style.Dark });
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
    return <SetupScreen dispatch={dispatch} theme={theme} setTheme={setTheme} />;
  }

  return <GameScreen state={state} dispatch={dispatch} />;
}
