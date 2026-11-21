# TWIN TIDES — Echo-Ring Spot Hunt

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Study two near-identical seaside dioramas side by side and click every difference before the tide timer runs out — 12 per scene across 4 scenes, 48 in all. A find rings both pictures at once (the Echo Ring); wrong clicks cost 5 seconds; three hints per scene pulse around a difference you missed. Scenes rise in difficulty: Harbor Dawn, Market Noon, Garden Dusk, Abyss Night. Every picture is painted in code on a canvas — no image files, no library, no network request.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. Mouse: click either picture to mark a difference. Keyboard: arrows or WASD move the magnifier, Enter marks, H asks for a hint, P pauses, R restarts.

## Screenshots

The four screenshots are staged scenes from the game's own code (`?shot=play|start|abyss|complete&seed=1`): the Harbor Dawn hunt mid-way (5 found, 7 remaining), the title, the Abyss Night hunt, and the all-48-found victory screen. Each scene plays the real rules through `world.clickAt`, so the frames are what a real hunt looks like.

---

<sub>Entered on [make.fun](https://make.fun/?ref=quadro-7&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
