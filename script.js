/* Will's Fence & Deck - site behavior */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Active nav state */
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll(".nav-links a[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === page) link.classList.add("is-active");
    });
  }

  /* Hamburger */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("is-open");
      links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", links.classList.contains("is-open") ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("is-open");
        links.classList.remove("is-open");
      });
    });
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Gallery carousel: featured-center, auto-advancing */
  var carousel = document.querySelector(".gallery-carousel");
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".gallery-slide"));
    var dotsWrap = carousel.querySelector(".carousel-dots");
    var prevBtn = carousel.querySelector(".carousel-prev");
    var nextBtn = carousel.querySelector(".carousel-next");
    var index = 0;
    var timer = null;
    var INTERVAL = 4500;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      var prev = (index - 1 + slides.length) % slides.length;
      var next = (index + 1) % slides.length;
      slides.forEach(function (slide, s) {
        slide.classList.remove("is-active", "is-prev", "is-next");
        if (s === index) slide.classList.add("is-active");
        else if (s === prev) slide.classList.add("is-prev");
        else if (s === next) slide.classList.add("is-next");
      });
      dots.forEach(function (dot, d) {
        dot.classList.toggle("is-active", d === index);
      });
    }

    function start() {
      if (reduceMotion) return;
      timer = setInterval(function () { goTo(index + 1); }, INTERVAL);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); restart(); });
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", function () { if (!timer) start(); });

    goTo(0);
    start();
  }

  /* Reviews carousel: one review at a time, auto-advancing */
  var reviews = document.querySelector(".reviews-carousel");
  if (reviews) {
    var track = reviews.querySelector(".reviews-track");
    var slidesR = Array.prototype.slice.call(reviews.querySelectorAll(".review"));
    var dotsWrapR = reviews.querySelector(".carousel-dots");
    var prevR = reviews.querySelector(".carousel-prev");
    var nextR = reviews.querySelector(".carousel-next");
    var current = 0;
    var timerR = null;
    var INTERVAL_R = 6500;

    slidesR.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to review " + (i + 1));
      dot.addEventListener("click", function () { go(i); restartR(); });
      dotsWrapR.appendChild(dot);
    });
    var dotsR = Array.prototype.slice.call(dotsWrapR.children);

    function render() {
      track.style.transform = "translateX(" + (-current * 100) + "%)";
      dotsR.forEach(function (d, i) { d.classList.toggle("is-active", i === current); });
    }
    function go(n) { current = (n + slidesR.length) % slidesR.length; render(); }
    function startR() { if (reduceMotion) return; timerR = setInterval(function () { go(current + 1); }, INTERVAL_R); }
    function stopR() { if (timerR) { clearInterval(timerR); timerR = null; } }
    function restartR() { stopR(); startR(); }

    if (prevR) prevR.addEventListener("click", function () { go(current - 1); restartR(); });
    if (nextR) nextR.addEventListener("click", function () { go(current + 1); restartR(); });
    reviews.addEventListener("mouseenter", stopR);
    reviews.addEventListener("mouseleave", function () { if (!timerR) startR(); });

    render();
    startR();
  }

  /* Light form validation */
  var form = document.querySelector("form[data-validate]");
  if (form) {
    form.addEventListener("submit", function (e) {
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = "#a06b3a";
          ok = false;
        } else {
          field.style.borderColor = "";
        }
      });
      if (!ok) e.preventDefault();
    });
  }
})();
