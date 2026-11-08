import MapView from "./MapView";
import { mapZoneLocations } from "../utils/locations";

export default function MapPreview({ zones }) {
  const locations = mapZoneLocations(zones).filter(
    (location) => location.coordinates,
  );

  if (locations.length === 0) {
    return (
      <p className="map-preview-empty" role="status">
        Map coordinates are not available for these locations.
      </p>
    );
  }

  return <MapView locations={locations} preview />;
}
