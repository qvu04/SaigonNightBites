# CRD.md — Concept Requirements Document
# SaigonNightBites

> Tài liệu này mô tả yêu cầu sản phẩm ở cấp độ khái niệm. Dùng làm kim chỉ nam khi ra quyết định tính năng, thiết kế và kỹ thuật trong suốt quá trình phát triển.

---

## 1. Tôi muốn tạo gì?

Một ứng dụng web **mobile-first**, toàn tiếng Việt, giúp người dùng tại **TP.HCM** tìm được quán ăn tối phù hợp trong vòng dưới 30 giây — không cần lướt, không cần nghĩ.

Hệ thống hoạt động theo luồng 4 bước tự động:

```
[Người dùng nhập tâm trạng + vị trí]
        ↓
[Gemini AI phân tích → trả về JSON từ khóa món ăn]
        ↓
[Google Places API tìm quán thực tế ≥ 4.0 ⭐ đang mở cửa]
        ↓
[Hiển thị kết quả trên bản đồ + danh sách]
```

Tên sản phẩm: **SaigonNightBites**
Loại sản phẩm: Web app (không phải native app)
Phạm vi địa lý: TP.HCM (ban đầu)
Thời điểm sử dụng chính: Buổi tối (18:00 – 23:00)

---

## 2. Người dùng chính

### Nhóm 1 — Người trẻ đô thị TP.HCM (primary)
- Độ tuổi: 18–32
- Thường xuyên ra ngoài ăn tối hoặc order về
- Sử dụng điện thoại là thiết bị chính
- Quen dùng Grab, ShopeeFood, Google Maps
- Đau điểm: mở 3–4 app mà vẫn không biết ăn gì

### Nhóm 2 — Người đi làm văn phòng (secondary)
- Ăn tối sau giờ làm, thường đi nhóm 2–5 người
- Cần chọn nhanh, không muốn tranh luận lâu
- Cần quán gần công ty hoặc gần nhà

### Nhóm 3 — Khách vãng lai / du lịch nội địa (tertiary)
- Không rành địa bàn TP.HCM
- Cần gợi ý đáng tin, có rating thực từ Google
- Ưu tiên quán nổi tiếng, không cần rẻ

### Đặc điểm chung của tất cả nhóm
- Không có thời gian và không muốn đọc review dài
- Muốn kết quả **cá nhân hóa** theo tâm trạng hiện tại
- Tin tưởng Google Maps rating hơn app review nội bộ

---

## 3. Vấn đề cần giải quyết

### Vấn đề cốt lõi
> "Tối nay ăn gì?" là câu hỏi lặp lại hàng ngày nhưng chưa có công cụ nào giải quyết đủ nhanh và đủ cá nhân.

### Phân tích chi tiết

| # | Vấn đề | Hiện trạng | Hậu quả |
|---|--------|------------|---------|
| 1 | Quá nhiều lựa chọn, không biết chọn từ đâu | Google Maps hiển thị hàng trăm quán không phân loại theo tâm trạng | Mất 10–20 phút vẫn chưa quyết định |
| 2 | Gợi ý của AI (ChatGPT) hay "bịa" địa chỉ | AI sinh văn bản không có dữ liệu thực tế | Người dùng đến nơi không tìm thấy quán |
| 3 | App review (Foody, Grab) không cá nhân hóa theo tâm trạng | Hiển thị theo trending / quảng cáo, không theo ngữ cảnh | Gợi ý không phù hợp (thèm bún bò nhưng hiện ra pizza) |
| 4 | Không biết quán còn mở cửa không | Google Maps đôi khi hiển thị giờ sai | Đến nơi thì quán đóng cửa |
| 5 | Nhóm bạn không đồng thuận được | Mỗi người thích một kiểu, không có công cụ trung hòa | Kết thúc bằng ăn cơm nhà |

### Điều SaigonNightBites KHÔNG giải quyết (out of scope v1)
- Đặt bàn trực tuyến
- Đánh giá quán ăn chi tiết (review dài)
- Giao thức ăn về nhà (không tích hợp bếp ảo)
- Gợi ý quán ngoài TP.HCM

---

## 4. Tính năng bắt buộc ở bản đầu tiên (MVP)

Thứ tự ưu tiên theo MoSCoW:

### Must Have (bắt buộc phải có)

