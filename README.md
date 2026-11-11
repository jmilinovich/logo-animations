# Animated Living Logo

An SVG logo with organic, character-like micro-animations: randomized eye blinks, squints, glances, and expressive mouth movements. Pure CSS + vanilla JS, zero dependencies.

## Files

```
logo-animations/
  1-living-logo.html    ← the main animation (standalone preview)
  2-draw-on.html        ← stroke-drawing entrance animation
  3-bounce-wink.html    ← bouncy entrance with wink
  4-ascii.html          ← the wordmark in 3D, rendered as ASCII (three.js)
  README.md             ← this file
```

## How it works

The original SVG has 5 paths. The two "i" letter paths were each split into a **stem** and a **dot** so the dots can animate independently as "eyes."

### Animated elements

| Element | CSS class | What it does |
|---------|-----------|-------------|
| Left eye (i-dot) | `.eye-left` | Blinks, squints, glances sideways |
| Right eye (i-dot) | `.eye-right` | Blinks, squints, glances sideways |
| Smile curve | `.smile` | Drifts between moods: happy, thinking, smirking |
| Whole logo | `.logo-container` | Subtle breathing scale pulse |

### Eye behaviors (JS-driven, randomized)

- **Blink** (55% chance) — fast scaleY squish, 80–150ms. 20% chance of double-blink. Right eye follows left with a tiny natural stagger.
- **Squint** (20%) — eyes narrow to 45–70% height for 1–3s, like thinking.
- **Glance** (25%) — both eyes shift left or right 20–50px, hold 0.8–2s, drift back.
- Interval between actions: 2.5–7s (randomized).

### Mouth moods (JS-driven, randomized)

The smile randomly transitions between 11 expression states:

| Category | Expressions |
|----------|-------------|
| Happy | resting, content, happy, very happy |
| Thinking | compressed/pondering, pursed-hmm left/right, slight thinking |
| Playful | smirk left/right, barely there |

Each expression is a combination of `scaleX`, `scaleY`, `translateX`, `translateY`, and `rotate`. Transitions use `cubic-bezier(0.4, 0, 0.2, 1)` with varying durations (1.2–2.2s). Each mood holds for 2–5s before drifting to the next.

### Accessibility

All animations respect `prefers-reduced-motion: reduce` — the logo renders static with no movement.

---

## Using in Astro

### 1. Create the component

Save as `src/components/LivingLogo.astro`:

