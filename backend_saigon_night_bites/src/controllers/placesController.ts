import type { Request, Response, NextFunction } from 'express';
import * as placesService from '../services/placesService.js';

export async function searchPlaces(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { keywords, latitude, longitude, radius } = req.query as Record<string, string>;

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
    const places = await placesService.searchNearbyPlaces(keywordList, lat, lng, rad);

    res.status(200).json({ success: true, data: { places, totalFound: places.length } });
  } catch (err) {
    next(err);
  }
}
