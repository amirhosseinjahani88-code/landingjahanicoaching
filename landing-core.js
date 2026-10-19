/* Pure functions of the landing: no DOM, so node:test can load them. */
(function (root) {
  "use strict";

  const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

  function ease(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  /* Scene progress p (0..1) -> what the hero shows.
     headline fades out over .08-.14; object i flies into the phone over its own window;
     the paper ground gives way to the dark one over .30-.56 (short, so the mix never looks muddy). */
  const SCENE = { headOut: [0.08, 0.14], first: 0.14, step: 0.18, fly: 0.16, dark: [0.3, 0.56] };
  function scene(p, count) {
    const span = (a, b) => clamp01((p - a) / (b - a));
    const objects = [];
    let caption = -1;
    for (let i = 0; i < count; i++) {
      const start = SCENE.first + i * SCENE.step;
      objects.push(ease(span(start, start + SCENE.fly)));
      if (p >= start && p < start + SCENE.step) caption = i;
    }
    return { head: 1 - span(SCENE.headOut[0], SCENE.headOut[1]), dark: span(SCENE.dark[0], SCENE.dark[1]), objects, caption };
  }

  const api = { clamp01, ease, scene, SCENE };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.LandingCore = api;
})(this);
