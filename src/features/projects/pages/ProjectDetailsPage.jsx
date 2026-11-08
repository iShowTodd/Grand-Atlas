import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/ui/PageState";
import { UnitCard } from "../../units";
import { useProject } from "../hooks/useProjects";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const query = useProject(id);
  const [activeImage, setActiveImage] = useState(0);
  const project = query.data;
  const images = project?.images ?? [];
  const developer = project?.developer?.name ?? "";
  const zone = project?.zone?.name ?? "";

  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>{project ? project.name : "Project"}</title>
        <meta
          name="description"
          content={
            project?.description ||
            "Discover project details and residences with Grand Atlas."
          }
        />
      </Helmet>
      <main className="project-details-page">
        {query.isLoading ? (
          <LoadingState label="Loading project" />
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={query.refetch} />
        ) : !project ? (
          <EmptyState title="Project not found">
            This project may have been removed.
          </EmptyState>
        ) : (
          <>
            <section className="project-gallery" aria-label="Project images">
              {images.length > 0 ? (
                <>
                  <img
                    className="project-gallery-main"
                    src={images[activeImage] ?? images[0]}
                    alt={`${project.name} project`}
                    width="1381"
                    height="562"
                    fetchPriority="high"
                  />
                  <div className="project-gallery-thumbnails">
                    {images.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        aria-label={`Show project image ${index + 1}`}
                        aria-pressed={activeImage === index}
                        onClick={() => setActiveImage(index)}
                      >
                        <img
                          src={image}
                          alt=""
                          width="270"
                          height="180"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState title="No project images">
                  Images have not been added to this project.
                </EmptyState>
              )}
            </section>
            <section className="project-details-intro">
              <div>
                <h1>{project.name}</h1>
                <p className="project-location">
                  {zone && <span>{zone}</span>}
                  {project.zone?.city_en && <span>{project.zone.city_en}</span>}
                </p>
              </div>
              {developer && (
                <Link
                  className="project-developer-link"
                  to={`/developers/${encodeURIComponent(project.developer.id)}/projects`}
                >
                  {developer}
                </Link>
              )}
            </section>
            <section className="project-overview">
              <div className="project-facts">
                <h2>At a glance</h2>
                <dl>
                  {zone && (
                    <div>
                      <dt>Location</dt>
                      <dd>{zone}</dd>
                    </div>
                  )}
                  {developer && (
                    <div>
                      <dt>Developer</dt>
                      <dd>{developer}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Listed residences</dt>
                    <dd>{project.units.length}</dd>
                  </div>
                  <div>
                    <dt>Available residences</dt>
                    <dd>
                      {
                        project.units.filter(
                          (unit) => unit.status === "AVAILABLE",
                        ).length
                      }
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="project-description">
                <h2>Overview</h2>
                <p>{project.description}</p>
              </div>
            </section>
            <section className="project-units">
              <div className="section-heading">
                <h2>Residences in this project</h2>
                <span className="heading-rule" />
              </div>
              {project.units.length === 0 ? (
                <EmptyState title="No residences listed">
                  There are no residences linked to this project yet.
                </EmptyState>
              ) : (
                <div className="property-grid">
                  {project.units.map((unit, index) => (
                    <UnitCard key={unit.id} unit={unit} index={index} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
