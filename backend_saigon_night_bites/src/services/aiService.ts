import { getModel } from '../config/gemini.js';
import type { AIRecommendation, Mood, Budget } from '../types/index.js';

const MOOD_MAP: Record<Mood, string> = {
  tired: 'mệt mỏi, cần hồi phục năng lượng',
  happy: 'vui vẻ, phấn khích muốn ăn gì đó đặc biệt',
  date: 'đi hẹn hò, cần không gian lãng mạn',
  group: 'đi nhóm bạn hoặc đồng nghiệp, cần chỗ rộng rãi',
  sweet: 'thèm đồ ngọt, tráng miệng',
  savory: 'thèm đồ mặn, cay, đậm đà',
};

const BUDGET_MAP: Record<Budget, string> = {
  low: 'dưới 50.000đ một người',
  mid: '50.000đ đến 150.000đ một người',
  high: 'trên 150.000đ một người',
};

function sanitizeText(text: string): string {
  return String(text)
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 500);
}

function buildPrompt(mood: Mood, budget: Budget): string {
  const hour = new Date().getHours();
  const timeOfDay = hour >= 18 ? 'buổi tối' : hour >= 12 ? 'buổi chiều' : 'buổi sáng';

  return `Bạn là trợ lý ẩm thực tại TP.HCM. Chỉ trả về JSON hợp lệ theo đúng format, không giải thích thêm bất kỳ điều gì.

Tình huống: Người dùng đang ở ${timeOfDay}, tâm trạng ${MOOD_MAP[mood]}, ngân sách ${BUDGET_MAP[budget]}.

Hãy gợi ý 3 đến 5 từ khóa món ăn Việt Nam hoặc loại hình ăn uống phổ biến tại TP.HCM, phù hợp để tìm kiếm trên Google Maps. Kèm theo một lý do ngắn (1-2 câu) bằng tiếng Việt.

Trả về đúng format JSON sau, không thêm bất kỳ văn bản nào khác:
{"keywords":["từ khóa 1","từ khóa 2","từ khóa 3"],"reason":"Lý do ngắn gọn tại sao những món này phù hợp."}`;
}

export async function getAIRecommendation(mood: Mood, budget: Budget): Promise<AIRecommendation> {
  const model = getModel();
  const result = await model.generateContent(buildPrompt(mood, budget));
  const rawText = result.response.text();

  let parsed: { keywords: unknown; reason: unknown };
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

  const keywords = (parsed.keywords as string[]).map(sanitizeText).filter(Boolean).slice(0, 5);
  const reason = sanitizeText(parsed.reason as string);

  return { keywords, reason };
}
