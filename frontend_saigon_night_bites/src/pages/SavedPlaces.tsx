import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FiHeart } from 'react-icons/fi'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import { getFavorites, removeFavorite } from '../api/favorites'
import type { FavoritePlace } from '../types'
import { FoodCard, SkeletonCard } from '../components'

export default function SavedPlaces() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState<FavoritePlace[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFavorites()
      .then((res) => setFavorites(res.data.data.favorites || []))
      .catch(() => toast.error('Không thể tải danh sách yêu thích'))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (fav: FavoritePlace) => {
    try {
      await removeFavorite(fav.id)
      setFavorites((prev) => prev.filter((f) => f.id !== fav.id))
      toast.success('Đã bỏ khỏi danh sách yêu thích')
    } catch {
      toast.error('Không thể bỏ yêu thích, thử lại nhé')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 md:pb-10">
        <div className="flex items-center gap-2 mb-6">
          <FiHeart className="w-5 h-5 fill-red-500 stroke-red-500" />
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Quán yêu thích
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard count={3} />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">💛</span>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-2">
              Bạn chưa lưu quán nào.
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-6">
              Hãy khám phá và lưu lại những quán ưng ý!
            </p>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm"
            >
              Khám phá ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav, i) => (
              <FoodCard
                key={fav.id}
                place={{
                  place_id: fav.place_id,
                  name: fav.name,
                  rating: fav.rating || 0,
                  vicinity: fav.vicinity || "",
                  location: fav.location,
                  photo_url: fav.photo_url,
                  open_now: true,
                  user_ratings_total: 0,
                  distance: null,
                }}
                isFavorited={true}
                onToggleFavorite={() => handleRemove(fav)}
                delay={i * 0.05}
              />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
