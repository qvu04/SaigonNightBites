# SaigonNightBites — Trợ Lý Ẩm Thực Đêm Tích Hợp AI & Google Maps

Ứng dụng web full-stack giúp người dùng giải quyết "nỗi đau quốc dân": *"Tối nay ăn gì tại TP.HCM?"*. Thay vì mất thời gian lướt và chọn, hệ thống sử dụng AI để thấu hiểu tâm trạng, thời tiết, ngân sách, kết hợp với dữ liệu thời gian thực từ Google Maps để đưa ra gợi ý quán ăn có rating cao nhất xung quanh bạn. Toàn bộ giao diện bằng **tiếng Việt**, hỗ trợ **chế độ tối (dark mode)**.

> Bản dựng thử (MVP) theo đúng yêu cầu: backend và frontend tách riêng, tích hợp Gemini AI và Google Places API, cơ sở dữ liệu Supabase (PostgreSQL).

---

## 1. Tính năng

| # | Tính năng | Mô tả |
|---|-----------|-------|
| 1 | Định vị vị trí thông minh | Tự động lấy tọa độ GPS hiện tại của người dùng tại TP.HCM để quét các quán ăn xung quanh trong bán kính từ 1km - 5km. |
| 2 | Gợi ý món ăn bằng AI | AI phân tích thời tiết hiện tại (nắng/mưa/se lạnh) và tâm trạng (mệt mỏi, đi hẹn hò, thèm đồ ngọt...) để gợi ý nhóm món ăn phù hợp nhất dưới dạng JSON. |
| 3 | Lọc địa điểm chuẩn Google Maps | Chỉ hiển thị các quán ăn có **Rating >= 4.0 ⭐** trên Google Maps và **đang mở cửa (Open Now)** vào buổi tối quanh vị trí người dùng. |
| 4 | Lưu lịch sử & Quán ăn yêu thích | Cho phép người dùng lưu lại những quán ăn đắc ý, các món ăn đã từng được AI gợi ý để xem lại khi cần. |
| 5 | Bản đồ trực quan & Dẫn đường | Hiển thị bản đồ trực quan (Google Maps/Leaflet) kèm nút bấm điều hướng nhanh sang ứng dụng bản đồ hoặc ứng dụng gọi xe. |
| 6 | Đóng góp & Đánh giá của cộng đồng | Người dùng có thể gắn tag nhanh cho quán (ví dụ: "quán vỉa hè", "có máy lạnh", "hợp đi nhóm") để tối ưu bộ lọc cho AI. |
| 7 | Dark mode | Giao diện ban đêm (Dark mode) dịu mắt, phù hợp với thói quen tìm đồ ăn đêm của người dùng, có hiệu ứng trượt mượt mà và ghi nhớ lựa chọn. |

---

## 2. Công nghệ sử dụng

**Backend**
- Node.js + Express.js — REST API
- Supabase (PostgreSQL) — cơ sở dữ liệu (lưu tài khoản, lịch sử tìm kiếm, danh sách quán yêu thích)
- Google Gemini API (hoặc OpenAI API) — Xử lý logic AI và phân tích prompt
- Google Places API — Truy vấn dữ liệu địa điểm thực tế từ Google
- JWT + bcryptjs — xác thực & mã hóa mật khẩu

**Frontend**
- React.js (Vite)
- TailwindCSS — giao diện mobile-first tối ưu cho điện thoại
- Framer Motion (thư viện `motion`) — animation trượt menu, hiệu ứng chọn món
- React Hook Form — quản lý form (nhập ngân sách, chọn khẩu vị)
- React Icons — các icon ẩm thực, bản đồ, thời tiết
- Axios + React Router
- Sử dụng thư viện shadcn/ui để xử lý component giao diện có sẵn
- Toaster xử lý thông báo actions
- Xử lý loading skeleton

---

