import { configuredZoneCoordinates } from "../data/locations";

function normalizeName(name) {
  return String(name ?? "")
    .trim()
    .toLowerCase();
}

function getApiCoordinates(zone) {
  const latitude = Number(zone.latitude ?? zone.lat ?? zone.location?.latitude);
  const longitude = Number(
    zone.longitude ?? zone.lng ?? zone.location?.longitude,
  );

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return { latitude, longitude };
  }

  const coordinates =
    zone.coordinates ??
    zone.location?.coordinates ??
    zone.geometry?.coordinates;

  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    const [longitudeValue, latitudeValue] = coordinates.map(Number);
    if (Number.isFinite(latitudeValue) && Number.isFinite(longitudeValue)) {
      return { latitude: latitudeValue, longitude: longitudeValue };
    }
  }

  return null;
}

function mapZoneLocation(zone) {
  const coordinates =
    getApiCoordinates(zone) ??
    configuredZoneCoordinates[normalizeName(zone.name)];
  const relatedUnit =
    zone.unit ??
    zone.units?.[0] ??
    zone.projects?.flatMap((project) => project.units ?? [])[0];

  return {
    id: zone.id,
    name: zone.name,
    city: zone.city,
    address:
      zone.address_en ??
      zone.address ??
      zone.location?.address_en ??
      zone.location?.address ??
      "",
    unitId:
      relatedUnit?.id ?? relatedUnit?._id ?? zone.unitId ?? zone.unit_id ?? "",
    description: zone.description,
    coordinates: coordinates ?? null,
  };
}

export function mapZoneLocations(zones) {
  return zones.map(mapZoneLocation);
}
