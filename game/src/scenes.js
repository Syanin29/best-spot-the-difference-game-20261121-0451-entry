// The four twin pictures. Each scene is painted twice from the same code:
// once plain (the left panel) and once with a set of planted mutations
// (the right panel). A mutation id in the set changes exactly one object,
// so the game always knows where every difference lives. Coordinates are
// panel-local, 560 wide by 420 tall. All art is drawn here — no images.

import { PANEL } from './config.js';

const W = PANEL.width;
const H = PANEL.height;

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function tri(ctx, x1, y1, x2, y2, x3, y3, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, s, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 22 * s, y + 4 * s, 14 * s, 0, Math.PI * 2);
  ctx.arc(x - 22 * s, y + 5 * s, 13 * s, 0, Math.PI * 2);
  ctx.fill();
}

function bird(ctx, x, y, s, stroke) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(x - 9 * s, y);
  ctx.quadraticCurveTo(x - 3 * s, y - 6 * s, x, y);
  ctx.quadraticCurveTo(x + 3 * s, y - 6 * s, x + 9 * s, y);
  ctx.stroke();
}

function boat(ctx, x, y, sailFill, hullFill) {
  tri(ctx, x, y - 52, x, y - 6, x + 30, y - 6, sailFill);
  tri(ctx, x - 4, y - 44, x - 4, y - 6, x - 24, y - 6, '#f4ead5');
  rect(ctx, x - 2, y - 56, 4, 56, '#5b4632');
  ctx.fillStyle = hullFill;
  ctx.beginPath();
  ctx.moveTo(x - 32, y);
  ctx.lineTo(x + 34, y);
  ctx.lineTo(x + 24, y + 14);
  ctx.lineTo(x - 22, y + 14);
  ctx.closePath();
  ctx.fill();
}

// ---------------------------------------------------------------- Harbor Dawn
function paintHarbor(ctx, m) {
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#7fb2d9');
  sky.addColorStop(0.6, '#f2c99a');
  sky.addColorStop(1, '#f7e3b8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 260);
  // sun (difference: sun-size)
  circle(ctx, 90, 78, m.has('sun-size') ? 34 : 24, '#ffd94d');
  circle(ctx, 90, 78, m.has('sun-size') ? 44 : 32, 'rgba(255,217,77,0.25)');
  cloud(ctx, 205, 58, 1, '#ffffff');
  // middle cloud (difference: cloud-missing)
  if (!m.has('cloud-missing')) cloud(ctx, 382, 92, 0.9, '#ffffff');
  cloud(ctx, 492, 48, 0.75, '#fdf6ec');
  // birds (difference: bird-missing — the middle bird of five)
  bird(ctx, 250, 132, 1, '#33526b');
  bird(ctx, 282, 122, 0.85, '#33526b');
  if (!m.has('bird-missing')) bird(ctx, 312, 138, 1, '#33526b');
  bird(ctx, 342, 126, 0.8, '#33526b');
  bird(ctx, 368, 140, 0.9, '#33526b');
  // sea
  const sea = ctx.createLinearGradient(0, 252, 0, H);
  sea.addColorStop(0, '#3d7ea6');
  sea.addColorStop(1, '#24506e');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 252, W, H - 252);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  for (const [wx, wy] of [[60, 286], [180, 306], [300, 282], [420, 310], [120, 352], [380, 362]]) {
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + 14, wy - 6, wx + 28, wy);
    ctx.stroke();
  }
  // extra crest (difference: crest-extra)
  if (m.has('crest-extra')) {
    ctx.beginPath();
    ctx.moveTo(505, 296);
    ctx.quadraticCurveTo(519, 288, 533, 296);
    ctx.stroke();
  }
  // boats (difference: sail-color on the left boat)
  boat(ctx, 150, 302, m.has('sail-color') ? '#2aa198' : '#d94f30', '#6b4226');
  boat(ctx, 268, 322, '#f2b134', '#54423a');
  // buoy (difference: buoy-color)
  circle(ctx, 332, 344, 11, m.has('buoy-color') ? '#8e5bb5' : '#f27d26');
  rect(ctx, 329, 326, 6, 10, '#37474f');
  // leaping fish (difference: fish-missing)
  if (!m.has('fish-missing')) {
    ctx.fillStyle = '#9fd8e8';
    ctx.beginPath();
    ctx.ellipse(238, 332, 13, 6, -0.5, 0, Math.PI * 2);
    ctx.fill();
    tri(ctx, 248, 326, 258, 320, 256, 334, '#9fd8e8');
  }
  // lighthouse
  rect(ctx, 452, 168, 36, 96, '#f5f0e6');
  // stripes (difference: stripe-count — right panel has three, left has two)
  rect(ctx, 452, 188, 36, 12, '#c0392b');
  rect(ctx, 452, 222, 36, 12, '#c0392b');
  if (m.has('stripe-count')) rect(ctx, 452, 205, 36, 12, '#c0392b');
  rect(ctx, 448, 156, 44, 14, '#37474f');
  // lamp window (difference: lamp-dark)
  circle(ctx, 470, 163, 6, m.has('lamp-dark') ? '#263238' : '#ffe082');
  // flag (difference: flag-missing)
  if (!m.has('flag-missing')) tri(ctx, 470, 138, 470, 154, 488, 146, '#d94f30');
  rect(ctx, 468, 136, 3, 22, '#37474f');
  // pier + crates (differences: crate-missing, post-missing)
  rect(ctx, 0, 384, W, 10, '#7a5c3e');
  for (const px of [40, 130, 220, 310, 400, 490]) {
    if (m.has('post-missing') && px === 400) continue;
    rect(ctx, px, 394, 10, 26, '#5d4630');
  }
  rect(ctx, 74, 360, 24, 24, '#a9713f');
  rect(ctx, 100, 360, 24, 24, '#96622f');
  if (!m.has('crate-missing')) rect(ctx, 87, 336, 24, 24, '#b9834c');
}

