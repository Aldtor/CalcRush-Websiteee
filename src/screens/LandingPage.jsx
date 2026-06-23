import { useState, useEffect } from 'react';

const screenshots = [
  { src: '/calcRush-ss1.jpeg', title: 'Home Screen' },
  { src: '/calcRush-ss2.jpeg', title: 'Interactive Quiz' },
  { src: '/calcRush-ss3.jpeg', title: 'Stats & Charts' },
  { src: '/calcRush-ss4.jpeg', title: 'Detailed Results' },
];

const features = [
  { icon: '⏱️', title: 'Timed Challenges', desc: 'Each round is timed — the pressure makes simple math surprisingly fun and intense.' },
  { icon: '📈', title: 'Adaptive Difficulty', desc: 'Easy, Medium, and Hard modes with distinct question generation algorithms.' },
  { icon: '📊', title: 'Stats & History', desc: 'Track your accuracy, average time, and improvement across sessions.' },
  { icon: '🎁', title: 'Rewarded Ads', desc: 'AdMob rewarded interstitials shown after quiz completion — clean, non-intrusive monetization.' },
  { icon: '🌙', title: 'Dark Mode UI', desc: 'Premium dark-first UI designed for comfortable long sessions without eye strain.' },
  { icon: '📱', title: 'Native Android', desc: 'Built with Capacitor wrapping a React web app — smooth, native APK performance.' }
];

const faqs = [
  {
    q: 'What is CalcRush?',
    a: 'CalcRush is a high-speed mental math training app designed to help you improve your arithmetic speed, accuracy, and overall focus through daily practice modes, speed challenges, and performance tracking.'
  },
  {
    q: 'Does CalcRush collect any personal data?',
    a: 'No. CalcRush is entirely privacy-first. We do not collect, store, or share any personally identifiable information (PII). All quiz scores, accuracy ratings, and settings are saved locally on your device storage and never sent to our servers.'
  },
  {
    q: 'How does the Speed Challenge mode work?',
    a: 'In Speed Challenge, you choose a time limit (30s, 60s, or 120s) and try to answer as many arithmetic questions correctly as you can. Incorrect answers do not end the run but will impact your accuracy percentage.'
  },
  {
    q: 'Why are advertisements displayed?',
    a: 'To keep CalcRush 100% free to download and use, we display non-intrusive banner and occasional interstitial ads powered by Google AdMob. These ads comply with Google Play Family policies.'
  },
  {
    q: 'How do I contact support or report a bug?',
    a: 'You can contact the developer (Aldtor) directly by filling out the form on the Support tab of this website or by emailing us at aldtor.dev@gmail.com.'
  }
];

