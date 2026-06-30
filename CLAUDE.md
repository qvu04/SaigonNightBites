# CLAUDE.md — SaigonNightBites

## 1. Dự án này làm gì?

**SaigonNightBites** là ứng dụng web full-stack giải quyết bài toán "Tối nay ăn gì tại TP.HCM?" bằng kiến trúc **AI-driven Data Fetching**:

1. **Frontend** thu thập ngữ cảnh người dùng: tọa độ GPS, thời tiết hiện tại, tâm trạng (mệt mỏi, hẹn hò, thèm ngọt…), ngân sách.
2. **Backend** đóng gói ngữ cảnh đó gửi lên **Gemini API** với `system instruction` nghiêm ngặt, ép AI trả về JSON thuần chứa từ khóa món ăn tiếng Việt (không bịa địa chỉ).
3. Backend dùng từ khóa đó gọi **Google Places API** để lấy danh sách quán ăn thực tế xung quanh tọa độ người dùng (bán kính 1–5 km, rating ≥ 4.0 ⭐, đang mở cửa).
4. Kết quả hiển thị trên bản đồ, kèm nút dẫn đường và gọi xe. Người dùng có thể lưu quán yêu thích, xem lịch sử, và tag nhanh cho quán để cải thiện gợi ý AI.

Toàn bộ giao diện bằng **tiếng Việt**, hỗ trợ **dark mode**, tối ưu cho **mobile (375 px)**.

---

## 2. Stack công nghệ chính

### Backend — `backend_saigon_night_bites/`
| Công nghệ | Phiên bản tối thiểu | Vai trò |
|---|---|---|
| Node.js | 18 LTS | Runtime |
| Express.js | 4.x | REST API framework |
| Supabase JS SDK | 2.x | Client kết nối Supabase (PostgreSQL) |
| `@google/generative-ai` | latest | Gemini API SDK |
| `axios` | 1.x | Gọi Google Places API (HTTP) |
| `jsonwebtoken` | 9.x | Ký & xác thực JWT |
| `bcryptjs` | 2.x | Hash mật khẩu (cost factor 12) |
| `dotenv` | 16.x | Load biến môi trường |
| `cors` | 2.x | CORS middleware |
| `express-rate-limit` | 7.x | Rate limiting chống abuse |

**Database (Supabase / PostgreSQL)**
- Bảng: `users`, `search_history`, `favorite_places`
- Schema khởi tạo tại: `backend_saigon_night_bites/db/schema.sql`

### Frontend — `frontend_saigon_night_bites/`
| Công nghệ | Vai trò |
|---|---|
| React 18 + Vite | UI framework + build tool |
| TailwindCSS 3 | Styling — mobile-first |
| shadcn/ui | Component library có sẵn |
| Framer Motion (`motion`) | Animation: trượt menu, hiệu ứng chọn món |
| React Hook Form | Quản lý form nhập ngân sách, khẩu vị |
| React Router v6 | Client-side routing |
| Axios | HTTP client gọi backend |
| React Icons | Icon ẩm thực, bản đồ, thời tiết |
| Sonner (Toaster) | Thông báo toast |
| Google Maps JS API / Leaflet | Hiển thị bản đồ trực quan |

### External APIs
| API | Mục đích |
|---|---|
| Google Gemini API | Phân tích tâm trạng → gợi ý món ăn JSON |
| Google Places API (New) | Tìm quán ăn theo tọa độ + từ khóa |
| Google Maps JS API | Nhúng bản đồ vào giao diện |
| Geolocation API (browser) | Lấy tọa độ GPS người dùng |

---

## 3. File không được đụng vào

Các file sau **tuyệt đối không sửa, xóa, hoặc commit** trừ khi có lý do rõ ràng và đã review kỹ:

```
# Biến môi trường — chứa secret keys
backend_saigon_night_bites/.env
frontend_saigon_night_bites/.env

# Schema database — thay đổi sai sẽ phá vỡ dữ liệu production
backend_saigon_night_bites/db/schema.sql

# File template môi trường — không thêm giá trị thật vào đây
backend_saigon_night_bites/.env.example
frontend_saigon_night_bites/.env.example

# Lock files — không sửa tay, chỉ để package manager cập nhật
backend_saigon_night_bites/package-lock.json
frontend_saigon_night_bites/package-lock.json

# Config Tailwind / Vite / PostCSS gốc — thay đổi ảnh hưởng toàn bộ build
frontend_saigon_night_bites/tailwind.config.js
frontend_saigon_night_bites/vite.config.js
frontend_saigon_night_bites/postcss.config.js
```

