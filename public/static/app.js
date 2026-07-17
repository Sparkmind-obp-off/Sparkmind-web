// SparkMind Sovereign Foundry — light client behavior
// Live sprint-day sync (recomputes vs server clock, public-safe)
(function () {
  'use strict';

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var el = document.querySelector(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  });

  // Refresh sprint-day label from API (keeps tracker honest if cached)
  var label = document.getElementById('sprint-day-label');
  if (label) {
    fetch('/api/sprint')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (typeof d.today === 'number') {
          label.textContent = 'D' + d.today + ' / D14';
          var fill = document.querySelector('.progress-fill');
          if (fill) fill.style.width = (d.today / 14 * 100) + '%';
        }
      })
      .catch(function () { /* offline-safe */ });
  }

  console.log('%cSparkMind Sovereign Agent Foundry', 'color:#d4af37;font-weight:700', '— Doctrine v11.0 · Forge sovereign agents.');
})();
