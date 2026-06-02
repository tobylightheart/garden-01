/* garden.js — the only script in the garden.
   Two small jobs: switch between "day" and "dusk" (remembered), and let a few
   fireflies out after dusk. Progressive enhancement: without JS it's just day,
   and that's a perfectly good garden too. */
(function () {
  "use strict";

  var root   = document.documentElement;
  var button = document.querySelector(".season-toggle");
  var KEY    = "garden-season";
  var faces  = { day: "☀️", dusk: "🌙" };

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- fireflies: only at dusk, never if motion is unwelcome ------------- */
  function fireflies(on) {
    var layer = document.querySelector(".fireflies");
    if (!on || reduceMotion) {
      if (layer) { layer.remove(); }
      return;
    }
    if (layer) { return; }               // already glowing

    var hues = ["sun", "bloom", "moss"];
    layer = document.createElement("div");
    layer.className = "fireflies";
    layer.setAttribute("aria-hidden", "true");

    for (var i = 0; i < 14; i++) {
      var f = document.createElement("span");
      f.className = "firefly firefly--" + hues[i % hues.length];
      f.style.left = (Math.random() * 100).toFixed(2) + "vw";
      f.style.top  = (Math.random() * 100).toFixed(2) + "vh";
      f.style.animationDelay    = (Math.random() * 6).toFixed(2) + "s";
      f.style.animationDuration = (7 + Math.random() * 7).toFixed(2) + "s";
      layer.appendChild(f);
    }
    document.body.appendChild(layer);
  }

  /* ---- seasons ----------------------------------------------------------- */
  function apply(season) {
    root.setAttribute("data-season", season);
    if (button) {
      button.textContent = faces[season] || faces.day;
      button.setAttribute("aria-pressed", String(season === "dusk"));
    }
    fireflies(season === "dusk");
  }

  // Restore a saved choice, else follow the system's preference.
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  if (saved === "day" || saved === "dusk") {
    apply(saved);
  } else if (window.matchMedia &&
             window.matchMedia("(prefers-color-scheme: dark)").matches) {
    apply("dusk");
  } else {
    apply("day");
  }

  if (button) {
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-season") === "dusk" ? "day" : "dusk";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  }
})();