> Nếu cần thêm bảng hoặc thay đổi schema, tạo file migration mới trong `backend_saigon_night_bites/db/migrations/` — không sửa trực tiếp `schema.sql`.

---

## 4. Coding Convention

### Chung
- Ngôn ngữ code: **tiếng Anh** (tên biến, hàm, comment kỹ thuật).
- Ngôn ngữ giao diện người dùng: **tiếng Việt** (label, placeholder, thông báo).
- Không dùng `var` — chỉ dùng `const` / `let`.
- Không commit code có `console.log` debug còn sót lại.
- Mỗi file chỉ làm **một việc duy nhất** (Single Responsibility).
- Không viết comment giải thích "WHAT" (code đọc được tự giải thích); chỉ comment khi giải thích "WHY" — ràng buộc ẩn, quirk của API, workaround.

### Đặt tên
| Loại | Convention | Ví dụ |
|---|---|---|
| Biến / hàm JS | `camelCase` | `getUserLocation`, `favoriteList` |
| Component React | `PascalCase` | `FoodCard`, `MapContainer` |
| File component | `PascalCase.jsx` | `FoodCard.jsx` |
| File utility / hook | `camelCase.js` | `formatDistance.js`, `useAuth.js` |
| Hằng số | `UPPER_SNAKE_CASE` | `MAX_RADIUS_KM`, `JWT_EXPIRES_IN` |
| Bảng DB | `snake_case` | `search_history`, `favorite_places` |
| Cột DB | `snake_case` | `user_id`, `created_at` |
| Route API | `kebab-case`, số nhiều | `/api/favorite-places`, `/api/auth` |

### Backend (Node.js / Express)
- Cấu trúc thư mục: `controllers/` → `routes/` → `middleware/` → `config/`.
- Controller không chứa logic business phức tạp — tách ra service nếu hàm > 40 dòng.
- Mọi async handler phải bọc trong `try/catch` và gọi `next(error)`.
- Không hardcode URL, key, hay config — luôn đọc từ `process.env`.
- Response JSON nhất quán:
  ```json
  { "success": true, "data": { ... } }
  { "success": false, "error": "Mô tả lỗi ngắn gọn" }
  ```
