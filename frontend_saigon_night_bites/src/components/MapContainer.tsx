import { useEffect } from 'react'
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Place, Coords } from '../types'

// Fix default marker icons bị mất khi bundle với Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: 'hue-rotate-[240deg]',
})

const placeIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: 'hue-rotate-[120deg]',
})

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}

interface Props {
  places?: Place[]
  userLocation?: Coords | null
  tall?: boolean
}

export const MapContainer = ({ places = [], userLocation, tall = false }: Props) => {
  const heightClass = tall ? 'h-80 lg:h-[420px]' : 'h-48'
  const center: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [10.7769, 106.7009]

  return (
    <div className={`w-full ${heightClass} rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700`}>
      <LeafletMap
        center={center}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && (
          <>
            <RecenterMap lat={userLocation.latitude} lng={userLocation.longitude} />
            <Marker position={center} icon={userIcon}>
              <Popup>Vị trí của bạn</Popup>
            </Marker>
          </>
        )}

        {places.map((place) =>
          place.location ? (
            <Marker
              key={place.place_id}
              position={[place.location.lat, place.location.lng]}
              icon={placeIcon}
            >
              <Popup>
                <strong>{place.name}</strong>
                <br />
                ⭐ {place.rating} · {place.vicinity}
              </Popup>
            </Marker>
          ) : null
        )}
      </LeafletMap>
    </div>
  )
}
