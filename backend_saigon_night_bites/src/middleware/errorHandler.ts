import type { Request, Response, NextFunction } from 'express';

const SAFE_MESSAGES: Record<number, string> = {
  400: 'Yêu cầu không hợp lệ',
  401: 'Bạn cần đăng nhập để thực hiện thao tác này',
  403: 'Bạn không có quyền thực hiện thao tác này',
  404: 'Không tìm thấy tài nguyên yêu cầu',
  409: 'Dữ liệu đã tồn tại',
  429: 'Hệ thống đang bận, vui lòng thử lại sau ít phút',
  500: 'Đã xảy ra lỗi máy chủ, vui lòng thử lại sau',
};

export class AppError extends Error {
  statusCode: number;
  userMessage: string;

  constructor(message: string, statusCode: number, userMessage?: string) {
    super(message);
    this.statusCode = statusCode;
    this.userMessage = userMessage ?? SAFE_MESSAGES[statusCode] ?? SAFE_MESSAGES[500];
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[ErrorHandler]', err.message ?? err);
  const statusCode: number = err.statusCode ?? err.status ?? 500;
  const message: string = err.userMessage ?? SAFE_MESSAGES[statusCode] ?? SAFE_MESSAGES[500];
  res.status(statusCode).json({ success: false, error: message });
}