- HTTP status code đúng ngữ nghĩa: `200` OK, `201` Created, `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found, `500` Server Error.

### Frontend (React / Vite)
- Dùng **functional component** + **hooks** — không dùng class component.
- State toàn cục qua `Context` (`AuthContext`, `ThemeContext`, `LocationContext`) — không prop-drill quá 2 cấp.
- Mọi lời gọi API đặt trong `src/api/` — component không gọi `axios` trực tiếp.
- Không inline style — dùng Tailwind class. Nếu cần style động thì dùng `clsx` / `cn()` của shadcn.
- Ảnh / icon ẩm thực lấy từ `React Icons` hoặc public CDN — không commit ảnh binary vào repo.
- Loading state phải có **skeleton** thay vì spinner trần (đã có pattern sẵn trong codebase).

### Git
- Branch: `feature/<tên-ngắn>`, `fix/<tên-lỗi>`, `chore/<việc-vặt>`.
- Commit message theo **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- Không commit thẳng vào `main` — luôn tạo branch và merge qua Pull Request.

---

## 5. Security Baseline

### 5.1 Quản lý Secret & Biến Môi Trường
- **Tuyệt đối không commit** `.env` vào git. File `.gitignore` phải có dòng `*.env` và `.env*`.
- `.env.example` chỉ chứa tên biến với giá trị placeholder (`YOUR_KEY_HERE`) — không bao giờ chứa giá trị thật.
- Biến bắt buộc phía backend:
  ```
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY   # dùng service_role, không dùng anon key ở backend
  JWT_SECRET                  # tối thiểu 64 ký tự random, entropy cao
  GEMINI_API_KEY
  GOOGLE_PLACES_API_KEY
  NODE_ENV                    # "development" | "production"
  ```
- Biến bắt buộc phía frontend (chỉ expose những gì thực sự cần):
  ```
  VITE_API_BASE_URL           # URL backend
  VITE_GOOGLE_MAPS_API_KEY    # Maps JS API key (restrict domain + API scope trên GCP)
  ```
- Rotate key ngay lập tức nếu phát hiện bị lộ lên git hoặc log.

### 5.2 Authentication & Authorization
- Mật khẩu hash bằng **bcryptjs** với `saltRounds = 12` — không hash SHA/MD5.
- JWT phải có `expiresIn` ngắn (ví dụ `15m` cho access token). Nếu cần session dài, implement refresh token lưu trong Supabase.
- Mọi endpoint (trừ `/api/auth/register` và `/api/auth/login`) phải qua middleware xác thực JWT.
- Middleware JWT phải xác thực cả **chữ ký** lẫn **thời gian hết hạn** trước khi truy xuất database.
- Không trả về thông tin nhạy cảm trong response JWT payload — chỉ lưu `userId` và `email`.
- Phía Supabase: backend chỉ dùng `service_role` key (server-side), không bao giờ truyền key này ra frontend.

### 5.3 Input Validation & Injection Prevention
- Validate tất cả input từ request body / query string trước khi xử lý — dùng thư viện như `zod` hoặc `joi`.
- Tọa độ GPS (`latitude`, `longitude`) phải kiểm tra: là số thực, trong khoảng hợp lệ (`lat: -90–90`, `lng: -180–180`).
- `radius` phải bị giới hạn cứng phía backend: `1000 ≤ radius ≤ 5000` (mét) — không tin tham số từ client.
- Prompt gửi cho Gemini phải được **sanitize** trước — không nhúng trực tiếp text người dùng vào prompt template mà không escape. Đây là điểm nguy hiểm **Prompt Injection**.
- Mọi query Supabase phải dùng **parameterized query** (Supabase SDK mặc định làm điều này) — không nối chuỗi SQL thủ công.
- Frontend không bao giờ render HTML trực tiếp từ API response bằng `dangerouslySetInnerHTML`.

### 5.4 API Security
- Bật **CORS** chỉ cho origin cụ thể (không dùng `*` ở production):
  ```js
  cors({ origin: process.env.ALLOWED_ORIGIN })
  ```
- Bật **Rate Limiting** trên tất cả route, đặc biệt ketat hơn với `/api/auth/*` và `/api/ai/*` (vì AI endpoint có chi phí tiền):
  ```
  /api/auth/*     → 10 requests / 15 phút / IP
  /api/ai/*       → 20 requests / 1 giờ / user
  /api/places/*   → 50 requests / 1 giờ / user
  ```
- Dùng **Helmet.js** để set các HTTP security header (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`).
- Không bao giờ trả về stack trace hay thông báo lỗi chi tiết của hệ thống ra client ở production — log phía server, trả về thông báo generic.
- Google Places API Key: trên Google Cloud Console, **restrict** key chỉ cho phép:
  - HTTP Referrer: domain production của app
  - API scope: chỉ `Places API` và `Maps JavaScript API`
- Gemini API Key: restrict theo IP của server nếu có thể.

### 5.5 Geolocation & Privacy
- Tọa độ GPS người dùng là dữ liệu nhạy cảm — chỉ lưu vào `search_history` nếu người dùng đã đăng nhập và đồng ý.
- Không log tọa độ chính xác vào file log hệ thống — nếu cần debug, log theo grid 500 m.
- Cột `latitude` / `longitude` trong DB không được expose qua public Supabase Row Level Security.

### 5.6 Dependency Security
- Chạy `npm audit` trước mỗi lần deploy — không deploy nếu có lỗ hổng `high` / `critical` chưa được xử lý.
- Không cài package không rõ nguồn gốc hoặc package với weekly downloads < 1000 mà không review source.
- Cập nhật dependency định kỳ (tối thiểu 1 tháng/lần), ưu tiên patch và minor version.

### 5.7 Frontend Security
- Không lưu JWT vào `localStorage` nếu có thể — ưu tiên `httpOnly cookie` hoặc in-memory. Nếu bắt buộc dùng `localStorage`, ghi rõ lý do trong code.
- Content Security Policy (CSP) trên frontend Vite build phải giới hạn `script-src` chỉ cho domain của app và Google APIs.
- Mọi link điều hướng ra bên ngoài (Grab, ShopeeFood...) phải có `rel="noopener noreferrer"`.
- Dark mode preference lưu vào `localStorage` — không lưu thông tin tài khoản hay token vào `sessionStorage`.

## PRD (Product Requirements Document)
Xem chi tiết tại **[PRD.md](./PRD.md)**.