| # | Tính năng | Mô tả chi tiết |
|---|-----------|----------------|
| M1 | Đăng ký / Đăng nhập | Email + mật khẩu. JWT auth. Không cần social login ở v1. |
| M2 | Lấy vị trí GPS | Dùng Geolocation API của trình duyệt. Nếu từ chối quyền thì yêu cầu nhập quận thủ công. |
| M3 | Chọn tâm trạng | Giao diện chọn nhanh: tâm trạng (mệt / vui / hẹn hò / đi nhóm / thèm ngọt / thèm mặn), ngân sách (dưới 50k / 50–150k / trên 150k), bán kính (1/2/3/5 km). |
| M4 | AI gợi ý món ăn | Gọi Gemini API với ngữ cảnh người dùng. Nhận về JSON: danh sách 3–5 từ khóa món ăn phù hợp + lý do ngắn. |
| M5 | Tìm quán Google Places | Dùng từ khóa từ AI gọi Places API. Lọc: rating ≥ 4.0, open_now = true, trong bán kính đã chọn. |
| M6 | Hiển thị danh sách quán | Card quán: tên, ảnh, rating, khoảng cách, địa chỉ, tag nhanh. Tối thiểu 5–10 kết quả. |
| M7 | Nút dẫn đường | Link mở Google Maps / Apple Maps app với tọa độ quán. |
| M8 | Dark mode | Toggle sáng/tối. Ghi nhớ lựa chọn bằng localStorage. |

### Should Have (nên có, ưu tiên sau M)

| # | Tính năng | Mô tả chi tiết |
|---|-----------|----------------|
| S1 | Lưu quán yêu thích | Nút tim trên mỗi card. Lưu vào bảng `favorite_places`. |
| S2 | Lịch sử tìm kiếm | Lưu 10 lần gần nhất vào `search_history`. Xem lại ở trang Profile. |
| S3 | Hiển thị bản đồ | Map nhúng hiển thị pin vị trí các quán kết quả. |
| S4 | Loading skeleton | Skeleton placeholder khi đang gọi API — không dùng spinner đơn thuần. |

### Could Have (làm nếu còn thời gian)

| # | Tính năng | Mô tả chi tiết |
|---|-----------|----------------|
| C1 | Tag cộng đồng | Người dùng tag nhanh cho quán: "vỉa hè", "có máy lạnh", "hợp đi nhóm", "ít ồn". |
| C2 | Thời tiết tự động | Gọi Weather API, hiển thị thời tiết hiện tại và để AI tự điều chỉnh gợi ý. |
| C3 | Chia sẻ kết quả | Tạo link share danh sách quán gợi ý cho bạn bè. |

### Won't Have (v1 không làm)
- Group Vote (bỏ phiếu nhóm)
- Đặt bàn
- Tích hợp Grab / ShopeeFood order
- Push notification
- Native mobile app

---

## 5. Dữ liệu đầu vào

### 5.1 Đầu vào từ người dùng (qua UI)

| Trường | Kiểu | Bắt buộc | Ràng buộc | Ví dụ |
|--------|------|----------|-----------|-------|
| `mood` | string | Có | Enum: `tired`, `happy`, `date`, `group`, `sweet`, `savory` | `"date"` |
| `budget` | string | Có | Enum: `low` (≤50k), `mid` (50–150k), `high` (>150k) | `"mid"` |
| `radius` | number | Có | Enum: 1000, 2000, 3000, 5000 (mét) | `2000` |
| `latitude` | number | Có | -90 ≤ lat ≤ 90, phải trong vùng TP.HCM | `10.7769` |
| `longitude` | number | Có | -180 ≤ lng ≤ 180, phải trong vùng TP.HCM | `106.7009` |

### 5.2 Dữ liệu hệ thống tự thu thập

| Nguồn | Dữ liệu | Mục đích |
|-------|---------|---------|
| Browser Geolocation API | `latitude`, `longitude` | Tọa độ GPS hiện tại |
| Weather API (tùy chọn) | Nhiệt độ, trạng thái (nắng/mưa) | Cải thiện ngữ cảnh prompt AI |
| Thời gian hệ thống | Giờ hiện tại | Xác định buổi tối, lọc `open_now` |

### 5.3 Dữ liệu xác thực (Auth)

