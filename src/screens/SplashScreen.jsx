import { useEffect, useState } from 'react';
import Watermark from '../components/Watermark';

const MATH_PARTICLES = [
  { char: '+', top: '15%', left: '12%', size: 28, delay: 0 },
  { char: '−', top: '65%', left: '82%', size: 32, delay: 1.5 },
  { char: '×', top: '75%', left: '14%', size: 30, delay: 0.8 },
  { char: '÷', top: '22%', left: '78%', size: 34, delay: 2.2 },
  { char: '√', top: '42%', left: '88%', size: 24, delay: 1.1 },
  { char: 'x²', top: '48%', left: '10%', size: 22, delay: 1.9 },
  { char: '?', top: '80%', left: '60%', size: 28, delay: 0.4 },
  { char: '%', top: '18%', left: '46%', size: 20, delay: 2.7 }
];

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0); // 0=logo, 1=text/loading, 2=fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => onDone(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="app-screen splash-premium-bg"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        opacity: phase === 2 ? 0 : 1,
        transition: 'opacity 0.5s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Math Symbol Particles */}
      {MATH_PARTICLES.map((p, idx) => (
        <div
          key={idx}
          className="math-particle"
          style={{
            top: p.top,
            left: p.left,
            fontSize: p.size,
            animation: `floatMathSymbol 6s ease-in-out ${p.delay}s infinite`,
          }}
        >
          {p.char}
        </div>
      ))}

      {/* Decorative Blur Orbs */}
      <div style={{
        position: 'absolute', width: 320, height: 320,
        borderRadius: '50%', top: '-60px', right: '-60px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 280, height: 280,
        borderRadius: '50%', bottom: '-40px', left: '-40px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />

      {/* App Logo with breathing glow pulse */}
      <div
        className="anim-bounce-in logo-glow-pulse"
        style={{
          width: 110, height: 110,
          borderRadius: 28,
          overflow: 'hidden',
          marginBottom: 32,
          zIndex: 5,
        }}
      >
        <img
          src="/logo.png"
          alt="CalcRush"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* App Title & Subtitle */}
      <div
        className={`anim-fade-in-up ${phase >= 1 ? '' : 'opacity-0'}`}
        style={{ textAlign: 'center', zIndex: 5, transition: 'opacity 0.4s ease' }}
      >
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 46,
          fontWeight: 900,
          margin: 0,
          background: 'linear-gradient(135deg, #e9d5ff 0%, #f5f3ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-1.5px',
          textShadow: '0 4px 10px rgba(0,0,0,0.15)',
        }}>
          CalcRush
        </h1>
        <p style={{
          margin: '8px 0 0',
          fontSize: 13,
          color: 'rgba(255,255,255,0.45)',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}>
          Math · Speed · Practice
        </p>
      </div>

      {/* Premium Linear Loading Progress Bar */}
      <div style={{
        position: 'absolute', bottom: 70,
        width: 140, height: 3,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 100,
        overflow: 'hidden',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'opacity 0.3s ease 0.2s',
        zIndex: 5,
      }}>
        <div style={{
          height: '100%',
          width: '100%',
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-light))',
          transformOrigin: 'left',
          animation: 'progress-loading 1.8s cubic-bezier(0.1, 0.85, 0.25, 1) forwards',
        }} />
      </div>

      <Watermark />
    </div>
  );
}
