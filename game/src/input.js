// Mouse and keyboard, translated into game actions. The mouse clicks a
// panel; the keyboard drives a magnifier ring (arrows or WASD) and marks
// with Enter or Space, so the whole hunt is playable without a mouse.

import { PANEL, VIEW } from './config.js';

export const ACTION_CONFIRM = 1;
export const ACTION_HINT = 2;
export const ACTION_PAUSE = 4;
export const ACTION_RESTART = 8;

export function createInput(canvas) {
  let actions = 0;
  let click = null;
  let cursor = { x: PANEL.width / 2, y: PANEL.height / 2, visible: false };
  const keys = new Set();

  function toLogical(event) {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - r.left) / r.width) * VIEW.width,
      y: ((event.clientY - r.top) / r.height) * VIEW.height,
    };
  }

  canvas.addEventListener('pointerdown', (event) => {
    const p = toLogical(event);
    click = p;
    cursor = { x: p.x, y: p.y, visible: false };
  });

  canvas.addEventListener('pointermove', (event) => {
    const p = toLogical(event);
    hover = p;
  });

  let hover = null;

  window.addEventListener('keydown', (event) => {
    const k = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) event.preventDefault();
    keys.add(k);
    if (k === 'enter' || k === ' ') actions |= ACTION_CONFIRM;
    if (k === 'h') actions |= ACTION_HINT;
    if (k === 'p' || k === 'escape') actions |= ACTION_PAUSE;
    if (k === 'r') actions |= ACTION_RESTART;
  });
  window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));

  // Move the keyboard magnifier; returns its panel-local position on the
  // left panel (it mirrors onto the right panel when drawn).
  function updateCursor(dt) {
    const speed = 340 * dt;
    let moved = false;
    if (keys.has('arrowleft') || keys.has('a')) { cursor.x -= speed; moved = true; }
    if (keys.has('arrowright') || keys.has('d')) { cursor.x += speed; moved = true; }
    if (keys.has('arrowup') || keys.has('w')) { cursor.y -= speed; moved = true; }
    if (keys.has('arrowdown') || keys.has('s')) { cursor.y += speed; moved = true; }
    if (moved) {
      cursor.visible = true;
      cursor.x = Math.min(PANEL.width, Math.max(0, cursor.x));
      cursor.y = Math.min(PANEL.height, Math.max(0, cursor.y));
    }
    return cursor;
  }

  function takeClick() {
    const c = click;
    click = null;
    return c;
  }

  function takeActions() {
    const a = actions;
    actions = 0;
    return a;
  }

  return { takeClick, takeActions, updateCursor, hover: () => hover };
}

/** Which panel a logical point falls in, and its panel-local position. */
export function panelAt(x, y) {
  const localY = y - PANEL.topY;
  if (localY < 0 || localY > PANEL.height) return null;
  const left = x - PANEL.leftX;
  if (left >= 0 && left <= PANEL.width) return { panel: 0, x: left, y: localY };
  const right = x - PANEL.rightX;
  if (right >= 0 && right <= PANEL.width) return { panel: 1, x: right, y: localY };
  return null;
}
