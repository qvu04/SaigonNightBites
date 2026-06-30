import supabase from '../config/supabase.js';
import { getModel } from '../config/gemini.js';

const VALID_MOODS = ['tired', 'happy', 'date', 'group', 'sweet', 'savory'];
const VALID_BUDGETS = ['low', 'mid', 'high'];
const VALID_RADII = [1000, 2000, 3000, 5000];

const MOOD_MAP = {
  tired: 'mệt mỏi, cần hồi phục năng lượng',
  happy: 'vui vẻ, phấn khích muốn ăn gì đó đặc biệt',
  date: 'đi hẹn hò, cần không gian lãng mạn',
  group: 'đi nhóm bạn hoặc đồng nghiệp, cần chỗ rộng rãi',
  sweet: 'thèm đồ ngọt, tráng miệng',
  savory: 'thèm đồ mặn, cay, đậm đà',
};

const BUDGET_MAP = {
  low: 'dưới 50.000đ một người',
  mid: '50.000đ đến 150.000đ một người',
  high: 'trên 150.000đ một người',
};

function sanitizeText(text) {
  return String(text)
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 500);
}

function buildPrompt(mood, budget) {
  const moodVi = MOOD_MAP[mood];
  const budgetVi = BUDGET_MAP[budget];
  const hour = new Date().getHours();
  const timeOfDay = hour >= 18 ? 'buổi tối' : hour >= 12 ? 'buổi chiều' : 'buổi sáng';

  return `Bạn là trợ lý ẩm thực tại TP.HCM. Chỉ trả về JSON hợp lệ theo đúng format, không giải thích thêm bất kỳ điều gì.

Tình huống: Người dùng đang ở ${timeOfDay}, tâm trạng ${moodVi}, ngân sách ${budgetVi}.

Hãy gợi ý 3 đến 5 từ khóa món ăn Việt Nam hoặc loại hình ăn uống phổ biến tại TP.HCM, phù hợp để tìm kiếm trên Google Maps. Kèm theo một lý do ngắn (1-2 câu) bằng tiếng Việt.

Trả về đúng format JSON sau, không thêm bất kỳ văn bản nào khác:
{"keywords":["từ khóa 1","từ khóa 2","từ khóa 3"],"reason":"Lý do ngắn gọn tại sao những món này phù hợp."}`;
}

export async function recommend(req, res, next) {
  try {
    const { mood, budget, radius, latitude, longitude } = req.body;

    if (!VALID_MOODS.includes(mood)) {
      return res.status(400).json({ success: false, error: 'Tâm trạng không hợp lệ' });
    }
    if (!VALID_BUDGETS.includes(budget)) {
      return res.status(400).json({ success: false, error: 'Ngân sách không hợp lệ' });
    }
    if (!VALID_RADII.includes(Number(radius))) {
      return res.status(400).json({ success: false, error: 'Bán kính không hợp lệ (1000/2000/3000/5000)' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, error: 'Tọa độ không hợp lệ' });
    }
    if (lat < 10.3 || lat > 11.2 || lng < 106.3 || lng > 107.1) {
      return res.status(400).json({
        success: false,
        error: 'Vị trí phải nằm trong khu vực TP.HCM',
      });
    }

    const model = getModel();
    const prompt = buildPrompt(mood, budget);
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('AI trả về định dạng không hợp lệ');
      parsed = JSON.parse(match[0]);
    }

    if (!Array.isArray(parsed.keywords) || !parsed.reason) {
      throw new Error('Cấu trúc phản hồi AI không hợp lệ');
    }

    const keywords = parsed.keywords.map(sanitizeText).filter(Boolean).slice(0, 5);
    const reason = sanitizeText(parsed.reason);

    const { data: historyEntry, error: historyError } = await supabase
      .from('search_history')
      .insert({
        user_id: req.user.userId,
        mood,
        budget,
        radius: Number(radius),
        ai_keywords: keywords,
        ai_reason: reason,
        latitude: Math.round(lat * 100) / 100,
        longitude: Math.round(lng * 100) / 100,
      })
      .select('id')
      .single();

    if (historyError) {
      console.error('[aiController] Failed to save history:', historyError.message);
    }

    return res.status(200).json({
      success: true,
      data: { keywords, reason, historyId: historyEntry?.id || null },
    });
  } catch (err) {
    next(err);
  }
}
