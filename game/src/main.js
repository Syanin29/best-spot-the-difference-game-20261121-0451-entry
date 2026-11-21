// Boot and the one loop: input is read every frame, the world advances in
// fixed 1/60 s steps, and the renderer paints what is there. Screens:
// title, play, paused, scene clear, time up, victory.
//
// ?seed=N is accepted for parity with the screenshot scenes (the pictures
// are hand-planted, so the seed only steadies shot staging).
// ?shot=play|start|abyss|complete stages that scene, paints it twice and
// sets window.__shotReady for a screenshot.

import { BEST_KEY, STEP } from './config.js';
import { createWorld, EVENT_FIND, EVENT_HINT, EVENT_SCENE_CLEAR, EVENT_TIME_UP, EVENT_WRONG } from './world.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_PAUSE, ACTION_RESTART, createInput, panelAt } from './input.js';
import { createRenderer, SCREEN_CLEAR, SCREEN_FAIL, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_VICTORY } from './render.js';
import { soundClear, soundFail, soundFind, soundHint, soundTick, soundWrong } from './audio.js';
import { stageShot } from './shots.js';

const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
const renderer = createRenderer(canvas);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best then lasts this visit.
  }
}

function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world.state, scene.screen, scene.best, null);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let screen = SCREEN_TITLE;
  let best = readBest();
  let accumulator = 0;
  let last = performance.now();
  let lastTickSecond = -1;

  function announce(message) {
    status.textContent = message;
  }

  function beginHunt() {
    world.reset();
    accumulator = 0;
    screen = SCREEN_PLAY;
    announce('Hunt started. 12 differences to find.');
  }

  function finishBest() {
    if (world.state.score > best) {
      best = world.state.score;
      saveBest(best);
    }
  }

  function handleEvents(events) {
    if (events & EVENT_FIND) {
      soundFind(world.state.combo);
      announce(`Found. ${world.remaining()} remaining.`);
    }
    if (events & EVENT_WRONG) soundWrong();
    if (events & EVENT_HINT) soundHint();
    if (events & EVENT_SCENE_CLEAR) {
      soundClear();
      finishBest();
      screen = world.state.finished ? SCREEN_VICTORY : SCREEN_CLEAR;
      announce(world.state.finished ? `All 48 found. Score ${world.state.score}.` : 'Scene clear.');
    } else if (events & EVENT_TIME_UP) {
      soundFail();
      finishBest();
      screen = SCREEN_FAIL;
      announce(`Time up. Score ${world.state.score}.`);
    }
  }

  function handleClick() {
    const click = input.takeClick();
    if (!click) return;
    if (screen === SCREEN_TITLE || screen === SCREEN_FAIL || screen === SCREEN_VICTORY) {
      beginHunt();
      return;
    }
    if (screen === SCREEN_CLEAR) {
      world.advance();
      screen = SCREEN_PLAY;
      announce('Next scene. 12 differences to find.');
      return;
    }
    if (screen !== SCREEN_PLAY) return;
    const hit = panelAt(click.x, click.y);
    if (hit) handleEvents(world.clickAt(hit.x, hit.y));
  }

  function handleActions(cursor) {
    const actions = input.takeActions();
    if (actions & ACTION_RESTART) {
      beginHunt();
      return;
    }
    if (screen === SCREEN_PLAY && actions & ACTION_HINT) handleEvents(world.useHint());
    if (actions & ACTION_CONFIRM) {
      if (screen === SCREEN_TITLE || screen === SCREEN_FAIL || screen === SCREEN_VICTORY) beginHunt();
      else if (screen === SCREEN_CLEAR) {
        world.advance();
        screen = SCREEN_PLAY;
      } else if (screen === SCREEN_PAUSED) screen = SCREEN_PLAY;
      else if (screen === SCREEN_PLAY && cursor.visible) handleEvents(world.clickAt(cursor.x, cursor.y));
    } else if (actions & ACTION_PAUSE) {
      if (screen === SCREEN_PLAY) screen = SCREEN_PAUSED;
      else if (screen === SCREEN_PAUSED) screen = SCREEN_PLAY;
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    const cursor = input.updateCursor(STEP);
    handleClick();
    handleActions(cursor);
    if (screen === SCREEN_PLAY) {
      while (accumulator >= STEP && screen === SCREEN_PLAY) {
        handleEvents(world.step(STEP));
        accumulator -= STEP;
      }
      const second = Math.ceil(world.state.timeLeft);
      if (second <= 10 && second !== lastTickSecond && second > 0) {
        lastTickSecond = second;
        soundTick();
      }
    } else {
      accumulator = 0;
    }
    renderer.draw(world.state, screen, best, cursor);
  }

  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