// ---------------------------------------------------------------- Market Noon
function stall(ctx, x, awningA, awningB) {
  rect(ctx, x, 250, 110, 90, '#8d6e4c');
  rect(ctx, x + 8, 268, 94, 10, '#6f5638');
  for (let i = 0; i < 5; i += 1) {
    tri(ctx, x - 6 + i * 24, 250, x + 6 + i * 24, 250, x + i * 24, 224, i % 2 ? awningA : awningB);
  }
  rect(ctx, x + 2, 250, 6, 90, '#5d4630');
  rect(ctx, x + 102, 250, 6, 90, '#5d4630');
}

function paintMarket(ctx, m) {
  const sky = ctx.createLinearGradient(0, 0, 0, 240);
  sky.addColorStop(0, '#8ec9e8');
  sky.addColorStop(1, '#dff2f7');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 240);
  circle(ctx, 492, 62, 26, '#ffdf5e');
  cloud(ctx, 120, 62, 1, '#ffffff');
  // cloud shape (difference: cloud-shape — right cloud is wider)
  cloud(ctx, 310, 84, m.has('cloud-shape') ? 1.35 : 0.9, '#ffffff');
  // rooftops
  rect(ctx, 30, 150, 130, 110, '#c97b5a');
  tri(ctx, 20, 150, 170, 150, 95, 108, '#8e4a32');
  rect(ctx, 210, 166, 120, 94, '#d9a05b');
  tri(ctx, 200, 166, 340, 166, 270, 126, '#7a4a2b');
  rect(ctx, 390, 156, 140, 104, '#b56a4a');
  tri(ctx, 380, 156, 540, 156, 460, 114, '#6e3b26');
  // chimney bird (difference: chimney-bird)
  rect(ctx, 300, 118, 14, 26, '#7a4a2b');
  if (!m.has('chimney-bird')) bird(ctx, 307, 110, 0.8, '#37474f');
  // cat on the left roof (difference: cat-color)
  const cat = m.has('cat-color') ? '#eceff1' : '#37474f';
  ctx.fillStyle = cat;
  ctx.beginPath();
  ctx.ellipse(120, 138, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, 134, 132, 6, cat);
  tri(ctx, 130, 128, 133, 121, 136, 128, cat);
  ctx.strokeStyle = cat;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(107, 136);
  ctx.quadraticCurveTo(96, 128, 100, 118);
  ctx.stroke();
  // shutter window (difference: shutter-open)
  rect(ctx, 236, 196, 30, 36, '#5d8aa8');
  if (m.has('shutter-open')) {
    rect(ctx, 222, 196, 12, 36, '#2e7d6b');
    rect(ctx, 268, 196, 12, 36, '#2e7d6b');
  } else {
    rect(ctx, 236, 196, 14, 36, '#2e7d6b');
    rect(ctx, 252, 196, 14, 36, '#2e7d6b');
  }
  // ground
  rect(ctx, 0, 260, W, H - 260, '#cbb489');
  // stalls (difference: awning-color on the middle stall)
  stall(ctx, 36, '#d94f30', '#f4ead5');
  stall(ctx, 222, m.has('awning-color') ? '#2e7d6b' : '#d94f30', '#f4ead5');
  stall(ctx, 408, '#f2b134', '#f4ead5');
  // fruit piles (difference: apple-count — right pile has one fewer)
  for (const [ax, ay] of [[60, 300], [76, 300], [68, 288]]) circle(ctx, ax, ay, 7, '#c62828');
  const apples = m.has('apple-count') ? [[246, 300], [262, 300]] : [[246, 300], [262, 300], [254, 288]];
  for (const [ax, ay] of apples) circle(ctx, ax, ay, 7, '#ef6c00');
  for (const [ax, ay] of [[432, 300], [448, 300], [440, 288]]) circle(ctx, ax, ay, 7, '#7cb342');
  // hanging lanterns (difference: lantern-missing — middle one gone)
  ctx.strokeStyle = '#37474f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 210);
  ctx.quadraticCurveTo(W / 2, 244, W, 210);
  ctx.stroke();
  const lanternXs = m.has('lantern-missing') ? [90, 470] : [90, 280, 470];
  for (const lx of lanternXs) {
    const ly = 222 + Math.abs(lx - 280) * -0.04 + 14;
    circle(ctx, lx, ly, 10, '#ffca28');
    rect(ctx, lx - 4, ly - 14, 8, 5, '#37474f');
  }
  // bunting (difference: bunting-missing — one flag gone)
  const flags = ['#d94f30', '#f2b134', '#2e7d6b', '#5d8aa8', '#8e5bb5'];
  for (let i = 0; i < 5; i += 1) {
    if (m.has('bunting-missing') && i === 2) continue;
    tri(ctx, 60 + i * 26, 344, 84 + i * 26, 344, 72 + i * 26, 362, flags[i]);
  }
  // barrels (difference: barrel-count — right side has two, left has three)
  for (const bx of [470, 500]) {
    rect(ctx, bx, 356, 26, 34, '#8d6e4c');
    rect(ctx, bx, 364, 26, 4, '#5d4630');
    rect(ctx, bx, 378, 26, 4, '#5d4630');
  }
  if (!m.has('barrel-count')) {
    rect(ctx, 440, 356, 26, 34, '#8d6e4c');
    rect(ctx, 440, 364, 26, 4, '#5d4630');
    rect(ctx, 440, 378, 26, 4, '#5d4630');
  }
  // cart wheel (difference: wheel-spokes — right wheel has 6 spokes, left 4)
  circle(ctx, 330, 372, 20, '#6f5638');
  circle(ctx, 330, 372, 6, '#cbb489');
  ctx.strokeStyle = '#cbb489';
  ctx.lineWidth = 3;
  const spokes = m.has('wheel-spokes') ? 6 : 4;
  for (let i = 0; i < spokes; i += 1) {
    const a = (i / spokes) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(330, 372);
    ctx.lineTo(330 + Math.cos(a) * 17, 372 + Math.sin(a) * 17);
    ctx.stroke();
  }
  // flower pot (difference: pot-color)
  tri(ctx, 180, 368, 206, 368, 200, 392, m.has('pot-color') ? '#5d8aa8' : '#c0392b');
  tri(ctx, 186, 368, 200, 368, 193, 392, m.has('pot-color') ? '#5d8aa8' : '#c0392b');
  circle(ctx, 193, 358, 7, '#ec407a');
  // shop sign (difference: sign-shape — circle left, star right)
  if (m.has('sign-shape')) {
    ctx.fillStyle = '#f2b134';
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 ? 6 : 13;
      const px = 95 + Math.cos(a) * r;
      const py = 196 + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    circle(ctx, 95, 196, 12, '#f2b134');
  }
}

