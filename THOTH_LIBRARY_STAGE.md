# Adventure Storyboard — Thoth’s Library

The old **Make Sentences** stage has been replaced by a platform game set in Thoth’s magical library. The library is now Stage 1.

## Goal

Restore ten ancient scrolls. On every level, the child looks at an event card and collects the word tablets in the correct sentence order.

Example:

`Nefertiti → wrote → a letter → yesterday`

Picking a tablet out of order does not remove it. The game does not reveal the correct next word, so the learner must work out the sentence independently. A completed scroll lights up with golden light and opens the next level.

## Controls

- Move: `A` / `D` or `←` / `→`
- Jump: `W`, `↑`, or `Space`
- Drop from a platform: `S` or `↓`
- Touch screens: the Left, Down, Jump, and Right buttons below the scene

## Game flow

1. Stage 1 — guide the magic scarab through Thoth’s library and restore ten sentence scrolls.
2. Stage 2 — put Nefertiti’s ten event cards in the correct order.
3. Stage 3 — read the completed story.

## Main files

- `src/games/storyboard/ThothScrollRunner.tsx` — movement, jumping, collisions, tablet order, scoring, and level progress.
- `src/games/storyboard/ThothScrollRunner.module.css` — scene, magic scarab, tablets, scroll, and responsive controls.
- `public/images/thoth-library-platformer.png` — full-resolution generated artwork.
- `public/images/optimized/thoth-library-platformer.webp` — optimized game background.

## Local launch

Run `dev.cmd` from the project folder. When Vite prints the local address, open it in a browser and select **Adventure Storyboard**. Thoth’s Library opens as Stage 1.
