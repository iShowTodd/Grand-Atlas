import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/ui/PageState";
import { useZones } from "../../zones";
import MapView from "../components/MapView";
import { mapZoneLocations } from "../utils/locations";

export default function MapPage() {
  const zonesQuery = useZones();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const locations = useMemo(
    () => mapZoneLocations(zonesQuery.data ?? []),
    [zonesQuery.data],
  );
  const filteredLocations = locations.filter((location) =>
    `${location.name} ${location.city}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  const activeId = filteredLocations.some(
    (location) => location.id === selectedId,
  )
    ? selectedId
    : filteredLocations[0]?.id;

  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>Explore Locations</title>
        <meta
          name="description"
          content="Explore Grand Atlas zones on an interactive map and browse residences by location."
        />
      </Helmet>
      <main className="map-page">
        <header className="map-page-heading">
          <span className="eyebrow">Find your destination</span>
          <h1>Explore Grand Atlas Locations</h1>
          <p>Choose a zone to focus the map and explore its residences.</p>
        </header>
        {zonesQuery.isLoading ? (
          <LoadingState label="Loading locations" />
        ) : zonesQuery.isError ? (
          <ErrorState error={zonesQuery.error} onRetry={zonesQuery.refetch} />
        ) : locations.length === 0 ? (
          <EmptyState title="No locations available">
            Locations will appear here when zones are published.
          </EmptyState>
        ) : (
          <>
            <p className="map-location-note">
              Markers show approximate zone centers because the API does not
              provide precise coordinates.
            </p>
            <div className="map-page-layout">
              <MapView
                locations={filteredLocations}
                selectedId={activeId}
                onSelect={setSelectedId}
              />
              <aside className="map-location-panel">
                <label className="map-location-search">
                  <span>Search locations</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by zone or city"
                  />
                </label>
                <h2>Locations</h2>
                {filteredLocations.length === 0 ? (
                  <p className="map-list-empty" role="status">
                    No locations match your search.
                  </p>
                ) : (
                  <ul className="map-location-list">
                    {filteredLocations.map((location) => (
                      <li key={location.id}>
                        <button
                          className={
                            location.id === activeId
                              ? "map-location-button is-active"
                              : "map-location-button"
                          }
                          type="button"
                          disabled={!location.coordinates}
                          onClick={() => setSelectedId(location.id)}
                        >
                          <span>{location.name}</span>
                          <span>
                            {location.coordinates
                              ? location.city || "View map marker"
                              : "Map location unavailable"}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </aside>
            </div>
          </>
        )}
      </main>
    </>
  );
}
