import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import { TILE_LAYER_CONFIG } from "../config/tiles";
import { createMarkerIcon } from "../utils/markerIcon";
import "../styles/map.css";
import "leaflet/dist/leaflet.css";

function FocusSelectedLocation({ location }) {
  const map = useMap();
  const previousLocationId = useRef(location?.id);

  useEffect(() => {
    if (
      location?.coordinates &&
      previousLocationId.current &&
      previousLocationId.current !== location.id
    ) {
      map.flyTo(
        [location.coordinates.latitude, location.coordinates.longitude],
        Math.max(map.getZoom(), 9),
        { duration: 0.45 },
      );
    }
    previousLocationId.current = location?.id;
  }, [location, map]);

  return null;
}

function FitLocations({ locations }) {
  const map = useMap();
  const coordinatesKey = locations
    .filter((location) => location.coordinates)
    .map(
      (location) =>
        `${location.coordinates.latitude},${location.coordinates.longitude}`,
    )
    .join("|");
  const coordinates = useMemo(
    () =>
      coordinatesKey
        ? coordinatesKey
            .split("|")
            .map((coordinate) => coordinate.split(",").map(Number))
        : [],
    [coordinatesKey],
  );

  useEffect(() => {
    if (coordinates.length > 0) {
      map.fitBounds(coordinates, { padding: [48, 48], maxZoom: 14 });
    }
  }, [coordinates, map]);

  return null;
}

export default function MapView({
  locations,
  selectedId,
  onSelect,
  preview = false,
}) {
  const selectedLocation = locations.find(
    (location) => location.id === selectedId,
  );

  return (
    <div
      className={`atlas-map${preview ? " atlas-map-preview" : ""}`}
      aria-label="Interactive map of Grand Atlas zones"
    >
      <MapContainer
        center={[29.8, 31.2]}
        zoom={5}
        scrollWheelZoom={!preview}
        zoomControl={!preview}
        aria-label="OpenStreetMap showing Grand Atlas zone locations"
      >
        <TileLayer {...TILE_LAYER_CONFIG} />
        <FitLocations locations={locations} />
        <FocusSelectedLocation location={selectedLocation} />
        {locations.map((location) =>
          location.coordinates ? (
            <Marker
              key={location.id}
              icon={createMarkerIcon(location.id === selectedId)}
              position={[
                location.coordinates.latitude,
                location.coordinates.longitude,
              ]}
              eventHandlers={{
                click: () => onSelect?.(location.id),
              }}
            >
              <Popup>
                <strong>{location.name}</strong>
                {(location.address || location.city) && (
                  <span>{location.address || location.city}</span>
                )}
                {location.unitId ? (
                  <Link to={`/units/${encodeURIComponent(location.unitId)}`}>
                    View unit
                  </Link>
                ) : null}
              </Popup>
            </Marker>
          ) : null,
        )}
      </MapContainer>
    </div>
  );
}
