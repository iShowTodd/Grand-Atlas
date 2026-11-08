import L from "leaflet";

export function createMarkerIcon(active = false) {
  const width = active ? 42 : 34;
  const height = width + 8;

  return L.divIcon({
    className: active
      ? "atlas-map-marker atlas-map-marker-active"
      : "atlas-map-marker",
    html: '<span class="atlas-map-pin"><span class="atlas-map-pin-center"></span></span>',
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height],
  });
}
