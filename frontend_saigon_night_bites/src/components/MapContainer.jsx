import { FiMapPin } from 'react-icons/fi'

export default function MapContainer({ places = [], userLocation }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_JS_API_KEY') {
    return (
      <div className="w-full h-48 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-2">
        <FiMapPin className="w-8 h-8 text-zinc-400" />
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Tìm thấy {places.length} quán xung quanh bạn
        </p>
        {userLocation && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </p>
        )}
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Thêm Google Maps API Key để hiển thị bản đồ
        </p>
      </div>
    )
  }

  const center = userLocation
    ? `${userLocation.latitude},${userLocation.longitude}`
    : '10.7769,106.7009'

  const markers = places
    .slice(0, 10)
    .map(
      (p, i) =>
        `markers=color:red%7Clabel:${i + 1}%7C${p.location?.lat},${p.location?.lng}`
    )
    .join('&')

  const src = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=14&size=600x200&scale=2&markers=color:blue%7Clabel:B%7C${center}&${markers}&key=${apiKey}`

  return (
    <div className="w-full h-48 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100">
      <img
        src={src}
        alt="Bản đồ khu vực"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
