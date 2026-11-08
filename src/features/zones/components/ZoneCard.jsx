import { Link } from "react-router-dom";

export default function ZoneCard({ zone }) {
  const image = zone.images[0];
  const city = zone.city || zone.name;

  return (
    <article className="zone-list-card">
      <Link
        className="zone-list-image"
        to={`/units?zoneName=${encodeURIComponent(zone.name)}`}
        aria-label={`View residences in ${zone.name}`}
      >
        {image ? (
          <img
            src={image}
            alt={`${zone.name} destination`}
            width="327"
            height="221"
            loading="lazy"
          />
        ) : (
          <span aria-hidden="true">{zone.name.slice(0, 1)}</span>
        )}
      </Link>
      <div className="zone-list-info">
        <div>
          <h2>{zone.name}</h2>
          <p>{city}</p>
        </div>
        <Link
          className="text-link"
          to={`/units?zoneName=${encodeURIComponent(zone.name)}`}
        >
          Explore zone <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
