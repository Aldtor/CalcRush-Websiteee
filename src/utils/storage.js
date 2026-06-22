// LocalStorage utility for persisting stats and settings

const STORAGE_KEY = 'mathsprint_data';

const defaultData = {
  bestScore: 0,
  totalSolved: 0,
  totalCorrect: 0,
  totalAccuracy: 0,
  lastMode: 'basic',
  lastOperation: 'addition',
  lastDifficulty: 'easy',
  theme: 'dark',
  soundsEnabled: true,
  advancedMath: false,
  notificationsEnabled: false,
  sessions: [],
};

export function loadStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultData };
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return { ...defaultData };
  }
}

export function saveStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function updateStats(data, sessionResult) {
  const { correct, total, score } = sessionResult;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const newTotalSolved = (data.totalSolved || 0) + total;
  const newTotalCorrect = (data.totalCorrect || 0) + correct;
  const newAccuracy = newTotalSolved > 0 ? Math.round((newTotalCorrect / newTotalSolved) * 100) : 0;
  const newBestScore = Math.max(data.bestScore || 0, score || correct);

  const sessions = [...(data.sessions || [])].slice(-20); // keep last 20
  sessions.push({
    date: Date.now(),
    correct,
    total,
    accuracy,
    score: score || correct,
  });

  return {
    ...data,
    bestScore: newBestScore,
    totalSolved: newTotalSolved,
    totalCorrect: newTotalCorrect,
    totalAccuracy: newAccuracy,
    sessions,
  };
}

export function resetStorage() {
  const data = loadStorage();
  const reset = {
    ...defaultData,
    theme: data.theme, // keep theme preference
  };
  saveStorage(reset);
  return reset;
}
