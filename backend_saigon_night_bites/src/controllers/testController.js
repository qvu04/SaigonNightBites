import { getModel } from '../config/gemini.js';
import axios from 'axios';

async function probeGemini() {
  const start = Date.now();
  const model = getModel();
  const result = await model.generateContent('Reply with valid JSON: {"ok":true}');
  const text = result.response.text().trim();
  return { ok: true, message: `Phản hồi hợp lệ: ${text.slice(0, 60)}`, latencyMs: Date.now() - start };
}

async function probePlaces() {
  const start = Date.now();
  try {
    const { data } = await axios.post(
      'https://places.googleapis.com/v1/places:searchText',
      {
        textQuery: 'phở',
        languageCode: 'vi',
        openNow: true,
        maxResultCount: 1,
        locationBias: {
          circle: {
            center: { latitude: 10.7769, longitude: 106.7009 },
            radius: 1000,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.rating',
        },
        timeout: 8000,
      }
    );
    const count = data.places?.length ?? 0;
    return { ok: true, message: `Tìm thấy ${count} kết quả (Places API New)`, latencyMs: Date.now() - start };
  } catch (err) {
    const status = err.response?.status;
    const apiMsg =
      err.response?.data?.error?.message ||
      err.response?.data?.error?.status ||
      err.message;
    const hint =
      status === 403
        ? ' → Vào GCP Console bật "Places API (New)" và kiểm tra API key restrictions'
        : '';
    return { ok: false, message: `[${status ?? 'ERR'}] ${apiMsg}${hint}`, latencyMs: Date.now() - start };
  }
}

export async function testKeys(req, res, next) {
  try {
    const [geminiResult, placesResult] = await Promise.allSettled([probeGemini(), probePlaces()]);

    const gemini =
      geminiResult.status === 'fulfilled'
        ? geminiResult.value
        : { ok: false, message: geminiResult.reason?.message || 'Lỗi không xác định', latencyMs: null };

    const places =
      placesResult.status === 'fulfilled'
        ? placesResult.value
        : { ok: false, message: placesResult.reason?.message || 'Lỗi không xác định', latencyMs: null };

    res.json({ success: true, data: { gemini, places } });
  } catch (err) {
    next(err);
  }
}
