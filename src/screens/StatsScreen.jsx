import { useState } from 'react';
import { resetStorage } from '../utils/storage';
import Watermark from '../components/Watermark';

function MiniBarChart({ sessions }) {
  if (!sessions || sessions.length === 0) return (
    <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-muted)', fontSize: 14 }}>
      No sessions yet. Start practicing!
    </div>
  );

  const maxScore = Math.max(...sessions.map(s => s.score), 1);
  const recent = sessions.slice(-10);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100, padding: '8px 4px' }}>
      {recent.map((s, i) => {
        const pct = Math.max(8, (s.score / maxScore) * 100);
        const acc = s.accuracy;
        const color = acc >= 80 ? '#10b981' : acc >= 50 ? '#f59e0b' : '#ef4444';
        return (
          <div key={i} style={{
            flex: 1, height: '100%', background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 6, position: 'relative', overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          }}>
            {/* Value Label */}
            <div style={{
              position: 'absolute', top: 4, left: 0, right: 0, zIndex: 2,
              textAlign: 'center', fontSize: 9, fontWeight: 900,
              color: 'var(--color-text)', opacity: 0.9,
            }}>
              {s.score}
            </div>
            {/* Progress Fill */}
            <div style={{
              width: '100%', height: `${pct}%`,
              background: `linear-gradient(to top, ${color}aa, ${color})`,
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }} />
          </div>
        );
      })}
    </div>
  );
}

export default function StatsScreen({ storageData, onClose, onReset }) {
  const [confirmReset, setConfirmReset] = useState(false);

  const sessions = storageData.sessions || [];
  const recent5 = sessions.slice(-5).reverse();

  function handleReset() {
    if (confirmReset) {
      onReset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'scroll', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', background: 'var(--color-bg)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div style={{ padding: '20px 20px 40px', minHeight: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            onClick={onClose}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'var(--color-card)', border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, cursor: 'pointer', color: 'var(--color-text)', flexShrink: 0,
            }}
          >←</button>
          <div>
            <h2 style={{ margin: 0, fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 900 }}>📊 Stats Dashboard</h2>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Your progress overview</div>
          </div>
        </div>

        {/* All-time stats cards with indicators */}
        <div className="section-label">All-Time</div>
        <div className="stats-grid anim-fade-in-up" style={{ marginBottom: 20 }}>
          <div className="stat-card" style={{ borderLeft: '3px solid #8b5cf6', paddingLeft: 8 }}>
            <div className="stat-value">{storageData.totalSolved || 0}</div>
            <div className="stat-label">Solved</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid #10b981', paddingLeft: 8 }}>
            <div className="stat-value" style={{ color: '#10b981' }}>{storageData.totalCorrect || 0}</div>
            <div className="stat-label">Correct</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid #ef4444', paddingLeft: 8 }}>
            <div className="stat-value" style={{ color: '#ef4444' }}>
              {Math.max(0, (storageData.totalSolved || 0) - (storageData.totalCorrect || 0))}
            </div>
            <div className="stat-label">Wrong</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid #c084fc', paddingLeft: 8 }}>
            <div className="stat-value" style={{ color: '#c084fc' }}>{storageData.totalAccuracy || 0}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid #f59e0b', paddingLeft: 8 }}>
            <div className="stat-value" style={{ color: '#f59e0b' }}>{storageData.bestScore || 0}</div>
            <div className="stat-label">Best Score</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid #06b6d4', paddingLeft: 8 }}>
            <div className="stat-value" style={{ color: '#06b6d4' }}>{sessions.length}</div>
            <div className="stat-label">Sessions</div>
          </div>
        </div>

        {/* Upgraded Chart */}
        <div className="section-label">Recent Sessions Progress</div>
        <div className="card anim-fade-in-up delay-100" style={{ padding: '20px 16px', marginBottom: 24 }}>
          <MiniBarChart sessions={sessions} />
          <div style={{ display: 'flex', gap: 16, marginTop: 16, justifyContent: 'center' }}>
            {[
              { color: '#10b981', label: '≥80% acc' },
              { color: '#f59e0b', label: '50-79%' },
              { color: '#ef4444', label: '<50%' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--color-text-muted)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2.5, background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Recent sessions list */}
        <div className="section-label">Recent Sessions</div>
        <div className="anim-fade-in-up delay-200" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {recent5.length === 0 ? (
            <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>
              No sessions yet
            </div>
          ) : recent5.map((s, i) => {
            const color = s.accuracy >= 80 ? '#10b981' : s.accuracy >= 50 ? '#f59e0b' : '#ef4444';
            const date = new Date(s.date);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            return (
              <div key={i} className="card" style={{
                padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 900, color, flexShrink: 0,
                  border: `1px solid ${color}30`
                }}>
                  {s.accuracy}%
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>Score: {s.score}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {s.correct}/{s.total} correct
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--color-text-muted)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{dateStr}</div>
                  <div style={{ marginTop: 2 }}>{timeStr}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset */}
        <button
          className={`btn ${confirmReset ? 'btn-danger' : 'btn-secondary'} btn-md anim-fade-in-up delay-300`}
          onClick={handleReset}
          style={{ width: '100%', marginBottom: 8 }}
        >
          {confirmReset ? '⚠️ Tap again to confirm reset' : '🗑️ Reset All Progress'}
        </button>

        <Watermark inline />

      </div>
    </div>
  );
}
