import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  const developer =
    project.developer?.name_en ??
    project.developer?.name ??
    project.developer?.name_ar;
  const zone =
    project.zone?.name_en ?? project.zone?.name ?? project.zone?.name_ar;
  const image = project.images[0];

  return (
    <article className="landmark-card project-list-card">
      {image && (
        <Link
          className="landmark-image"
          to={`/projects/${encodeURIComponent(project.id)}`}
          aria-label={`View ${project.name}`}
        >
          <img
            src={image}
            alt={`${project.name} development`}
            width="418"
            height="284"
            loading="lazy"
          />
          {zone && <span>{zone}</span>}
        </Link>
      )}
      {!image && (
        <div
          className="landmark-image project-image-empty"
          aria-hidden="true"
        />
      )}
      <div className="landmark-info">
        <span className="developer-monogram" aria-hidden="true">
          {project.name.slice(0, 1)}
        </span>
        <div>
          <h2>{project.name}</h2>
          <p>{developer || project.description}</p>
        </div>
      </div>
      <Link
        className="landmark-link"
        to={`/projects/${encodeURIComponent(project.id)}`}
      >
        View project <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
