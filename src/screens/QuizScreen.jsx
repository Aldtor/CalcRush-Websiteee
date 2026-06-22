import { useState, useEffect, useRef, useCallback } from 'react';
import { generateQuestion, getModeConfig, OPERATIONS, DIFFICULTIES, resetQuestionHistory } from '../utils/mathUtils';
import { playCorrect, playWrong, playTick, playTimeUp } from '../utils/sounds';

/* ─── Confetti Burst ─────────────────────────────────── */
const CONFETTI_COLORS = ['#a855f7','#7c3aed','#f59e0b','#10b981','#ec4899','#60a5fa','#ffffff','#fde68a'];

function ConfettiBurst({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 48 }, (_, i) => {
    const angle = (i / 48) * 360;
    const dist  = 80 + Math.random() * 120;
    const dx    = Math.cos((angle * Math.PI) / 180) * dist;
    const dy    = Math.sin((angle * Math.PI) / 180) * dist;
    const size  = 6 + Math.random() * 8;
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const shape = i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '0';
    const rot   = Math.random() * 720;
    return { dx, dy, size, color, shape, rot, delay: Math.random() * 0.1 };
  });

  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      pointerEvents: 'none', zIndex: 999,
    }}>
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: p.size, height: p.size,
          borderRadius: p.shape,
          background: p.color,
          left: 0, top: 0,
          transform: 'translate(-50%,-50%)',
          animation: `confetti-fly 0.7s cubic-bezier(0.2,0.8,0.4,1) ${p.delay}s forwards`,
          '--dx': `${p.dx}px`,
          '--dy': `${p.dy}px`,
          '--rot': `${p.rot}deg`,
          opacity: 1,
        }} />
      ))}
    </div>
  );
}

/* ─── Timer Ring ─────────────────────────────────────── */
function TimerRing({ seconds, total, urgent }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const progress = total > 0 ? seconds / total : 0;
  const offset = circ * (1 - progress);
  const stroke = urgent ? '#ef4444' : seconds <= total * 0.3 ? '#f59e0b' : '#7c3aed';

  return (
    <div className="timer-ring" style={{ width: 110, height: 110 }}>
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle className="timer-circle-bg" cx="55" cy="55" r={r} strokeWidth="8" />
        <circle
          className="timer-circle-fill"
          cx="55" cy="55" r={r} strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ stroke, transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: "'Outfit',sans-serif",
          fontSize: 28, fontWeight: 900,
          color: stroke,
          animation: urgent ? 'timer-pulse 0.5s ease infinite' : 'none',
          lineHeight: 1,
        }}>
          {seconds}
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>SEC</div>
      </div>
    </div>
  );
}

