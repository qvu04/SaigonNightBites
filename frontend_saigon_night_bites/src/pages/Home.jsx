import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FiMapPin, FiAlertCircle, FiLogOut } from 'react-icons/fi'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import MoodSelector from '../components/MoodSelector'
import BudgetSelector from '../components/BudgetSelector'
import RadiusSelector from '../components/RadiusSelector'
import { useLocation } from '../context/LocationContext'
import { useAuth } from '../context/AuthContext'
import { getAIRecommendation } from '../api/ai'
import { searchPlaces } from '../api/places'

export default function Home() {
  const navigate = useNavigate()
  const { location, loading: gpsLoading, error: gpsError, setManualLocation } = useLocation()
  const { logout } = useAuth()

  const [mood, setMood] = useState(null)
  const [budget, setBudget] = useState('mid')
  const [radius, setRadius] = useState(2000)
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')
  const [searching, setSearching] = useState(false)

  const activeLocation = location || (manualLat && manualLng
    ? { latitude: parseFloat(manualLat), longitude: parseFloat(manualLng) }
    : null)

  const handleSetManual = () => {
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)
    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Vui lòng nhập tọa độ hợp lệ')
      return
    }
    if (lat < 10.3 || lat > 11.2 || lng < 106.3 || lng > 107.1) {
      toast.error('Tọa độ phải nằm trong khu vực TP.HCM')
      return
    }
    setManualLocation(lat, lng)
    toast.success('Đã cập nhật vị trí thủ công')
  }

  const handleSearch = async () => {
    if (!mood) {
      toast.error('Bạn chưa chọn tâm trạng hôm nay!')
      return
    }
    if (!activeLocation) {
      toast.error('Vui lòng cung cấp vị trí của bạn')
      return
    }

    setSearching(true)
    try {
      const aiRes = await getAIRecommendation({
        mood,
        budget,
        radius,
        latitude: activeLocation.latitude,
        longitude: activeLocation.longitude,
      })

      const { keywords, reason } = aiRes.data.data

      const placesRes = await searchPlaces({
        keywords,
        latitude: activeLocation.latitude,
        longitude: activeLocation.longitude,
        radius,
      })

      navigate('/discovery', {
        state: {
          places: placesRes.data.data.places,
          totalFound: placesRes.data.data.totalFound,
          aiSuggestion: { keywords, reason },
          userLocation: activeLocation,
          searchParams: { mood, budget, radius },
        },
      })
    } catch (err) {
      const msg = err.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại'
      toast.error(msg)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="max-w-lg mx-auto px-4 pt-20 pb-24">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              Tối nay bạn muốn
              <br />
              ăn gì? 🌙
            </h1>
            <div className="flex items-center gap-1.5 mt-2">
              {gpsLoading ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Đang lấy vị trí...</span>
                </>
              ) : location ? (
                <>
                  <FiMapPin className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Đã có vị trí ✓</span>
                </>
              ) : (
                <>
                  <FiAlertCircle className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-amber-600 dark:text-amber-400">Nhập vị trí thủ công</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Đăng xuất"
          >
            <FiLogOut className="w-5 h-5" />
          </button>
        </div>

        {gpsError && !location && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-3">
              📍 {gpsError}. Nhập tọa độ thủ công:
            </p>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                step="0.0001"
                placeholder="Vĩ độ (VD: 10.7769)"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                step="0.0001"
                placeholder="Kinh độ (VD: 106.7009)"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              onClick={handleSetManual}
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors"
            >
              Xác nhận vị trí
            </button>
          </div>
        )}

        <section className="mb-6">
          <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-wide">
            Tâm trạng hôm nay
          </h2>
          <MoodSelector value={mood} onChange={setMood} />
        </section>

        <section className="mb-6">
          <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-wide">
            Ngân sách
          </h2>
          <BudgetSelector value={budget} onChange={setBudget} />
        </section>

        <section className="mb-8">
          <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-wide">
            Bán kính tìm kiếm
          </h2>
          <RadiusSelector value={radius} onChange={setRadius} />
        </section>

        <button
          onClick={handleSearch}
          disabled={!mood || !activeLocation || searching}
          className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base transition-colors shadow-lg shadow-orange-200 dark:shadow-orange-900/30"
        >
          {searching ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              AI đang phân tích...
            </span>
          ) : (
            'Tìm quán ngay 🍜'
          )}
        </button>

        {!mood && (
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-3">
            Chọn tâm trạng để bắt đầu
          </p>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