| Trường | Ràng buộc |
|--------|-----------|
| `email` | Định dạng email hợp lệ, unique trong DB |
| `password` | Tối thiểu 8 ký tự, có chữ + số |

### 5.4 Prompt gửi Gemini (template chuẩn)

```
System: Bạn là trợ lý ẩm thực tại TP.HCM. Chỉ trả về JSON hợp lệ, không giải thích thêm.
User: Tâm trạng: {mood_vi}. Ngân sách: {budget_vi}. Thời tiết: {weather}. 
Thời điểm: {time}. Hãy gợi ý 3-5 từ khóa món ăn phù hợp cho tôi tìm trên Google Maps tại TP.HCM.
Format: { "keywords": ["...", "..."], "reason": "..." }
```

---

## 6. Kết quả đầu ra

### 6.1 Kết quả từ Gemini AI

```json
{
  "keywords": ["bún bò Huế", "cháo lòng", "mì quảng"],
  "reason": "Trời mưa và bạn đang mệt — món nước nóng, đậm đà sẽ giúp phục hồi năng lượng tốt hơn."
}
```

### 6.2 Kết quả từ Google Places API (sau khi lọc)

Mỗi quán ăn trả về:

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `place_id` | string | ID định danh quán trên Google |
| `name` | string | Tên quán |
| `rating` | number | Rating Google (≥ 4.0 sau khi lọc) |
| `user_ratings_total` | number | Tổng số lượt đánh giá |
| `vicinity` | string | Địa chỉ rút gọn |
| `geometry.location` | object | `{ lat, lng }` tọa độ quán |
| `opening_hours.open_now` | boolean | Đang mở cửa hay không |
| `photos[0]` | object | Ảnh đại diện quán (dùng Places Photo API) |
| `distance` | number | Khoảng cách từ người dùng (tính thêm, đơn vị mét) |

### 6.3 Response API chuẩn trả về Frontend

```json
{
  "success": true,
  "data": {
    "aiSuggestion": {
      "keywords": ["bún bò Huế", "cháo lòng"],
      "reason": "Trời mưa, bạn mệt — nên ăn nóng."
    },
    "places": [
      {
        "place_id": "ChIJ...",
        "name": "Bún Bò Huế Mợ Tư",
        "rating": 4.5,
        "user_ratings_total": 312,
        "vicinity": "45 Nguyễn Trãi, Quận 1",
        "location": { "lat": 10.771, "lng": 106.698 },
        "open_now": true,
        "photo_url": "https://maps.googleapis.com/...",
        "distance": 850
      }
    ],
    "totalFound": 8
  }
}
```

### 6.4 Kết quả hiển thị trên UI

- Lý do gợi ý của AI (1–2 câu, tiếng Việt)
- Danh sách 5–10 card quán ăn, sắp xếp theo `rating` giảm dần
- Bản đồ với pin vị trí từng quán
- Khoảng cách hiển thị: "850 m" hoặc "1.2 km"
- Badge trạng thái: "Đang mở cửa" (xanh) / "Sắp đóng" (vàng)

---

## 7. Giao diện mong muốn

### Nguyên tắc thiết kế
- **Mobile-first**: thiết kế chuẩn cho màn 375 px, responsive lên desktop.
- **Dark mode mặc định** vào ban đêm (18:00–06:00), light mode ban ngày, người dùng có thể toggle.
- **Tối giản — hành động nhanh**: người dùng phải chọn xong tâm trạng và nhận kết quả trong tối đa 3 lần chạm.
- Ngôn ngữ: **100% tiếng Việt** trên toàn bộ UI.
- Font: hệ thống (Inter / SF Pro) — không dùng font nặng.

### Màu sắc

| Token | Light | Dark | Dùng cho |
|-------|-------|------|---------|
| Background | `#FAFAFA` | `#0F0F0F` | Nền trang |
| Surface | `#FFFFFF` | `#1A1A1A` | Card, modal |
| Primary | `#F97316` | `#FB923C` | CTA button, icon active |
| Text primary | `#111827` | `#F9FAFB` | Tiêu đề |
| Text secondary | `#6B7280` | `#9CA3AF` | Mô tả phụ |
| Success | `#22C55E` | `#4ADE80` | Badge "Đang mở cửa" |
| Border | `#E5E7EB` | `#2D2D2D` | Viền card |

### Cấu trúc màn hình

