import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/ui/PageState";
import { useZones } from "../hooks/useZones";
import ZoneCard from "../components/ZoneCard";

const emptyZones = [];

export default function ZonesPage() {
  const query = useZones();
  const [search, setSearch] = useState("");
  const zones = query.data ?? emptyZones;
  const heroImage = zones.find((zone) => zone.images[0])?.images[0];
  const visibleZones = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return zones;

    return zones.filter((zone) =>
      [zone.name, zone.city, zone.description]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase().includes(term)),
    );
  }, [zones, search]);

  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>Zones</title>
        <meta
          name="description"
          content="Explore the Grand Atlas destinations and find residences by zone."
        />
      </Helmet>
      <main className="zones-page">
        <section className="zones-hero">
          {heroImage && (
            <img
              className="zones-hero-image"
              src={heroImage}
              alt=""
              width="1440"
              height="595"
              fetchPriority="high"
            />
          )}
          <div className="zones-hero-shade" />
          <div className="zones-hero-copy">
            <h1>Destinations Defined by Distinction</h1>
            <p>
              From the quiet pulse of the shoreline to the vibrant energy of the
              metropolitan center, explore our guide to the neighborhoods that
              mirror your ambition and your aesthetic.
            </p>
          </div>
        </section>
        {query.isLoading ? (
          <LoadingState label="Loading zones" />
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={query.refetch} />
        ) : query.data.length === 0 ? (
          <EmptyState title="No zones available">
            Destinations will appear here when they are listed.
          </EmptyState>
        ) : (
          <section className="zones-results" aria-label="Zones">
            <label className="projects-search">
              <span>Search destinations</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search zone or city"
              />
            </label>
            {visibleZones.length === 0 ? (
              <EmptyState title="No matching zones">
                Try another search term.
              </EmptyState>
            ) : (
              <div className="zones-grid">
                {visibleZones.map((zone) => (
                  <ZoneCard key={zone.id} zone={zone} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}
