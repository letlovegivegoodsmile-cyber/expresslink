import { useEffect } from "react";

/**
 * Site-wide visual effects for the marketing pages:
 * - word-split mask reveals ([data-split])
 * - scroll-in reveals ([data-reveal])
 * - one-shot animated counters ([data-count])
 * - sticky header state (.site-header.is-scrolled)
 * - body.is-loaded for hero entrance
 */
export function useSiteFX() {
  useEffect(() => {
    document.body.classList.add("is-loaded");
    const root = document.querySelector<HTMLElement>(".ell");
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* ---- split words into masked spans ---- */
    const splitEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-split]"),
    );
    splitEls.forEach((el) => {
      const words = (el.textContent ?? "").trim().split(/\s+/);
      el.textContent = "";
      words.forEach((word, i) => {
        const outer = document.createElement("span");
        outer.className = "word";
        const inner = document.createElement("span");
        inner.className = "word-inner";
        inner.textContent = word;
        inner.style.transitionDelay = `${i * 70}ms`;
        outer.appendChild(inner);
        el.appendChild(outer);
        if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
      });
    });

    /* ---- reveal observer ---- */
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
    );
    root
      .querySelectorAll("[data-reveal], [data-split]")
      .forEach((el) => revealObserver.observe(el));

    /* ---- counters ---- */
    const animateCount = (el: HTMLElement) => {
      const target = parseFloat(el.dataset.count ?? "0");
      const decimals = parseInt(el.dataset.decimals ?? "0", 10);
      if (prefersReducedMotion) {
        el.textContent = target.toFixed(decimals);
        return;
      }
      const duration = 1600;
      let start: number | null = null;
      const frame = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target as HTMLElement);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    root.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

    /* ---- header scroll state ---- */
    const header = root.querySelector<HTMLElement>(".site-header");
    const onScroll = () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("is-loaded");
    };
  }, []);
}
