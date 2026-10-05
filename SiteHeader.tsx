import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#fleet", label: "Fleet" },
  { href: "#process", label: "Process" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function Brand() {
  return (
    <>
      <img src="/assets/img/globe-icon.png" alt="" className="brand-globe" />
      <span className="brand-word">
        EXPRESS<em>LINK</em>
        <small>LOGISTICS</small>
      </span>
    </>
  );
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = NAV.map((n) =>
      document.querySelector(n.href),
    ).filter(Boolean) as Element[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#top" className="brand" aria-label="Express Link Logistics home">
          <Brand />
        </a>

        <nav
          className={`main-nav${menuOpen ? " is-open" : ""}`}
          ref={navRef}
          aria-label="Main navigation"
        >
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={active === n.href ? "is-active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="header-cta">
          <a className="header-phone" href="tel:+13472542428">
            <PhoneIcon />
            <span>+1 (347) 254-2428</span>
          </a>
          <a href="#contact" className="btn btn-primary btn-sm">
            <span className="btn-marker"></span>Get a Quote
          </a>
          <button
            className={`nav-toggle${menuOpen ? " is-open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
