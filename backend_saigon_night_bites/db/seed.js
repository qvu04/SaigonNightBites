/**
 * Seed script — tạo dữ liệu test cho search_history và favorite_places.
 * Chạy từ thư mục backend_saigon_night_bites:
 *   node db/seed.js
 *
 * Script sẽ:
 *   1. Tạo (hoặc tái sử dụng) một user test: test@saigonnightbites.com / Test1234
 *   2. Xóa dữ liệu seed cũ của user đó (idempotent)
 *   3. Chèn 6 search_history + 5 favorite_places
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TEST_EMAIL = 'test@saigonnightbites.com';
const TEST_PASSWORD = 'Test1234';

// ── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ── 1. Upsert test user ───────────────────────────────────────────────────────

console.log('🔐 Tạo user test...');
const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);

const { data: existingUser } = await supabase
  .from('users')
  .select('id')
  .eq('email', TEST_EMAIL)
  .single();

let userId;

if (existingUser) {
  userId = existingUser.id;
  console.log(`   ✓ Dùng user đã tồn tại: ${TEST_EMAIL} (id: ${userId})`);
} else {
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({ email: TEST_EMAIL, password_hash: passwordHash })
    .select('id')
    .single();

  if (error) {
    console.error('❌ Lỗi tạo user:', error.message);
    process.exit(1);
  }
  userId = newUser.id;
  console.log(`   ✓ Tạo user mới: ${TEST_EMAIL} (id: ${userId})`);
}

// ── 2. Xóa dữ liệu seed cũ (idempotent) ─────────────────────────────────────

await supabase.from('search_history').delete().eq('user_id', userId);
await supabase.from('favorite_places').delete().eq('user_id', userId);
console.log('🗑️  Đã xóa dữ liệu seed cũ');

// ── 3. Chèn search_history ───────────────────────────────────────────────────

console.log('📜 Chèn search_history...');

const historyRows = [
  {
    user_id: userId,
    mood: 'tired',
    budget: 'mid',
    radius: 2000,
    ai_keywords: ['phở bò', 'cháo gà', 'hủ tiếu'],
    ai_reason: 'Khi mệt mỏi cần bữa ăn ấm, nhẹ bụng để phục hồi năng lượng. Phở và cháo là lựa chọn hoàn hảo.',
    latitude: 10.78,
    longitude: 106.70,
    created_at: daysAgo(0),
  },
  {
    user_id: userId,
    mood: 'happy',
    budget: 'high',
    radius: 3000,
    ai_keywords: ['bít tết', 'lẩu nướng', 'hải sản'],
    ai_reason: 'Tâm trạng vui vẻ, hãy thưởng thức bữa ăn đặc biệt! Lẩu nướng hay hải sản sẽ làm buổi tối thêm trọn vẹn.',
    latitude: 10.79,
    longitude: 106.71,
    created_at: daysAgo(1),
  },
  {
    user_id: userId,
    mood: 'date',
    budget: 'high',
    radius: 3000,
    ai_keywords: ['nhà hàng lãng mạn', 'ẩm thực Ý', 'rooftop bar'],
    ai_reason: 'Đêm hẹn hò cần không gian tinh tế. Nhà hàng view đẹp hoặc ẩm thực Ý sẽ tạo ấn tượng tốt.',
    latitude: 10.77,
    longitude: 106.69,
    created_at: daysAgo(3),
  },
  {
    user_id: userId,
    mood: 'group',
    budget: 'mid',
    radius: 5000,
    ai_keywords: ['lẩu', 'quán nhậu', 'bbq'],
    ai_reason: 'Đi nhóm đông cần chỗ rộng rãi và đồ ăn để chia sẻ. Lẩu hoặc BBQ là lựa chọn vui nhộn nhất.',
    latitude: 10.80,
    longitude: 106.72,
    created_at: daysAgo(5),
  },
  {
    user_id: userId,
    mood: 'sweet',
    budget: 'low',
    radius: 1000,
    ai_keywords: ['chè', 'kem', 'bánh ngọt'],
    ai_reason: 'Thèm đồ ngọt? Chè Sài Gòn hay kem tươi sẽ thỏa mãn cơn thèm ngay gần bạn.',
    latitude: 10.76,
    longitude: 106.68,
    created_at: daysAgo(7),
  },
  {
    user_id: userId,
    mood: 'savory',
    budget: 'low',
    radius: 2000,
    ai_keywords: ['bánh mì', 'cơm tấm', 'bún thịt nướng'],
    ai_reason: 'Thèm vị đậm đà, cay cay? Cơm tấm sườn hay bánh mì thịt nướng là vua của đường phố Sài Gòn.',
    latitude: 10.78,
    longitude: 106.70,
    created_at: daysAgo(10),
  },
];

const { error: historyError } = await supabase.from('search_history').insert(historyRows);

if (historyError) {
  console.error('❌ Lỗi chèn search_history:', historyError.message);
  process.exit(1);
}
console.log(`   ✓ Đã chèn ${historyRows.length} bản ghi search_history`);

// ── 4. Chèn favorite_places ──────────────────────────────────────────────────

console.log('❤️  Chèn favorite_places...');

const favoritesRows = [
  {
    user_id: userId,
    place_id: 'seed_place_001',
    name: 'Phở Hòa Pasteur',
    rating: 4.5,
    vicinity: '260C Pasteur, Phường 8, Quận 3, TP. Hồ Chí Minh',
    location: { lat: 10.7797, lng: 106.6981 },
    photo_url: null,
  },
  {
    user_id: userId,
    place_id: 'seed_place_002',
    name: 'Cơm Tấm Bà Ghẻ',
    rating: 4.6,
    vicinity: '84 Đặng Văn Bi, Thủ Đức, TP. Hồ Chí Minh',
    location: { lat: 10.8505, lng: 106.7717 },
    photo_url: null,
  },
  {
    user_id: userId,
    place_id: 'seed_place_003',
    name: 'Lẩu Dê Bắc Hương',
    rating: 4.4,
    vicinity: '14 Hoàng Diệu, Phường 10, Quận 4, TP. Hồ Chí Minh',
    location: { lat: 10.7617, lng: 106.7031 },
    photo_url: null,
  },
  {
    user_id: userId,
    place_id: 'seed_place_004',
    name: 'Chè Khúc Bạch Bạch Dương',
    rating: 4.3,
    vicinity: '56 Võ Thị Sáu, Phường Tân Định, Quận 1, TP. Hồ Chí Minh',
    location: { lat: 10.7892, lng: 106.6917 },
    photo_url: null,
  },
  {
    user_id: userId,
    place_id: 'seed_place_005',
    name: 'Bánh Mì Huỳnh Hoa',
    rating: 4.7,
    vicinity: '26 Lê Thị Riêng, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    location: { lat: 10.7726, lng: 106.6980 },
    photo_url: null,
  },
];

const { error: favError } = await supabase.from('favorite_places').insert(favoritesRows);

if (favError) {
  console.error('❌ Lỗi chèn favorite_places:', favError.message);
  process.exit(1);
}
console.log(`   ✓ Đã chèn ${favoritesRows.length} bản ghi favorite_places`);

// ── Done ─────────────────────────────────────────────────────────────────────

console.log('\n✅ Seed hoàn tất!');
console.log('─────────────────────────────────────────');
console.log(`📧 Email   : ${TEST_EMAIL}`);
console.log(`🔑 Password: ${TEST_PASSWORD}`);
console.log('─────────────────────────────────────────');
console.log('Đăng nhập bằng tài khoản trên để test giao diện.\n');
