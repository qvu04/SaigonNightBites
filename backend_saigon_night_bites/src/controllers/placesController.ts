import type { Request, Response, NextFunction } from 'express';
import * as placesService from '../services/placesService.js';
import * as aiService from '../services/aiService.js';
import type { Place } from '../types/index.js';

const FINAL_RESULT_COUNT = 10;

export async function searchPlaces(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { keywords, reason, latitude, longitude, radius } = req.query as Record<string, string>;

    if (!keywords || !latitude || !longitude || !radius) {
      res.status(400).json({
        success: false,
        error: 'Thiếu tham số: keywords, latitude, longitude, radius',
      });
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = Math.min(5000, Math.max(1000, parseInt(radius, 10)));

    if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
      res.status(400).json({ success: false, error: 'Tọa độ hoặc bán kính không hợp lệ' });
      return;
    }

    const keywordList = keywords.split(',').map((k) => k.trim()).filter(Boolean);
    const candidates = await placesService.searchNearbyPlaces(keywordList, lat, lng, rad);

    let places: Place[] = candidates.slice(0, FINAL_RESULT_COUNT);

    try {
      const ranked = await aiService.rankPlacesByRelevance(candidates, keywordList, reason ?? '');
      if (ranked.length > 0) {
        const reasonById = new Map(ranked.map((r) => [r.place_id, r.ai_reason]));
        const candidateById = new Map(candidates.map((c) => [c.place_id, c]));
        places = ranked
          .map((r) => candidateById.get(r.place_id))
          .filter((p): p is Place => Boolean(p))
          .map((p) => ({ ...p, ai_reason: reasonById.get(p.place_id) ?? null }));
      }
    } catch (rankErr) {
      // AI rerank là lớp tăng cường, lỗi Groq không được làm hỏng kết quả tìm kiếm gốc
      console.error('[rankPlacesByRelevance]', rankErr);
    }

    res.status(200).json({ success: true, data: { places, totalFound: places.length } });
  } catch (err) {
    next(err);
  }
}
