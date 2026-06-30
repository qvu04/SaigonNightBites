import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { FiArrowLeft } from 'react-icons/fi'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import AIInsightCard from '../components/AIInsightCard'
import FoodCard from '../components/FoodCard'
import MapContainer from '../components/MapContainer'
import SkeletonCard from '../components/SkeletonCard'
import { getFavorites, addFavorite, removeFavorite } from '../api/favorites'
import type { Place, Coords } from '../types'
import type { AxiosError } from 'axios'

interface LocationState {
  places: Place[]
  totalFound: number
  aiSuggestion: { keywords: string[]; reason: string }
  userLocation: Coords
}

interface FavoriteMap {
  [placeId: string]: string
}

export default function Discovery() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: LocationState | null }
  const [favoriteIds, setFavoriteIds] = useState<FavoriteMap>({})
  const [loadingFavs, setLoadingFavs] = useState(true)

  useEffect(() => {
    getFavorites()
      .then((res) => {
        const docs = res.data.data.favorites || []
        const map: FavoriteMap = {}
        docs.forEach((f) => { map[f.place_id] = f.id })
        setFavoriteIds(map)
      })
      .catch(() => { })
      .finally(() => setLoadingFavs(false))
  }, [])

  if (!state) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
        <span className="text-5xl">🍽️</span>
        <p className="text-center text-zinc-600 dark:text-zinc-400 font-medium">
          Vui lòng quay lại trang chủ để tìm kiếm
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm"
        >
          Về trang chủ
        </button>
      </div>
    )
  }

  const { places = [], totalFound = 0, aiSuggestion, userLocation } = state

  const handleToggleFavorite = async (place: Place) => {
    const alreadyFav = !!favoriteIds[place.place_id]
    if (alreadyFav) {
      const docId = favoriteIds[place.place_id]
      try {
        await removeFavorite(docId)
        setFavoriteIds((prev) => {
          const next = { ...prev }
          delete next[place.place_id]
          return next
        })
        toast.success('Đã bỏ khỏi danh sách yêu thích')
      } catch {
        toast.error('Không thể bỏ yêu thích, thử lại nhé')
      }
    } else {
      try {
        const res = await addFavorite({
          place_id: place.place_id,
          name: place.name,
          rating: place.rating,
          vicinity: place.vicinity,
          location: place.location,
          photo_url: place.photo_url ?? null,
        })
        const newDoc = res.data.data.favorite
        setFavoriteIds((prev) => ({ ...prev, [place.place_id]: newDoc.id }))
        toast.success('Đã thêm vào yêu thích ❤️')
      } catch (err) {
        const axiosErr = err as AxiosError
        if (axiosErr.response?.status === 409) {
          toast.info('Quán này đã trong danh sách yêu thích rồi!')
        } else {
          toast.error('Không thể thêm yêu thích, thử lại nhé')
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-24 md:pb-10">
        <div className="flex items-center gap-3 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </button>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Kết quả gợi ý
          </h1>
          <span className="ml-auto text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-orange-500 dark:text-orange-400">{totalFound}</span> quán phù hợp
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-8 lg:items-start">
          <div>
            {aiSuggestion && (
              <div className="mb-4">
                <AIInsightCard
                  reason={aiSuggestion.reason}
                  keywords={aiSuggestion.keywords}
                />
              </div>
            )}

            <div className="mb-4 lg:hidden">
              <MapContainer places={places} userLocation={userLocation} />
            </div>

            {places.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-5xl block mb-3">😔</span>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-2">
                  Không tìm thấy quán phù hợp trong khu vực này.
                </p>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-6">
                  Hãy thử mở rộng bán kính tìm kiếm.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm"
                >
                  Tìm lại
                </button>
              </div>
            ) : loadingFavs ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                <SkeletonCard count={3} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {places.map((place, i) => (
                  <FoodCard
                    key={place.place_id}
                    place={place}
                    isFavorited={!!favoriteIds[place.place_id]}
                    onToggleFavorite={() => handleToggleFavorite(place)}
                    delay={i * 0.05}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <MapContainer places={places} userLocation={userLocation} tall />
              {userLocation && (
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Vị trí tìm kiếm</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                    {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
