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

function getStreakMultiplier(streak) {
  return 1 + Math.min(0.8, (streak || 0) * 0.05);
}

function randInRange(difficulty, streak = 0) {
  const r = RANGES[difficulty];
  const mult = getStreakMultiplier(streak);
  const adjustedMax = Math.round(r.max * mult);
  return randInt(r.min, adjustedMax);
}

function randMultInRange(difficulty, streak = 0) {
  const mr = MULT_RANGES[difficulty];
  const mult = getStreakMultiplier(streak);
  const adjustedMax = Math.round(mr.max * mult);
  return randInt(mr.min, adjustedMax);
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
function buildAddition(difficulty, streak = 0) {
  const num1 = randInRange(difficulty, streak);
  const num2 = randInRange(difficulty, streak);
  return { question: `${num1} + ${num2}`, answer: num1 + num2, op: '+' };
}

function buildSubtraction(difficulty, streak = 0) {
  let num1 = randInRange(difficulty, streak);
  let num2 = randInRange(difficulty, streak);
  if (num2 > num1) [num1, num2] = [num2, num1];
  if (num1 - num2 < 3) num1 = num2 + randInt(3, 10);
  return { question: `${num1} − ${num2}`, answer: num1 - num2, op: '-' };
}

function buildMultiplication(difficulty, streak = 0) {
  const num1 = randMultInRange(difficulty, streak);
  const num2 = randMultInRange(difficulty, streak);
  return { question: `${num1} × ${num2}`, answer: num1 * num2, op: '×' };
}

function buildDivision(difficulty, streak = 0) {
  const mult = getStreakMultiplier(streak);
  const divisorMin = 2;
  const divisorMax = Math.round((difficulty === 'easy' ? 6 : difficulty === 'medium' ? 12 : 20) * mult);
  const answerMin = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 10;
  const answerMax = Math.round((difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 50) * mult);

  const divisor = randInt(divisorMin, divisorMax);
  const quotient = randInt(answerMin, answerMax);
  const dividend = quotient * divisor;

  return { question: `${dividend} ÷ ${divisor}`, answer: quotient, op: '÷' };
}

// ─── Advanced Question Builders ──────────────────────────────────────────────

function buildBodmas(difficulty, streak = 0) {
  const mult = getStreakMultiplier(streak);
  if (difficulty === 'easy') {
    const a = randInt(5, Math.round(15 * mult));
    const b = randInt(2, Math.round(10 * mult));
    const c = randInt(2, Math.max(3, a + b - 2));
    if (randInt(0, 1) === 0) {
      return { question: `${a} + ${b} − ${c}`, answer: a + b - c, op: 'mixed' };
    } else {
      let first = a;
      let second = c;
      if (first < second) [first, second] = [second, first];
      return { question: `${first} − ${second} + ${b}`, answer: first - second + b, op: 'mixed' };
    }
  } else if (difficulty === 'medium') {
    const a = randInt(2, Math.round(8 * mult));
    const b = randInt(2, Math.round(6 * mult));
    const c = randInt(2, Math.round(15 * mult));
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
    const type = randInt(0, 2);
    if (type === 0) {
      const a = randInt(2, Math.round(8 * mult));
      const b = randInt(2, Math.round(8 * mult));
      const c = randInt(3, Math.round(6 * mult));
      return { question: `(${a} + ${b}) × ${c}`, answer: (a + b) * c, op: 'mixed' };
    } else if (type === 1) {
      const a = randInt(3, Math.round(8 * mult));
      const b = randInt(3, Math.round(8 * mult));
      const c = randInt(2, Math.round(5 * mult));
      const d = randInt(2, Math.round(5 * mult));
      let p1 = a * b;
      let p2 = c * d;
      if (p2 > p1) {
        return { question: `${c} × ${d} − ${a} × ${b}`, answer: p2 - p1, op: 'mixed' };
      }
      return { question: `${a} × ${b} − ${c} × ${d}`, answer: p1 - p2, op: 'mixed' };
    } else {
      const d = randInt(2, Math.round(6 * mult));
      const quotient = randInt(2, Math.round(8 * mult));
      const c = d * quotient;
      const a = randInt(3, Math.round(8 * mult));
      const b = randInt(3, Math.round(8 * mult));
      return { question: `${a} × ${b} + ${c} ÷ ${d}`, answer: a * b + quotient, op: 'mixed' };
    }
  }
}

function buildAlgebra(difficulty, mode, streak = 0) {
  let base;
  let op = mode;
  if (mode === 'mixed') {
    const ops = ['addition', 'subtraction', 'multiplication', 'division'];
    op = ops[randInt(0, 3)];
  }

  switch (op) {
    case 'addition':       base = buildAddition(difficulty, streak); break;
    case 'subtraction':    base = buildSubtraction(difficulty, streak); break;
    case 'multiplication': base = buildMultiplication(difficulty, streak); break;
    case 'division':       base = buildDivision(difficulty, streak); break;
    default:               base = buildAddition(difficulty, streak);
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

function buildSquareRoot(difficulty, streak = 0) {
  const mult = getStreakMultiplier(streak);
  if (difficulty === 'easy') {
    const n = randInt(2, Math.round(10 * mult));
    return { question: `${n}²`, answer: n * n, op: 'mixed' };
  } else if (difficulty === 'medium') {
    if (randInt(0, 1) === 0) {
      const n = randInt(2, Math.round(12 * mult));
      return { question: `√${n * n}`, answer: n, op: 'mixed' };
    } else {
      const n = randInt(8, Math.round(15 * mult));
      return { question: `${n}²`, answer: n * n, op: 'mixed' };
    }
  } else {
    if (randInt(0, 1) === 0) {
      const n = randInt(6, Math.round(20 * mult));
      return { question: `√${n * n}`, answer: n, op: 'mixed' };
    } else {
      const n = randInt(12, Math.round(25 * mult));
      return { question: `${n}²`, answer: n * n, op: 'mixed' };
    }
  }
}

function buildModulo(difficulty, streak = 0) {
  const mult = getStreakMultiplier(streak);
  let dividendMax = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 60 : 120;
  dividendMax = Math.round(dividendMax * mult);
  const divisorMax = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 16;

  const divisor = randInt(2, divisorMax);
  const dividend = randInt(divisor + 1, dividendMax);
  const remainder = dividend % divisor;

  return { question: `${dividend} mod ${divisor}`, answer: remainder, op: 'mixed' };
}

function buildPercentageAndFractions(difficulty, streak = 0) {
  const mult = getStreakMultiplier(streak);
  const type = randInt(0, 1);
  
  if (type === 0) {
    const percentages = difficulty === 'easy' ? [50, 10] : difficulty === 'medium' ? [25, 50, 75, 20] : [15, 30, 45, 60, 75, 80];
    const pct = percentages[randInt(0, percentages.length - 1)];
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const factor = 100 / gcd(pct, 100);
    let kMax = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 8 : 15;
    kMax = Math.round(kMax * mult);
    const k = randInt(1, kMax);
    const num = k * factor;
    const ans = (pct * num) / 100;
    
    return { question: `${pct}% of ${num}`, answer: ans, op: 'mixed' };
  } else {
    const denominators = difficulty === 'easy' ? [2, 3, 4] : difficulty === 'medium' ? [3, 4, 5, 6] : [6, 8, 9, 12];
    const den = denominators[randInt(0, denominators.length - 1)];
    const numers = [];
    for (let n = 1; n < den; n++) {
      if (den % n !== 0 || n === 1) numers.push(n);
    }
    const num = numers[randInt(0, numers.length - 1)];
    let kMax = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 12 : 20;
    kMax = Math.round(kMax * mult);
    const k = randInt(1, kMax);
    const target = k * den;
    const ans = (target / den) * num;
    
    return { question: `${num}/${den} of ${target}`, answer: ans, op: 'mixed' };
  }
}

function buildExponentsAndLogs(difficulty, streak = 0) {
  const mult = getStreakMultiplier(streak);
  const type = randInt(0, 1);
  
  if (type === 0) {
    let base, power;
    if (difficulty === 'easy') {
      const bases = [2, 3, 4, 5, 10];
      base = bases[randInt(0, bases.length - 1)];
      power = base > 5 ? 2 : randInt(2, 3);
    } else if (difficulty === 'medium') {
      base = randInt(2, Math.round(10 * mult));
      power = base > 6 ? 2 : base > 3 ? randInt(2, 3) : randInt(2, 5);
    } else {
      base = randInt(2, Math.round(15 * mult));
      power = base > 10 ? 2 : base > 6 ? randInt(2, 3) : base > 3 ? randInt(2, 4) : randInt(3, 8);
    }
    const ans = Math.pow(base, power);
    return { question: `${base}^${power}`, answer: ans, op: 'mixed' };
  } else {
    let base, power;
    if (difficulty === 'easy') {
      const bases = [2, 3, 5, 10];
      base = bases[randInt(0, bases.length - 1)];
      power = randInt(2, 3);
    } else if (difficulty === 'medium') {
      const bases = [2, 3, 4, 5];
      base = bases[randInt(0, bases.length - 1)];
      power = randInt(2, 4);
    } else {
      base = randInt(2, Math.min(10, Math.round(8 * mult)));
      power = base > 5 ? randInt(2, 3) : randInt(2, 5);
    }
    const value = Math.pow(base, power);
    return { question: `log${base}(${value})`, answer: power, op: 'mixed' };
  }
}

function buildGcdAndLcm(difficulty, streak = 0) {
  const mult = getStreakMultiplier(streak);
  const type = randInt(0, 1);
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const lcm = (a, b) => (a * b) / gcd(a, b);
  
  if (type === 0) {
    let maxVal = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 50 : 100;
    maxVal = Math.round(maxVal * mult);
    const common = randInt(difficulty === 'easy' ? 2 : 4, difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20);
    const k1 = randInt(1, Math.round(maxVal / common));
    let k2 = randInt(1, Math.round(maxVal / common));
    while (gcd(k1, k2) !== 1) {
      k2 = randInt(1, Math.round(maxVal / common));
    }
    const num1 = k1 * common;
    const num2 = k2 * common;
    const ans = gcd(num1, num2);
    
    return { question: `GCD(${num1}, ${num2})`, answer: ans, op: 'mixed' };
  } else {
    let rangeMax = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 16 : 28;
    rangeMax = Math.round(rangeMax * mult);
    const num1 = randInt(3, rangeMax);
    let num2 = randInt(3, rangeMax);
    while (num1 === num2) {
      num2 = randInt(3, rangeMax);
    }
    const ans = lcm(num1, num2);
    
    return { question: `LCM(${num1}, ${num2})`, answer: ans, op: 'mixed' };
  }
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export function generateQuestion(difficulty, mode, advancedMath = false, streak = 0) {
  let result;
  let attempts = 0;

  do {
    if (advancedMath) {
      const advancedPool = [
        () => buildAlgebra(difficulty, mode, streak),
        () => buildBodmas(difficulty, streak),
        () => buildSquareRoot(difficulty, streak),
        () => buildModulo(difficulty, streak),
        () => buildPercentageAndFractions(difficulty, streak),
        () => buildExponentsAndLogs(difficulty, streak),
        () => buildGcdAndLcm(difficulty, streak)
      ];
      
      const roll = randInt(0, 9);
      if (roll < 3) {
        // 30% chance for algebraic variant of the current base mode
        result = buildAlgebra(difficulty, mode, streak);
      } else {
        // 70% chance to select randomly from the full advanced pool
        const index = randInt(0, advancedPool.length - 1);
        result = advancedPool[index]();
      }
    } else {
      const op = getOperation(mode);
      switch (op) {
        case '+':  result = buildAddition(difficulty, streak);       break;
        case '-':  result = buildSubtraction(difficulty, streak);    break;
        case '×':  result = buildMultiplication(difficulty, streak); break;
        case '÷':  result = buildDivision(difficulty, streak);       break;
        default:   result = buildAddition(difficulty, streak);
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