/* ─── Main Quiz Screen ───────────────────────────────── */
export default function QuizScreen({ config, onFinish, onQuit }) {
  const { mode, operation, difficulty } = config;
  const modeConfig = getModeConfig(mode);

  // Retrieve dynamic or preset question counts and time limits
  const isSpeed    = mode === 'speed' || (modeConfig && modeConfig.type === 'speed');
  const isAccuracy = mode === 'accuracy' || (modeConfig && modeConfig.type === 'accuracy');
  const totalQuestions = config.questions || (modeConfig ? modeConfig.questions : 10);
  const timerTotal     = config.timer || (modeConfig ? modeConfig.timer : 30);

  const [question,     setQuestion]     = useState(null);
  const [input,        setInput]        = useState('');
  const [feedback,     setFeedback]     = useState(null);
  const [correctAnswer,setCorrectAnswer]= useState(null);
  const [score,        setScore]        = useState(0);
  const [correct,      setCorrect]      = useState(0);
  const [total,        setTotal]        = useState(0);
  const [streak,       setStreak]       = useState(0);
  const [bestStreak,   setBestStreak]   = useState(0);
  const [timeLeft,     setTimeLeft]     = useState(timerTotal || 0);
  const [gameOver,     setGameOver]     = useState(false);
  const [questionAnim, setQuestionAnim] = useState('anim-slide-right');
  const [shakeInput,   setShakeInput]   = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mistakes,     setMistakes]     = useState([]);

  const timerRef      = useRef(null);
  const feedbackRef   = useRef(null);
  const questionNum   = useRef(0);

  const opInfo   = OPERATIONS.find(o => o.id === operation) || OPERATIONS[0];
  const diffInfo = DIFFICULTIES.find(d => d.id === difficulty) || DIFFICULTIES[0];

  function triggerVibrate() {
    try {
      if (navigator && navigator.vibrate) {
        navigator.vibrate(12);
      }
    } catch (_) {}
  }

  const loadNext = useCallback(() => {
    setQuestionAnim('');
    setTimeout(() => {
      setQuestion(generateQuestion(difficulty, operation, config.advancedMath));
      setInput('');
      setFeedback(null);
      setCorrectAnswer(null);
      setShakeInput(false);
      setShowConfetti(false);
      setQuestionAnim('anim-slide-right');
      questionNum.current += 1;
    }, 20);
  }, [difficulty, operation, config.advancedMath]);

  useEffect(() => { resetQuestionHistory(); loadNext(); }, []);

  // Timer
  useEffect(() => {
    if (!isSpeed) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          playTimeUp();
          setGameOver(true);
          return 0;
        }
        if (t <= 6) playTick();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isSpeed]);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        onFinish({ correct, total, score, streak: bestStreak, mode, operation, difficulty, mistakes });
      }, 300);
    }
  }, [gameOver]);

  function handleSubmit() {
    if (!question || feedback !== null) return;
    triggerVibrate();
    if (input.trim() === '') {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      return;
    }
    const userAnswer = parseInt(input.trim(), 10);
    if (isNaN(userAnswer)) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      return;
    }

    const isCorrect  = userAnswer === question.answer;
    const newTotal   = total + 1;
    const newCorrect = isCorrect ? correct + 1 : correct;

    setTotal(newTotal);
    setCorrect(newCorrect);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setCorrectAnswer(question.answer);

    if (isCorrect) {
      const newStreak = streak + 1;
      const newScore  = score + 1 + Math.floor(newStreak / 3);
      setStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
      setScore(newScore);
      playCorrect();
      setShowConfetti(true);
    } else {
      setStreak(0);
      playWrong();
      setMistakes(prev => [
        ...prev,
        {
          question: question.question,
          correctAnswer: question.answer,
          userAnswer: userAnswer,
        }
      ]);
    }

    if (isAccuracy && newTotal >= totalQuestions) {
      feedbackRef.current = setTimeout(() => {
        onFinish({ correct: newCorrect, total: newTotal, score: newCorrect, streak: bestStreak, mode, operation, difficulty, mistakes });
      }, 1000);
      return;
    }

    feedbackRef.current = setTimeout(() => {
      loadNext();
    }, isCorrect ? 900 : 1200);
  }

  function handleNumKey(val) {
    if (feedback !== null) return;
    triggerVibrate();
    if (val === '⌫') {
      setInput(p => p.slice(0, -1));
    } else if (val === '±') {
      setInput(p => p.startsWith('-') ? p.slice(1) : p ? '-' + p : p);
    } else {
      setInput(p => (p + val).slice(0, 5)); // max 5 digits
    }
  }

  const progressPct = isAccuracy ? (total / totalQuestions) * 100 : 0;
  const urgent      = isSpeed && timeLeft <= 5;

  if (!question) return null;

  const inputBg = feedback === 'correct'
    ? 'rgba(16,185,129,0.12)'
    : feedback === 'wrong'
      ? 'rgba(239,68,68,0.12)'
      : 'rgba(255,255,255,0.06)';

  const inputBorder = feedback === 'correct'
    ? '#10b981'
    : feedback === 'wrong'
      ? '#ef4444'
      : 'rgba(124,58,237,0.4)';

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'scroll', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', paddingTop: 'env(safe-area-inset-top, 0px)' }}>

      {/* Confetti */}
      <ConfettiBurst active={showConfetti} />

      {/* Top Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 20px 10px',
        flexShrink: 0,
      }}>
        <button
          onClick={onQuit}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, cursor: 'pointer', color: 'var(--color-text)',
            flexShrink: 0,
          }}
        >←</button>

        <div style={{ flex: 1 }}>
          {isAccuracy && (
            <>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6,
              }}>
                <span style={{ fontWeight: 600 }}>{total} / {totalQuestions}</span>
                <span style={{ color: opInfo.color, fontWeight: 700 }}>{opInfo.label}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </>
          )}
          {isSpeed && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                Questions: <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>{total}</span>
              </div>
              <div style={{ fontSize: 13, color: opInfo.color, fontWeight: 700 }}>{opInfo.label}</div>
            </div>
          )}
          {!isSpeed && !isAccuracy && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Q#{total + 1}</div>
              <div style={{ fontSize: 13, color: opInfo.color, fontWeight: 700 }}>{opInfo.label}</div>
            </div>
          )}
        </div>

        {streak >= 3 && (
          <div className="streak-badge anim-bounce-in" style={{ flexShrink: 0 }}>
            🔥 {streak}
          </div>
        )}
        <div style={{
          padding: '4px 10px', borderRadius: 20,
          background: `${diffInfo.color}20`,
          color: diffInfo.color, fontSize: 12, fontWeight: 700,
          flexShrink: 0,
        }}>
          {diffInfo.label}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '4px 20px 12px', gap: 12,
      }}>

        {/* Score + Timer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div className="card" style={{ flex: 1, padding: '12px 16px', marginRight: isSpeed ? 16 : 0 }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Score</div>
            <div style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: 32, fontWeight: 900,
              color: 'var(--color-primary-light)',
              lineHeight: 1.1,
            }}>{score}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
              ✅ {correct} / {total}
            </div>
          </div>
          {isSpeed && <TimerRing seconds={timeLeft} total={timerTotal} urgent={urgent} />}
        </div>

        {/* Question Card */}
        <div
          className={`card glow-primary ${questionAnim}`}
          style={{
            padding: '28px 24px',
            textAlign: 'center',
            flexShrink: 0,
            minHeight: 120,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(124,58,237,0.08)',
            border: '1.5px solid rgba(124,58,237,0.25)',
          }}
        >
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: opInfo.color,
            marginBottom: 10,
          }}>
            {question.op === 'mixed' ? '∞' : (question.op || opInfo.symbol)} What is?
          </div>
          <div style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 48, fontWeight: 900,
            color: 'var(--color-text)',
            lineHeight: 1.1, letterSpacing: '-1px',
            wordBreak: 'break-word',
          }}>
            {question.question}
          </div>
          <div style={{ marginTop: 6, fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>= ?</div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className={`${feedback === 'correct' ? 'feedback-correct' : 'feedback-wrong'} anim-scale-in`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{feedback === 'correct' ? '🎉' : '❌'}</span>
              <div>
                <div style={{
                  fontWeight: 700, fontSize: 15,
                  color: feedback === 'correct' ? 'var(--color-success)' : 'var(--color-danger)',
                }}>
                  {feedback === 'correct' ? 'Correct!' : 'Wrong!'}
                </div>
                {feedback === 'wrong' && (
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    Answer: <strong style={{ color: 'var(--color-text)' }}>{correctAnswer}</strong>
                  </div>
                )}
              </div>
            </div>
            {feedback === 'correct' && streak >= 2 && (
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>🔥 x{streak}</div>
            )}
          </div>
        )}

        {/* Answer Display Box (read-only, no keyboard) */}
        {/* Pushes elements below it down via marginTop: 'auto' */}
        <div style={{
          flexShrink: 0,
          marginTop: 'auto', 
          background: inputBg,
          border: `2px solid ${inputBorder}`,
          borderRadius: 16,
          padding: '14px 20px',
          textAlign: 'center',
          fontFamily: "'Outfit', sans-serif",
          fontSize: 36,
          fontWeight: 900,
          color: feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : 'var(--color-text)',
          letterSpacing: '2px',
          minHeight: 66,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.2s, background 0.2s',
          boxShadow: feedback === 'correct'
            ? '0 0 20px rgba(16,185,129,0.2)'
            : feedback === 'wrong'
              ? '0 0 20px rgba(239,68,68,0.2)'
              : `0 0 0 0 transparent`,
          animation: shakeInput ? 'anim-shake 0.4s ease' : 'none',
        }}>
          {input || <span style={{ opacity: 0.2, fontSize: 28 }}>?</span>}
        </div>

        {/* Premium Numpad */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
          flexShrink: 0,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}>
          {[
            '7','8','9','⌫',
            '4','5','6','±',
            '1','2','3','',
            '','0','','✓',
          ].map((k, i) => {
            if (k === '') return <div key={i} />;

            const isSubmit  = k === '✓';
            const isBack    = k === '⌫';
            const isSign    = k === '±';
            const isDisabled = feedback !== null;

            let bg, color, fontSize, fontWeight, borderColor, shadow;

            if (isSubmit) {
              bg = isDisabled
                ? 'rgba(124,58,237,0.3)'
                : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
              color = '#fff';
              fontSize = 24;
              fontWeight = 800;
              borderColor = 'rgba(168,85,247,0.5)';
              shadow = isDisabled ? 'none' : '0 4px 20px rgba(124,58,237,0.4)';
            } else if (isBack) {
              bg = 'rgba(239,68,68,0.12)';
              color = '#ef4444';
              fontSize = 20;
              fontWeight = 700;
              borderColor = 'rgba(239,68,68,0.25)';
              shadow = 'none';
            } else if (isSign) {
              bg = 'rgba(245,158,11,0.12)';
              color = '#f59e0b';
              fontSize = 18;
              fontWeight = 700;
              borderColor = 'rgba(245,158,11,0.25)';
              shadow = 'none';
            } else {
              bg = 'rgba(255,255,255,0.06)';
              color = 'var(--color-text)';
              fontSize = 22;
              fontWeight = 700;
              borderColor = 'rgba(255,255,255,0.08)';
              shadow = 'none';
            }

            return (
              <button
                key={i}
                onClick={() => isSubmit ? handleSubmit() : handleNumKey(k)}
                disabled={isDisabled}
                style={{
                  background: bg,
                  color,
                  fontSize,
                  fontWeight,
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: 14,
                  height: 56,
                  cursor: isDisabled ? 'default' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                  boxShadow: shadow,
                  transition: 'transform 0.08s ease, opacity 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  outline: 'none',
                  backdropFilter: 'blur(8px)',
                }}
                onPointerDown={e => {
                  if (!isDisabled) e.currentTarget.style.transform = 'scale(0.92)';
                }}
                onPointerUp={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onPointerLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {k}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
