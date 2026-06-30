import { motion } from 'framer-motion'
import { FiHeart, FiNavigation, FiStar, FiMapPin } from 'react-icons/fi'
import { clsx } from 'clsx'
import { formatDistance } from '../utils/formatDistance'

export default function FoodCard({ place, isFavorited, onToggleFavorite, delay = 0 }) {
  const {
    name,
    rating,
    user_ratings_total,
    vicinity,
    location,
    photo_url,
    distance,
    open_now,
  } = place

  const handleDirections = () => {
    if (location?.lat && location?.lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
        '_blank',
        'noopener,noreferrer'
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-700"
    >
      <div className="relative h-40 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-zinc-700 dark:to-zinc-600">
        {photo_url ? (
          <img
            src={photo_url}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-40">🍽️</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1.5">
          {open_now && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white shadow-sm">
              Đang mở cửa
            </span>
          )}
        </div>
        <button
          onClick={onToggleFavorite}
          aria-label={isFavorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-900/90 flex items-center justify-center shadow-sm transition-transform hover:scale-110 active:scale-95"
        >
          <FiHeart
            className={clsx(
              'w-4 h-4 transition-colors',
              isFavorited
                ? 'fill-red-500 stroke-red-500'
                : 'stroke-zinc-400 dark:stroke-zinc-500'
            )}
          />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-tight truncate mb-1">
          {name}
        </h3>

        <div className="flex items-center gap-3 mb-1.5">
          <div className="flex items-center gap-1">
            <FiStar className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {rating?.toFixed(1)}
            </span>
            {user_ratings_total > 0 && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                ({user_ratings_total.toLocaleString('vi-VN')})
              </span>
            )}
          </div>
          {distance != null && (
            <div className="flex items-center gap-1">
              <FiMapPin className="w-3 h-3 text-zinc-400" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {formatDistance(distance)}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mb-3">
          {vicinity}
        </p>

        <button
          onClick={handleDirections}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold transition-colors"
        >
          <FiNavigation className="w-4 h-4" />
          Dẫn đường
        </button>
      </div>
    </motion.div>
  )
}
