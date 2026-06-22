import { loadStorage } from './storage';

// Sound effects using real MP3 files

const sounds = {
  correct:  null,
  wrong:    null,
  areBaba:  null,  // plays when ALL answers correct (100% accuracy)
  khatam:   null,  // plays when ≤10% answers correct (very bad score)
};

function loadSound(key, src, volume = 0.8) {
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.volume = volume;
  sounds[key] = audio;
}

// Preload all sounds immediately
loadSound('correct',  './correct.mp3');
loadSound('wrong',    './wrong.mp3');
loadSound('areBaba',  './are_baba.mp3', 1.0);
loadSound('khatam',   './khatam.mp3',   1.0);

function playSound(key) {
  try {
    const storage = loadStorage();
    if (storage && storage.soundsEnabled === false) {
      return;
    }
    const snd = sounds[key];
    if (!snd) return;
    // Clone so rapid triggers work
    const clone = snd.cloneNode();
    clone.volume = snd.volume;
    clone.play().catch(() => {});
  } catch {
    // ignore
  }
}

export function playCorrect() {
  playSound('correct');
}

export function playWrong() {
  playSound('wrong');
}

/**
 * Plays end-of-game result sound based on accuracy.
 * @param {number} correct - number of correct answers
 * @param {number} total   - total questions answered
 */
export function playResultSound(correct, total) {
  if (total === 0) return;
  const accuracy = correct / total; // 0.0 – 1.0

  if (accuracy === 1.0) {
    // 100% perfect — "Are Baba!" celebration
    playSound('areBaba');
  } else if (accuracy <= 0.10) {
    // 10% or fewer correct — "Khatam" shame sound
    playSound('khatam');
  }
  // anything in between: silence (no end sound)
}

// Keep these as no-ops or re-use wrong
export function playTick() {}
export function playTimeUp() {
  playSound('wrong');
}
