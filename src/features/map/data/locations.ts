type Coordinates = {
  latitude: number;
  longitude: number;
};

export const configuredZoneCoordinates = {
  alexandria: { latitude: 31.2001, longitude: 29.9187 },
  cairo: { latitude: 30.0444, longitude: 31.2357 },
  giza: { latitude: 29.987, longitude: 31.2118 },
  sinai: { latitude: 29.5, longitude: 33.8 },
} satisfies Record<string, Coordinates>;
