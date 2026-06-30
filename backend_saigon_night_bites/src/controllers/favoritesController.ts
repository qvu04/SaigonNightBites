import type { Request, Response, NextFunction } from 'express';
import * as favoritesService from '../services/favoritesService.js';
import type { AddFavoriteInput } from '../types/index.js';

export async function getFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const favorites = await favoritesService.getUserFavorites(req.user.userId);
    res.status(200).json({ success: true, data: { favorites } });
  } catch (err) {
    next(err);
  }
}

export async function addFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { place_id, name, rating, vicinity, location, photo_url } = req.body as AddFavoriteInput;

    if (!place_id || !name) {
      res.status(400).json({ success: false, error: 'place_id và name là bắt buộc' });
      return;
    }
    if (rating !== undefined && (typeof rating !== 'number' || rating < 0 || rating > 5)) {
      res.status(400).json({ success: false, error: 'Rating phải là số từ 0 đến 5' });
      return;
    }
    if (location && (typeof location.lat !== 'number' || typeof location.lng !== 'number')) {
      res.status(400).json({ success: false, error: 'location phải có lat và lng là số' });
      return;
    }

    const favorite = await favoritesService.addUserFavorite(req.user.userId, {
      place_id, name, rating, vicinity, location, photo_url,
    });

    res.status(201).json({ success: true, data: { favorite } });
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ success: false, error: 'Quán này đã có trong danh sách yêu thích' });
      return;
    }
    next(err);
  }
}

export async function removeFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);

    const existing = await favoritesService.findUserFavorite(req.user.userId, id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Không tìm thấy quán yêu thích này' });
      return;
    }

    await favoritesService.removeUserFavorite(req.user.userId, id);
    res.status(200).json({ success: true, data: { message: 'Đã xóa khỏi danh sách yêu thích' } });
  } catch (err) {
    next(err);
  }
}
