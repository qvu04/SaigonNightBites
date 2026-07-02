import type { Request, Response, NextFunction } from 'express';
import * as aiService from '../services/aiService.js';
import * as historyService from '../services/historyService.js';
import { getMockComments } from '../services/mockComments.js';
import type { Mood, Budget } from '../types/index.js';

const VALID_MOODS = new Set<Mood>(['tired', 'happy', 'date', 'group', 'sweet', 'savory']);
const VALID_BUDGETS = new Set<Budget>(['low', 'mid', 'high']);
const VALID_RADII = new Set([1000, 2000, 3000, 5000]);

export async function recommend(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { mood, budget, radius, latitude, longitude } = req.body as {
      mood?: string;
      budget?: string;
      radius?: unknown;
      latitude?: unknown;
      longitude?: unknown;
    };

    if (!VALID_MOODS.has(mood as Mood)) {
      res.status(400).json({ success: false, error: 'Tâm trạng không hợp lệ' });
      return;
    }
    if (!VALID_BUDGETS.has(budget as Budget)) {
      res.status(400).json({ success: false, error: 'Ngân sách không hợp lệ' });
      return;
    }
    if (!VALID_RADII.has(Number(radius))) {
      res.status(400).json({ success: false, error: 'Bán kính không hợp lệ (1000/2000/3000/5000)' });
      return;
    }

    const lat = parseFloat(String(latitude));
    const lng = parseFloat(String(longitude));

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({ success: false, error: 'Tọa độ không hợp lệ' });
      return;
    }
    if (lat < 10.3 || lat > 11.2 || lng < 106.3 || lng > 107.1) {
      res.status(400).json({ success: false, error: 'Vị trí phải nằm trong khu vực TP.HCM' });
      return;
    }

    const { keywords, reason } = await aiService.getAIRecommendation(mood as Mood, budget as Budget);

    const historyId = await historyService.saveSearchHistory(req.user.userId, {
      mood: mood as Mood,
      budget: budget as Budget,
      radius: Number(radius),
      ai_keywords: keywords,
      ai_reason: reason,
      latitude: lat,
      longitude: lng,
    });

    res.status(200).json({ success: true, data: { keywords, reason, historyId } });
  } catch (err) {
    next(err);
  }
}

export async function getInsights(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name } = req.body as { name?: unknown };

    if (typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ success: false, error: 'Thiếu tham số: name' });
      return;
    }

    const comments = getMockComments(name.trim().slice(0, 200));
    const insight = await aiService.analyzeProsCons(name.trim().slice(0, 200), comments);

    res.status(200).json({ success: true, data: insight });
  } catch (err) {
    next(err);
  }
}
