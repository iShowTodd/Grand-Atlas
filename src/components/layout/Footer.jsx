import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" aria-label="Grand Atlas home">
            <img
              src="/assets/logo.svg"
              alt="Grand Atlas"
              width="116"
              height="116"
              loading="lazy"
            />
          </Link>
          <p>Exceptional places. Thoughtfully found.</p>
        </div>
        <div className="footer-links">
          <h3>Quick links</h3>
          <Link to="/#about">About Grand Atlas</Link>
          <Link to="/units">Our residences</Link>
          <Link to="/zones">Locations</Link>
          <Link to="/projects">Developments</Link>
          <Link to="/contact">Contact us</Link>
        </div>
        <div className="footer-links">
          <h3>Account</h3>
          <Link to="/login">Sign in</Link>
          <Link to="/register">Create account</Link>
          <Link to="/admin">Administration</Link>
        </div>
        <div className="newsletter">
          <h3>Get in touch</h3>
          <p>Speak with our team about finding your next home.</p>
          <Link className="footer-contact-link" to="/contact">
            Contact Grand Atlas <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Grand Atlas. All rights reserved.
        </span>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}