```
1. Màn Home (Chọn tâm trạng)
   ├── Header: Logo + Toggle dark mode
   ├── Section: Greeting ("Tối nay bạn muốn ăn gì?")
   ├── Grid tâm trạng: 6 nút emoji lớn (Mệt / Vui / Hẹn hò / Đi nhóm / Thèm ngọt / Thèm mặn)
   ├── Selector ngân sách: 3 chip (Dưới 50k / 50–150k / Trên 150k)
   ├── Slider bán kính: 1 / 2 / 3 / 5 km
   └── CTA Button: "Tìm quán ngay 🍜" (full-width, orange)

2. Màn Discovery (Kết quả AI)
   ├── Header: Nút quay lại + "Kết quả gợi ý"
   ├── AI Insight Card: Lý do gợi ý (nền gradient cam nhạt)
   ├── Map Container: Google Maps nhúng, pin các quán
   ├── List quán ăn (scroll dọc):
   │   └── FoodCard: Ảnh | Tên | ⭐ Rating | 📍 Khoảng cách | Badge mở cửa | Nút ♡ | Nút Dẫn đường
   └── Loading state: Skeleton 3 card khi đang gọi API

3. Màn Saved Places (Quán yêu thích)
   ├── Header: "Quán yêu thích của bạn"
   └── Danh sách card đã lưu (giống FoodCard nhưng có nút xóa)

4. Màn History (Lịch sử)
   ├── Header: "Lịch sử tìm kiếm"
   └── Timeline: Ngày + tâm trạng + danh sách quán đã xem

5. Màn Auth (Đăng nhập / Đăng ký)
   └── Form đơn giản, validation inline, không redirect ra ngoài
```

### Animation (Framer Motion)
- Chuyển trang: slide-up (300 ms, ease-out)
- Card quán: fade-in stagger (50 ms delay giữa các card)
- Toggle tâm trạng: scale bounce khi chọn
- Dark mode switch: smooth transition 200 ms toàn trang

---

## 8. Điều kiện hoàn chỉnh (Definition of Done)

MVP được coi là hoàn chỉnh khi **tất cả** các tiêu chí dưới đây đạt:

### Chức năng
- [ ] Người dùng có thể đăng ký tài khoản mới bằng email + mật khẩu
- [ ] Người dùng có thể đăng nhập và nhận JWT hợp lệ
- [ ] Trang Home hiển thị đủ 6 lựa chọn tâm trạng, 3 mức ngân sách, 4 mức bán kính
- [ ] Khi nhấn "Tìm quán ngay", hệ thống lấy được tọa độ GPS (hoặc yêu cầu nhập thủ công)
- [ ] AI trả về ít nhất 3 từ khóa món ăn + lý do bằng tiếng Việt
- [ ] Google Places trả về ít nhất 5 quán ăn (rating ≥ 4.0, đang mở cửa) trong bán kính đã chọn
- [ ] Mỗi quán hiển thị đủ: tên, ảnh, rating, khoảng cách, địa chỉ, badge trạng thái
- [ ] Nút "Dẫn đường" mở đúng tọa độ quán trên Google Maps
- [ ] Người dùng có thể lưu / bỏ lưu quán yêu thích
- [ ] Lịch sử tìm kiếm lưu và hiển thị đúng 10 lần gần nhất
- [ ] Dark mode toggle hoạt động và ghi nhớ sau khi reload trang

### Kỹ thuật
- [ ] Backend và frontend chạy độc lập (tách riêng port: 4000 và 5173)
- [ ] Tất cả API endpoint (trừ auth) yêu cầu JWT hợp lệ
- [ ] Rate limiting hoạt động: thử gọi `/api/ai/recommend` quá 20 lần/giờ phải nhận `429`
- [ ] Không có secret key nào xuất hiện trong source code hoặc git history
- [ ] `npm audit` không có lỗ hổng `high` hoặc `critical`
- [ ] Không có lỗi console trên trình duyệt khi sử dụng luồng chính

### Trải nghiệm người dùng
- [ ] Thời gian từ nhấn "Tìm quán" đến khi có kết quả ≤ 5 giây (trên mạng 4G bình thường)
- [ ] Skeleton loading hiển thị đúng trong khi chờ API
- [ ] Giao diện hiển thị đúng trên màn 375 px (iPhone SE) và 390 px (iPhone 14)
- [ ] Dark mode không có màu sắc bị vỡ hoặc text không đọc được
- [ ] Tất cả text trên UI bằng tiếng Việt, không có chuỗi tiếng Anh lộ ra ngoài

