// Mark JS active so reveal styles apply (no-JS users see content immediately).
document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Sticky header border on scroll ---- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Copy-to-clipboard for install commands ---- */
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); ta.remove();
      }
      const original = btn.textContent;
      btn.textContent = "copied ✓";
      btn.classList.add("copied");
      setTimeout(() => { btn.textContent = original; btn.classList.remove("copied"); }, 1600);
    });
  });

  /* ---- Scroll reveal ----
     Content is visible by default; JS adds the hidden state, then reveals on
     intersection. Safety net guarantees everything shows even if IO never
     fires (headless renderer, background tab) so the page never ships blank. */
  const revealables = document.querySelectorAll(".reveal");
  const showAll = () => revealables.forEach((el) => el.classList.add("is-in"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });

  revealables.forEach((el) => io.observe(el));

  // Safety: reveal anything still hidden after 1.2s.
  setTimeout(showAll, 1200);

  /* ---- Mobile nav toggle (scrolls to links / simple disclosure) ---- */
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.getElementById("features")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
});
