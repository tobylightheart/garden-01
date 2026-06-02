/* garden.js — the only script in the garden.
   Switches between "day" and "dusk", remembers your choice, and otherwise
   stays out of the way. Progressive enhancement: without JS, it's just day. */
(function () {
  "use strict";

  var root   = document.documentElement;
  var button = document.querySelector(".season-toggle");
  var KEY    = "garden-season";

  var faces = { day: "☀️", dusk: "🌙" };

  function apply(season) {
    root.setAttribute("data-season", season);
    if (button) {
      button.textContent = faces[season] || faces.day;
      button.setAttribute("aria-pressed", String(season === "dusk"));
    }
  }

  // Restore a saved choice, else follow the system's preference.
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  if (saved === "day" || saved === "dusk") {
    apply(saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
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
