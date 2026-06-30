const SAFE_MESSAGES = {
  400: 'Yêu cầu không hợp lệ',
  401: 'Bạn cần đăng nhập để thực hiện thao tác này',
  403: 'Bạn không có quyền thực hiện thao tác này',
  404: 'Không tìm thấy tài nguyên yêu cầu',
  409: 'Dữ liệu đã tồn tại',
  429: 'Hệ thống đang bận, vui lòng thử lại sau ít phút',
  500: 'Đã xảy ra lỗi máy chủ, vui lòng thử lại sau',
};

// Controllers that want to expose a custom message to the client must set err.userMessage
export class AppError extends Error {
  constructor(message, statusCode, userMessage) {
    super(message);
    this.statusCode = statusCode;
    this.userMessage = userMessage || SAFE_MESSAGES[statusCode] || SAFE_MESSAGES[500];
  }
}

export function errorHandler(err, req, res, next) {
  // Always log full error server-side for debugging
  console.error('[ErrorHandler]', err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  // Only expose userMessage (set explicitly by AppError) — never err.message from third-party libs
  const message = err.userMessage || SAFE_MESSAGES[statusCode] || SAFE_MESSAGES[500];

  res.status(statusCode).json({ success: false, error: message });
}
