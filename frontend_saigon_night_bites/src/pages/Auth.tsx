import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import animSrc from '../assets/animations/food_location.lottie?url'
import { useAuth } from '../context/AuthContext'
import type { AxiosError } from 'axios'
import { useLogin, useRegister } from '../hooks/mutation'

interface FormValues {
  email: string
  password: string
  confirmPassword?: string
}

const HIGHLIGHTS = [
  { emoji: '🤖', text: 'AI Gemini phân tích tâm trạng của bạn' },
  { emoji: '📍', text: 'Quán ăn thực tế đang mở cửa gần bạn' },
  { emoji: '⭐', text: 'Chỉ hiển thị quán rating 4.0 trở lên' },
  { emoji: '❤️', text: 'Lưu quán yêu thích & xem lại lịch sử' },
]

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { mutateAsync: loginAsync, isPending: pendingLogin } = useLogin()
  const { mutateAsync: registerAsync, isPending: pendingRegister } = useRegister()
  const loading = isLogin ? pendingLogin : pendingRegister
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const reason = searchParams.get('reason')
    if (reason === 'expired') toast.info('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại')
    if (reason === 'no_session') toast.info('Vui lòng đăng nhập để tiếp tục')
  }, [])
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>()

  const switchTab = (toLogin: boolean) => {
    setIsLogin(toLogin)
    reset()
  }

  const onSubmit = async (payload: FormValues) => {
    try {
      if (isLogin) {
        const res = await loginAsync(payload)
        login(res.data.accessToken, res.data.user, res.data.refreshToken, res.data.refreshExpiresAt)
        toast.success('Đăng nhập thành công! 🎉')
        const from = searchParams.get('from') || '/home'
        navigate(from, { replace: true })
      } else {
        await registerAsync(payload)
        toast.success('Đăng ký thành công! Hãy đăng nhập.')
        switchTab(true)
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ error: string }>
      const msg =
        axiosErr.response?.data?.error ||
        (isLogin ? 'Email hoặc mật khẩu không đúng' : 'Đăng ký thất bại, vui lòng thử lại')
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-between bg-gradient-to-br from-orange-500 to-orange-600 p-12 text-white overflow-hidden relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-white/5" />

        <div className="relative z-10 w-full">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">🍜</span>
            <span className="text-xl font-bold">SaigonNightBites</span>
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-64 h-64">
              <DotLottieReact
                src={animSrc}
                loop
                autoplay
                style={{ width: '100%%', height: '100%' }}
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-3">
            Tối nay ăn gì<br />tại TP.HCM?
          </h1>
          <p className="text-orange-100 text-base leading-relaxed mb-8">
            Để AI giúp bạn tìm quán ăn phù hợp với tâm trạng, ngân sách và vị trí ngay lúc này.
          </p>

          <div className="space-y-3">
            {HIGHLIGHTS.map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base flex-shrink-0">
                  {item.emoji}
                </span>
                <span className="text-orange-50 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-orange-200 text-xs self-start mt-5">
          © 2026 SaigonNightBites · Để tôi giúp bạn lựa chọn món ăn nhé!
        </p>
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-12 lg:px-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-6">
            <div className="flex justify-center mb-2">
              <div className="w-32 h-32">
                <DotLottieReact
                  src={animSrc}
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              SaigonNightBites
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Tối nay ăn gì tại TP.HCM?
            </p>
          </div>
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {isLogin
                ? 'Đăng nhập để tiếp tục khám phá ẩm thực Sài Gòn'
                : 'Tham gia để bắt đầu trải nghiệm'}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl dark:shadow-none border border-zinc-100 dark:border-zinc-800 p-6">
            <div className="flex rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-1 mb-6">
              <button
                onClick={() => switchTab(true)}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${isLogin
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400'
                  }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => switchTab(false)}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${!isLogin
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400'
                  }`}
              >
                Đăng ký
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      placeholder="ten@email.com"
                      {...register('email', {
                        required: 'Vui lòng nhập email',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Email không hợp lệ',
                        },
                      })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tối thiểu 8 ký tự"
                      {...register('password', {
                        required: 'Vui lòng nhập mật khẩu',
                        minLength: { value: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
                        pattern: {
                          value: /^(?=.*[a-zA-Z])(?=.*\d)/,
                          message: 'Mật khẩu phải có cả chữ và số',
                        },
                      })}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        {...register('confirmPassword', {
                          required: 'Vui lòng xác nhận mật khẩu',
                          validate: (val) =>
                            val === watch('password') || 'Mật khẩu xác nhận không khớp',
                        })}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                      >
                        {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isLogin ? 'Đang đăng nhập...' : 'Đang đăng ký...'}
                    </span>
                  ) : isLogin ? (
                    'Đăng nhập'
                  ) : (
                    'Tạo tài khoản'
                  )}
                </button>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
