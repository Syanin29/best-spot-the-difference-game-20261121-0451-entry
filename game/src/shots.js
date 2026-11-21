// The screenshot scenes behind ?shot=play|start|abyss|complete. Each one
// plays the real rules: it clicks actual differences through world.clickAt
// and runs the tide timer, so the frame is what a real hunt looks like —
// markers on the finds, several differences still unfound, and the
// remaining counter mid-count. The same seed always gives the same frame.

import { STEP } from './config.js';
import { SCREEN_PLAY, SCREEN_TITLE, SCREEN_VICTORY } from './render.js';

function runSeconds(world, seconds) {
  const steps = Math.round(seconds / STEP);
  for (let i = 0; i < steps; i += 1) world.step(STEP);
}

function findFirst(world, count) {
  const diffs = world.diffs();
  for (let i = 0; i < count && i < diffs.length; i += 1) {
    world.clickAt(diffs[i].x, diffs[i].y);
    runSeconds(world, 0.4);
  }
}

/**
 * Set `world` to the named scene and return the screen to draw over it.
 * play: scene 1, 5 of 12 found, 7 remaining, timer mid-tide (the cover).
 * start: the title over scene 1. abyss: scene 4, 4 of 12 found.
 * complete: all four scenes cleared by playing every difference.
 */
export function stageShot(name, world) {
  world.reset();
  if (name === 'start') {
    runSeconds(world, 2);
    return { screen: SCREEN_TITLE, best: 0 };
  }
  if (name === 'abyss') {
    world.startScene(3);
    findFirst(world, 4);
    world.clickAt(40, 40); // one wrong click, as a real hunt has
    runSeconds(world, 18);
    return { screen: SCREEN_PLAY, best: 0 };
  }
  if (name === 'complete') {
    for (let scene = 0; scene < 4; scene += 1) {
      world.startScene(scene);
      findFirst(world, world.diffs().length);
      runSeconds(world, 1);
    }
    return { screen: SCREEN_VICTORY, best: world.state.score };
  }
  // play (default): the cover frame.
  findFirst(world, 5);
  runSeconds(world, 14);
  return { screen: SCREEN_PLAY, best: 0 };
}
