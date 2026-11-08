import { Link } from "react-router-dom";

const fallbackImages = [
  "/assets/featured-office.png",
  "/assets/featured-hacienda.png",
  "/assets/featured-villa.png",
];

export default function UnitCard({ unit, index = 0, variant = "home" }) {
  const image = unit.images[0] || fallbackImages[index % fallbackImages.length];
  const developer =
    unit.developer?.name_en ?? unit.developer?.name ?? unit.developer?.name_ar;
  const zone = unit.zone?.name_en ?? unit.zone?.name ?? unit.zone?.name_ar;
  const project = unit.project?.name_en ?? unit.project?.name;
  const location = unit.city || zone || "";

  if (variant === "catalog") {
    return (
      <article className="property-card property-card-catalog">
        <Link
          className="property-image-button"
          to={`/units/${encodeURIComponent(unit.id)}`}
          aria-label={`View ${unit.title}`}
        >
          <img
            src={image}
            alt={`${unit.title} residence`}
            width="442"
            height="284"
            loading="lazy"
          />
          <span className="image-label">{unit.status}</span>
        </Link>
        <div className="catalog-unit-features">
          <span>{unit.bedrooms} Bedrooms</span>
          <span>{unit.bathrooms} Bathrooms</span>
          <span>{unit.size}m</span>
        </div>
        <div className="property-card-body">
          <div className="catalog-unit-heading">
            <h3>{unit.title}</h3>
            {unit.price !== undefined && (
              <strong>
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "EGP",
                  maximumFractionDigits: 0,
                }).format(Number(unit.price))}
              </strong>
            )}
          </div>
          <p>{unit.description}</p>
          <Link
            className="landmark-link"
            to={`/units/${encodeURIComponent(unit.id)}`}
          >
            Explore residence <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="property-card">
      <Link
        className="property-image-button"
        to={`/units/${encodeURIComponent(unit.id)}`}
        aria-label={`View ${unit.title}`}
      >
        <img
          src={image}
          alt={`${unit.title} residence`}
          width="442"
          height="284"
          loading="lazy"
        />
        <span className="image-label">{unit.status}</span>
      </Link>
      <div className="property-card-body">
        <div className="property-meta">
          <span>{location}</span>
          <span>
            {unit.bedrooms ? `${unit.bedrooms} bedrooms` : unit.status}
          </span>
        </div>
        <h3>{unit.title}</h3>
        <p>{developer || project || zone || unit.city || ""}</p>
        <div className="unit-card-details">
          {unit.price !== undefined && unit.price !== null && (
            <strong>
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "EGP",
                maximumFractionDigits: 0,
              }).format(Number(unit.price))}
            </strong>
          )}
          {unit.size !== undefined && unit.size !== null && (
            <span>{unit.size} m²</span>
          )}
        </div>
        <Link
          className="text-link"
          to={`/units/${encodeURIComponent(unit.id)}`}
        >
          Explore residence <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
