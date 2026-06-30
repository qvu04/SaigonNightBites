import type { Request, Response, NextFunction } from 'express';
import * as historyService from '../services/historyService.js';

export async function getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const history = await historyService.getUserHistory(req.user.userId);
    res.status(200).json({ success: true, data: { history } });
  } catch (err) {
    next(err);
  }
}
