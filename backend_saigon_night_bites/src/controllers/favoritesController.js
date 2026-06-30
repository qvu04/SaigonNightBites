import supabase from '../config/supabase.js';

export async function getFavorites(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('favorite_places')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ success: true, data: { favorites: data } });
  } catch (err) {
    next(err);
  }
}

export async function addFavorite(req, res, next) {
  try {
    const { place_id, name, rating, vicinity, location, photo_url } = req.body;

    if (!place_id || !name) {
      return res.status(400).json({ success: false, error: 'place_id và name là bắt buộc' });
    }
    if (rating !== undefined && (typeof rating !== 'number' || rating < 0 || rating > 5)) {
      return res.status(400).json({ success: false, error: 'Rating phải là số từ 0 đến 5' });
    }
    if (location && (typeof location.lat !== 'number' || typeof location.lng !== 'number')) {
      return res.status(400).json({ success: false, error: 'location phải có lat và lng là số' });
    }

    const { data, error } = await supabase
      .from('favorite_places')
      .insert({
        user_id: req.user.userId,
        place_id,
        name,
        rating: rating ?? null,
        vicinity: vicinity ?? null,
        location: location ?? null,
        photo_url: photo_url ?? null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ success: false, error: 'Quán này đã có trong danh sách yêu thích' });
      }
      throw error;
    }

    return res.status(201).json({ success: true, data: { favorite: data } });
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const { id } = req.params;

    const { data: existing, error: findError } = await supabase
      .from('favorite_places')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .single();

    if (findError || !existing) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy quán yêu thích này' });
    }

    const { error } = await supabase
      .from('favorite_places')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.userId);

    if (error) throw error;

    return res.status(200).json({ success: true, data: { message: 'Đã xóa khỏi danh sách yêu thích' } });
  } catch (err) {
    next(err);
  }
}
