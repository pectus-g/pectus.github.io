/* Pectus Games site: background videos, year, local preview links. */
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tryPlay(video) {
    var p = video.play();
    if (p && typeof p.catch === "function") { p.catch(function () {}); }
  }

  var videos = document.querySelectorAll("video[data-bg]");
  Array.prototype.forEach.call(videos, function (video) {
    if (reduceMotion) {
      video.pause();
      video.removeAttribute("autoplay");
      return;
    }
    video.muted = true;
    video.inView = true;
    tryPlay(video);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          video.inView = entry.isIntersecting;
          if (entry.isIntersecting) { tryPlay(video); } else { video.pause(); }
        });
      }, { threshold: 0.05 }).observe(video);
    }
  });

  // A tab opened in the background starts its videos when it comes to the front.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden || reduceMotion) { return; }
    Array.prototype.forEach.call(videos, function (video) {
      if (video.inView && video.paused) { tryPlay(video); }
    });
  });

  var year = document.querySelector("[data-year]");
  if (year) { year.textContent = String(new Date().getFullYear()); }

  // Opened straight from the disk (double click on index.html): folder links need index.html.
  if (location.protocol === "file:") {
    Array.prototype.forEach.call(document.querySelectorAll("a[href]"), function (a) {
      var href = a.getAttribute("href");
      if (!href || /^[a-z]+:/i.test(href) || href.charAt(0) === "#") { return; }
      if (href.slice(-1) === "/") { a.setAttribute("href", href + "index.html"); }
    });
  }
})();
