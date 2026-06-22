// Question Generator Utility

// ─── Number ranges per difficulty ────────────────────────────────────────────
const RANGES = {
  easy:   { min: 2,  max: 15  },  // small numbers, manageable
  medium: { min: 15, max: 60  },  // no trivially easy combos
  hard:   { min: 40, max: 120 },  // challenging
};

const MULT_RANGES = {
  easy:   { min: 2,  max: 10 },
  medium: { min: 5,  max: 20 },
  hard:   { min: 8,  max: 30 },
};

// ─── Anti-repeat pool ─────────────────────────────────────────────────────────
const HISTORY_SIZE = 6;
const recentQuestions = [];

function isDuplicate(questionStr) {
  return recentQuestions.includes(questionStr);
}

function recordQuestion(questionStr) {
  recentQuestions.push(questionStr);
  if (recentQuestions.length > HISTORY_SIZE) {
    recentQuestions.shift();
  }
}

export function resetQuestionHistory() {
  recentQuestions.length = 0;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randInRange(difficulty) {
  const r = RANGES[difficulty];
  return randInt(r.min, r.max);
}

function getOperation(mode) {
  if (mode === 'mixed') {
    const ops = ['+', '-', '×', '÷'];
    return ops[Math.floor(Math.random() * ops.length)];
  }
  const map = { addition: '+', subtraction: '-', multiplication: '×', division: '÷' };
  return map[mode] || '+';
}

// ─── Individual question builders ────────────────────────────────────────────
function buildAddition(difficulty) {
  const num1 = randInRange(difficulty);
  const num2 = randInRange(difficulty);
  return { question: `${num1} + ${num2}`, answer: num1 + num2, op: '+' };
}

function buildSubtraction(difficulty) {
  let num1 = randInRange(difficulty);
  let num2 = randInRange(difficulty);
  if (num2 > num1) [num1, num2] = [num2, num1];
  if (num1 - num2 < 3) num1 = num2 + randInt(3, 10);
  return { question: `${num1} − ${num2}`, answer: num1 - num2, op: '-' };
}

function buildMultiplication(difficulty) {
  const mr = MULT_RANGES[difficulty];
  const num1 = randInt(mr.min, mr.max);
  const num2 = randInt(mr.min, mr.max);
  return { question: `${num1} × ${num2}`, answer: num1 * num2, op: '×' };
}

function buildDivision(difficulty) {
  // Refined ranges: quotients (answers) are: Easy (2-10), Medium (5-20), Hard (10-50)
  // Divisors are: Easy (2-6), Medium (3-12), Hard (4-20)
  // This keeps numbers manageable for mental calculation while retaining appropriate difficulty.
  const divisorMin = 2;
  const divisorMax = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 12 : 20;
  const answerMin = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10;
  const answerMax = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 50;

  const divisor = randInt(divisorMin, divisorMax);
  const quotient = randInt(answerMin, answerMax);
  const dividend = quotient * divisor;

  return { question: `${dividend} ÷ ${divisor}`, answer: quotient, op: '÷' };
}

// ─── Advanced Question Builders ──────────────────────────────────────────────

function buildBodmas(difficulty) {
  if (difficulty === 'easy') {
    // a + b - c or a - b + c
    const a = randInt(5, 15);
    const b = randInt(2, 10);
    const c = randInt(2, a + b - 2);
    if (randInt(0, 1) === 0) {
      return { question: `${a} + ${b} − ${c}`, answer: a + b - c, op: 'mixed' };
    } else {
      let first = a;
      let second = c;
      if (first < second) [first, second] = [second, first];
      return { question: `${first} − ${second} + ${b}`, answer: first - second + b, op: 'mixed' };
    }
  } else if (difficulty === 'medium') {
    // a * b + c or a + b * c or a * b - c
    const a = randInt(2, 8);
    const b = randInt(2, 6);
    const c = randInt(2, 15);
    const type = randInt(0, 2);
    if (type === 0) {
      return { question: `${a} × ${b} + ${c}`, answer: a * b + c, op: 'mixed' };
    } else if (type === 1) {
      return { question: `${c} + ${a} × ${b}`, answer: c + a * b, op: 'mixed' };
    } else {
      const product = a * b;
      const sub = randInt(2, Math.max(3, product - 2));
      return { question: `${a} × ${b} − ${sub}`, answer: product - sub, op: 'mixed' };
    }
  } else {
    // hard: (a + b) * c or a * b - c * d or a * b + c / d
    const type = randInt(0, 2);
    if (type === 0) {
      const a = randInt(2, 8);
      const b = randInt(2, 8);
      const c = randInt(3, 6);
      return { question: `(${a} + ${b}) × ${c}`, answer: (a + b) * c, op: 'mixed' };
    } else if (type === 1) {
      const a = randInt(3, 8);
      const b = randInt(3, 8);
      const c = randInt(2, 5);
      const d = randInt(2, 5);
      let p1 = a * b;
      let p2 = c * d;
      if (p2 > p1) {
        return { question: `${c} × ${d} − ${a} × ${b}`, answer: p2 - p1, op: 'mixed' };
      }
      return { question: `${a} × ${b} − ${c} × ${d}`, answer: p1 - p2, op: 'mixed' };
    } else {
      const d = randInt(2, 6);
      const quotient = randInt(2, 8);
      const c = d * quotient;
      const a = randInt(3, 8);
      const b = randInt(3, 8);
      return { question: `${a} × ${b} + ${c} ÷ ${d}`, answer: a * b + quotient, op: 'mixed' };
    }
  }
}

function buildAlgebra(difficulty, mode) {
  let base;
  let op = mode;
  if (mode === 'mixed') {
    const ops = ['addition', 'subtraction', 'multiplication', 'division'];
    op = ops[randInt(0, 3)];
  }

  switch (op) {
    case 'addition':       base = buildAddition(difficulty); break;
    case 'subtraction':    base = buildSubtraction(difficulty); break;
    case 'multiplication': base = buildMultiplication(difficulty); break;
    case 'division':       base = buildDivision(difficulty); break;
    default:               base = buildAddition(difficulty);
  }

  const parts = base.question.split(' ');
  if (parts.length !== 3) return base;

  const valA = parseInt(parts[0], 10);
  const valB = parseInt(parts[2], 10);
  const opSymbol = parts[1];
  const ans = base.answer;

  if (randInt(0, 1) === 0) {
    return { question: `? ${opSymbol} ${valB} = ${ans}`, answer: valA, op: base.op };
  } else {
    return { question: `${valA} ${opSymbol} ? = ${ans}`, answer: valB, op: base.op };
  }
}

function buildSquareRoot(difficulty) {
  if (difficulty === 'easy') {
    const n = randInt(2, 10);
    return { question: `${n}²`, answer: n * n, op: 'mixed' };
  } else if (difficulty === 'medium') {
    if (randInt(0, 1) === 0) {
      const n = randInt(2, 12);
      return { question: `√${n * n}`, answer: n, op: 'mixed' };
    } else {
      const n = randInt(8, 15);
      return { question: `${n}²`, answer: n * n, op: 'mixed' };
    }
  } else {
    if (randInt(0, 1) === 0) {
      const n = randInt(6, 20);
      return { question: `√${n * n}`, answer: n, op: 'mixed' };
    } else {
      const n = randInt(12, 25);
      return { question: `${n}²`, answer: n * n, op: 'mixed' };
    }
  }
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export function generateQuestion(difficulty, mode, advancedMath = false) {
  let result;
  let attempts = 0;

  do {
    if (advancedMath) {
      // 50% chance to generate advanced question types
      if (randInt(0, 1) === 0) {
        result = buildAlgebra(difficulty, mode);
      } else {
        if (mode === 'mixed') {
          result = randInt(0, 1) === 0 ? buildBodmas(difficulty) : buildSquareRoot(difficulty);
        } else {
          result = buildAlgebra(difficulty, mode);
        }
      }
    } else {
      const op = getOperation(mode);
      switch (op) {
        case '+':  result = buildAddition(difficulty);       break;
        case '-':  result = buildSubtraction(difficulty);    break;
        case '×':  result = buildMultiplication(difficulty); break;
        case '÷':  result = buildDivision(difficulty);       break;
        default:   result = buildAddition(difficulty);
      }
    }
    attempts++;
  } while (isDuplicate(result?.question) && attempts < 8);

  recordQuestion(result?.question || '');
  return result;
}

// ─── App Constants ────────────────────────────────────────────────────────────
export const MODES = [
  { id: 'basic',      label: 'Basic Practice', icon: '📚', desc: 'Unlimited questions, no timer' },
  { id: 'speed',      label: 'Speed Challenge', icon: '⚡', desc: 'Answer under time limit' },
  { id: 'accuracy',   label: 'Accuracy Focus',  icon: '🎯', desc: 'Complete a fixed set of questions' },
];

export const OPERATIONS = [
  { id: 'addition',       label: 'Addition',       symbol: '+', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' },
  { id: 'subtraction',    label: 'Subtraction',    symbol: '−', color: '#2563eb', bg: 'rgba(37,99,235,0.15)'  },
  { id: 'multiplication', label: 'Multiply',       symbol: '×', color: '#059669', bg: 'rgba(5,150,105,0.15)'  },
  { id: 'division',       label: 'Division',       symbol: '÷', color: '#d97706', bg: 'rgba(217,119,6,0.15)'  },
  { id: 'mixed',          label: 'Mixed',          symbol: '∞', color: '#db2777', bg: 'rgba(219,39,119,0.15)' },
];

export const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',   desc: '2–15',   color: '#10b981' },
  { id: 'medium', label: 'Medium', desc: '15–60',  color: '#f59e0b' },
  { id: 'hard',   label: 'Hard',   desc: '40–120', color: '#ef4444' },
];

export function getModeConfig(modeId) {
  if (modeId === 'basic')       return { type: 'basic',    timer: null, questions: null };
  if (modeId === 'speed')       return { type: 'speed',    timer: 30,   questions: null };
  if (modeId === 'accuracy')    return { type: 'accuracy', timer: null, questions: 10   };
  return { type: 'basic', timer: null, questions: null };
}
