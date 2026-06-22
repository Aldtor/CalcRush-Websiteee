// Aldtor watermark — supports inline (inside scroll) or absolute (fixed screens)
export default function Watermark({ inline = false }) {
  return (
    <div style={{
      ...(inline
        ? { position: 'relative', marginTop: 24, marginBottom: 4 }
        : { position: 'absolute', bottom: 14, left: 0, right: 0, pointerEvents: 'none', zIndex: 10 }
      ),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 12px',
        borderRadius: 100,
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          fontFamily: "'Inter', sans-serif",
        }}>
          Made by
        </span>
        <span style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: "'Outfit', sans-serif",
        }}>
          Aldtor
        </span>
      </div>
    </div>
  );
}
