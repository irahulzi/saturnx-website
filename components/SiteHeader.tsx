"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/index.html", label: "HOME", external: true },
  { href: "/itservices.html", label: "IT SERVICES", external: true },
  { href: "/engineering.html", label: "ENGINEERING SERVICES", external: true },
  { href: "/satx-ai", label: "SATX AI", external: false },
  { href: "/itservices.html#contact", label: "CONTACT", external: true },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function isActive(href: string) {
    return href === "/satx-ai" && pathname === "/satx-ai";
  }

  function renderLink(link: (typeof NAV_LINKS)[number]) {
    const className = `nav-pill${isActive(link.href) ? " nav-pill--active" : ""}`;

    if (link.external) {
      return (
        <a
          key={link.href}
          className={className}
          href={link.href}
          onClick={() => setMenuOpen(false)}
          {...(isActive(link.href) ? { "aria-current": "page" } : {})}
        >
          {link.label}
        </a>
      );
    }

    return (
      <Link
        key={link.href}
        className={className}
        href={link.href}
        onClick={() => setMenuOpen(false)}
        aria-current={isActive(link.href) ? "page" : undefined}
      >
        {link.label}
      </Link>
    );
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-row">
          <a className="brand" href="/index.html" aria-label="Saturnx Home">
            <img className="brand-logo" src="/logo.png" alt="Saturnx logo" />
          </a>

          <nav className="nav">
            <div className={`nav-sections${menuOpen ? " active" : ""}`}>
              {NAV_LINKS.map(renderLink)}
            </div>
          </nav>

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={menuOpen ? "Close mobile menu" : "Toggle mobile menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        className={`mobile-menu-overlay${menuOpen ? " active" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
