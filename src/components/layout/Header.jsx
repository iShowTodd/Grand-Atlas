import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../app/auth-context";

function Icon({ name }) {
  const paths = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m18 6-12 12M6 6l12 12" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <Link
        className="brand"
        to="/"
        aria-label="Grand Atlas home"
        onClick={closeMenu}
      >
        <img
          src="/assets/logo.svg"
          alt="Grand Atlas"
          width="116"
          height="116"
        />
      </Link>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <Icon name={menuOpen ? "close" : "menu"} />
      </button>
      <nav
        className={menuOpen ? "main-nav nav-open" : "main-nav"}
        id="site-navigation"
        aria-label="Main navigation"
      >
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>
        <Link to="/units" onClick={closeMenu}>
          Units
        </Link>
        <Link to="/zones" onClick={closeMenu}>
          Zones
        </Link>
        <Link to="/developers" onClick={closeMenu}>
          Developers
        </Link>
        <Link to="/contact" onClick={closeMenu}>
          Contact Us
        </Link>
      </nav>
      {user ? (
        <button
          className="button button-small header-cta"
          type="button"
          onClick={signOut}
        >
          Sign out
        </button>
      ) : (
        <Link className="button button-small header-cta" to="/register">
          Register
        </Link>
      )}
    </header>
  );
}
