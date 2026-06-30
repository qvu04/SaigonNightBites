import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email và mật khẩu là bắt buộc' });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ success: false, error: 'Định dạng email không hợp lệ' });
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      res.status(400).json({
        success: false,
        error: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái và chữ số',
      });
      return;
    }

    const existing = await authService.findUserByEmail(email.toLowerCase());
    if (existing) {
      res.status(409).json({ success: false, error: 'Email này đã được đăng ký' });
      return;
    }

    const passwordHash = await authService.hashPassword(password);
    const user = await authService.createUser(email.toLowerCase(), passwordHash);

    res.status(201).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email và mật khẩu là bắt buộc' });
      return;
    }

    const user = await authService.findUserByEmail(email.toLowerCase());
    if (!user || !user.password_hash) {
      res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không đúng' });
      return;
    }

    const isMatch = await authService.comparePasswords(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không đúng' });
      return;
    }

    const token = authService.signToken({ userId: user.id, email: user.email });

    res.status(200).json({
      success: true,
      data: { token, user: { id: user.id, email: user.email } },
    });
  } catch (err) {
    next(err);
  }
}
