/**
 * Initialize living logo animations on a container element.
 * Adds eye blinks/squints/glances, mouth mood expressions,
 * eye tracking (mouse/touch/gyroscope), and hover/tap reactions.
 *
 * @param {Element} container - The .logo-container element wrapping the SVG
 * @returns {() => void} Cleanup function that cancels all pending timers and listeners
 */
export function initLivingLogo(container) {
  const eyeL = container.querySelector('.eye-left');
  const eyeR = container.querySelector('.eye-right');
  const smile = container.querySelector('.smile');
  const trackL = container.querySelector('.eye-track-left');
  const trackR = container.querySelector('.eye-track-right');
  const svgEl = container.querySelector('svg');

  if (!eyeL || !eyeR || !smile) return () => {};

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return () => {};

  const timers = [];
  const listeners = [];

  function schedule(fn, delay) {
    const id = setTimeout(fn, delay);
    timers.push(id);
    return id;
  }

  function listen(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    listeners.push({ target, event, handler, options });
  }

  // --- Eye expressions ---

  function doBlink() {
    eyeL.classList.remove('squint');
    eyeR.classList.remove('squint');
    eyeL.classList.add('blink');
    schedule(() => eyeR.classList.add('blink'), 30 + Math.random() * 40);

    const openDelay = 180 + Math.random() * 120;
    schedule(() => {
      eyeL.classList.remove('blink');
      schedule(() => eyeR.classList.remove('blink'), 30 + Math.random() * 40);
    }, openDelay);

    // 20% double-blink
    if (Math.random() < 0.2) {
      schedule(() => {
        eyeL.classList.add('blink');
        schedule(() => eyeR.classList.add('blink'), 30 + Math.random() * 40);
        schedule(() => {
          eyeL.classList.remove('blink');
          schedule(() => eyeR.classList.remove('blink'), 30 + Math.random() * 40);
        }, 180 + Math.random() * 120);
      }, 400);
    }
  }

  function doSquint() {
    eyeL.classList.add('squint');
    eyeR.classList.add('squint');
    const squintAmount = 0.45 + Math.random() * 0.25;
    eyeL.style.transform = `scaleY(${squintAmount})`;
    eyeR.style.transform = `scaleY(${squintAmount + (Math.random() * 0.1 - 0.05)})`;

    schedule(() => {
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

    schedule(() => {
      eyeL.style.transform = '';
      eyeR.style.transform = '';
      schedule(() => {
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
    schedule(nextEyeAction, 2500 + Math.random() * 4500);
  }

  schedule(nextEyeAction, 1500 + Math.random() * 1500);

  // --- Mouth expressions ---

  const moods = [
    // happy / open
    { sx: 1,    sy: 1,    ty: 0,   tx: 0,   r: 0,   dur: '1.8s' },  // resting
    { sx: 1.04, sy: 1.1,  ty: 12,  tx: 0,   r: 0,   dur: '1.6s' },  // content
    { sx: 1.07, sy: 1.18, ty: 20,  tx: 0,   r: 0,   dur: '1.4s' },  // happy
    { sx: 1.09, sy: 1.22, ty: 26,  tx: 0,   r: 0,   dur: '1.2s' },  // very happy
    // thinking / inquisitive
    { sx: 0.92, sy: 0.85, ty: -8,  tx: 0,   r: 0,   dur: '2.0s' },  // compressed — pondering
    { sx: 0.88, sy: 0.8,  ty: -10, tx: 20,  r: 1.5, dur: '2.2s' },  // pursed right — hmm
    { sx: 0.88, sy: 0.8,  ty: -10, tx: -20, r:-1.5, dur: '2.2s' },  // pursed left — hmm
    { sx: 0.95, sy: 0.9,  ty: -5,  tx: 10,  r: 0.8, dur: '2.0s' },  // slight thinking
    // smirk / playful
    { sx: 1.03, sy: 1.06, ty: 8,   tx: 25,  r: 1.2, dur: '2.0s' },  // smirk right
    { sx: 1.03, sy: 1.06, ty: 8,   tx: -25, r:-1.2, dur: '2.0s' },  // smirk left
    { sx: 1.01, sy: 1.02, ty: 3,   tx: 0,   r: 0,   dur: '2.2s' },  // barely there
  ];

  function nextMouth() {
    const m = moods[Math.floor(Math.random() * moods.length)];
    smile.style.transitionDuration = m.dur;
    smile.style.transform =
      `translateX(${m.tx}px) translateY(${m.ty}px) scaleX(${m.sx}) scaleY(${m.sy}) rotate(${m.r}deg)`;
    schedule(nextMouth, 2000 + Math.random() * 3000);
  }

  schedule(nextMouth, 2000);

  // --- Eye tracking (mouse / touch / gyroscope) ---

  if (trackL && trackR && svgEl) {
    const eyeCenterL = { x: 1576, y: 101 };
    const eyeCenterR = { x: 2689, y: 101 };
    const MAX_SHIFT = 28;

    function setTrack(dx, dy) {
      const mag = Math.sqrt(dx * dx + dy * dy);
      if (mag > MAX_SHIFT) {
        dx = (dx / mag) * MAX_SHIFT;
        dy = (dy / mag) * MAX_SHIFT;
      }
      trackL.setAttribute('transform', `translate(${dx.toFixed(1)}, ${dy.toFixed(1)})`);
      trackR.setAttribute('transform', `translate(${dx.toFixed(1)}, ${dy.toFixed(1)})`);
    }

    function handlePointer(px, py) {
      const rect = svgEl.getBoundingClientRect();
      const viewBox = svgEl.viewBox.baseVal;
      const sx = viewBox.width / rect.width;
      const sy = viewBox.height / rect.height;
      const svgX = (px - rect.left) * sx;
      const svgY = (py - rect.top) * sy;
      const midX = (eyeCenterL.x + eyeCenterR.x) / 2;
      const midY = (eyeCenterL.y + eyeCenterR.y) / 2;
      const rawDx = svgX - midX;
      const rawDy = svgY - midY;
      const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
      if (dist < 1) return;
      const strength = Math.min(dist / 600, 1);
      const dx = (rawDx / dist) * MAX_SHIFT * strength;
      const dy = (rawDy / dist) * MAX_SHIFT * strength;
      setTrack(dx, dy);
    }

    listen(document, 'mousemove', function (e) {
      handlePointer(e.clientX, e.clientY);
    });

    listen(document, 'touchmove', function (e) {
      const t = e.touches[0];
      if (t) handlePointer(t.clientX, t.clientY);
    }, { passive: true });

    listen(document, 'mouseleave', function () {
      setTrack(0, 0);
    });

    // Device orientation (mobile gyroscope)
    if (window.DeviceOrientationEvent) {
      listen(window, 'deviceorientation', function (e) {
        if (e.gamma === null && e.beta === null) return;
        const dx = (e.gamma || 0) / 90 * MAX_SHIFT;
        const dy = ((e.beta || 0) - 45) / 90 * MAX_SHIFT;
        setTrack(dx, dy);
      });
    }
  }

  // --- Hover / tap reaction: happy smile + cross-eyed ---

  let hoverActive = false;

  function enterHover() {
    if (hoverActive) return;
    hoverActive = true;
    smile.style.transitionDuration = '0.4s';
    smile.style.transform = 'translateY(30px) scaleX(1.12) scaleY(1.28)';
    eyeL.classList.add('squint');
    eyeR.classList.add('squint');
    eyeL.style.transform = 'translateX(30px)';
    eyeR.style.transform = 'translateX(-30px)';
  }

  function leaveHover() {
    if (!hoverActive) return;
    hoverActive = false;
    smile.style.transitionDuration = '0.6s';
    smile.style.transform = '';
    eyeL.classList.remove('squint');
    eyeR.classList.remove('squint');
    eyeL.style.transform = '';
    eyeR.style.transform = '';
  }

  listen(container, 'mouseenter', enterHover);
  listen(container, 'mouseleave', leaveHover);
  listen(container, 'touchstart', function () {
    if (hoverActive) leaveHover();
    else enterHover();
  }, { passive: true });

  // Cleanup: cancel all timers and remove listeners
  return function cleanup() {
    timers.forEach(clearTimeout);
    listeners.forEach(({ target, event, handler, options }) => {
      target.removeEventListener(event, handler, options);
    });
    eyeL.classList.remove('blink', 'squint');
    eyeR.classList.remove('blink', 'squint');
    eyeL.style.transform = '';
    eyeR.style.transform = '';
    smile.style.transitionDuration = '';
    smile.style.transform = '';
    if (trackL) trackL.removeAttribute('transform');
    if (trackR) trackR.removeAttribute('transform');
  };
}
