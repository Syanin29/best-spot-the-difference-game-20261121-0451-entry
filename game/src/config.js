// TWIN TIDES — Echo-Ring Spot Hunt. Shared constants for every module.
// The playfield is a 1280x720 logical canvas: a header band on top, two
// picture panels side by side below it, and a footer band with the controls.

export const VIEW = { width: 1280, height: 720 };
export const PANEL = { width: 560, height: 420, leftX: 36, rightX: 684, topY: 118 };
export const HEADER = { height: 104 };
export const FOOTER_Y = 556;

export const STEP = 1 / 60;
export const SCENE_SECONDS = 90;
export const HINTS_PER_SCENE = 3;
export const WRONG_PENALTY_SECONDS = 5;
export const WRONG_PENALTY_SCORE = 40;
export const FIND_SCORE = 120;
export const COMBO_BONUS = 15;
export const TIME_BONUS_PER_SECOND = 4;
export const BEST_KEY = 'twin-tides-best-v1';

// Four hand-built scenes, easiest first. Each hides exactly 12 differences,
// so a full hunt is 48 finds. Later scenes hide smaller, quieter changes.
export const SCENES = [
  { name: 'Harbor Dawn', subtitle: 'Scene 1 · warm-up tide', diffCount: 12 },
  { name: 'Market Noon', subtitle: 'Scene 2 · busy stalls', diffCount: 12 },
  { name: 'Garden Dusk', subtitle: 'Scene 3 · fading light', diffCount: 12 },
  { name: 'Abyss Night', subtitle: 'Scene 4 · deep dark', diffCount: 12 },
];

export const TOTAL_DIFFERENCES = SCENES.reduce((sum, s) => sum + s.diffCount, 0);
