# Mario Theft Auto

A browser-based 3D open-world driving/walking game (three.js) with a GTA-style loading screen.
Runs on **PC** (keyboard + mouse) and **phones / tablets** (on-screen touch controls) — the site detects which one it is opened on.

> Needs an internet connection the first time it loads: three.js r128, its GLTFLoader and a few helper
> scripts/textures are fetched from public CDNs (cdnjs, jsDelivr, GitHub raw).

## Run it

| How | Steps |
|---|---|
| **Double-click** | Open `index.html` in Chrome / Edge / Firefox / Safari. Works straight from disk. |
| **Local server** (optional) | In this folder run `python3 -m http.server 8000`, then open <http://localhost:8000> |
| **Host it** | Upload the whole folder to any static host (GitHub Pages, Netlify, Cloudflare Pages, any web server). |
| **One single file** | `python3 tools/build_single.py` → `mario-theft-auto-single.html` (everything inlined) |

## Controls

**PC:** `W A S D` move · mouse look (drag / pointer lock) · `Space` jump (handbrake in a car) · `Shift` run · `C` crouch ·
`F` enter/exit vehicle · `M` map size · `N` time of day · while driving: `H` horn · `R` radio · `Y` repair · `T` reset trip

**Phone / tablet:** left thumb = joystick (push past the outer ring to run) · right thumb = look · pinch = zoom ·
buttons: JUMP, ENTER (vehicle), CROUCH, RUN (toggle), HORN, plus map / radio / day-night / repair / fullscreen / settings.

The ⚙ button opens settings: look sensitivity, control scheme (auto / touch / keyboard), graphics quality,
fullscreen and a **performance overlay** (FPS, JS time per frame, draw calls, triangles and a bottleneck verdict).

URL options: `?controls=touch` or `?controls=keyboard` (force a scheme) · `?perf=1` (show the performance overlay)

## Device detection

`js/core/device.js` runs first and exposes `window.DEVICE`:
`type` (`phone` / `tablet` / `desktop`), `os`, `browser`, `touch`, `controls` (`touch` / `keyboard`), `touchUI`, `label`.
It also tags `<html>` with `data-device`, `data-os`, `data-controls`, `data-orient`. iPadOS (which pretends to be a Mac),
Android tablets and touch-screen laptops are handled; a PC that gets touched is offered "Enable touch controls".
Phones get lighter default graphics and a few HUD tweaks (see `js/apps/game.js`, search for `DEVICE`).

## Folder structure

```
index.html                 page skeleton: markup + <script>/<link> tags. Script ORDER matters (see below).
css/
  solo-mode.css            game-only mode (hides the fake desktop)
  desktop-shell.css        the simulated desktop / window styles
  loader.css               GTA-style loading screen
js/
  core/device.js           device detection (window.DEVICE)
  loader/                  loading screen: lite mode, 3D tilt/parallax, fail watchdog, loader logic
  shell/                   the simulated OS: helpers, branding, icons, audio, desktop/windows, boot (solo mode + game start)
  apps/                    registry.js + one file per in-OS app. THE GAME IS js/apps/game.js
  touch/touch-controls.js  on-screen controls, settings panel, performance overlay
assets/
  img/loader/              loading-screen slides (3 backgrounds + 3 cut-out subjects)
  audio/                   loading-screen music (replace the MP3 to change the track; see README.txt there)
  data/                    big base64 blobs kept as .js on purpose (see below)
tools/build_single.py      rebuild one standalone HTML file
```

### Why the data is `.js` and not separate image/audio files
`assets/data/*.js` hold textures, sounds, the player model and the road/radio data as base64. They are JavaScript
(not loose files) so the game still works when you open `index.html` straight from disk — browsers block WebGL textures
and `fetch()` from separate files on `file://`. `images.js` / `audio.js` define `window.MTA_DATA`, which the game code
reads (`MTA_DATA.img0`, …); the other four fill the `<script type="text/plain">` placeholders in `index.html`.

### Script order
These are classic scripts that share one global scope, so order matters: `assets/data/images.js` + `audio.js` →
`js/shell/*` → `js/apps/registry.js` → each app → `js/shell/boot.js` → the remaining data blobs → `js/touch/touch-controls.js`.
Keep that order if you add files.

## Where to change things

| I want to… | Look in |
|---|---|
| Tweak the game, world, cars, HUD | `js/apps/game.js` (search the `/* … */` section comments) |
| Grass density / look | `js/apps/game.js` → `const GR=` (`mkLayer({W,cs,nb,segs,…})`; `LOWQ` = low-end settings) |
| Graphics quality levels | `js/apps/game.js` → `const GV=` / `gvApply` |
| Touch layout, joystick, buttons | `js/touch/touch-controls.js` (CSS is at the top of that file) |
| Loading screen slides | `index.html` (`#cinemaScene0…2`), `css/loader.css`, `assets/img/loader/` |
| Device rules | `js/core/device.js` |

## Notes
- **HDR is disabled** (the game's post-processing HDR mode never switches on; `setHDR` in `js/apps/game.js`).
- iPhone **Low Power Mode** caps browsers at 30 fps — turn it off when testing performance.
- Fullscreen isn't available on iPhone Safari; use Share → *Add to Home Screen* to play fullscreen.
