import axios from 'axios';
import type { Place } from '../types/index.js';

const PLACES_URL = 'https://places.googleapis.com/v1/places:searchText';
const MIN_RATING = 4.0;
const MAX_RESULTS = 10;

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function buildPhotoUrl(photoName: string): string | null {
  if (!photoName || !process.env.GOOGLE_PLACES_API_KEY) return null;
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${process.env.GOOGLE_PLACES_API_KEY}`;
}

export async function searchNearbyPlaces(
  keywords: string[],
  lat: number,
  lng: number,
  radius: number
): Promise<Place[]> {
  const { data } = await axios.post(
    PLACES_URL,
    {
      textQuery: keywords[0],
      languageCode: 'vi',
      openNow: true,
      maxResultCount: 20,
      locationBias: {
        circle: { center: { latitude: lat, longitude: lng }, radius },
      },
      rankPreference: 'DISTANCE',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.location,places.currentOpeningHours,places.photos',
      },
      timeout: 8000,
    }
  );

  return ((data.places ?? []) as Record<string, any>[])
    .filter((p) => (p.rating ?? 0) >= MIN_RATING)
    .map((p) => ({
      place_id: p.id as string,
      name: (p.displayName?.text ?? '') as string,
      rating: (p.rating ?? 0) as number,
      user_ratings_total: (p.userRatingCount ?? 0) as number,
      vicinity: (p.formattedAddress ?? '') as string,
      location: { lat: p.location.latitude as number, lng: p.location.longitude as number },
      open_now: (p.currentOpeningHours?.openNow ?? true) as boolean,
      photo_url: p.photos?.[0]?.name ? buildPhotoUrl(p.photos[0].name as string) : null,
      distance: haversineDistance(lat, lng, p.location.latitude as number, p.location.longitude as number),
    }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, MAX_RESULTS);
}
