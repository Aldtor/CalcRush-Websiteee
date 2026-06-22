import { useState } from 'react';
import { MODES, OPERATIONS, DIFFICULTIES } from '../utils/mathUtils';
import Watermark from '../components/Watermark';

export default function HomeScreen({ onStart, storageData, theme, onToggleTheme, onShowStats, onUpdateSettings }) {
  const [selectedMode, setSelectedMode] = useState(storageData.lastMode || 'basic');
  const [selectedOp, setSelectedOp] = useState(storageData.lastOperation || 'addition');
  const [selectedDiff, setSelectedDiff] = useState(storageData.lastDifficulty || 'easy');

  // Custom configuration states
  const [speedDuration, setSpeedDuration] = useState(30);
  const [accuracyCount, setAccuracyCount] = useState(10);
  const [showSettings, setShowSettings] = useState(false);

  function handleStart() {
    const config = {
      mode: selectedMode,
      operation: selectedOp,
      difficulty: selectedDiff,
      advancedMath: storageData.advancedMath
    };

    if (selectedMode === 'speed') {
      config.timer = speedDuration;
      config.questions = null;
    } else if (selectedMode === 'accuracy') {
      config.questions = accuracyCount;
      config.timer = null;
    } else {
      config.timer = null;
      config.questions = null;
    }

    onStart(config);
  }

  const totalSolved = storageData.totalSolved || 0;
  const accuracy = storageData.totalAccuracy || 0;
  const bestScore = storageData.bestScore || 0;

  return (
    <div className="app-screen">

      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--color-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px 12px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            overflow: 'hidden', flexShrink: 0,
            boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          }}>
            <img
              src="/logo.png"
              alt="CalcRush"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 19, lineHeight: 1 }}>CalcRush</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '0.04em' }}>Math Practice</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onShowStats}
            style={{ padding: '8px 12px', fontSize: 13, minHeight: 36 }}
          >
            📊 Stats
          </button>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--color-card)', border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, cursor: 'pointer', color: 'var(--color-text)'
            }}
            title="Settings"
          >
            ⚙️
          </button>
          <button
            onClick={onToggleTheme}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--color-card)', border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ padding: '16px 20px 40px' }}>

        {/* Quick Stats */}
        <div className="stats-grid anim-fade-in-up" style={{ marginBottom: 20 }}>
          <div className="stat-card">
            <div className="stat-value">{totalSolved}</div>
            <div className="stat-label">Solved</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#10b981' }}>{accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#f59e0b' }}>{bestScore}</div>
            <div className="stat-label">Best Score</div>
          </div>
        </div>

        {/* Practice Mode */}
        <div className="anim-fade-in-up delay-100" style={{ marginBottom: 20 }}>
          <div className="section-label">Practice Mode</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  borderRadius: 14,
                  border: `2px solid ${selectedMode === m.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: selectedMode === m.id
                    ? 'rgba(124,58,237,0.12)'
                    : 'var(--color-card)',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s ease',
                  width: '100%',
                }}
              >
                <span style={{ fontSize: 26 }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text)' }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{m.desc}</div>
                </div>
                {selectedMode === m.id && (
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, color: 'white', fontWeight: 700, flexShrink: 0,
                  }}>✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom duration selectors for Speed mode */}
        {selectedMode === 'speed' && (
          <div className="anim-fade-in" style={{
            marginTop: -10, marginBottom: 20, padding: '14px 16px',
            background: 'var(--color-card)', border: '2px solid var(--color-border)',
            borderRadius: 14,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Time Limit: <span style={{ color: 'var(--color-primary-light)', fontWeight: 800 }}>{speedDuration} seconds</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {[30, 60, 90, 120].map(sec => (
                <button
                  key={sec}
                  onClick={() => setSpeedDuration(sec)}
                  className={`chip ${speedDuration === sec ? 'active' : ''}`}
                  style={{ padding: '8px 14px', fontSize: 12, borderRadius: 10, border: '1px solid var(--color-border)' }}
                >
                  {sec}s
                </button>
              ))}
              <div style={{ flex: 1, minWidth: 120, display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                <input
                  type="range"
                  min="10"
                  max="180"
                  step="5"
                  value={speedDuration}
                  onChange={(e) => setSpeedDuration(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Custom questions selector for Accuracy mode */}
        {selectedMode === 'accuracy' && (
          <div className="anim-fade-in" style={{
            marginTop: -10, marginBottom: 20, padding: '14px 16px',
            background: 'var(--color-card)', border: '2px solid var(--color-border)',
            borderRadius: 14,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Questions: <span style={{ color: 'var(--color-primary-light)', fontWeight: 800 }}>{accuracyCount} questions</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {[10, 20, 30, 50].map(count => (
                <button
                  key={count}
                  onClick={() => setAccuracyCount(count)}
                  className={`chip ${accuracyCount === count ? 'active' : ''}`}
                  style={{ padding: '8px 14px', fontSize: 12, borderRadius: 10, border: '1px solid var(--color-border)' }}
                >
                  {count}
                </button>
              ))}
              <div style={{ flex: 1, minWidth: 120, display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={accuracyCount}
                  onChange={(e) => setAccuracyCount(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Operations */}
        <div className="anim-fade-in-up delay-200" style={{ marginBottom: 20 }}>
          <div className="section-label">Operation</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 8,
          }}>
            {OPERATIONS.map(op => (
              <button
                key={op.id}
                onClick={() => setSelectedOp(op.id)}
                className={`op-icon ${selectedOp === op.id ? 'active' : ''}`}
                style={{
                  background: selectedOp === op.id ? op.bg : 'var(--color-card)',
                  borderColor: selectedOp === op.id ? op.color : 'var(--color-border)',
                  color: selectedOp === op.id ? op.color : 'var(--color-text-muted)',
                  border: `2px solid ${selectedOp === op.id ? op.color : 'var(--color-border)'}`,
                  fontSize: op.id === 'mixed' ? 18 : 22,
                  flexDirection: 'column',
                  gap: 2,
                  width: '100%',
                  height: 60,
                }}
              >
                <span>{op.symbol}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  {op.label.slice(0, 4)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="anim-fade-in-up delay-300" style={{ marginBottom: 24 }}>
          <div className="section-label">Difficulty</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDiff(d.id)}
                style={{
                  flex: 1, padding: '12px 8px', borderRadius: 14,
                  border: `2px solid ${selectedDiff === d.id ? d.color : 'var(--color-border)'}`,
                  background: selectedDiff === d.id ? `${d.color}18` : 'var(--color-card)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  fontWeight: 700, fontSize: 15,
                  color: selectedDiff === d.id ? d.color : 'var(--color-text)',
                }}>
                  {d.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>
                  {d.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          className="btn btn-primary btn-lg anim-fade-in-up delay-400 anim-pulse-glow"
          onClick={handleStart}
          style={{ width: '100%', fontSize: 20, minHeight: 64 }}
        >
          🚀 Start Practice
        </button>

        <Watermark inline />
      </div>

      {/* Settings Drawer Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(15,14,23,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'flex-end',
        }} onClick={() => setShowSettings(false)}>
          <div style={{
            width: '85%', maxWidth: 360, height: '100%',
            background: 'var(--color-bg)',
            borderLeft: '1px solid var(--color-border)',
            padding: '24px 20px',
            display: 'flex', flexDirection: 'column',
            gap: 24,
            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            animation: 'slideInRight 0.3s ease forwards',
          }} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
              <h3 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 900 }}>⚙️ App Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  background: 'none', border: 'none', color: 'var(--color-text)',
                  fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Daily Reminder Setting */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ marginRight: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Daily Reminder</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>Get notified at 7 PM daily to practice math</div>
                </div>
                <div
                  className={`toggle ${storageData.notificationsEnabled ? 'on' : ''}`}
                  onClick={() => onUpdateSettings('notificationsEnabled', !storageData.notificationsEnabled)}
                >
                  <div className="toggle-thumb" />
                </div>
              </div>

              {/* Advanced Math Setting */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ marginRight: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Advanced Math</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>Include BODMAS, Algebra, and Squares/Roots</div>
                </div>
                <div
                  className={`toggle ${storageData.advancedMath ? 'on' : ''}`}
                  onClick={() => onUpdateSettings('advancedMath', !storageData.advancedMath)}
                >
                  <div className="toggle-thumb" />
                </div>
              </div>

              {/* Sound Effects Setting */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ marginRight: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Sound Effects</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>Play sound effects in-game</div>
                </div>
                <div
                  className={`toggle ${storageData.soundsEnabled ? 'on' : ''}`}
                  onClick={() => onUpdateSettings('soundsEnabled', !storageData.soundsEnabled)}
                >
                  <div className="toggle-thumb" />
                </div>
              </div>

            </div>

            <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: 11, color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
              CalcRush v1.1.0 • Built with Passion
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