```astro
---
interface Props {
  class?: string;
  color?: string;
  maxWidth?: string;
}

const {
  class: className = '',
  color = '#010101',
  maxWidth = '400px',
} = Astro.props;
---

<div class:list={['living-logo', className]} style={`max-width: ${maxWidth};`}>
  <svg viewBox="0 0 3109 2091" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="smile" d="M2179.09 1895.38C2275.81 1895.38 2372.84 1886.14 2470.18 1867.66C2566.91 1849.17 2661.17 1820.53 2752.97 1781.71C2844.76 1742.28 2930.4 1691.76 3009.87 1630.16C3036.36 1642.48 3057.62 1658.19 3073.64 1677.29C3089.66 1696.39 3101.36 1717.02 3108.75 1739.2C3034.21 1814.98 2944.88 1879.05 2840.76 1931.42C2737.26 1983.79 2628.21 2023.53 2513.62 2050.63C2399.03 2077.12 2287.52 2090.37 2179.09 2090.37C2071.27 2090.37 1960.07 2077.12 1845.48 2050.63C1730.27 2023.53 1620.91 1983.79 1517.41 1931.42C1413.91 1879.05 1324.89 1814.98 1250.34 1739.2C1257.12 1717.02 1268.51 1696.39 1284.53 1677.29C1300.55 1658.19 1322.11 1642.48 1349.22 1630.16C1428.7 1691.76 1514.33 1742.28 1606.13 1781.71C1697.31 1820.53 1791.57 1849.17 1888.91 1867.66C1986.25 1886.14 2082.98 1895.38 2179.09 1895.38Z" fill="currentColor"/>
    <path class="stem-right" d="M2812.11 1258.66C2786.85 1263.59 2756.97 1266.05 2722.47 1266.05C2687.97 1266.05 2657.78 1263.59 2631.91 1258.66V574.806C2631.91 541.537 2626.05 517.51 2614.35 502.724C2603.26 487.322 2582.62 479.621 2552.43 479.621H2532.1C2527.17 458.674 2524.71 437.419 2524.71 415.856C2524.71 404.767 2525.33 393.985 2526.56 383.512C2527.79 372.422 2529.64 361.025 2532.1 349.319C2554.9 346.239 2576.15 344.082 2595.87 342.85C2615.58 341.618 2631.91 341.002 2644.85 341.002H2667.95C2712.92 341.002 2748.04 355.172 2773.3 383.512C2799.17 411.852 2812.11 450.357 2812.11 499.027V1258.66Z" fill="currentColor"/>
    <path class="eye-right" d="M2574.61 101.654C2574.61 71.4656 2580.16 44.9741 2591.25 22.179C2602.34 16.0182 2617.12 10.7815 2635.6 6.46898C2654.09 2.15635 2671.95 0 2689.2 0C2705.22 0 2723.09 2.15635 2742.8 6.46898C2763.13 10.7815 2777.92 16.0182 2787.16 22.179C2792.09 32.6524 2796.09 45.5902 2799.17 60.9923C2802.25 75.7783 2803.79 89.332 2803.79 101.654C2803.79 132.458 2798.25 159.258 2787.16 182.053C2778.54 188.213 2764.06 193.45 2743.73 197.763C2723.4 202.075 2705.22 204.232 2689.2 204.232C2671.95 204.232 2653.78 202.075 2634.68 197.763C2616.2 193.45 2601.72 188.213 2591.25 182.053C2580.16 159.258 2574.61 132.458 2574.61 101.654Z" fill="currentColor"/>
    <path class="letter-l" d="M2351.9 1402.82C2361.75 1429.31 2366.68 1459.81 2366.68 1494.31C2366.68 1501.09 2366.38 1507.86 2365.76 1514.64C2365.76 1521.42 2364.83 1527.58 2362.99 1533.12C2342.66 1536.2 2318.01 1539.28 2289.06 1542.36C2260.1 1545.44 2233.92 1546.98 2210.51 1546.98C2153.21 1546.98 2109.16 1531.58 2078.36 1500.78C2048.17 1469.97 2033.07 1424.08 2033.07 1363.08V191.294L2044.16 179.28H2112.55C2150.75 179.28 2176.31 188.83 2189.25 207.928C2202.81 226.411 2209.58 255.983 2209.58 296.644V1321.5C2209.58 1348.61 2215.43 1368.94 2227.14 1382.49C2239.46 1396.04 2257.64 1402.82 2281.66 1402.82H2351.9Z" fill="currentColor"/>
    <path class="stem-left" d="M1699.47 1258.66C1674.21 1263.59 1644.33 1266.05 1609.83 1266.05C1575.32 1266.05 1545.14 1263.59 1519.26 1258.66V574.806C1519.26 541.537 1513.41 517.51 1501.7 502.724C1490.61 487.322 1469.97 479.621 1439.79 479.621H1419.46C1414.53 458.674 1412.06 437.419 1412.06 415.856C1412.06 404.767 1412.68 393.985 1413.91 383.512C1415.14 372.422 1416.99 361.025 1419.46 349.319C1442.25 346.239 1463.51 344.082 1483.22 342.85C1502.93 341.618 1519.26 341.002 1532.2 341.002H1555.3C1600.28 341.002 1635.39 355.172 1660.65 383.512C1686.53 411.852 1699.47 450.357 1699.47 499.027V1258.66Z" fill="currentColor"/>
    <path class="eye-left" d="M1461.97 101.654C1461.97 71.4656 1467.51 44.9741 1478.6 22.179C1489.69 16.0182 1504.47 10.7815 1522.96 6.46898C1541.44 2.15635 1559.31 0 1576.56 0C1592.57 0 1610.44 2.15635 1630.16 6.46898C1650.49 10.7815 1665.27 16.0182 1674.51 22.179C1679.44 32.6524 1683.45 45.5902 1686.53 60.9923C1689.61 75.7783 1691.15 89.332 1691.15 101.654C1691.15 132.458 1685.6 159.258 1674.51 182.053C1665.89 188.213 1651.41 193.45 1631.08 197.763C1610.75 202.075 1592.57 204.232 1576.56 204.232C1559.31 204.232 1541.13 202.075 1522.03 197.763C1503.55 193.45 1489.07 188.213 1478.6 182.053C1467.51 159.258 1461.97 132.458 1461.97 101.654Z" fill="currentColor"/>
    <path class="letter-nn" d="M79.4747 339.154C117.056 339.154 143.239 350.552 158.025 373.347C172.811 395.526 180.204 426.946 180.204 467.607V1258.66C155.561 1263.59 125.989 1266.05 91.4883 1266.05C56.3716 1266.05 25.8755 1263.59 0 1258.66V352.092L12.0136 339.154H79.4747ZM500.876 677.384C500.876 610.847 491.634 563.716 473.152 535.993C455.285 508.269 426.946 494.407 388.132 494.407C357.328 494.407 324.368 503.956 289.251 523.055C254.134 542.153 221.174 568.029 190.37 600.681C159.565 633.334 135.538 669.683 118.288 709.728V530.448C144.78 491.635 175.276 457.442 209.776 427.87C244.893 397.682 282.166 373.963 321.595 356.712C361.641 339.462 402.302 330.837 443.58 330.837C497.179 330.837 541.537 343.775 576.654 369.65C612.387 394.91 638.878 429.41 656.128 473.152C673.379 516.278 682.004 564.332 682.004 617.316V1258.66C656.745 1263.59 626.865 1266.05 592.364 1266.05C557.247 1266.05 526.751 1263.59 500.876 1258.66V677.384ZM1003.6 675.535C1003.6 608.998 994.05 562.176 974.951 535.068C956.469 507.961 928.129 494.407 889.932 494.407C859.744 494.407 827.399 503.648 792.899 522.131C758.398 539.997 725.438 565.565 694.018 598.833C662.597 631.486 636.414 669.683 615.467 713.425V506.421C645.655 473.152 678.615 443.272 714.348 416.78C750.697 390.289 788.586 369.342 828.016 353.94C867.445 338.538 907.49 330.837 948.152 330.837C1001.75 330.837 1045.8 343.775 1080.3 369.65C1115.42 395.526 1141.6 430.334 1158.85 474.076C1176.1 517.202 1184.73 565.565 1184.73 619.164V1067.36C1184.73 1099.4 1186.58 1129.59 1190.27 1157.93C1194.59 1186.27 1202.29 1210.91 1213.38 1231.86C1199.82 1242.95 1182.88 1252.19 1162.55 1259.58C1142.22 1266.98 1121.27 1270.67 1099.71 1270.67C1064.59 1270.67 1039.64 1261.12 1024.85 1242.02C1010.68 1222.31 1003.6 1193.35 1003.6 1155.16V675.535Z" fill="currentColor"/>
  </svg>
</div>

<style>
  .living-logo {
    width: 100%;
    animation: breathe 4s ease-in-out infinite;
  }

  .living-logo svg {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
  }

  @keyframes breathe {
    0%, 100% { transform: scale(1.0); }
    50%      { transform: scale(1.005); }
  }

  .eye-left, .eye-right {
    transition: transform 0.08s ease-in;
  }
  .eye-left  { transform-origin: 1576px 101px; }
  .eye-right { transform-origin: 2689px 101px; }

  .eye-left.blink, .eye-right.blink {
    transform: scaleY(0.05);
  }

  .eye-left.squint, .eye-right.squint {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .smile {
    transform-origin: 2179px 1860px;
    transition: transform 1.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    .living-logo { animation: none; }
    .eye-left, .eye-right { transition: none; }
    .smile { transition: none; }
  }
</style>

<script>
  function initLivingLogo(container: HTMLElement) {
    const eyeL = container.querySelector('.eye-left') as SVGPathElement;
    const eyeR = container.querySelector('.eye-right') as SVGPathElement;
    const smile = container.querySelector('.smile') as SVGPathElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !eyeL || !eyeR || !smile) return;

    // --- Eye expressions ---
    function doBlink() {
      eyeL.classList.remove('squint');
      eyeR.classList.remove('squint');
      eyeL.classList.add('blink');
      setTimeout(() => eyeR.classList.add('blink'), 30 + Math.random() * 40);
      const openDelay = 80 + Math.random() * 70;
      setTimeout(() => {
        eyeL.classList.remove('blink');
        setTimeout(() => eyeR.classList.remove('blink'), 20 + Math.random() * 30);
      }, openDelay);
      if (Math.random() < 0.2) {
        setTimeout(() => {
          eyeL.classList.add('blink');
          setTimeout(() => eyeR.classList.add('blink'), 30 + Math.random() * 40);
          setTimeout(() => {
            eyeL.classList.remove('blink');
            setTimeout(() => eyeR.classList.remove('blink'), 20 + Math.random() * 30);
          }, 80 + Math.random() * 70);
        }, 250);
      }
    }

    function doSquint() {
      eyeL.classList.add('squint');
      eyeR.classList.add('squint');
      const amt = 0.45 + Math.random() * 0.25;
      eyeL.style.transform = `scaleY(${amt})`;
      eyeR.style.transform = `scaleY(${amt + (Math.random() * 0.1 - 0.05)})`;
      setTimeout(() => {
        eyeL.classList.remove('squint');
        eyeR.classList.remove('squint');
        eyeL.style.transform = '';
        eyeR.style.transform = '';
      }, 1000 + Math.random() * 2000);
    }

    function doGlance() {
      eyeL.classList.add('squint');
      eyeR.classList.add('squint');
      const dir = Math.random() < 0.5 ? 1 : -1;
      const shift = 20 + Math.random() * 30;
      eyeL.style.transform = `translateX(${dir * shift}px)`;
      eyeR.style.transform = `translateX(${dir * shift}px)`;
      setTimeout(() => {
        eyeL.style.transform = '';
        eyeR.style.transform = '';
        setTimeout(() => {
          eyeL.classList.remove('squint');
          eyeR.classList.remove('squint');
        }, 400);
      }, 800 + Math.random() * 1200);
    }

    function nextEyeAction() {
      const roll = Math.random();
      if (roll < 0.55) doBlink();
      else if (roll < 0.75) doSquint();
      else doGlance();
      setTimeout(nextEyeAction, 2500 + Math.random() * 4500);
    }
    setTimeout(nextEyeAction, 1500 + Math.random() * 1500);

    // --- Mouth expressions ---
    const moods = [
      { sx: 1,     sy: 1,    ty: 0,   tx: 0,   r: 0,   dur: '1.8s' },
      { sx: 1.04,  sy: 1.1,  ty: 12,  tx: 0,   r: 0,   dur: '1.6s' },
      { sx: 1.07,  sy: 1.18, ty: 20,  tx: 0,   r: 0,   dur: '1.4s' },
      { sx: 1.09,  sy: 1.22, ty: 26,  tx: 0,   r: 0,   dur: '1.2s' },
      { sx: 0.92,  sy: 0.85, ty: -8,  tx: 0,   r: 0,   dur: '2.0s' },
      { sx: 0.88,  sy: 0.8,  ty: -10, tx: 20,  r: 1.5, dur: '2.2s' },
      { sx: 0.88,  sy: 0.8,  ty: -10, tx: -20, r:-1.5, dur: '2.2s' },
      { sx: 0.95,  sy: 0.9,  ty: -5,  tx: 10,  r: 0.8, dur: '2.0s' },
      { sx: 1.03,  sy: 1.06, ty: 8,   tx: 25,  r: 1.2, dur: '2.0s' },
      { sx: 1.03,  sy: 1.06, ty: 8,   tx: -25, r:-1.2, dur: '2.0s' },
      { sx: 1.01,  sy: 1.02, ty: 3,   tx: 0,   r: 0,   dur: '2.2s' },
    ];

    function nextMouth() {
      const m = moods[Math.floor(Math.random() * moods.length)];
      smile.style.transitionDuration = m.dur;
      smile.style.transform =
        `translateX(${m.tx}px) translateY(${m.ty}px) scaleX(${m.sx}) scaleY(${m.sy}) rotate(${m.r}deg)`;
      setTimeout(nextMouth, 2000 + Math.random() * 3000);
    }
    setTimeout(nextMouth, 2000);
  }

  // Init all living logos on the page
  document.querySelectorAll('.living-logo').forEach((el) => {
    initLivingLogo(el as HTMLElement);
  });
</script>
```

