import axios from 'axios';
import OpeningHours from 'opening_hours';
import type { Place } from '../types/index.js';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const MAX_RESULTS = 10;
const CANDIDATE_POOL = 20;

// TODO: rating thật cần Google Places/Foursquare (chưa tích hợp) — placeholder này chỉ hiện ngoài production để test UI, tắt hẳn ở production để không hiện số giả cho người dùng thật
const PLACEHOLDER_RATING = process.env.NODE_ENV === 'production' ? 0 : 4.0;

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

function buildQuery(lat: number, lng: number, radius: number): string {
  return `[out:json][timeout:8];(node["amenity"~"restaurant|cafe|fast_food|food_court"](around:${radius},${lat},${lng}););out body ${MAX_RESULTS * 3};`;
}

// null = không có/không parse được opening_hours tag -> chưa chắc chắn, để FoodCard ẩn badge thay vì đoán bừa
function computeOpenNow(openingHoursTag: unknown): boolean | null {
  if (typeof openingHoursTag !== 'string' || !openingHoursTag.trim()) return null;
  try {
    return new OpeningHours(openingHoursTag).getState();
  } catch {
    return null;
  }
}

// Hầu hết quán ăn nhỏ ở OSM không có addr:street đầy đủ — ghép thêm số nhà/phường/quận nếu có để tránh phải fallback về "TP.HCM" chung chung
function buildVicinity(tags: Record<string, any>): string {
  const streetLine = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ');
  const parts = [
    streetLine,
    tags['addr:suburb'] || tags['addr:quarter'],
    tags['addr:district'],
    tags['addr:city'],
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : 'TP.HCM';
}

// Overpass không hỗ trợ lọc theo món ăn — trả về pool ứng viên để aiService.rankPlacesByRelevance chọn lọc theo keywords/mood
export async function searchNearbyPlaces(
  _keywords: string[],
  lat: number,
  lng: number,
  radius: number
): Promise<Place[]> {
  try {
    const { data } = await axios.post(OVERPASS_URL, buildQuery(lat, lng, radius), {
      headers: {
        'Content-Type': 'text/plain',
        'User-Agent': 'SaigonNightBites/1.0',
      },
      timeout: 10000,
    });

    const elements: Record<string, any>[] = data.elements ?? [];

    return elements
      .filter((el) => el.tags?.name)
      .map((el) => {
        const tags = el.tags ?? {};
        return {
          place_id: String(el.id),
          name: (tags.name ?? '') as string,
          rating: PLACEHOLDER_RATING,
          user_ratings_total: 0,
          vicinity: buildVicinity(tags),
          location: { lat: el.lat as number, lng: el.lon as number },
          open_now: computeOpenNow(tags['opening_hours']),
          photo_url: null,
          distance: haversineDistance(lat, lng, el.lat as number, el.lon as number),
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, CANDIDATE_POOL);
  } catch {
    // Trả về mảng rỗng nếu Overpass timeout hoặc lỗi mạng
    return [];
  }
}
