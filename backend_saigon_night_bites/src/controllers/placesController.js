import axios from 'axios';

const PLACES_NEW_URL = 'https://places.googleapis.com/v1/places:searchText';

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function buildPhotoUrl(photoName) {
  if (!photoName || !process.env.GOOGLE_PLACES_API_KEY) return null;
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${process.env.GOOGLE_PLACES_API_KEY}`;
}

export async function searchPlaces(req, res, next) {
  try {
    const { keywords, latitude, longitude, radius } = req.query;

    if (!keywords || !latitude || !longitude || !radius) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu tham số: keywords, latitude, longitude, radius',
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = Math.min(5000, Math.max(1000, parseInt(radius, 10)));

    if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
      return res.status(400).json({ success: false, error: 'Tọa độ hoặc bán kính không hợp lệ' });
    }

    const keywordList = keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const { data } = await axios.post(
      PLACES_NEW_URL,
      {
        textQuery: keywordList[0],
        languageCode: 'vi',
        openNow: true,
        maxResultCount: 20,
        locationBias: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: rad,
          },
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

    const places = (data.places || [])
      .filter((p) => (p.rating ?? 0) >= 4.0)
      .map((p) => ({
        place_id: p.id,
        name: p.displayName?.text || '',
        rating: p.rating ?? 0,
        user_ratings_total: p.userRatingCount ?? 0,
        vicinity: p.formattedAddress || '',
        location: {
          lat: p.location.latitude,
          lng: p.location.longitude,
        },
        open_now: p.currentOpeningHours?.openNow ?? true,
        photo_url: p.photos?.[0]?.name ? buildPhotoUrl(p.photos[0].name) : null,
        distance: haversineDistance(lat, lng, p.location.latitude, p.location.longitude),
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      data: { places, totalFound: places.length },
    });
  } catch (err) {
    next(err);
  }
}
