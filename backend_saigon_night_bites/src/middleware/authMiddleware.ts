import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService.js';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Không tìm thấy token xác thực' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, error: 'Token đã hết hạn, vui lòng đăng nhập lại' });
    } else {
      res.status(401).json({ success: false, error: 'Token không hợp lệ' });
    }
  }
}