export default function LandingPage({ theme, onToggleTheme, onPlayDemo }) {
  const [activeTab, setActiveTab] = useState('home');
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState({ submitted: false, loading: false, error: '' });

  // Handle responsive resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Swipe and Keyboard listeners for carousel
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    if (activeTab !== 'home') return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setActiveScreenshot((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveScreenshot((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 40;
    if (isSwipe) {
      if (distance > 0) {
        setActiveScreenshot((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
      } else {
        setActiveScreenshot((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ submitted: false, loading: false, error: 'Please fill in all required fields.' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormStatus({ submitted: false, loading: false, error: 'Please enter a valid email address.' });
      return;
    }

    setFormStatus({ submitted: false, loading: true, error: '' });

    // Simulate sending message with a premium delay
    setTimeout(() => {
      setFormStatus({ submitted: true, loading: false, error: '' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div style={{
      background: 'var(--color-bg)',
      color: 'var(--color-text)',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      paddingTop: 'env(safe-area-inset-top, 0px)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .btn-shimmer {
          position: relative;
          overflow: hidden;
        }
        .btn-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          animation: shine 4s infinite linear;
        }
        @keyframes floatUp {
          0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.12; }
          90% { opacity: 0.12; }
          100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }
        .math-symbol {
          position: fixed;
          color: var(--color-primary-light);
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          pointer-events: none;
          user-select: none;
          z-index: 1;
          animation: floatUp 15s infinite linear;
        }
        .feat-card-hover {
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
        }
        .feat-card-hover:hover {
          transform: translateY(-5px);
          border-color: rgba(139, 92, 246, 0.35) !important;
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.15), 0 8px 32px rgba(0,0,0,0.15) !important;
        }
        .stat-card-hover {
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
        }
        .stat-card-hover:hover {
          transform: translateY(-5px) scale(1.02) !important;
          border-color: rgba(245, 158, 11, 0.45) !important;
          box-shadow: 0 10px 30px rgba(245, 158, 11, 0.22), 0 8px 32px rgba(0,0,0,0.15) !important;
        }
      `}</style>

      {/* Floating Math Symbols */}
      {[
        { symbol: '+', left: '10%', size: '32px', delay: '0s', duration: '18s' },
        { symbol: '−', left: '25%', size: '24px', delay: '3s', duration: '22s' },
        { symbol: '×', left: '40%', size: '28px', delay: '7s', duration: '15s' },
        { symbol: '÷', left: '55%', size: '36px', delay: '2s', duration: '20s' },
        { symbol: '√', left: '70%', size: '30px', delay: '9s', duration: '17s' },
        { symbol: '%', left: '85%', size: '22px', delay: '5s', duration: '24s' },
        { symbol: 'x²', left: '15%', size: '26px', delay: '11s', duration: '19s' },
        { symbol: '+', left: '60%', size: '28px', delay: '13s', duration: '21s' },
        { symbol: '×', left: '80%', size: '34px', delay: '1s', duration: '16s' },
        { symbol: '−', left: '48%', size: '24px', delay: '15s', duration: '23s' },
      ].map((p, idx) => (
        <div
          key={idx}
          className="math-symbol"
          style={{
            left: p.left,
            fontSize: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: 0,
          }}
        >
          {p.symbol}
        </div>
      ))}

      {/* FIXED GLOW SPHERES */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0) 70%)', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, rgba(245, 158, 11, 0) 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />

      {/* Premium Navigation Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: theme === 'dark' ? 'rgba(9, 9, 15, 0.75)' : 'rgba(249, 250, 251, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
        padding: isMobile ? '12px 16px' : '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo and Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            overflow: 'hidden', boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
          }}>
            <img src="/logo.png" alt="CalcRush" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 18, lineHeight: 1 }}>CalcRush</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '0.04em' }}>Math Practice</div>
          </div>
        </div>

        {/* Tab Navigation links */}
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? 12 : 24, 
          fontSize: isMobile ? 13 : 14, 
          fontWeight: 600 
        }}>
          <button 
            onClick={() => setActiveTab('home')}
            style={{
              background: 'none', border: 'none', outline: 'none', cursor: 'pointer',
              color: activeTab === 'home' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'color 0.2s', padding: '4px 0', position: 'relative',
              fontWeight: activeTab === 'home' ? 700 : 500
            }}
          >
            Home
            {activeTab === 'home' && <span style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, background: 'var(--color-primary)', borderRadius: 2 }} />}
          </button>

          <button 
            onClick={() => setActiveTab('privacy')}
            style={{
              background: 'none', border: 'none', outline: 'none', cursor: 'pointer',
              color: activeTab === 'privacy' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'color 0.2s', padding: '4px 0', position: 'relative',
              fontWeight: activeTab === 'privacy' ? 700 : 500
            }}
          >
            Privacy
            {activeTab === 'privacy' && <span style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, background: 'var(--color-primary)', borderRadius: 2 }} />}
          </button>

          <button 
            onClick={() => setActiveTab('terms')}
            style={{
              background: 'none', border: 'none', outline: 'none', cursor: 'pointer',
              color: activeTab === 'terms' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'color 0.2s', padding: '4px 0', position: 'relative',
              fontWeight: activeTab === 'terms' ? 700 : 500
            }}
          >
            Terms
            {activeTab === 'terms' && <span style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, background: 'var(--color-primary)', borderRadius: 2 }} />}
          </button>

          <button 
            onClick={() => setActiveTab('support')}
            style={{
              background: 'none', border: 'none', outline: 'none', cursor: 'pointer',
              color: activeTab === 'support' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'color 0.2s', padding: '4px 0', position: 'relative',
              fontWeight: activeTab === 'support' ? 700 : 500
            }}
          >
            Support
            {activeTab === 'support' && <span style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, background: 'var(--color-primary)', borderRadius: 2 }} />}
          </button>
        </nav>

        {/* Theme and Action */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={onToggleTheme}
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'var(--color-card)', border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={onPlayDemo}
              className="btn btn-secondary"
              style={{
                borderRadius: 12, padding: '10px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
                borderColor: 'var(--color-primary-light)', color: 'var(--color-primary-light)',
                fontWeight: 700
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)';
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--color-card)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Play Demo 🚀
            </button>
            <a 
              href="https://play.google.com/store/apps/details?id=com.aldtor.calcrush&pcampaignid=web_share" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                borderRadius: 12, padding: '10px 18px', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <span>🤖</span> Get CalcRush
            </a>
          </div>
        )}

        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={onPlayDemo}
              style={{
                borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                boxShadow: '0 2px 10px rgba(124, 58, 237, 0.3)'
              }}
            >
              Play Demo 🚀
            </button>
            <button
              onClick={onToggleTheme}
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'var(--color-card)', border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, cursor: 'pointer',
              }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>

        {/* ================= HOME TAB ================= */}
        {activeTab === 'home' && (
          <div className="anim-fade-in" style={{ paddingBottom: 80 }}>
            {/* HERO BANNER */}
            <div style={{ width: '100%', background: 'var(--color-bg)' }}>
              <div style={{
                width: '100%',
                overflow: 'hidden',
                borderBottom: '1px solid var(--color-border)',
                boxShadow: '0 10px 60px rgba(0,0,0,.5), 0 0 60px rgba(124,58,237,.08)',
              }}>
                <img 
                  src="/calcRush-banner.png" 
                  alt="CalcRush Feature Banner" 
                  style={{ width: '100%', display: 'block', objectFit: 'contain' }}
                  loading="eager"
                />
              </div>
            </div>

            {/* APP INFO */}
            <div style={{ padding: isMobile ? '40px 16px 20px' : '60px 32px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
                <span style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 50, background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
                  🚀 Live on Google Play
                </span>
                <span style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 50, background: 'rgba(59,130,246,.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,.2)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
                  📱 Android
                </span>
                <span style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 50, background: 'rgba(245,158,11,.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,.2)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
                  AdMob
                </span>
              </div>

              <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                fontWeight: 900,
                letterSpacing: '-.04em',
                lineHeight: 1.05,
                marginBottom: 16,
                marginTop: 0,
              }}>
                <span className="text-gradient">Calc</span>Rush
              </h1>

              <p style={{
                color: 'var(--color-text-muted)',
                fontSize: 'clamp(0.95rem, 3vw, 1.05rem)',
                lineHeight: 1.7,
                marginBottom: 32,
                maxWidth: 680,
              }}>
                A fast-paced math quiz app that challenges your mental arithmetic with timed levels, difficulty scaling, and reward-based ads. Built with React Native + Capacitor for Android.
              </p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.aldtor.calcrush&pcampaignid=web_share" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary glow-primary btn-shimmer"
                  style={{
                    borderRadius: 16,
                    padding: '12px 28px',
                    fontWeight: 800,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: 22 }}>🤖</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 9, opacity: 0.8, fontWeight: 600, letterSpacing: '0.05em' }}>GET IT ON</div>
                    <div style={{ fontSize: 15, lineHeight: 1.1 }}>Google Play</div>
                  </div>
                </a>
                <button 
                  onClick={onPlayDemo}
                  className="btn btn-primary glow-primary btn-shimmer"
                  style={{
                    borderRadius: 16,
                    padding: '14px 28px',
                    fontWeight: 800,
                    fontSize: 14,
                    minHeight: 56,
                    background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary-dark))',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(168, 85, 247, 0.6)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(168, 85, 247, 0.4)';
                  }}
                >
                  Play Web Demo 🚀
                </button>
                <button 
                  onClick={() => setActiveTab('support')}
                  className="btn btn-secondary"
                  style={{
                    borderRadius: 16,
                    padding: '14px 28px',
                    fontWeight: 700,
                    fontSize: 14,
                    minHeight: 56,
                  }}
                >
                  Get Support Hub
                </button>
              </div>
            </div>

            {/* SCREENSHOTS CAROUSEL */}
            <section style={{ maxWidth: 960, margin: '60px auto 0', padding: '0 16px', width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-primary-light)', marginBottom: 8, display: 'inline-block' }}>
                  Screenshots
                </span>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                  App <span className="text-gradient">Gallery</span>
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
                  Use the arrows or keyboard Arrow keys to browse screenshots.
                </p>
              </div>

              <div 
                style={{ position: 'relative', width: '100%', userSelect: 'none' }}
                onMouseEnter={e => {
                  const elLeft = document.getElementById('carPrevBtn');
                  const elRight = document.getElementById('carNextBtn');
                  if (elLeft) elLeft.style.opacity = '1';
                  if (elRight) elRight.style.opacity = '1';
                }}
                onMouseLeave={e => {
                  const elLeft = document.getElementById('carPrevBtn');
                  const elRight = document.getElementById('carNextBtn');
                  if (elLeft) elLeft.style.opacity = isMobile ? '1' : '0.6';
                  if (elRight) elRight.style.opacity = isMobile ? '1' : '0.6';
                }}
              >
                {/* Prev Button */}
                <button
                  id="carPrevBtn"
                  onClick={() => setActiveScreenshot(prev => (prev === 0 ? screenshots.length - 1 : prev - 1))}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: isMobile ? 12 : 20,
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    width: isMobile ? 42 : 52,
                    height: isMobile ? 42 : 52,
                    borderRadius: '50%',
                    background: 'rgba(9, 9, 15, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: isMobile ? '1.5rem' : '1.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    opacity: isMobile ? '1' : '0.6',
                    outline: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(9, 9, 15, 0.8)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  &#8249;
                </button>

                {/* Carousel Viewport */}
                <div style={{
                  overflow: 'hidden',
                  borderRadius: 24,
                  width: '100%',
                  boxShadow: '0 20px 60px rgba(0,0,0,.5), 0 0 40px rgba(124,58,237,.12)',
                  border: '1px solid var(--color-border)',
                  background: '#09090f',
                  height: isMobile ? 320 : 540,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div 
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px 0',
                    }}
                  >
                    <img 
                      src={screenshots[activeScreenshot].src} 
                      alt={screenshots[activeScreenshot].title} 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>

                {/* Next Button */}
                <button
                  id="carNextBtn"
                  onClick={() => setActiveScreenshot(prev => (prev === screenshots.length - 1 ? 0 : prev + 1))}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: isMobile ? 12 : 20,
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    width: isMobile ? 42 : 52,
                    height: isMobile ? 42 : 52,
                    borderRadius: '50%',
                    background: 'rgba(9, 9, 15, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: isMobile ? '1.5rem' : '1.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    opacity: isMobile ? '1' : '0.6',
                    outline: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(9, 9, 15, 0.8)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  &#8250;
                </button>
              </div>

              {/* Dots and Counter */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                {screenshots.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveScreenshot(idx)}
                    style={{
                      width: activeScreenshot === idx ? 28 : 8,
                      height: 8,
                      borderRadius: activeScreenshot === idx ? 4 : '50%',
                      background: activeScreenshot === idx ? 'var(--color-primary-light)' : 'var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.25s',
                      boxShadow: activeScreenshot === idx ? '0 0 10px var(--color-primary-light)' : 'none',
                    }}
                  />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 12, fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.06em' }}>
                {activeScreenshot + 1} / {screenshots.length}
              </div>
            </section>

            {/* VIDEO WALKTHROUGH SECTION */}
            <section style={{ background: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', margin: '80px 0 0 0', padding: isMobile ? '60px 16px' : '80px 32px' }}>
              <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-primary-light)', marginBottom: 8, display: 'inline-block' }}>
                    Demo
                  </span>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                    See It In <span className="text-gradient">Action</span>
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
                    Watch a full gameplay walkthrough of CalcRush.
                  </p>
                </div>

                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%', // 16:9 Aspect Ratio
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 20px 60px rgba(0,0,0,.5), 0 0 40px rgba(124,58,237,.12)',
                  background: '#000',
                }}>
                  <iframe
                    src="https://www.youtube.com/embed/378Ug6ev5vs"
                    title="CalcRush App Demo"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </section>

            {/* APP STATS GRID */}
            <section style={{ maxWidth: 1100, margin: '80px auto 0', padding: '0 16px', width: '100%' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                gap: 20,
              }}>
                <div className="card stat-card-hover" style={{ padding: '24px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="text-gradient" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 900 }}>3</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Difficulty Levels
                  </div>
                </div>
                <div className="card stat-card-hover" style={{ padding: '24px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="text-gradient" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 900 }}>∞</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Math Questions
                  </div>
                </div>
                <div className="card stat-card-hover" style={{ padding: '24px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="text-gradient" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 900 }}>⏱</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Timed Rounds
                  </div>
                </div>
                <div className="card stat-card-hover" style={{ padding: '24px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="text-gradient" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 900 }}>📊</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Stats Tracking
                  </div>
                </div>
              </div>
            </section>

            {/* FEATURES GRID */}
            <section style={{ maxWidth: 1100, margin: '80px auto 0', padding: '0 16px', width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-primary-light)', marginBottom: 8, display: 'inline-block' }}>
                  Features
                </span>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? 24 : 32, fontWeight: 900, margin: 0 }}>
                  What Makes It <span className="text-gradient">Addictive</span>
                </h2>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
              }}>
                {features.map((f, i) => (
                  <div 
                    key={i} 
                    className="card feat-card-hover" 
                    style={{ 
                      padding: '28px 24px', 
                      display: 'flex', 
                      gap: 18, 
                    }}
                  >
                    <span style={{ fontSize: 32, flexShrink: 0 }}>{f.icon}</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{f.title}</h3>
                      <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* TECH STACK chips wrapper */}
            <section style={{ background: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', margin: '80px 0 0 0', padding: isMobile ? '60px 16px' : '80px 32px' }}>
              <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-primary-light)', marginBottom: 8, display: 'inline-block' }}>
                    Tech Stack
                  </span>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                    Built With
                  </h2>
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  justifyContent: 'center',
                }}>
                  {[
                    { icon: '⚛️', name: 'React' },
                    { icon: '🎨', name: 'CSS Modules' },
                    { icon: '⚡', name: 'Capacitor' },
                    { icon: '🤖', name: 'Android SDK' },
                    { icon: '📱', name: 'AdMob' },
                    { icon: '🔧', name: 'Gradle' },
                    { icon: '📦', name: 'Play Console' },
                  ].map((tech, idx) => (
                    <div
                      key={idx}
                      className="card"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 20px',
                        borderRadius: 50,
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: 'var(--color-surface)',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{tech.icon}</span>
                      <span>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* STATUS CTA */}
            <section style={{ padding: '85px 16px 20px', maxWidth: 760, margin: '0 auto', width: '100%' }}>
              <div className="card" style={{ padding: isMobile ? '32px 20px' : '48px 40px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-primary-light)', marginBottom: 12, display: 'inline-block' }}>
                  Download
                </span>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>
                  🚀 Available on Google Play
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>
                  CalcRush is now live for Android! Get it on Google Play to start your mental math training journey today.
                </p>
                <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.aldtor.calcrush&pcampaignid=web_share" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary glow-primary btn-shimmer"
                    style={{
                      borderRadius: 16,
                      padding: '12px 28px',
                      fontWeight: 800,
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ fontSize: 22 }}>🤖</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 9, opacity: 0.8, fontWeight: 600, letterSpacing: '0.05em' }}>GET IT ON</div>
                      <div style={{ fontSize: 15, lineHeight: 1.1 }}>Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= PRIVACY POLICY ================= */}
        {activeTab === 'privacy' && (
          <div className="anim-fade-in" style={{ padding: isMobile ? '32px 16px' : '50px 32px 80px', maxWidth: 1000, margin: '0 auto' }}>
            <div className="card" style={{ padding: isMobile ? '24px 20px' : '48px 48px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 6,
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))'
              }} />
              
              <div style={{ marginBottom: 32 }}>
                <span style={{
                  display: 'inline-block', background: 'rgba(139,92,246,0.1)', color: 'var(--color-primary-light)',
                  borderRadius: 50, padding: '4px 14px', fontSize: 11, fontWeight: 700, marginBottom: 16
                }}>
                  Effective Date: May 10, 2026
                </span>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 900, margin: '0 0 8px 0' }}>
                  Privacy Policy
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: 0 }}>
                  CalcRush – Maths Quiz &nbsp;|&nbsp; Developed by Aldtor &nbsp;|&nbsp; Last Updated: May 10, 2026
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', gap: 40 }}>
                {/* Sidebar Navigation (Desktop only) */}
                {!isMobile && (
                  <aside style={{ borderRight: '1px solid var(--color-border)', paddingRight: 20 }}>
                    <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginBottom: 16 }}>
                      Contents
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, fontWeight: 500 }}>
                      <li><a href="#collect" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>1. Information We Collect</a></li>
                      <li><a href="#admob" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>2. Google AdMob Ads</a></li>
                      <li><a href="#safety" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>3. Data Safety</a></li>
                      <li><a href="#children" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>4. Children's Privacy</a></li>
                      <li><a href="#thirdparty" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>5. Third-Party Services</a></li>
                      <li><a href="#permissions" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>6. Permissions Used</a></li>
                      <li><a href="#retention" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>7. Data Retention</a></li>
                      <li><a href="#security" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>8. Data Security</a></li>
                      <li><a href="#changes" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>9. Changes to Policy</a></li>
                      <li><a href="#contact" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>10. Contact Information</a></li>
                    </ul>
                  </aside>
                )}

                {/* Content */}
                <div style={{ lineHeight: 1.7, fontSize: 14.5 }}>
                  <p style={{ marginBottom: 20 }}>
                    Welcome to <strong>CalcRush – Maths Quiz</strong> ("App"), developed and operated by <strong>Aldtor</strong> ("we", "us", or "our"). This Privacy Policy explains how we handle information when you download and play our mobile game.
                  </p>
                  <p style={{ marginBottom: 20 }}>
                    By downloading or using CalcRush, you agree to the practices described in this policy. If you do not agree with this policy, please do not download or use the App.
                  </p>

                  <h2 id="collect" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>1. Information We Collect</h2>
                  <p style={{ marginBottom: 12 }}>
                    CalcRush is built from the ground up to protect user privacy. <strong>We do not collect, store, or share any personally identifiable information (PII)</strong> from our users. Specifically:
                  </p>
                  <ul style={{ paddingLeft: 20, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li>We do <strong>not</strong> require user accounts, profiles, or registrations.</li>
                    <li>We do <strong>not</strong> collect names, email addresses, phone numbers, or hardware addresses.</li>
                    <li>We do <strong>not</strong> request access to device contacts, camera, microphone, or storage files.</li>
                    <li>All scores, statistics, and game records are stored <strong>locally on your device</strong> using secure storage and never transmitted to our servers.</li>
                  </ul>

                  <h2 id="admob" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>2. Advertising (Google AdMob)</h2>
                  <p style={{ marginBottom: 12 }}>
                    CalcRush displays advertisements served by <strong>Google AdMob</strong>. Google AdMob may collect and process certain device identifiers to deliver relevant banner and interstitial ads, including:
                  </p>
                  <ul style={{ paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li>Device advertising identifiers (e.g., Google Advertising ID).</li>
                    <li>Approximate location data derived from IP addresses.</li>
                    <li>App interaction and engagement logs.</li>
                    <li>Device specifications such as model, language, and operating system.</li>
                  </ul>
                  <p style={{ marginBottom: 20 }}>
                    This data is collected directly by Google AdMob and is governed by Google's Privacy Policy. You can learn more or review Google's practices at <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>https://policies.google.com/privacy</a>. You can also opt out of personalized ads in your Android Settings (Settings → Google → Ads → Opt out).
                  </p>

                  <h2 id="safety" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>3. Data Safety</h2>
                  <p style={{ marginBottom: 20 }}>
                    Because the app operates completely offline (except for loading advertisements), all score values, level progress, streaks, and user preferences are recorded inside the device's sandboxed storage. No databases are synchronized to Aldtor servers.
                  </p>

                  <h2 id="children" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>4. Children's Privacy</h2>
                  <p style={{ marginBottom: 20 }}>
                    CalcRush is designed to be family-safe and appropriate for all age groups. We do not collect or request any personal details from children under 13. All ads requested by the application comply with Google Play family guidelines and COPPA regulations.
                  </p>

                  <h2 id="thirdparty" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>5. Third-Party Services</h2>
                  <p style={{ marginBottom: 20 }}>
                    Our application embeds Google AdMob libraries to support free app gameplay. We advise our users to check the respective privacy terms of Google AdMob to understand how they gather advertising metrics.
                  </p>

                  <h2 id="permissions" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>6. Permissions Used</h2>
                  <p style={{ marginBottom: 12 }}>
                    CalcRush uses the absolute minimum permissions:
                  </p>
                  <ul style={{ paddingLeft: 20, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li><strong>Internet access</strong> (android.permission.INTERNET): Necessary to fetch and show ads via AdMob.</li>
                    <li><strong>Network state</strong> (android.permission.ACCESS_NETWORK_STATE): Necessary to check if an active connection is present.</li>
                  </ul>

                  <h2 id="retention" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>7. Data Retention</h2>
                  <p style={{ marginBottom: 20 }}>
                    As Aldtor does not upload or retain user data, there is no retention schedule. Local device databases (like local scores) are removed when you uninstall the app or clear the application cache from system settings.
                  </p>

                  <h2 id="security" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>8. Data Security</h2>
                  <p style={{ marginBottom: 20 }}>
                    Since we store zero personal data on cloud servers, the risk of data leakage is minimized. However, we advise users to protect their mobile devices to prevent unauthorized physical access to local offline app statistics.
                  </p>

                  <h2 id="changes" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>9. Changes to This Policy</h2>
                  <p style={{ marginBottom: 20 }}>
                    We may update our Privacy Policy occasionally. Changes are active upon publishing, indicated by updating the "Last Updated" date at the top of the policy page. We recommend reviewing this document from time to time.
                  </p>

                  <h2 id="contact" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>10. Contact Information</h2>
                  <p style={{ marginBottom: 10 }}>
                    If you have questions regarding privacy while using CalcRush, you can contact the developer:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li><strong>Developer:</strong> Aldtor</li>
                    <li><strong>Email:</strong> <a href="mailto:aldtor.dev@gmail.com" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>aldtor.dev@gmail.com</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TERMS & CONDITIONS ================= */}
        {activeTab === 'terms' && (
          <div className="anim-fade-in" style={{ padding: isMobile ? '32px 16px' : '50px 32px 80px', maxWidth: 1000, margin: '0 auto' }}>
            <div className="card" style={{ padding: isMobile ? '24px 20px' : '48px 48px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 6,
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))'
              }} />
              
              <div style={{ marginBottom: 32 }}>
                <span style={{
                  display: 'inline-block', background: 'rgba(139,92,246,0.1)', color: 'var(--color-primary-light)',
                  borderRadius: 50, padding: '4px 14px', fontSize: 11, fontWeight: 700, marginBottom: 16
                }}>
                  Effective Date: May 10, 2026
                </span>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 900, margin: '0 0 8px 0' }}>
                  Terms & Conditions
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: 0 }}>
                  CalcRush – Maths Quiz &nbsp;|&nbsp; Developed by Aldtor &nbsp;|&nbsp; Last Updated: May 10, 2026
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', gap: 40 }}>
                {/* Sidebar Navigation (Desktop only) */}
                {!isMobile && (
                  <aside style={{ borderRight: '1px solid var(--color-border)', paddingRight: 20 }}>
                    <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginBottom: 16 }}>
                      Contents
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, fontWeight: 500 }}>
                      <li><a href="#agreement" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>1. Agreement to Terms</a></li>
                      <li><a href="#intellectual" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>2. Intellectual Property</a></li>
                      <li><a href="#license" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>3. User License</a></li>
                      <li><a href="#prohibited" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>4. Prohibited Behaviors</a></li>
                      <li><a href="#disclaimers" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>5. Disclaimers</a></li>
                      <li><a href="#liability" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>6. Limitation of Liability</a></li>
                      <li><a href="#termination" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>7. Termination</a></li>
                      <li><a href="#governing" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>8. Governing Law</a></li>
                      <li><a href="#changesterms" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>9. Changes to Terms</a></li>
                      <li><a href="#supportinfo" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>10. Contact Us</a></li>
                    </ul>
                  </aside>
                )}

                {/* Content */}
                <div style={{ lineHeight: 1.7, fontSize: 14.5 }}>
                  <p style={{ marginBottom: 20 }}>
                    Welcome to <strong>CalcRush – Maths Quiz</strong> ("App"). These Terms & Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and <strong>Aldtor</strong> ("we", "us", or "our"), concerning your access to and use of CalcRush on mobile platforms.
                  </p>
                  <p style={{ marginBottom: 20 }}>
                    By downloading, installing, or playing the App, you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions. If you do not agree, you must immediately uninstall and discontinue using the App.
                  </p>

                  <h2 id="agreement" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>1. Agreement to Terms</h2>
                  <p style={{ marginBottom: 20 }}>
                    You represent that you are at least of legal age in your jurisdiction, or have received permission from parents or guardians to play this educational app. These terms govern the entirety of CalcRush services, features, and visual designs.
                  </p>

                  <h2 id="intellectual" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>2. Intellectual Property Rights</h2>
                  <p style={{ marginBottom: 20 }}>
                    Unless otherwise indicated, the App, including source code, database tables, visual layouts, sound assets, vector icons, graphics, and logos are owned and controlled by Aldtor, and protected under intellectual property and copyright laws. You may not copy, republish, upload, or sell any assets from CalcRush without written consent.
                  </p>

                  <h2 id="license" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>3. User License</h2>
                  <p style={{ marginBottom: 20 }}>
                    We grant you a limited, non-exclusive, non-transferable, revocable license to download and run CalcRush solely for personal, non-commercial educational purposes on mobile devices owned or controlled by you.
                  </p>

                  <h2 id="prohibited" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>4. Prohibited Behaviors</h2>
                  <p style={{ marginBottom: 12 }}>
                    As a user of the App, you agree not to:
                  </p>
                  <ul style={{ paddingLeft: 20, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li>Systematically extract data or content to recreate a competing app.</li>
                    <li>Decompile, reverse-engineer, disassemble, or bypass security features.</li>
                    <li>Use automated scripts, bots, or modifications to manipulate local high score records.</li>
                    <li>Utilize the App in any manner that conflicts with local or international legislation.</li>
                  </ul>

                  <h2 id="disclaimers" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>5. Disclaimers</h2>
                  <p style={{ marginBottom: 20 }}>
                    The App is provided on an "as-is" and "as-available" basis. You agree that your use of the App will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including, without limitation, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                  </p>

                  <h2 id="liability" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>6. Limitation of Liability</h2>
                  <p style={{ marginBottom: 20 }}>
                    In no event will Aldtor be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit or lost data arising from your use of the App, even if we have been advised of the possibility of such damages.
                  </p>

                  <h2 id="termination" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>7. Termination</h2>
                  <p style={{ marginBottom: 20 }}>
                    These Terms remain in effect until terminated by either you or us. You may terminate these Terms at any time by uninstalling the App. We reserve the right to suspend or terminate services at any time without notice if you violate any clauses.
                  </p>

                  <h2 id="governing" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>8. Governing Law</h2>
                  <p style={{ marginBottom: 20 }}>
                    These terms and your use of CalcRush are governed by and construed in accordance with the laws of the developer's jurisdiction, without regard to conflict of law principles.
                  </p>

                  <h2 id="changesterms" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>9. Changes to Terms</h2>
                  <p style={{ marginBottom: 20 }}>
                    We reserve the right to edit these Terms & Conditions at our discretion. We will indicate modifications by updating the "Last Updated" timestamp. Using the App after changes are posted means you accept the revised Terms.
                  </p>

                  <h2 id="supportinfo" style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary-light)', margin: '24px 0 10px 0' }}>10. Contact Us</h2>
                  <p style={{ marginBottom: 10 }}>
                    If you have questions regarding these terms, please contact:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li><strong>Developer:</strong> Aldtor</li>
                    <li><strong>Email:</strong> <a href="mailto:aldtor.dev@gmail.com" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>aldtor.dev@gmail.com</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SUPPORT HUB ================= */}
        {activeTab === 'support' && (
          <div className="anim-fade-in" style={{ padding: isMobile ? '32px 16px' : '50px 32px 80px', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 900, margin: 0 }}>
                Support Hub
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 8 }}>
                Get help, browse common questions, or send a direct message to the developer.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: 32, alignItems: 'start' }}>
              {/* Left Side: Accordion FAQs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, margin: '0 0 8px 0' }}>
                  Frequently Asked Questions
                </h2>
                
                {faqs.map((f, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className="card"
                      style={{ 
                        overflow: 'hidden', 
                        borderColor: isOpen ? 'var(--color-primary)' : 'var(--color-border)',
                        transition: 'border-color 0.25s ease' 
                      }}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        style={{
                          width: '100%', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          background: 'none', border: 'none', outline: 'none', cursor: 'pointer',
                          textAlign: 'left', color: 'var(--color-text)', fontWeight: 700, fontSize: 14.5
                        }}
                      >
                        <span>{f.q}</span>
                        <span style={{ 
                          fontSize: 12, color: 'var(--color-primary-light)', 
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s ease'
                        }}>
                          ▼
                        </span>
                      </button>
                      
                      <div style={{
                        maxHeight: isOpen ? 200 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.25s ease-out',
                        background: 'rgba(255,255,255,0.01)',
                      }}>
                        <div style={{ padding: '0 20px 20px 20px', fontSize: 13.5, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                          {f.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Side: Interactive Support Form */}
              <div className="card" style={{ padding: '28px 24px', position: 'relative' }}>
                {formStatus.submitted ? (
                  /* Success Feedback Panel */
                  <div className="anim-scale-in" style={{ textAlign: 'center', padding: '24px 8px' }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.12)',
                      border: '2px solid var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 32, margin: '0 auto 20px', color: 'var(--color-success)',
                      animation: 'bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                      ✓
                    </div>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, margin: '0 0 10px 0' }}>
                      Message Sent!
                    </h3>
                    <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                      Thank you for contacting us. Your ticket has been simulated successfully. The developer will review your request shortly.
                    </p>
                    <button
                      onClick={() => setFormStatus({ submitted: false, loading: false, error: '' })}
                      className="btn btn-secondary btn-sm"
                      style={{ margin: '0 auto' }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  /* Contact Form */
                  <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, margin: 0 }}>
                      Send Message
                    </h2>
                    
                    {formStatus.error && (
                      <div className="feedback-wrong" style={{ fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span>⚠️</span>
                        <span>{formStatus.error}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        style={{
                          width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                          borderRadius: 12, padding: '12px 16px', color: 'var(--color-text)', outline: 'none',
                          fontSize: 14, fontFamily: 'inherit', transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@domain.com"
                        style={{
                          width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                          borderRadius: 12, padding: '12px 16px', color: 'var(--color-text)', outline: 'none',
                          fontSize: 14, fontFamily: 'inherit', transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Subject</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Bug report, feedback, inquiry"
                        style={{
                          width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                          borderRadius: 12, padding: '12px 16px', color: 'var(--color-text)', outline: 'none',
                          fontSize: 14, fontFamily: 'inherit', transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>Message *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we help you?"
                        style={{
                          width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                          borderRadius: 12, padding: '12px 16px', color: 'var(--color-text)', outline: 'none',
                          fontSize: 14, fontFamily: 'inherit', resize: 'vertical', transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus.loading}
                      className="btn btn-primary"
                      style={{
                        width: '100%', borderRadius: 12, padding: 14, marginTop: 8, fontSize: 14,
                        opacity: formStatus.loading ? 0.7 : 1, cursor: formStatus.loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {formStatus.loading ? 'Sending Message…' : 'Submit Query'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--color-border)',
        padding: '32px 24px',
        textAlign: 'center',
        background: theme === 'dark' ? 'rgba(9, 9, 15, 0.4)' : 'rgba(243, 244, 246, 0.6)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
            &copy; 2026 Aldtor. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={() => setActiveTab('home')} 
              style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', color: 'var(--color-primary-light)', fontSize: 12 }}
            >
              Home
            </button>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
            <button 
              onClick={() => setActiveTab('privacy')} 
              style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', color: 'var(--color-primary-light)', fontSize: 12 }}
            >
              Privacy Policy
            </button>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
            <button 
              onClick={() => setActiveTab('terms')} 
              style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', color: 'var(--color-primary-light)', fontSize: 12 }}
            >
              Terms of Service
            </button>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
            <button 
              onClick={() => setActiveTab('support')} 
              style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', color: 'var(--color-primary-light)', fontSize: 12 }}
            >
              Support Center
            </button>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
            <a 
              href="/app-ads.txt" 
              style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}
            >
              app-ads.txt
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
