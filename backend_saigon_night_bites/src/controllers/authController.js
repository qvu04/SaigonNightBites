import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabase.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email và mật khẩu là bắt buộc' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, error: 'Định dạng email không hợp lệ' });
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        error: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái và chữ số',
      });
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return res.status(409).json({ success: false, error: 'Email này đã được đăng ký' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from('users')
      .insert({ email: email.toLowerCase(), password_hash })
      .select('id, email')
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email và mật khẩu là bắt buộc' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.status(200).json({
      success: true,
      data: { token, user: { id: user.id, email: user.email } },
    });
  } catch (err) {
    next(err);
  }
}