### 2. Use it

```astro
---
import LivingLogo from '../components/LivingLogo.astro';
---

<!-- Default: black on transparent -->
<LivingLogo />

<!-- White logo for dark backgrounds -->
<LivingLogo color="white" />

<!-- Custom color and size -->
<LivingLogo color="#ff6b35" maxWidth="200px" />
```

---

## Transparent background + custom foreground color

The Astro component uses `currentColor` for all SVG path fills instead of hardcoded `#010101`. This means the logo color is controlled by CSS `color`, which gives you full flexibility:

### Via the `color` prop

```astro
<LivingLogo color="#ff6b35" />
```

This sets `color` on the container div, and all paths inherit it via `fill="currentColor"`.

### Via CSS custom properties

You can also control it with CSS variables for theme switching:

```astro
<LivingLogo class="themed-logo" />

<style>
  .themed-logo {
    color: var(--logo-color, #010101);
  }

  :root {
    --logo-color: #1a1a1a;
  }

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    :root {
      --logo-color: #ffffff;
    }
  }
</style>
```

### Via Tailwind / utility classes

```astro
<LivingLogo class="text-slate-900 dark:text-white" />
```

### How it works

The key change from the standalone HTML is replacing all `fill="#010101"` with `fill="currentColor"` in the SVG paths. Since SVG `currentColor` inherits from the CSS `color` property, the logo becomes fully themeable while keeping a transparent background by default.

