import { groqClient, GROQ_MODEL } from '../config/gemini.js';
import type { AIRecommendation, Mood, Budget, Place, RankedPlace, ProsConsInsight } from '../types/index.js';

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

function parseJsonLoose(rawText: string): Record<string, unknown> {
  try {
    return JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('AI trả về định dạng không hợp lệ');
    return JSON.parse(match[0]);
  }
}

function buildPrompt(mood: Mood, budget: Budget): string {
  const hour = new Date().getHours();
  const timeOfDay = hour >= 18 ? 'buổi tối' : hour >= 12 ? 'buổi chiều' : 'buổi sáng';

  return `Bạn là trợ lý ẩm thực tại TP.HCM. Chỉ trả về JSON hợp lệ theo đúng format, không giải thích thêm bất kỳ điều gì.

Tình huống: Người dùng đang ở ${timeOfDay}, tâm trạng ${MOOD_MAP[mood]}, ngân sách ${BUDGET_MAP[budget]}.

Hãy gợi ý 3 đến 5 từ khóa món ăn Việt Nam hoặc loại hình ăn uống phổ biến tại TP.HCM, phù hợp để tìm kiếm trên Google Maps. Kèm theo một lý do ngắn (1-2 câu) bằng tiếng Việt.

Trả về đúng format JSON sau:
{"keywords":["từ khóa 1","từ khóa 2","từ khóa 3"],"reason":"Lý do ngắn gọn tại sao những món này phù hợp."}`;
}

export async function getAIRecommendation(mood: Mood, budget: Budget): Promise<AIRecommendation> {
  const response = await groqClient.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: 'user', content: buildPrompt(mood, budget) }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 512,
  });

  const rawText = response.choices[0]?.message?.content ?? '';
  const parsed = parseJsonLoose(rawText) as { keywords: unknown; reason: unknown };

  if (!Array.isArray(parsed.keywords) || !parsed.reason) {
    throw new Error('Cấu trúc phản hồi AI không hợp lệ');
  }

  const keywords = (parsed.keywords as string[]).map(sanitizeText).filter(Boolean).slice(0, 5);
  const reason = sanitizeText(parsed.reason as string);

  return { keywords, reason };
}

const RANK_LIMIT = 10;

function buildRankPrompt(places: Place[], keywords: string[], reason: string): string {
  const candidates = places.map((p) => ({ id: p.place_id, name: p.name, vicinity: p.vicinity }));

  return `Bạn là trợ lý ẩm thực tại TP.HCM. Chỉ trả về JSON hợp lệ, không giải thích thêm bất kỳ điều gì.

Ngữ cảnh gợi ý: từ khóa "${keywords.join(', ')}", lý do: "${reason}".

Danh sách ứng viên quán ăn (id, tên, địa chỉ), chỉ dựa vào dữ liệu này, không bịa thêm thông tin không có:
${JSON.stringify(candidates)}

Chọn tối đa ${RANK_LIMIT} quán phù hợp nhất với ngữ cảnh trên, sắp xếp theo độ phù hợp giảm dần. Với mỗi quán, viết 1 câu ngắn (dưới 20 từ, tiếng Việt) giải thích tại sao phù hợp, dựa trên tên quán.

Trả về đúng format JSON sau, "id" phải lấy từ danh sách ứng viên ở trên:
{"ranked":[{"id":"...","ai_reason":"..."}]}`;
}

export async function rankPlacesByRelevance(
  places: Place[],
  keywords: string[],
  reason: string
): Promise<RankedPlace[]> {
  if (places.length === 0) return [];

  const safeKeywords = keywords.map(sanitizeText).filter(Boolean).slice(0, 5);
  const safeReason = sanitizeText(reason);

  const response = await groqClient.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: 'user', content: buildRankPrompt(places, safeKeywords, safeReason) }],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 1024,
  });

  const rawText = response.choices[0]?.message?.content ?? '';
  const parsed = parseJsonLoose(rawText) as { ranked: unknown };

  if (!Array.isArray(parsed.ranked)) {
    throw new Error('Cấu trúc phản hồi AI không hợp lệ');
  }

  const validIds = new Set(places.map((p) => p.place_id));

  return (parsed.ranked as Array<{ id?: unknown; ai_reason?: unknown }>)
    .filter((r) => typeof r.id === 'string' && validIds.has(r.id) && r.ai_reason)
    .map((r) => ({ place_id: r.id as string, ai_reason: sanitizeText(String(r.ai_reason)).slice(0, 150) }))
    .slice(0, RANK_LIMIT);
}

const INSIGHT_ITEM_LIMIT = 3;

function buildInsightPrompt(placeName: string, comments: string[]): string {
  return `Bạn là trợ lý ẩm thực tại TP.HCM. Chỉ trả về JSON hợp lệ, không giải thích thêm bất kỳ điều gì.

Dưới đây là các bình luận thật của khách về quán "${placeName}":
${JSON.stringify(comments)}

Chỉ dựa vào nội dung các bình luận trên (không suy diễn thêm), liệt kê tối đa ${INSIGHT_ITEM_LIMIT} ưu điểm và tối đa ${INSIGHT_ITEM_LIMIT} nhược điểm, mỗi ý ngắn gọn (dưới 12 từ, tiếng Việt). Nếu bình luận không đề cập ưu/nhược điểm nào thì để mảng đó rỗng.

Trả về đúng format JSON sau:
{"pros":["..."],"cons":["..."]}`;
}

export async function analyzeProsCons(placeName: string, comments: string[]): Promise<ProsConsInsight> {
  if (comments.length === 0) return { pros: [], cons: [], comments: [] };

  const safeName = sanitizeText(placeName);
  const safeComments = comments.map(sanitizeText).filter(Boolean).slice(0, 10);

  const response = await groqClient.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: 'user', content: buildInsightPrompt(safeName, safeComments) }],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 512,
  });

  const rawText = response.choices[0]?.message?.content ?? '';
  const parsed = parseJsonLoose(rawText) as { pros: unknown; cons: unknown };

  if (!Array.isArray(parsed.pros) || !Array.isArray(parsed.cons)) {
    throw new Error('Cấu trúc phản hồi AI không hợp lệ');
  }

  const pros = (parsed.pros as string[]).map(sanitizeText).filter(Boolean).slice(0, INSIGHT_ITEM_LIMIT);
  const cons = (parsed.cons as string[]).map(sanitizeText).filter(Boolean).slice(0, INSIGHT_ITEM_LIMIT);

  return { pros, cons, comments: safeComments };
}
