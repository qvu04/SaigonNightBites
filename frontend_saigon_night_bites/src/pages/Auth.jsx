import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { loginUser, registerUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm()

  const switchTab = (toLogin) => {
    setIsLogin(toLogin)
    reset()
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (isLogin) {
        const res = await loginUser(data.email, data.password)
        login(res.data.data.token, res.data.data.user)
        toast.success('Đăng nhập thành công! 🎉')
        navigate('/')
      } else {
        await registerUser(data.email, data.password)
        toast.success('Đăng ký thành công! Hãy đăng nhập.')
        switchTab(true)
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (isLogin ? 'Email hoặc mật khẩu không đúng' : 'Đăng ký thất bại, vui lòng thử lại')
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍜</div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            SaigonNightBites
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Tối nay ăn gì tại TP.HCM?
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl dark:shadow-none border border-zinc-100 dark:border-zinc-800 p-6">
          <div className="flex rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-1 mb-6">
            <button
              onClick={() => switchTab(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                isLogin
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => switchTab(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                !isLogin
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
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập lại mật khẩu"
                      {...register('confirmPassword', {
                        required: 'Vui lòng xác nhận mật khẩu',
                        validate: (val) =>
                          val === watch('password') || 'Mật khẩu xác nhận không khớp',
                      })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
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
  )
}