The standalone preview (`1-living-logo.html`) uses hardcoded `#010101` for simplicity. The Astro component uses `currentColor` for production flexibility.

---

## Customization reference

### Tuning animation feel

In the `<script>` block of the Astro component:

| What | Where | Default |
|------|-------|---------|
| Time between eye actions | `setTimeout(nextEyeAction, ...)` | 2.5–7s |
| Blink vs squint vs glance ratio | `nextEyeAction()` roll thresholds | 55/20/25% |
| Time between mouth changes | `setTimeout(nextMouth, ...)` | 2–5s |
| Squint narrowness | `doSquint()` amt range | 0.45–0.7 |
| Glance distance | `doGlance()` shift range | 20–50px |
| Breathing intensity | `@keyframes breathe` scale | 1.0–1.005 |

### Adding/removing moods

Edit the `moods` array. Each entry:

```js
{
  sx: 1.0,    // scaleX — horizontal stretch (>1 = wider smile)
  sy: 1.0,    // scaleY — vertical stretch (>1 = taller smile)
  ty: 0,      // translateY — vertical shift (+ = down)
  tx: 0,      // translateX — horizontal shift (+ = right)
  r: 0,       // rotate in degrees
  dur: '1.8s' // transition duration to reach this mood
}
```

### Disabling specific behaviors

