/* Landing: the scroll scene, the paper/digital switches, light entrances. */
(function () {
  "use strict";
  const C = window.LandingCore;
  const root = document.documentElement;
  root.classList.add("js");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bar = document.querySelector(".bar");

  /* ---------- scene: native scroll, a sticky stage, CSS variables only ---------- */
  const scene = document.getElementById("scene");
  if (scene && !reduced) {
    root.classList.add("scene-on");
    const stage = scene.querySelector(".scene__stage");
    const caps = Array.from(scene.querySelectorAll(".cap"));
    const objs = Array.from(scene.querySelectorAll(".obj"));
    const rows = Array.from(scene.querySelectorAll(".prow"));
    let top = 0, travel = 1, raf = 0, lastCap = -2;

    const measure = () => {
      top = scene.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(1, scene.offsetHeight - stage.offsetHeight);
      draw();
    };
    const draw = () => {
      raf = 0;
      const p = C.clamp01((window.scrollY - top) / travel);
      const s = C.scene(p, objs.length);
      stage.style.setProperty("--dark", s.dark.toFixed(3));
      stage.style.setProperty("--head", s.head.toFixed(3));
      stage.style.setProperty("--phone", C.clamp01((p - 0.08) / 0.08).toFixed(3)); // the phone is there before the first object lands
      objs.forEach((el, i) => el.style.setProperty("--t", s.objects[i].toFixed(3)));
      rows.forEach((el, i) => el.style.setProperty("--t", (s.objects[i] || 0).toFixed(3)));
      if (s.caption !== lastCap) {
        caps.forEach((el, i) => el.classList.toggle("is-on", i === s.caption));
        lastCap = s.caption;
      }
      const dark = s.dark > 0.5 || window.scrollY > top + travel;
      stage.classList.toggle("is-dark", s.dark > 0.5);
      bar.classList.toggle("is-dark", dark);
    };
    window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(draw); }, { passive: true });
    new ResizeObserver(measure).observe(scene);
    measure();
  } else if (bar) {
    const sceneEnd = () => (scene ? scene.offsetTop + scene.offsetHeight - bar.offsetHeight : 0);
    const onScroll = () => bar.classList.toggle("is-dark", window.scrollY > sceneEnd());
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- paper / digital switches ---------- */
  const phone = window.matchMedia("(max-width: 899px)");
  document.querySelectorAll(".band .switch").forEach((sw) => {
    const band = sw.closest(".band");
    sw.addEventListener("click", () => {
      const on = sw.getAttribute("aria-checked") !== "true";
      sw.setAttribute("aria-checked", String(on));
      band.toggleAttribute("data-on", on);
      band.classList.add("touched");
    });
    /* On a phone a tap anywhere on the band flips it; the switch stays the keyboard control. */
    band.addEventListener("click", (e) => {
      if (phone.matches && !e.target.closest("a, button")) sw.click();
    });
  });

  /* ---------- light entrances ---------- */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
