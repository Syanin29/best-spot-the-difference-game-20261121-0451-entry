// Everything the player sees: the header with the remaining counter and
// the tide timer, the two panels with their Echo Rings, and the title,
// pause, scene-clear, time-up and victory screens. One canvas, drawn
// fresh each frame from the world state.

import { FOOTER_Y, HINTS_PER_SCENE, PANEL, SCENE_SECONDS, SCENES, TOTAL_DIFFERENCES, VIEW } from './config.js';
import { paintPanel, sceneDiffs } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_FAIL = 'fail';
export const SCREEN_VICTORY = 'victory';

const FONT = 'system-ui, "Segoe UI", Roboto, sans-serif';

function text(ctx, str, x, y, size, fill, align = 'left', weight = '600') {
  ctx.fillStyle = fill;
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function panelFrame(ctx, x, label) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#0b1c2c';
  ctx.fillRect(x - 6, PANEL.topY - 6, PANEL.width + 12, PANEL.height + 12);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 6, PANEL.topY - 6, PANEL.width + 12, PANEL.height + 12);
  text(ctx, label, x + PANEL.width / 2, PANEL.topY + PANEL.height + 22, 15, '#9fc3dd', 'center', '700');
}

function drawPanel(ctx, state, panelX, mutated) {
  ctx.save();
  ctx.translate(panelX, PANEL.topY);
  paintPanel(ctx, state.sceneIndex, mutated);
  // Echo Rings: every find rings BOTH panels at the same spot.
  for (const d of sceneDiffs(state.sceneIndex)) {
    if (!state.found.has(d.id)) continue;
    ctx.strokeStyle = '#37e08b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(55,224,139,0.35)';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#0b3d24';
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.moveTo(d.x - 7, d.y);
    ctx.lineTo(d.x - 2, d.y + 6);
    ctx.lineTo(d.x + 8, d.y - 6);
    ctx.stroke();
  }
  // Hint ring pulses around one unfound difference.
  if (state.hintId) {
    const d = sceneDiffs(state.sceneIndex).find((x) => x.id === state.hintId);
    if (d) {
      const pulse = 1 + Math.sin(state.hintPulse * 9) * 0.12;
      ctx.strokeStyle = '#ffc53d';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 7]);
      ctx.beginPath();
      ctx.arc(d.x, d.y, (d.r + 10) * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  // Wrong-click flash.
  if (state.wrongFlash) {
    const { x, y } = state.wrongFlash;
    ctx.strokeStyle = '#ff5a5a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 10);
    ctx.lineTo(x + 10, y + 10);
    ctx.moveTo(x + 10, y - 10);
    ctx.lineTo(x - 10, y + 10);
    ctx.stroke();
  }
  // Fresh-find burst.
  if (state.lastFind && state.lastFind.age < 0.45) {
    const a = 1 - state.lastFind.age / 0.45;
    ctx.strokeStyle = `rgba(255,255,255,${a * 0.8})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(state.lastFind.x, state.lastFind.y, state.lastFind.r + 4 + state.lastFind.age * 46, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawHeader(ctx, state, best) {
  const diffs = sceneDiffs(state.sceneIndex);
  const foundCount = state.found.size;
  const remaining = diffs.length - foundCount;
  text(ctx, 'TWIN TIDES', 36, 30, 30, '#ffd94d', 'left', '800');
  text(ctx, 'Echo-Ring Spot Hunt', 36, 58, 16, '#9fc3dd', 'left', '600');
  text(ctx, SCENES[state.sceneIndex].name, 36, 82, 15, '#ffffff', 'left', '700');
  // The counter the whole game turns on: found, and how many remain.
  text(ctx, `FOUND ${foundCount}/${diffs.length}`, 640, 34, 30, '#37e08b', 'center', '800');
  text(ctx, `${remaining} REMAINING`, 640, 66, 24, remaining <= 3 ? '#ffc53d' : '#ffffff', 'center', '800');
  text(ctx, `SCORE ${state.score}`, 1244, 30, 22, '#ffffff', 'right', '800');
  text(ctx, `BEST ${best}`, 1244, 56, 15, '#9fc3dd', 'right', '600');
  text(ctx, `HINTS ${'●'.repeat(state.hintsLeft)}${'○'.repeat(HINTS_PER_SCENE - state.hintsLeft)}`, 1244, 80, 15, '#ffc53d', 'right', '700');
  // Tide timer bar.
  const frac = Math.max(0, state.timeLeft / SCENE_SECONDS);
  const low = state.timeLeft <= 15;
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.fillRect(36, 96, VIEW.width - 72, 10);
  ctx.fillStyle = low ? '#ff5a5a' : '#37b6e0';
  ctx.fillRect(36, 96, (VIEW.width - 72) * frac, 10);
  text(ctx, `${Math.ceil(state.timeLeft)}s`, 48, 101, 12, '#0b1c2c', 'left', '800');
  if (state.combo >= 3) text(ctx, `COMBO ×${state.combo}`, 640, 88, 14, '#ffc53d', 'center', '800');
}

function drawFooter(ctx, state) {
  text(
    ctx,
    'Click either picture to mark a difference · H = hint · Arrows/WASD + Enter = keyboard mark · P = pause · R = restart',
    VIEW.width / 2,
    FOOTER_Y + 46,
    15,
    '#7fa6c4',
    'center',
    '600',
  );
  text(
    ctx,
    `Scene ${state.sceneIndex + 1} of ${SCENES.length} · ${TOTAL_DIFFERENCES} differences in all · wrong click −5s`,
    VIEW.width / 2,
    FOOTER_Y + 72,
    14,
    '#5b7f9c',
    'center',
    '600',
  );
}

function overlay(ctx, title, lines, prompt) {
  ctx.fillStyle = 'rgba(4,14,24,0.68)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  text(ctx, title, VIEW.width / 2, 240, 54, '#ffd94d', 'center', '800');
  lines.forEach((line, i) => text(ctx, line, VIEW.width / 2, 300 + i * 34, 21, '#e8f2fa', 'center', '600'));
  if (prompt) text(ctx, prompt, VIEW.width / 2, 300 + lines.length * 34 + 26, 19, '#37e08b', 'center', '800');
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function draw(state, screen, best, cursor) {
    const bg = ctx.createLinearGradient(0, 0, 0, VIEW.height);
    bg.addColorStop(0, '#10283e');
    bg.addColorStop(1, '#081826');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);

    const all = new Set(sceneDiffs(state.sceneIndex).map((d) => d.id));
    panelFrame(ctx, PANEL.leftX, 'PICTURE A');
    panelFrame(ctx, PANEL.rightX, 'PICTURE B');
    drawPanel(ctx, state, PANEL.leftX, new Set());
    drawPanel(ctx, state, PANEL.rightX, all);

    // Keyboard magnifier mirrors onto both panels.
    if (cursor && cursor.visible && screen === SCREEN_PLAY) {
      for (const px of [PANEL.leftX, PANEL.rightX]) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(px + cursor.x, PANEL.topY + cursor.y, 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(px + cursor.x - 22, PANEL.topY + cursor.y);
        ctx.lineTo(px + cursor.x + 22, PANEL.topY + cursor.y);
        ctx.moveTo(px + cursor.x, PANEL.topY + cursor.y - 22);
        ctx.lineTo(px + cursor.x, PANEL.topY + cursor.y + 22);
        ctx.stroke();
      }
    }

    drawHeader(ctx, state, best);
    drawFooter(ctx, state);

    if (screen === SCREEN_TITLE) {
      overlay(
        ctx,
        'TWIN TIDES',
        [
          'Echo-Ring Spot Hunt — 48 differences, 4 scenes, 90-second tides',
          'Two near-identical pictures. Click every difference before the tide runs out.',
          'A find rings both pictures at once. Wrong clicks cost 5 seconds.',
          'Scenes: Harbor Dawn · Market Noon · Garden Dusk · Abyss Night',
        ],
        'CLICK OR PRESS ENTER TO START',
      );
    } else if (screen === SCREEN_PAUSED) {
      overlay(ctx, 'PAUSED', [`${state.found.size} found · ${sceneDiffs(state.sceneIndex).length - state.found.size} remaining`], 'P OR ENTER TO RESUME');
    } else if (screen === SCREEN_CLEAR) {
      const last = state.cleared[state.cleared.length - 1];
      overlay(
        ctx,
        'SCENE CLEAR!',
        [
          `${SCENES[state.sceneIndex].name} complete in ${Math.round(last ? last.time : 0)}s`,
          `Time bonus +${last ? last.bonus : 0} · Score ${state.score}`,
          `Next: ${SCENES[state.sceneIndex + 1] ? SCENES[state.sceneIndex + 1].name : ''}`,
        ],
        'CLICK OR PRESS ENTER FOR THE NEXT SCENE',
      );
    } else if (screen === SCREEN_FAIL) {
      overlay(
        ctx,
        'THE TIDE TOOK IT',
        [
          `Time up in ${SCENES[state.sceneIndex].name} — ${state.found.size} of ${sceneDiffs(state.sceneIndex).length} found`,
          `Score ${state.score} · Best ${best}`,
        ],
        'CLICK OR PRESS ENTER TO TRY AGAIN',
      );
    } else if (screen === SCREEN_VICTORY) {
      const mins = Math.floor(state.totalTime / 60);
      const secs = Math.round(state.totalTime % 60);
      const accuracy = state.finds + state.wrongs > 0 ? Math.round((state.finds / (state.finds + state.wrongs)) * 100) : 100;
      overlay(
        ctx,
        'ALL 48 FOUND!',
        [
          `Score ${state.score} · Best ${best}`,
          `Time ${mins}:${String(secs).padStart(2, '0')} · Accuracy ${accuracy}% · Best combo ×${state.bestCombo}`,
          `Hints used ${state.hintsUsed} · Wrong clicks ${state.wrongs}`,
          'Harbor Dawn ✓ · Market Noon ✓ · Garden Dusk ✓ · Abyss Night ✓',
        ],
        'CLICK OR PRESS ENTER TO PLAY AGAIN',
      );
    }
  }

  return { draw };
}