## 3. Cấu trúc thư mục
.
├── backend_saigon_night_bites/ # API Node/Express
│ ├── db/schema.sql # Script tạo bảng người dùng, lịch sử, quán yêu thích
│ └── src/
│ ├── config/ # Kết nối Supabase & cấu hình AI SDK
│ ├── controllers/ # Logic xử lý AI Prompt, fetch Google Places, Auth
│ ├── middleware/ # Xác thực JWT, xử lý lỗi API
│ ├── routes/ # Khai báo endpoint (/api/ai, /api/places...)
│ └── index.js # Khởi động server
│
├── frontend_saigon_night_bites/ # Giao diện React
│ └── src/
│ ├── api/ # Cấu hình axios kết nối backend
│ ├── components/ # Layout, FoodCard, MapContainer, DarkModeSwitch...
│ ├── context/ # AuthContext, ThemeContext, LocationContext
│ ├── pages/ # Home (Chọn tâm trạng), Discovery (Kết quả AI), SavedPlaces...
│ └── utils/ # Định dạng khoảng cách, xử lý icon thời tiết, format tiền Việt Nam,..
│
└── README.md

---

## 4. Hướng dẫn cài đặt & chạy

### Yêu cầu
- Node.js phiên bản 18 trở lên
- Một tài khoản Supabase, một API Key của Google Gemini (miễn phí) và một API Key của Google Maps Cloud.

### Bước 1 — Tạo cơ sở dữ liệu Supabase
1. Tạo một project mới trên Supabase.
2. Vào **SQL Editor**, mở file `backend_saigon_night_bites/db/schema.sql`, dán toàn bộ nội dung và bấm **Run** để tạo các bảng `users`, `search_history`, `favorite_places`.
3. Lấy thông tin `Project URL` và `service_role` key tại mục **Project Settings → API**.

### Bước 2 — Chạy Backend
```bash
cd backend_saigon_night_bites
cp .env.example .env        # tạo file .env
# Mở .env và điền: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET, GEMINI_API_KEY, GOOGLE_PLACES_API_KEY
npm install
npm run dev                 # chạy backend tại http://localhost:4000
```

### Bước 3 — Chạy Frontend
```bash
cd frontend_saigon_night_bites
cp .env.example .env        # mặc định trỏ tới http://localhost:4000/api
npm install
npm run dev                 # mở ứng dụng tại http://localhost:5173
```

### Bước 4 — Sử dụng
Mở trình duyệt tại `http://localhost:5173` trên giao diện điện thoại (F12 chọn chế độ Mobile). Cấp quyền truy cập vị trí, chọn tâm trạng hiện tại của bạn và để AI săn tìm món ăn đêm phù hợp nhất.

---

## 5. Danh sách API chính

| Phương thức | Endpoint | Chức năng |
|-------------|----------|-----------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập tài khoản |
| POST | `/api/ai/recommend` | Gửi tọa độ + tâm trạng -> AI phân tích và trả về món ăn phù hợp |
| GET  | `/api/places/search` | Nhận món ăn từ AI -> Gọi Google Places API lấy danh sách quán > 4.0 sao |
| GET/POST/DELETE | `/api/favorites` | Quản lý danh sách quán ăn yêu thích của người dùng |
| GET | `/api/history` | Xem lại lịch sử các đêm trước đã ăn gì |

Tất cả endpoint (trừ đăng ký/đăng nhập) yêu cầu gửi kèm header `Authorization: Bearer <token>`.

---

## 6. Ghi chú về kiến trúc và dữ liệu

Dự án này sử dụng kiến trúc **AI-driven Data Fetching**. Cụ thể: 
1. Frontend thu thập dữ liệu ngữ cảnh (Tọa độ, Thời tiết, Tâm trạng).
2. Backend gửi dữ liệu này cho **Gemini API** kèm theo một `system instruction` nghiêm ngặt để ép AI trả về dữ liệu thuần cấu trúc JSON (chứa từ khóa món ăn tiếng Việt).
3. Backend nhận kết quả JSON từ AI, bóc tách từ khóa món ăn và tiếp tục gọi **Google Places API** để truy vấn các địa điểm ăn uống thực tế xung quanh tọa độ của user.
Cách tiếp cận này giúp giảm thiểu hiện tượng AI "bịa" ra địa chỉ quán không có thật (Hallucination) [tại đây](https://foody.vn).

---