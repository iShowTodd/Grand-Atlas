import { Link } from "react-router-dom";
import {
  ErrorState,
  EmptyState,
  LoadingState,
} from "../../../components/ui/PageState";
import { MapPreview } from "../../map";
import { UnitCard } from "../../units";

function SectionHeading({ eyebrow, children }) {
  return (
    <div className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{children}</h2>
      <span className="heading-rule" />
    </div>
  );
}

function hasCollectionError(query) {
  return query.isError || !Array.isArray(query.data);
}

function collectionError(query) {
  return query.error ?? new Error("The API returned an invalid collection.");
}

export function BenchmarksSection() {
  const stats = [
    {
      icon: "/assets/icon-property.svg",
      width: 36.7,
      height: 36.7,
      number: "48",
      label: "Properties Managed",
    },
    {
      icon: "/assets/icon-investment.svg",
      width: 40.4,
      height: 40.6,
      number: "90M",
      label: "Total Managed Investments",
    },
    {
      icon: "/assets/icon-clients.svg",
      width: 41,
      height: 41,
      number: "500",
      label: "Happy Clients",
    },
    {
      icon: "/assets/icon-award.svg",
      width: 39,
      height: 39,
      number: "99%",
      label: "Client Satisfaction",
    },
  ];

  return (
    <section className="benchmarks section-wrap" id="benchmarks">
      <SectionHeading>Benchmarks of Success</SectionHeading>
      <div className="stat-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <img
              src={stat.icon}
              alt=""
              width={stat.width}
              height={stat.height}
              loading="lazy"
            />
            <strong>{stat.number}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="about section-wrap" id="about">
      <SectionHeading>About Grand Atlas</SectionHeading>
      <div className="about-grid">
        <div className="about-image-wrap">
          <img
            src="/assets/about.png"
            alt="Contemporary residence framed by a landscaped garden"
            width="1124"
            height="750"
            loading="lazy"
          />
        </div>
        <div className="about-copy">
          <p>
            We began with a singular, uncompromising vision: to bridge the gap
            between world-class architecture and the individuals who define our
            global culture. We recognized that for the discerning client, a home
            is rarely just a physical structure; it is a curated environment, a
            private gallery, and the ultimate expression of a life well-lived.
          </p>
          <p>
            Our journey started not in the pursuit of transactions, but in the
            pursuit of excellence. We don’t just find you a home; we secure your
            peace of mind through a veil of absolute professional
            confidentiality.
          </p>
          <a className="button" href="#contact">
            Know more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function UnitsPreview({ query }) {
  return (
    <section className="residences section-wrap" id="units">
      <SectionHeading eyebrow="A considered collection">
        Hand-Selected Masterpieces
      </SectionHeading>
      {query.isLoading || query.isPending ? (
        <LoadingState label="Loading residences" />
      ) : hasCollectionError(query) ? (
        <ErrorState error={collectionError(query)} onRetry={query.refetch} />
      ) : query.data.length === 0 ? (
        <EmptyState title="No residences available">
          New residences will appear here when they are listed.
        </EmptyState>
      ) : (
        <>
          <div className="property-grid">
            {query.data.slice(0, 3).map((unit, index) => (
              <UnitCard key={unit.id} unit={unit} index={index} />
            ))}
          </div>
          <Link className="button units-more" to="/units">
            Explore all residences <span aria-hidden="true">→</span>
          </Link>
        </>
      )}
    </section>
  );
}

export function ZonesSection({ query }) {
  return (
    <section className="locations-section" id="zones">
      <div className="section-wrap">
        <SectionHeading>Strategic Locations</SectionHeading>
      </div>
      <div className="map-frame">
        {query.isLoading || query.isPending ? (
          <LoadingState label="Loading locations" />
        ) : hasCollectionError(query) ? (
          <ErrorState error={collectionError(query)} onRetry={query.refetch} />
        ) : query.data.length === 0 ? (
          <EmptyState title="No locations listed yet">
            Locations will appear here when zones are published.
          </EmptyState>
        ) : (
          <MapPreview zones={query.data} />
        )}
      </div>
      <div className="map-preview-action">
        <Link className="button" to="/map">
          View full map <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

const projectImages = [
  "/assets/landmark-palm-hills.png",
  "/assets/landmark-hayah.png",
  "/assets/landmark-palm-hills.png",
];

export function ProjectsSection({ query }) {
  return (
    <section className="landmarks section-wrap" id="developers">
      <SectionHeading eyebrow="Designed for what comes next">
        Future Landmarks
      </SectionHeading>
      {query.isLoading || query.isPending ? (
        <LoadingState label="Loading projects" />
      ) : hasCollectionError(query) ? (
        <ErrorState error={collectionError(query)} onRetry={query.refetch} />
      ) : query.data.length === 0 ? (
        <EmptyState title="No projects available">
          Project details will appear here when they are published.
        </EmptyState>
      ) : (
        <div className="landmark-grid">
          {query.data.slice(0, 3).map((project, index) => {
            const developer =
              project.developer?.name_en ??
              project.developer?.name ??
              project.developer?.name_ar;
            const zone =
              project.zone?.name_en ??
              project.zone?.name ??
              project.zone?.name_ar;
            const image =
              project.images[0] || projectImages[index % projectImages.length];

            return (
              <article className="landmark-card" key={project.id}>
                <div className="landmark-image">
                  <img
                    src={image}
                    alt={`${project.name} development`}
                    width="418"
                    height="284"
                    loading="lazy"
                  />
                  <span>{zone}</span>
                </div>
                <div className="landmark-info">
                  <span className="developer-monogram" aria-hidden="true">
                    {project.name.slice(0, 1)}
                  </span>
                  <div>
                    <h3>{project.name}</h3>
                    <p>{developer || project.description}</p>
                  </div>
                </div>
                <Link
                  className="landmark-link"
                  to={
                    zone
                      ? `/units?zoneName=${encodeURIComponent(zone)}`
                      : "/units"
                  }
                >
                  View residences <span aria-hidden="true">→</span>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
