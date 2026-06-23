import { useState, useCallback, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
import StatsScreen from './screens/StatsScreen';
import LandingPage from './screens/LandingPage';
import { loadStorage, saveStorage, updateStats, resetStorage } from './utils/storage';
import { initAdMob, showBanner, hideBanner, prepareInterstitial, showInterstitial } from './utils/admobUtils';
import { scheduleDailyReminder, cancelDailyReminder } from './utils/notificationUtils';
import { Capacitor } from '@capacitor/core';

const SCREEN = {
  SPLASH: 'splash',
  HOME: 'home',
  QUIZ: 'quiz',
  RESULT: 'result',
  STATS: 'stats',
};

export default function App() {
  const [screen, setScreen] = useState(SCREEN.SPLASH);
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [storageData, setStorageData] = useState(() => loadStorage());
  const [theme, setTheme] = useState(() => loadStorage().theme || 'dark');
  const [adLoading, setAdLoading] = useState(false);
  const [quizKey, setQuizKey] = useState(0);
  const [playDemo, setPlayDemo] = useState(false);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Init AdMob once on mount
  useEffect(() => {
    initAdMob();
  }, []);

  // Sync Daily Reminders when settings load or change
  useEffect(() => {
    if (storageData.notificationsEnabled) {
      scheduleDailyReminder().catch(() => {});
    } else {
      cancelDailyReminder().catch(() => {});
    }
  }, [storageData.notificationsEnabled]);

  // Show / hide banner depending on active screen
  useEffect(() => {
    if (screen === SCREEN.QUIZ || screen === SCREEN.SPLASH || adLoading) {
      hideBanner();
    } else {
      showBanner();
    }
  }, [screen, adLoading]);

  function toggleTheme() {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      setStorageData(d => {
        const updated = { ...d, theme: next };
        saveStorage(updated);
        return updated;
      });
      return next;
    });
  }

  const handleUpdateSettings = useCallback((key, value) => {
    setStorageData(d => {
      const updated = { ...d, [key]: value };
      saveStorage(updated);
      return updated;
    });
  }, []);

  const handleSplashDone = useCallback(() => {
    setScreen(SCREEN.HOME);
  }, []);

  function handleStart(config) {
    setStorageData(d => {
      const updated = {
        ...d,
        lastMode: config.mode,
        lastOperation: config.operation,
        lastDifficulty: config.difficulty,
      };
      saveStorage(updated);
      return updated;
    });
    setQuizConfig(config);
    setQuizKey(prev => prev + 1);
    setScreen(SCREEN.QUIZ);
    // Pre-load the interstitial in the background while the user plays.
    prepareInterstitial().catch(() => {});
  }

  async function handleQuizFinish(result) {
    // 1. Save stats
    setStorageData(d => {
      const updated = updateStats(d, result);
      saveStorage(updated);
      return updated;
    });
    setQuizResult(result);

    // 2. Show overlay immediately so the user never sees a half-reset quiz.
    setAdLoading(true);

    // 3. Show interstitial — it was pre-loaded at quiz start so this is fast.
    try {
      const timeout = new Promise(resolve => setTimeout(resolve, 3000));
      await Promise.race([showInterstitial(), timeout]);
    } catch {
      // Ad failed — just continue
    }

    // 4. Go to result screen
    setAdLoading(false);
    setScreen(SCREEN.RESULT);
  }

  function handleQuit() {
    setScreen(SCREEN.HOME);
  }

  function handleRestart() {
    setQuizKey(prev => prev + 1);
    setScreen(SCREEN.QUIZ);
  }

  function handleHome() {
    setScreen(SCREEN.HOME);
  }

  function handleShowStats() {
    setScreen(SCREEN.STATS);
  }

  function handleResetStats() {
    const reset = resetStorage();
    setStorageData(reset);
  }

  const isNative = Capacitor.isNativePlatform();

  if (!isNative && !playDemo) {
    return (
      <LandingPage
        theme={theme}
        onToggleTheme={toggleTheme}
        onPlayDemo={() => {
          setScreen(SCREEN.HOME);
          setPlayDemo(true);
        }}
      />
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {screen === SCREEN.SPLASH && (
        <SplashScreen onDone={handleSplashDone} />
      )}
      {screen === SCREEN.HOME && (
        <HomeScreen
          onStart={handleStart}
          storageData={storageData}
          theme={theme}
          onToggleTheme={toggleTheme}
          onShowStats={handleShowStats}
          onUpdateSettings={handleUpdateSettings}
          onExitDemo={!isNative ? () => setPlayDemo(false) : null}
        />
      )}
      {screen === SCREEN.QUIZ && quizConfig && (
        <QuizScreen
          key={`${quizConfig.mode}-${quizConfig.operation}-${quizConfig.difficulty}-${quizKey}`}
          config={quizConfig}
          onFinish={handleQuizFinish}
          onQuit={handleQuit}
        />
      )}
      {screen === SCREEN.RESULT && quizResult && (
        <ResultScreen
          result={quizResult}
          storageData={storageData}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}
      {screen === SCREEN.STATS && (
        <StatsScreen
          storageData={storageData}
          onClose={handleHome}
          onReset={handleResetStats}
        />
      )}

      {/* Full-screen loading overlay shown while interstitial is loading/playing. */}
      {adLoading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'var(--color-bg)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 20,
        }}>
          {/* Spinner */}
          <div style={{
            width: 56, height: 56,
            borderRadius: '50%',
            border: '4px solid rgba(124,58,237,0.15)',
            borderTopColor: '#7c3aed',
            animation: 'spin-slow 0.8s linear infinite',
          }} />
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 16, fontWeight: 700,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.04em',
          }}>
            Loading results…
          </div>
        </div>
      )}

    </div>
  );
}
