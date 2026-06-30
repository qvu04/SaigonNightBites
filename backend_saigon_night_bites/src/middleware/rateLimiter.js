import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Quá nhiều yêu cầu đăng nhập, vui lòng thử lại sau 15 phút' },
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.user?.userId || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Bạn đã dùng hết lượt gợi ý AI trong giờ này, vui lòng thử lại sau' },
});

export const placesLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => req.user?.userId || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Quá nhiều yêu cầu tìm kiếm, vui lòng thử lại sau' },
});