### Kiểm thử tối thiểu
- [ ] Luồng happy path: đăng nhập → chọn tâm trạng → nhận kết quả → lưu quán → xem lại lịch sử
- [ ] Luồng lỗi: GPS bị từ chối → hiển thị hướng dẫn nhập thủ công
- [ ] Luồng lỗi: Places API không tìm thấy quán → hiển thị thông báo thân thiện, không crash

---

## 9. Rủi ro cần tránh

### Rủi ro kỹ thuật

| # | Rủi ro | Mức độ | Cách giảm thiểu |
|---|--------|--------|-----------------|
| R1 | **AI Hallucination** — Gemini bịa ra tên quán / địa chỉ không có thật | Cao | Ép AI chỉ trả về từ khóa món ăn (không phải tên quán). Địa điểm thực tế lấy 100% từ Google Places. |
| R2 | **Prompt Injection** — Người dùng nhập tâm trạng chứa lệnh điều khiển AI | Cao | Sanitize input trước khi đưa vào prompt. Dùng `system instruction` nghiêm ngặt. Giới hạn độ dài field tâm trạng ≤ 200 ký tự. |
| R3 | **Chi phí API vượt ngân sách** — Gemini + Google Places tính tiền theo lượt gọi | Cao | Rate limit chặt: 20 request AI/giờ/user. Bật GCP budget alert. Cache kết quả Places trong 15 phút cho cùng tọa độ + từ khóa. |
| R4 | **Google Places không trả đủ kết quả** — Bán kính nhỏ, giờ khuya ít quán mở | Trung bình | Tự động mở rộng bán kính thêm 1 km nếu kết quả < 3 quán. Thông báo người dùng biết. |
| R5 | **JWT bị lộ hoặc bị đánh cắp** | Trung bình | JWT expiry ngắn (15 phút). Không lưu trong localStorage nếu có thể. Implement refresh token. |
| R6 | **Tọa độ GPS sai hoặc bị giả mạo** | Trung bình | Validate tọa độ nằm trong bbox TP.HCM phía backend. Cảnh báo nếu tọa độ quá xa trung tâm. |
| R7 | **Supabase service_role key bị lộ** | Cao | Không bao giờ expose key này ra frontend. Chỉ dùng phía server. Rotate ngay nếu lộ. |

### Rủi ro sản phẩm

| # | Rủi ro | Mức độ | Cách giảm thiểu |
|---|--------|--------|-----------------|
| R8 | **Kết quả AI không phù hợp với tâm trạng** — Người dùng chọn "mệt" nhưng AI gợi ý lẩu cay | Trung bình | Kiểm thử prompt với 6 loại tâm trạng trước khi release. Cho người dùng nút "Thử lại" để gọi AI lần khác. |
| R9 | **Ảnh quán xấu hoặc không tải được** | Thấp | Dùng ảnh từ Places Photo API. Có fallback placeholder ảnh mặc định theo loại món ăn. |
| R10 | **Người dùng từ chối cấp quyền vị trí** | Trung bình | UI hướng dẫn rõ lý do cần quyền vị trí. Cung cấp lựa chọn nhập tên quận/huyện thủ công. |
| R11 | **Thông tin giờ mở cửa trên Google sai** | Thấp | Hiển thị disclaimer nhỏ: "Giờ mở cửa theo Google Maps, vui lòng kiểm tra lại trước khi đến." |
| R12 | **Giao diện trông xấu trên Android Chrome** | Thấp | Test trên Chrome Android (Samsung Galaxy + Pixel) trước release. Đặc biệt chú ý bottom navigation bar che content. |

### Rủi ro vận hành

| # | Rủi ro | Cách giảm thiểu |
|---|--------|-----------------|
| R13 | Google Places API thay đổi pricing đột ngột | Theo dõi GCP billing dashboard. Đặt hard limit ngân sách tháng. |
| R14 | Supabase free tier đạt giới hạn | Monitor DB size và request count. Xóa `search_history` > 90 ngày theo định kỳ. |
| R15 | Gemini API bị gián đoạn | Implement fallback: nếu AI lỗi, dùng danh sách từ khóa hardcode theo tâm trạng để gọi Places API. |
