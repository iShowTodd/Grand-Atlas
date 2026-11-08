import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/ui/PageState";
import { useUnit } from "../hooks/useUnits";

export default function UnitDetailsPage() {
  const { id } = useParams();
  const query = useUnit(id);
  const unit = query.data;
  const image = unit?.images[0] || "/assets/featured-office.png";

  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>{unit ? unit.title : "Residence"}</title>
        <meta
          name="description"
          content={
            unit
              ? `Explore ${unit.title} in ${unit.city || unit.zone?.name || "a Grand Atlas destination"}. View residence details and contact our team.`
              : "Explore a Grand Atlas residence and view its listing details."
          }
        />
      </Helmet>
      <main className="unit-detail-page">
        {query.isLoading ? (
          <LoadingState label="Loading residence" />
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={query.refetch} />
        ) : !unit ? (
          <EmptyState title="Residence not found">
            This listing may have been removed.
          </EmptyState>
        ) : (
          <article className="unit-detail">
            <img
              className="unit-detail-image"
              src={image}
              alt={unit.title}
              width="1129"
              height="750"
            />
            <div className="unit-detail-copy">
              <Link className="back-link" to="/units">
                ← All residences
              </Link>
              <span className="eyebrow">
                {unit.city || unit.zone?.name || "Grand Atlas"}
              </span>
              <h1>{unit.title}</h1>
              <p>{unit.description}</p>
              <dl className="unit-detail-list">
                <div>
                  <dt>Status</dt>
                  <dd>{unit.status}</dd>
                </div>
                {unit.price !== undefined && (
                  <div>
                    <dt>Price</dt>
                    <dd>{unit.price}</dd>
                  </div>
                )}
                {unit.size !== undefined && (
                  <div>
                    <dt>Size</dt>
                    <dd>{unit.size} m²</dd>
                  </div>
                )}
                {unit.bedrooms !== undefined && (
                  <div>
                    <dt>Bedrooms</dt>
                    <dd>{unit.bedrooms}</dd>
                  </div>
                )}
                {unit.bathrooms !== undefined && (
                  <div>
                    <dt>Bathrooms</dt>
                    <dd>{unit.bathrooms}</dd>
                  </div>
                )}
              </dl>
              <Link className="button" to="/contact">
                Contact us about this residence{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        )}
      </main>
    </>
  );
}
