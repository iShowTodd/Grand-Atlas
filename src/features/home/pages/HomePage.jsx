import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useProjects } from "../../projects";
import { useUnits } from "../../units";
import { useZones } from "../../zones";
import { ContactForm } from "../../contact";
import { SOCIAL_LINKS } from "../../../config/env";
import {
  AboutSection,
  BenchmarksSection,
  ProjectsSection,
  UnitsPreview,
  ZonesSection,
} from "../components/HomeSections";

export default function HomePage() {
  const unitsQuery = useUnits({ sort: "asc" });
  const zonesQuery = useZones();
  const projectsQuery = useProjects();

  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>Modern Luxury Living</title>
        <meta
          name="description"
          content="Discover exceptional residences and landmark developments with Grand Atlas."
        />
      </Helmet>
      <main>
        <section className="hero" id="home">
          <img
            className="hero-image"
            src="/assets/hero.png"
            alt=""
            width="1164"
            height="750"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <h1>Redefining the Horizon of Modern Luxury Living</h1>
            <p>
              We believe a home should be a sanctuary of innovation and an
              extension of your personal brand. By combining cutting-edge market
              data with a keen eye for world-class design, we help you navigate
              the complexities of the luxury market to find a space that
              inspires your best work and your deepest rest.
            </p>
            <Link className="button hero-button" to="/units">
              Explore <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hero-socials" aria-label="Social media">
            <a href={SOCIAL_LINKS.facebook} aria-label="Facebook">
              <img
                src="/assets/icon-facebook.svg"
                alt=""
                width="30"
                height="30"
              />
            </a>
            <a href={SOCIAL_LINKS.instagram} aria-label="Instagram">
              <img
                src="/assets/icon-instagram.svg"
                alt=""
                width="30"
                height="30"
              />
            </a>
            <a href={SOCIAL_LINKS.tiktok} aria-label="TikTok">
              <img
                src="/assets/icon-tiktok.svg"
                alt=""
                width="28"
                height="28"
              />
            </a>
          </div>
        </section>
        <BenchmarksSection />
        <AboutSection />
        <UnitsPreview query={unitsQuery} />
        <ZonesSection query={zonesQuery} />
        <ProjectsSection query={projectsQuery} />
        <section className="contact-section" id="contact">
          <div className="contact-copy">
            <span className="eyebrow">Let’s make your next move</span>
            <h2>Find the place that feels like yours.</h2>
            <p>
              Speak with our team for guidance on a home or development that
              suits you.
            </p>
          </div>
          <ContactForm />
        </section>
      </main>
    </>
  );
}