// ---------------------------------------------------------------- Garden Dusk
function tree(ctx, x, y, s, leaf, apples, appleFill) {
  rect(ctx, x - 5 * s, y - 40 * s, 10 * s, 44 * s, '#5d4630');
  circle(ctx, x, y - 62 * s, 30 * s, leaf);
  circle(ctx, x - 22 * s, y - 48 * s, 20 * s, leaf);
  circle(ctx, x + 22 * s, y - 48 * s, 20 * s, leaf);
  const spots = [[-14, -70], [10, -78], [18, -52], [-4, -56]];
  for (let i = 0; i < apples; i += 1) circle(ctx, x + spots[i][0] * s, y + spots[i][1] * s, 4.5 * s, appleFill);
}

function paintGarden(ctx, m) {
  const sky = ctx.createLinearGradient(0, 0, 0, 250);
  sky.addColorStop(0, '#3b3f6b');
  sky.addColorStop(0.55, '#8e5a7a');
  sky.addColorStop(1, '#e8a06a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 250);
  // moon (difference: moon-flip — crescent faces the other way)
  circle(ctx, 468, 66, 22, '#f7e8b0');
  circle(ctx, m.has('moon-flip') ? 478 : 458, 60, 18, '#3b3f6b');
  // stars (difference: star-missing)
  const stars = [[60, 50], [130, 90], [220, 44], [330, 70], [400, 110], [90, 140]];
  stars.forEach(([sx, sy], i) => {
    if (m.has('star-missing') && i === 3) return;
    circle(ctx, sx, sy, 2.2, '#ffffff');
  });
  // ground
  const gnd = ctx.createLinearGradient(0, 250, 0, H);
  gnd.addColorStop(0, '#4a6b3f');
  gnd.addColorStop(1, '#2f4a2a');
  ctx.fillStyle = gnd;
  ctx.fillRect(0, 250, W, H - 250);
  // fence (difference: plank-missing)
  for (let i = 0; i < 14; i += 1) {
    if (m.has('plank-missing') && i === 9) continue;
    rect(ctx, 12 + i * 40, 262, 10, 34, '#7a5c3e');
  }
  rect(ctx, 0, 274, W, 6, '#8d6e4c');
  // trees (difference: apple-count on the left tree)
  tree(ctx, 96, 330, 1.15, '#3e6b34', m.has('apple-count') ? 2 : 4, '#e53935');
  tree(ctx, 452, 336, 1.3, '#356030', 3, '#fb8c00');
  // owl on the right tree (difference: owl-eyes — right owl sleeps)
  circle(ctx, 452, 252, 10, '#8d6e4c');
  if (m.has('owl-eyes')) {
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(446, 250);
    ctx.lineTo(452, 250);
    ctx.moveTo(454, 250);
    ctx.lineTo(460, 250);
    ctx.stroke();
  } else {
    circle(ctx, 449, 250, 2.4, '#263238');
    circle(ctx, 457, 250, 2.4, '#263238');
  }
  // pond + lily (difference: lily-missing)
  ctx.fillStyle = '#4a7a9e';
  ctx.beginPath();
  ctx.ellipse(280, 382, 96, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!m.has('lily-missing')) {
    ctx.fillStyle = '#66bb6a';
    ctx.beginPath();
    ctx.ellipse(246, 380, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, 246, 376, 4, '#f48fb1');
  }
  // bench (difference: cushion-color)
  rect(ctx, 150, 348, 84, 8, '#7a5c3e');
  rect(ctx, 150, 322, 84, 8, '#7a5c3e');
  rect(ctx, 156, 330, 8, 22, '#5d4630');
  rect(ctx, 220, 330, 8, 22, '#5d4630');
  rect(ctx, 158, 340, 68, 8, m.has('cushion-color') ? '#5d8aa8' : '#c0392b');
  // flowers (difference: flower-color — one row turns violet)
  const rows = [
    { y: 318, fill: '#ec407a', xs: [40, 70, 100, 300, 330] },
    { y: 402, fill: m.has('flower-color') ? '#8e5bb5' : '#f2b134', xs: [60, 110, 160, 420, 470, 510] },
  ];
  for (const row of rows) {
    for (const fx of row.xs) {
      circle(ctx, fx, row.y, 5, row.fill);
      circle(ctx, fx, row.y, 2, '#fff3e0');
    }
  }
  // butterflies (difference: butterfly-missing)
  const bf = (x, y, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.ellipse(x - 6, y, 6, 4, -0.5, 0, Math.PI * 2);
    ctx.ellipse(x + 6, y, 6, 4, 0.5, 0, Math.PI * 2);
    ctx.fill();
  };
  bf(190, 210, '#f2b134');
  if (!m.has('butterfly-missing')) bf(350, 196, '#5d8aa8');
  // fireflies (difference: firefly-count — right side has two fewer)
  const flies = [[70, 240], [160, 262], [260, 236], [370, 258], [480, 244], [520, 300]];
  flies.forEach(([fx, fy], i) => {
    if (m.has('firefly-count') && (i === 1 || i === 4)) return;
    circle(ctx, fx, fy, 3, '#ffee58');
  });
  // mushroom (difference: mushroom-size)
  const ms = m.has('mushroom-size') ? 1.7 : 1;
  rect(ctx, 502, 372, 8 * ms, 12 * ms, '#f5f0e6');
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.arc(506, 372, 12 * ms, Math.PI, 0);
  ctx.fill();
  // watering can (difference: can-color)
  rect(ctx, 320, 340, 26, 20, m.has('can-color') ? '#c0392b' : '#2e7d6b');
  tri(ctx, 346, 344, 362, 336, 348, 354, m.has('can-color') ? '#c0392b' : '#2e7d6b');
}

// ---------------------------------------------------------------- Abyss Night
function paintAbyss(ctx, m) {
  const sea = ctx.createLinearGradient(0, 0, 0, H);
  sea.addColorStop(0, '#0d2b45');
  sea.addColorStop(1, '#051626');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, W, H);
  // plankton (difference: plankton-count)
  const dots = [[40, 60], [120, 120], [200, 50], [300, 90], [390, 60], [480, 110], [90, 200], [250, 170], [420, 190], [520, 40]];
  dots.forEach(([dx, dy], i) => {
    if (m.has('plankton-count') && (i === 2 || i === 7 || i === 9)) return;
    circle(ctx, dx, dy, 2, 'rgba(160,220,255,0.7)');
  });
  // seabed
  ctx.fillStyle = '#123a52';
  ctx.beginPath();
  ctx.moveTo(0, 372);
  ctx.quadraticCurveTo(160, 352, 300, 368);
  ctx.quadraticCurveTo(440, 382, 560, 366);
  ctx.lineTo(560, H);
  ctx.lineTo(0, H);
  ctx.fill();
  // anglerfish (difference: lure-size)
  ctx.fillStyle = '#35586e';
  ctx.beginPath();
  ctx.ellipse(150, 150, 44, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  tri(ctx, 192, 150, 216, 134, 216, 166, '#35586e');
  circle(ctx, 128, 142, 5, '#e8f6ff');
  ctx.strokeStyle = '#35586e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(140, 128);
  ctx.quadraticCurveTo(150, 104, 168, 100);
  ctx.stroke();
  circle(ctx, 170, 100, m.has('lure-size') ? 11 : 6, '#ffe082');
  circle(ctx, 170, 100, m.has('lure-size') ? 20 : 12, 'rgba(255,224,130,0.2)');
  // jellyfish (difference: tentacle-count)
  ctx.fillStyle = 'rgba(186,140,230,0.85)';
  ctx.beginPath();
  ctx.arc(420, 130, 30, Math.PI, 0);
  ctx.fill();
  ctx.strokeStyle = 'rgba(186,140,230,0.85)';
  ctx.lineWidth = 3;
  const tentacles = m.has('tentacle-count') ? 3 : 5;
  for (let i = 0; i < tentacles; i += 1) {
    const tx = 398 + i * (44 / Math.max(1, tentacles - 1));
    ctx.beginPath();
    ctx.moveTo(tx, 130);
    ctx.quadraticCurveTo(tx - 6, 156, tx, 182);
    ctx.stroke();
  }
  // small fish school (difference: fish-stripe — one fish loses its stripe)
  const fishAt = (x, y, striped) => {
    ctx.fillStyle = '#f2a541';
    ctx.beginPath();
    ctx.ellipse(x, y, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    tri(ctx, x + 13, y, x + 22, y - 6, x + 22, y + 6, '#f2a541');
    if (striped) rect(ctx, x - 2, y - 6, 4, 12, '#37474f');
    circle(ctx, x - 8, y - 1, 2, '#263238');
  };
  fishAt(280, 240, true);
  fishAt(316, 262, !m.has('fish-stripe'));
  fishAt(246, 266, true);
  // eel (difference: eel-move — right eel sits lower)
  ctx.strokeStyle = '#66bb6a';
  ctx.lineWidth = 7;
  ctx.beginPath();
  const eelY = m.has('eel-move') ? 322 : 298;
  ctx.moveTo(60, eelY);
  ctx.quadraticCurveTo(100, eelY - 16, 140, eelY);
  ctx.quadraticCurveTo(170, eelY + 10, 196, eelY - 4);
  ctx.stroke();
  // coral (difference: coral-shade)
  ctx.strokeStyle = m.has('coral-shade') ? '#7e57c2' : '#ef5350';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(480, 378);
  ctx.lineTo(480, 340);
  ctx.moveTo(480, 356);
  ctx.lineTo(462, 338);
  ctx.moveTo(480, 348);
  ctx.lineTo(500, 330);
  ctx.stroke();
  // seaweed (difference: weed-height — right weed is shorter)
  ctx.strokeStyle = '#2e7d6b';
  ctx.lineWidth = 5;
  const weedTop = m.has('weed-height') ? 330 : 300;
  ctx.beginPath();
  ctx.moveTo(40, 384);
  ctx.quadraticCurveTo(30, (384 + weedTop) / 2, 42, weedTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(520, 384);
  ctx.quadraticCurveTo(512, 348, 522, 316);
  ctx.stroke();
  // treasure chest (difference: gem-color)
  rect(ctx, 250, 344, 64, 34, '#7a4a2b');
  ctx.fillStyle = '#8d5a33';
  ctx.beginPath();
  ctx.arc(282, 344, 32, Math.PI, 0);
  ctx.fill();
  rect(ctx, 276, 330, 12, 16, '#f2b134');
  circle(ctx, 282, 360, 6, m.has('gem-color') ? '#42a5f5' : '#ef5350');
  // starfish (difference: star-arm — right starfish has 4 arms)
  const arms = m.has('star-arm') ? 4 : 5;
  ctx.fillStyle = '#fb8c00';
  ctx.beginPath();
  for (let i = 0; i < arms * 2; i += 1) {
    const a = (i / (arms * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 7 : 16;
    const px = 150 + Math.cos(a) * r;
    const py = 378 + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  // shell (difference: shell-pattern — right shell has dots, left has stripes)
  ctx.fillStyle = '#f4c7b8';
  ctx.beginPath();
  ctx.arc(390, 384, 16, Math.PI, 0);
  ctx.fill();
  if (m.has('shell-pattern')) {
    circle(ctx, 382, 376, 2.4, '#b56a4a');
    circle(ctx, 392, 372, 2.4, '#b56a4a');
    circle(ctx, 400, 378, 2.4, '#b56a4a');
  } else {
    ctx.strokeStyle = '#b56a4a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(380, 384);
    ctx.lineTo(384, 372);
    ctx.moveTo(390, 384);
    ctx.lineTo(390, 370);
    ctx.moveTo(400, 384);
    ctx.lineTo(398, 372);
    ctx.stroke();
  }
  // pearl in open shell (difference: pearl-missing)
  ctx.fillStyle = '#d9a05b';
  ctx.beginPath();
  ctx.ellipse(70, 392, 20, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!m.has('pearl-missing')) circle(ctx, 70, 386, 6, '#ffffff');
  // bubbles (difference: bubble-missing — middle bubble gone)
  ctx.strokeStyle = 'rgba(180,230,255,0.8)';
  ctx.lineWidth = 2;
  const bubbles = [[210, 300, 6], [222, 272, 8], [212, 240, 5], [500, 240, 7], [512, 210, 5]];
  bubbles.forEach(([bx, by, br], i) => {
    if (m.has('bubble-missing') && i === 1) return;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.stroke();
  });
}

// Difference registries: id + panel-local centre + hit radius + a short
// label the complete screen can list. Order matches the painters above.
const HARBOR_DIFFS = [
  { id: 'sun-size', x: 90, y: 78, r: 40, label: 'The sun grew' },
  { id: 'cloud-missing', x: 382, y: 92, r: 34, label: 'A cloud vanished' },
  { id: 'bird-missing', x: 312, y: 138, r: 22, label: 'One bird flew off' },
  { id: 'sail-color', x: 150, y: 300, r: 32, label: 'A sail changed colour' },
  { id: 'stripe-count', x: 470, y: 205, r: 28, label: 'The lighthouse gained a stripe' },
  { id: 'flag-missing', x: 478, y: 146, r: 22, label: 'The flag is gone' },
  { id: 'crate-missing', x: 99, y: 348, r: 28, label: 'A crate was taken' },
  { id: 'buoy-color', x: 332, y: 344, r: 24, label: 'The buoy changed colour' },
  { id: 'fish-missing', x: 244, y: 330, r: 24, label: 'The leaping fish is gone' },
  { id: 'post-missing', x: 405, y: 404, r: 20, label: 'A pier post is missing' },
  { id: 'lamp-dark', x: 470, y: 163, r: 18, label: 'The lamp went dark' },
  { id: 'crest-extra', x: 519, y: 294, r: 22, label: 'An extra wave crest' },
];

const MARKET_DIFFS = [
  { id: 'cloud-shape', x: 310, y: 84, r: 38, label: 'The cloud stretched' },
  { id: 'chimney-bird', x: 307, y: 110, r: 20, label: 'The chimney bird left' },
  { id: 'cat-color', x: 122, y: 134, r: 24, label: 'The cat changed colour' },
  { id: 'shutter-open', x: 251, y: 214, r: 26, label: 'The shutters opened' },
  { id: 'sign-shape', x: 95, y: 196, r: 20, label: 'The sign became a star' },
  { id: 'awning-color', x: 277, y: 238, r: 30, label: 'An awning changed colour' },
  { id: 'apple-count', x: 254, y: 294, r: 22, label: 'One apple is missing' },
  { id: 'lantern-missing', x: 280, y: 236, r: 22, label: 'A lantern is gone' },
  { id: 'bunting-missing', x: 124, y: 352, r: 20, label: 'A bunting flag is gone' },
  { id: 'barrel-count', x: 453, y: 372, r: 24, label: 'A barrel was taken' },
  { id: 'wheel-spokes', x: 330, y: 372, r: 26, label: 'The wheel gained spokes' },
  { id: 'pot-color', x: 193, y: 376, r: 22, label: 'The flower pot changed colour' },
];

const GARDEN_DIFFS = [
  { id: 'moon-flip', x: 468, y: 66, r: 28, label: 'The moon flipped' },
  { id: 'star-missing', x: 330, y: 70, r: 16, label: 'A star went out' },
  { id: 'plank-missing', x: 377, y: 278, r: 20, label: 'A fence plank is missing' },
  { id: 'apple-count', x: 96, y: 268, r: 32, label: 'The tree lost apples' },
  { id: 'owl-eyes', x: 452, y: 250, r: 18, label: 'The owl fell asleep' },
  { id: 'lily-missing', x: 246, y: 380, r: 22, label: 'The lily pad is gone' },
  { id: 'cushion-color', x: 192, y: 344, r: 26, label: 'The bench cushion changed' },
  { id: 'flower-color', x: 285, y: 402, r: 30, label: 'A flower row changed colour' },
  { id: 'butterfly-missing', x: 350, y: 196, r: 20, label: 'A butterfly flew off' },
  { id: 'firefly-count', x: 275, y: 250, r: 30, label: 'Two fireflies went dark' },
  { id: 'mushroom-size', x: 506, y: 372, r: 24, label: 'The mushroom grew' },
  { id: 'can-color', x: 333, y: 350, r: 24, label: 'The watering can changed' },
];

const ABYSS_DIFFS = [
  { id: 'plankton-count', x: 270, y: 75, r: 34, label: 'Plankton thinned out' },
  { id: 'lure-size', x: 170, y: 100, r: 22, label: 'The lure glows bigger' },
  { id: 'tentacle-count', x: 420, y: 156, r: 32, label: 'The jellyfish lost tentacles' },
  { id: 'fish-stripe', x: 316, y: 262, r: 22, label: 'A fish lost its stripe' },
  { id: 'eel-move', x: 128, y: 306, r: 30, label: 'The eel sank lower' },
  { id: 'coral-shade', x: 482, y: 354, r: 26, label: 'The coral changed shade' },
  { id: 'weed-height', x: 40, y: 340, r: 26, label: 'The seaweed shrank' },
  { id: 'gem-color', x: 282, y: 356, r: 24, label: 'The chest gem changed' },
  { id: 'star-arm', x: 150, y: 378, r: 24, label: 'The starfish lost an arm' },
  { id: 'shell-pattern', x: 390, y: 378, r: 22, label: 'The shell pattern changed' },
  { id: 'pearl-missing', x: 70, y: 388, r: 20, label: 'The pearl is gone' },
  { id: 'bubble-missing', x: 222, y: 272, r: 20, label: 'A bubble popped' },
];

export const SCENE_ART = [
  { paint: paintHarbor, diffs: HARBOR_DIFFS },
  { paint: paintMarket, diffs: MARKET_DIFFS },
  { paint: paintGarden, diffs: GARDEN_DIFFS },
  { paint: paintAbyss, diffs: ABYSS_DIFFS },
];

/** Paint one panel of a scene. `mutated` is a Set of difference ids. */
export function paintPanel(ctx, sceneIndex, mutated) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
  ctx.clip();
  SCENE_ART[sceneIndex].paint(ctx, mutated);
  ctx.restore();
}

/** The difference list of a scene (panel-local centres and hit radii). */
export function sceneDiffs(sceneIndex) {
  return SCENE_ART[sceneIndex].diffs;
}
