import supabase from '../config/supabase.js';

export async function getHistory(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('id, mood, budget, radius, ai_keywords, ai_reason, created_at')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return res.status(200).json({ success: true, data: { history: data } });
  } catch (err) {
    next(err);
  }
}
