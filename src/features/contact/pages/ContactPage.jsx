import { Helmet } from "react-helmet-async";
import { SOCIAL_LINKS } from "../../../config/env";
import ContactForm from "../components/ContactForm";

const socialLinks = [
  {
    name: "Facebook",
    image: "/assets/icon-facebook.svg",
    href: SOCIAL_LINKS.facebook,
  },
  {
    name: "Instagram",
    image: "/assets/icon-instagram.svg",
    href: SOCIAL_LINKS.instagram,
  },
  {
    name: "TikTok",
    image: "/assets/icon-tiktok.svg",
    href: SOCIAL_LINKS.tiktok,
  },
];

const workingDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];

export default function ContactPage() {
  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>Contact Us</title>
        <meta
          name="description"
          content="Contact Grand Atlas for private consultations and real estate inquiries."
        />
      </Helmet>
      <main className="contact-page">
        <section className="contact-page-hero">
          <img
            src="/assets/hero.png"
            alt=""
            width="1164"
            height="750"
            fetchPriority="high"
          />
          <div className="contact-page-hero-shade" />
          <div className="contact-page-hero-copy">
            <h1>Connected Globally. Available Locally.</h1>
            <p>
              With experts positioned in the world’s most influential markets,
              we are never more than a conversation away. Reach out to our team
              to experience a new standard of real estate advisory.
            </p>
          </div>
        </section>
        <section className="contact-page-content">
          <div className="contact-information">
            <h2>Contact Information</h2>
            <p>
              Our team is available for private consultations and off-market
              inquiries. We operate with absolute discretion to ensure your real
              estate objectives are met with precision.
            </p>
            <address>
              <p>Minusio, Lake Maggiore, Switzerland — ref. LOC1771</p>
              <p>
                <a href="mailto:Grand.Atlas.Support@gmail.com">
                  Grand.Atlas.Support@gmail.com
                </a>
              </p>
              <p>
                <a href="tel:01247859622">01247859622</a>
              </p>
              <p>
                <a href="tel:035987124">035987124</a>
              </p>
            </address>
            <h3>Follow us on social media</h3>
            <div className="contact-social-links">
              {socialLinks.map((social) => (
                <a
                  href={social.href}
                  key={social.name}
                  aria-label={social.name}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={social.image}
                    alt=""
                    width="24"
                    height="24"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
            <h3>Working Hours</h3>
            <dl className="working-hours">
              {workingDays.map((day) => (
                <div key={day}>
                  <dt>{day}</dt>
                  <dd>9:00 AM - 5:00 PM</dd>
                </div>
              ))}
            </dl>
          </div>
          <section className="contact-page-form">
            <h2>Send us a message</h2>
            <ContactForm variant="page" />
          </section>
        </section>
      </main>
    </>
  );
}