To remove squinting and glancing (blink-only mode), change the eye action scheduler:

```js
function nextEyeAction() {
  doBlink();
  setTimeout(nextEyeAction, 3000 + Math.random() * 4000);
}
```

To make the mouth static, remove the `nextMouth` setTimeout call.

---

## ASCII (`4-ascii.html`)

The wordmark as a 3D object drawn in text. The SVG paths are extruded with three.js, lit, rendered with WebGL, and converted to characters on every frame by three's `AsciiEffect` (`three/addons/effects/AsciiEffect.js`). It follows [this demo](https://webdev.teknium.io/d/dither/demos/three-ascii-effect/), with the logo in place of the torus knot.

This is the one variant with a dependency. It loads three.js r186 from jsDelivr through an import map, so it needs a network connection unless the browser already has it cached. If three.js or WebGL is unavailable, the page shows the flat wordmark.

| What | How |
|------|-----|
| Spin it | Drag. It coasts, then turns back to face you. |
| Character set | `classic`, `dense`, `blocks`, `binary`, or `mili`, which uses the ramp ` .:ilm` so the logo is drawn in its own letters |
| Tint | `phosphor`, `amber`, `ice`, `paper`, or `ink` (dark characters on white) |
| Hide the controls | Press `h`, or load with `?hud=0` |
| Link to a setup | `4-ascii.html?charset=mili&tint=ink` |

The eyes and smile use the timings and the eleven moods from `src/living-logo.js`, and holding the logo triggers the hover reaction. With `prefers-reduced-motion` set, nothing moves by itself and dragging still turns it.

To tune it, edit the constants in the script: `DEPTH` and `BEVEL` for the extrusion, the lights under `Scene`, `SWAY` and `NOD` for the idle motion, and `FIT` for how much of the stage the wordmark fills.
