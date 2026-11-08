import { Link } from "react-router-dom";

export default function DeveloperCard({ developer }) {
  const image = developer.images[0];

  return (
    <article className="developer-list-card">
      <Link
        className="developer-list-image"
        to={`/developers/${encodeURIComponent(developer.id)}/projects`}
        aria-label={`View projects by ${developer.name}`}
      >
        {image ? (
          <img
            src={image}
            alt={`${developer.name} development`}
            width="415"
            height="271"
            loading="lazy"
          />
        ) : (
          <span className="developer-list-monogram" aria-hidden="true">
            {developer.name.slice(0, 1)}
          </span>
        )}
      </Link>
      <div className="developer-list-info">
        <span className="developer-monogram" aria-hidden="true">
          {developer.name.slice(0, 1)}
        </span>
        <div>
          <h2>{developer.name}</h2>
          {developer.description && <p>{developer.description}</p>}
        </div>
      </div>
      <Link
        className="landmark-link"
        to={`/developers/${encodeURIComponent(developer.id)}/projects`}
      >
        View projects <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
