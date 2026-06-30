import { z } from "zod";
export const loginSchema = z.object({
    email: z.email("Email không hợp lệ"),
    password: z.string("Mật khẩu tối thiểu 6 chữ số")
});
export type TLogin = z.infer<typeof loginSchema>;
export const registerSchema = z.object({
    email: z.email("Email không hợp lệ"),
    password: z.string("Mật khẩu tối thiểu 6 chữ số")
})
export type TRegister = z.infer<typeof registerSchema>;