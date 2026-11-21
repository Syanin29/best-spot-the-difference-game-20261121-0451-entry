// The hunt itself: which scene is up, which differences are found, the
// tide timer, hints, score and combo. Pure state and rules — no drawing,
// no DOM — so the screenshot scenes can play the same rules headlessly.

import {
  COMBO_BONUS,
  FIND_SCORE,
  HINTS_PER_SCENE,
  SCENE_SECONDS,
  SCENES,
  TIME_BONUS_PER_SECOND,
  WRONG_PENALTY_SCORE,
  WRONG_PENALTY_SECONDS,
} from './config.js';
import { sceneDiffs } from './scenes.js';

export const EVENT_NONE = 0;
export const EVENT_FIND = 1;
export const EVENT_WRONG = 2;
export const EVENT_SCENE_CLEAR = 4;
export const EVENT_TIME_UP = 8;
export const EVENT_HINT = 16;

export function createWorld() {
  const state = {
    sceneIndex: 0,
    found: new Set(),
    timeLeft: SCENE_SECONDS,
    score: 0,
    combo: 0,
    bestCombo: 0,
    hintsLeft: HINTS_PER_SCENE,
    hintId: null,
    hintPulse: 0,
    wrongFlash: null,
    wrongAge: 0,
    lastFind: null,
    finds: 0,
    wrongs: 0,
    hintsUsed: 0,
    totalTime: 0,
    sceneTime: 0,
    cleared: [],
    finished: false,
    failed: false,
  };

  function diffs() {
    return sceneDiffs(state.sceneIndex);
  }

  function remaining() {
    return diffs().length - state.found.size;
  }

  function startScene(index) {
    state.sceneIndex = index;
    state.found = new Set();
    state.timeLeft = SCENE_SECONDS;
    state.combo = 0;
    state.hintsLeft = HINTS_PER_SCENE;
    state.hintId = null;
    state.hintPulse = 0;
    state.wrongFlash = null;
    state.lastFind = null;
    state.sceneTime = 0;
    state.failed = false;
  }

  function reset() {
    state.score = 0;
    state.bestCombo = 0;
    state.finds = 0;
    state.wrongs = 0;
    state.hintsUsed = 0;
    state.totalTime = 0;
    state.cleared = [];
    state.finished = false;
    startScene(0);
  }

  // A click at panel-local (x, y) on either panel. The nearest unfound
  // difference whose ring contains the click wins, so two close rings
  // never steal each other's finds. Returns event flags.
  function clickAt(x, y) {
    if (state.finished || state.failed) return EVENT_NONE;
    let nearest = null;
    let nearestDist = Infinity;
    for (const d of diffs()) {
      if (state.found.has(d.id)) continue;
      const dx = x - d.x;
      const dy = y - d.y;
      const dist = dx * dx + dy * dy;
      if (dist <= d.r * d.r && dist < nearestDist) {
        nearest = d;
        nearestDist = dist;
      }
    }
    if (nearest) {
      const d = nearest;
      {
        state.found.add(d.id);
        state.finds += 1;
        state.combo += 1;
        state.bestCombo = Math.max(state.bestCombo, state.combo);
        state.score += FIND_SCORE + (state.combo - 1) * COMBO_BONUS;
        state.lastFind = { id: d.id, x: d.x, y: d.y, r: d.r, age: 0 };
        if (state.hintId === d.id) state.hintId = null;
        if (remaining() === 0) {
          const bonus = Math.ceil(state.timeLeft) * TIME_BONUS_PER_SECOND;
          state.score += bonus;
          state.cleared.push({ scene: state.sceneIndex, time: state.sceneTime, bonus });
          if (state.sceneIndex + 1 >= SCENES.length) state.finished = true;
          return EVENT_FIND | EVENT_SCENE_CLEAR;
        }
        return EVENT_FIND;
      }
    }
    state.wrongs += 1;
    state.combo = 0;
    state.score = Math.max(0, state.score - WRONG_PENALTY_SCORE);
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_PENALTY_SECONDS);
    state.wrongFlash = { x, y };
    state.wrongAge = 0;
    if (state.timeLeft <= 0) {
      state.failed = true;
      return EVENT_WRONG | EVENT_TIME_UP;
    }
    return EVENT_WRONG;
  }

  // Point at one unfound difference (the first in registry order, so the
  // hint is deterministic). Costs one hint; the ring pulses for 2 seconds.
  function useHint() {
    if (state.finished || state.failed || state.hintsLeft <= 0) return EVENT_NONE;
    const target = diffs().find((d) => !state.found.has(d.id));
    if (!target) return EVENT_NONE;
    state.hintsLeft -= 1;
    state.hintsUsed += 1;
    state.hintId = target.id;
    state.hintPulse = 2;
    state.combo = 0;
    return EVENT_HINT;
  }

  function advance() {
    if (state.sceneIndex + 1 < SCENES.length) startScene(state.sceneIndex + 1);
  }

  function step(dt) {
    if (state.finished || state.failed) return EVENT_NONE;
    state.timeLeft -= dt;
    state.sceneTime += dt;
    state.totalTime += dt;
    if (state.lastFind) state.lastFind.age += dt;
    if (state.wrongFlash) {
      state.wrongAge += dt;
      if (state.wrongAge > 0.6) state.wrongFlash = null;
    }
    if (state.hintPulse > 0) {
      state.hintPulse -= dt;
      if (state.hintPulse <= 0) state.hintId = null;
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.failed = true;
      return EVENT_TIME_UP;
    }
    return EVENT_NONE;
  }

  reset();
  return { state, reset, startScene, clickAt, useHint, advance, step, remaining, diffs };
}
