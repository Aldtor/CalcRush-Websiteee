/* eslint-disable */
import { useEffect, useState } from 'react';
import { OPERATIONS, DIFFICULTIES, MODES } from '../utils/mathUtils';
import { playResultSound } from '../utils/sounds';
import Watermark from '../components/Watermark';

function ScoreRing({ pct, size = 140 }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Outfit',sans-serif",
          fontSize: 30, fontWeight: 900,
          color,
          lineHeight: 1,
        }}>{pct}%</div>
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.08em' }}>ACCURACY</div>
      </div>
    </div>
  );
}

function RatingLabel({ pct }) {
  if (pct === 100) return <span>🏆 Perfect!</span>;
  if (pct >= 90) return <span>⭐ Excellent!</span>;
  if (pct >= 75) return <span>🎯 Great job!</span>;
  if (pct >= 50) return <span>💪 Keep going!</span>;
  return <span>📚 Practice more!</span>;
}

export default function ResultScreen({ result, storageData, onRestart, onHome }) {
  const { correct, total, score, streak, mode, operation, difficulty } = result;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const [ringPct, setRingPct] = useState(0);

  const opInfo = OPERATIONS.find(o => o.id === operation) || OPERATIONS[0];
  const diffInfo = DIFFICULTIES.find(d => d.id === difficulty) || DIFFICULTIES[0];
  const modeInfo = MODES.find(m => m.id === mode) || MODES[0];
  const isNewBest = score >= (storageData.bestScore || 0) && score > 0;

  useEffect(() => {
    const t = setTimeout(() => setRingPct(accuracy), 200);
    const s = setTimeout(() => playResultSound(correct, total), 600);
    return () => { clearTimeout(t); clearTimeout(s); };
  }, [accuracy]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'scroll', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', background: 'var(--color-bg)' }}>
      <div style={{ padding: '20px 20px 40px', minHeight: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header */}
        <div className="anim-fade-in-up" style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>
            {accuracy === 100 ? '🏆' : accuracy >= 75 ? '🎯' : accuracy >= 50 ? '💪' : '📚'}
          </div>
          <h2 style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 28, fontWeight: 900,
            margin: 0, color: 'var(--color-text)',
          }}>
            <RatingLabel pct={accuracy} />
          </h2>
          {isNewBest && (
            <div className="streak-badge anim-bounce-in delay-200" style={{ marginTop: 10, display: 'inline-flex' }}>
              🎉 New Best Score!
            </div>
          )}
        </div>

        {/* Score Ring + Stats */}
        <div className="card anim-fade-in-up delay-100" style={{ padding: '24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ScoreRing pct={ringPct} />
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Score</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 40, fontWeight: 900, color: 'var(--color-primary-light)', lineHeight: 1 }}>
                  {score}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div className="stat-card" style={{ padding: '10px 8px' }}>
                  <div className="stat-value" style={{ fontSize: 22, color: '#10b981' }}>{correct}</div>
                  <div className="stat-label">Correct</div>
                </div>
                <div className="stat-card" style={{ padding: '10px 8px' }}>
                  <div className="stat-value" style={{ fontSize: 22, color: '#ef4444' }}>{total - correct}</div>
                  <div className="stat-label">Wrong</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Row */}
        <div className="anim-fade-in-up delay-200" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div className="stat-card">
            <div style={{ fontSize: 22 }}>{modeInfo.icon}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, fontWeight: 600 }}>{modeInfo.label.split(' ')[0]}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: 22, fontWeight: 900, color: opInfo.color }}>{opInfo.symbol}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, fontWeight: 600 }}>{opInfo.label}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: 18, fontWeight: 800, color: diffInfo.color }}>{diffInfo.label}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, fontWeight: 600 }}>{diffInfo.desc}</div>
          </div>
        </div>

        {/* Streak */}
        {streak >= 3 && (
          <div
            className="anim-scale-in delay-300"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.1))',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 16, padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <span style={{ fontSize: 30 }}>🔥</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#f59e0b' }}>Best Streak: {streak}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Keep the fire going!</div>
            </div>
          </div>
        )}

        {/* Overall Stats */}
        <div className="anim-fade-in-up delay-300">
          <div className="section-label" style={{ marginBottom: 10 }}>All-Time Stats</div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{storageData.totalSolved || 0}</div>
              <div className="stat-label">Total Solved</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#10b981' }}>{storageData.totalAccuracy || 0}%</div>
              <div className="stat-label">Avg Accuracy</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#f59e0b' }}>{storageData.bestScore || 0}</div>
              <div className="stat-label">Best Score</div>
            </div>
          </div>
        </div>

        {/* Mistakes Review */}
        {result.mistakes && result.mistakes.length > 0 && (
          <div className="anim-fade-in-up delay-300" style={{ marginBottom: 10 }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Review Mistakes ({result.mistakes.length})</div>
            <div className="card" style={{
              padding: '16px', display: 'flex', flexDirection: 'column', gap: 10,
              maxHeight: 180, overflowY: 'auto', background: 'rgba(239,68,68,0.03)',
              border: '1.5px solid rgba(239,68,68,0.2)'
            }}>
              {result.mistakes.map((m, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', background: 'var(--color-bg)',
                  borderRadius: 10, borderLeft: '3px solid var(--color-danger)',
                }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700 }}>
                    {m.question} = <span style={{ color: 'var(--color-success)' }}>{m.correctAnswer}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    Your answer: <span style={{ color: 'var(--color-danger)', textDecoration: 'line-through', fontWeight: 700 }}>{m.userAnswer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="anim-fade-in-up delay-400" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
          <button className="btn btn-primary btn-lg" onClick={onRestart} style={{ width: '100%' }}>
            🔄 Play Again
          </button>
          <button className="btn btn-secondary btn-md" onClick={onHome} style={{ width: '100%' }}>
            🏠 Home
          </button>
        </div>

        {/* Watermark — always last, inline so it never overlaps buttons */}
        <Watermark inline />

      </div>
    </div>
  );
}
