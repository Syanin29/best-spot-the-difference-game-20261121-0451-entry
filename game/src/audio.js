// Small WebAudio sounds, generated in code: a bright chime on a find, a
// low buzz on a wrong click, a soft tick in the last ten seconds, and a
// little arpeggio when a scene clears. No audio files, no network.

let ctx = null;

function ensure() {
  if (ctx) return ctx;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    ctx = null;
  }
  return ctx;
}

function tone(freq, at, dur, type, gainPeak) {
  const ac = ensure();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime + at;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(gainPeak, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export function soundFind(combo) {
  const base = 660 + Math.min(combo, 8) * 40;
  tone(base, 0, 0.16, 'sine', 0.16);
  tone(base * 1.5, 0.05, 0.2, 'sine', 0.12);
}

export function soundWrong() {
  tone(150, 0, 0.22, 'square', 0.08);
}

export function soundTick() {
  tone(1100, 0, 0.05, 'sine', 0.05);
}

export function soundHint() {
  tone(880, 0, 0.12, 'triangle', 0.1);
  tone(1174, 0.08, 0.16, 'triangle', 0.1);
}

export function soundClear() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.24, 'sine', 0.14));
}

export function soundFail() {
  [392, 330, 262].forEach((f, i) => tone(f, i * 0.12, 0.26, 'triangle', 0.12));
}
