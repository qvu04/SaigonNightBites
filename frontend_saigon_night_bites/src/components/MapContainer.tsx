import { useEffect, useState } from 'react'
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { FiCheck, FiX, FiStar } from 'react-icons/fi'
import { getPlaceInsights } from '../api/ai'
import { formatDistance } from '../utils/formatDistance'
import type { Place, Coords, ProsConsInsight } from '../types'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const MarkerGlobalStyle = createGlobalStyle`
  .place-marker-icon,
  .user-marker-icon {
    background: transparent;
    border: none;
  }

  .place-marker-dot,
  .user-marker-dot {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    border: 3px solid #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .place-marker-dot {
    background: #f97316;
    box-shadow: 0 0 0 6px rgba(249, 115, 22, 0.25), 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  .user-marker-dot {
    background: #3b82f6;
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.25), 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  .place-marker-dot::after,
  .user-marker-dot::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #ffffff;
  }

  .dark .place-marker-dot,
  .dark .user-marker-dot {
    border-color: #18181b;
  }
`

const placeIcon = L.divIcon({
  className: 'place-marker-icon',
  html: `
    <div class="relative flex items-center justify-center w-full h-full">
      <span class="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 animate-ping"></span>
      <span class="place-marker-dot"></span>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -14],
})

const userIcon = L.divIcon({
  className: 'user-marker-icon',
  html: `
    <div class="relative flex items-center justify-center w-full h-full">
      <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
      <span class="user-marker-dot"></span>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -12],
})

const PopupBody = styled.div`
  width: 100%;
  font-family: inherit;
`

const PlaceName = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
  color: #18181b;

  .dark & {
    color: #f4f4f5;
  }
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin: 2px 0 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #3f3f46;

  .dark & {
    color: #d4d4d8;
  }
`

const MetaSeparator = styled.span`
  color: #a1a1aa;
  font-weight: 400;
`

const MetaAddress = styled.span`
  font-weight: 400;
  color: #71717a;

  .dark & {
    color: #a1a1aa;
  }
`

const StatusBadge = styled.span<{ $tone: 'open' | 'closed' }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 600;
  background: ${({ $tone }) => ($tone === 'open' ? '#dcfce7' : '#fee2e2')};
  color: ${({ $tone }) => ($tone === 'open' ? '#15803d' : '#b91c1c')};

  .dark & {
    background: ${({ $tone }) => ($tone === 'open' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)')};
    color: ${({ $tone }) => ($tone === 'open' ? '#4ade80' : '#f87171')};
  }
`

const StatusDot = styled.span<{ $tone: 'open' | 'closed' }>`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: ${({ $tone }) => ($tone === 'open' ? '#22c55e' : '#ef4444')};
`

const Divider = styled.div`
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid #e4e4e7;

  .dark & {
    border-top-color: #3f3f46;
  }
`

const AiLabel = styled.p`
  margin: 0 0 5px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #a1a1aa;

  .dark & {
    color: #71717a;
  }
`

const LoadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const Spinner = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 2px solid #d4d4d8;
  border-top-color: #f97316;
  animation: ${spin} 0.6s linear infinite;

  .dark & {
    border-color: #52525b;
  }
`

const MutedText = styled.span`
  font-size: 0.75rem;
  font-style: italic;
  color: #71717a;

  .dark & {
    color: #a1a1aa;
  }
`

const InsightGroup = styled.div`
  & + & {
    margin-top: 6px;
  }
`

const InsightHeading = styled.p<{ $tone: 'pro' | 'con' }>`
  margin: 0 0 4px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ $tone }) => ($tone === 'pro' ? '#059669' : '#ef4444')};

  .dark & {
    color: ${({ $tone }) => ($tone === 'pro' ? '#34d399' : '#f87171')};
  }
`

const InsightRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 0.8125rem;
  color: #3f3f46;
  margin-top: 2px;

  .dark & {
    color: #d4d4d8;
  }
`

const IconWrap = styled.span<{ $tone: 'pro' | 'con' }>`
  display: inline-flex;
  margin-top: 2px;
  flex-shrink: 0;
  color: ${({ $tone }) => ($tone === 'pro' ? '#10b981' : '#ef4444')};
`

const SourceNote = styled.p`
  margin: 10px 0 0;
  font-size: 0.6875rem;
  color: #a1a1aa;
`

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

type InsightState = ProsConsInsight | 'loading' | 'error'

export const MapContainer = ({ places = [], userLocation, tall = false }: Props) => {
  const heightClass = tall ? 'h-80 lg:h-[420px]' : 'h-48'
  const center: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [10.7769, 106.7009]

  const [insights, setInsights] = useState<Record<string, InsightState>>({})

  const handleMarkerClick = async (place: Place) => {
    if (insights[place.place_id]) return
    setInsights((prev) => ({ ...prev, [place.place_id]: 'loading' }))
    try {
      const res = await getPlaceInsights(place.name)
      setInsights((prev) => ({ ...prev, [place.place_id]: res.data.data }))
    } catch {
      setInsights((prev) => ({ ...prev, [place.place_id]: 'error' }))
    }
  }

  return (
    <div className={`w-full ${heightClass} rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700`}>
      <MarkerGlobalStyle />
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

        {places.map((place) => {
          const insight = insights[place.place_id]
          return place.location ? (
            <Marker
              key={place.place_id}
              position={[place.location.lat, place.location.lng]}
              icon={placeIcon}
              eventHandlers={{ click: () => handleMarkerClick(place) }}
            >
              <Popup minWidth={260} maxWidth={300}>
                <PopupBody>
                  <PlaceName>{place.name}</PlaceName>
                  <MetaRow>
                    {place.rating > 0 && (
                      <>
                        <FiStar size={13} className="fill-amber-400 stroke-amber-400" />
                        <span>{place.rating.toFixed(1)}</span>
                        <MetaSeparator>·</MetaSeparator>
                      </>
                    )}
                    {place.distance != null && (
                      <>
                        <span>{formatDistance(place.distance)}</span>
                        <MetaSeparator>·</MetaSeparator>
                      </>
                    )}
                    <MetaAddress>{place.vicinity}</MetaAddress>
                  </MetaRow>

                  {place.open_now === true && (
                    <StatusBadge $tone="open">
                      <StatusDot $tone="open" />
                      Đang mở cửa
                    </StatusBadge>
                  )}
                  {place.open_now === false && (
                    <StatusBadge $tone="closed">
                      <StatusDot $tone="closed" />
                      Đã đóng cửa
                    </StatusBadge>
                  )}

                  {insight === 'loading' && (
                    <Divider>
                      <LoadingRow>
                        <Spinner />
                        <MutedText>Đang phân tích bình luận...</MutedText>
                      </LoadingRow>
                    </Divider>
                  )}

                  {insight === 'error' && (
                    <Divider>
                      <MutedText>Chưa phân tích được lúc này.</MutedText>
                    </Divider>
                  )}

                  {insight && insight !== 'loading' && insight !== 'error' && (
                    <Divider>
                      <AiLabel>AI tổng hợp đánh giá</AiLabel>

                      {insight.pros.length > 0 && (
                        <InsightGroup>
                          <InsightHeading $tone="pro">Ưu điểm</InsightHeading>
                          {insight.pros.map((p) => (
                            <InsightRow key={p}>
                              <IconWrap $tone="pro"><FiCheck size={13} /></IconWrap>
                              <span>{p}</span>
                            </InsightRow>
                          ))}
                        </InsightGroup>
                      )}

                      {insight.cons.length > 0 && (
                        <InsightGroup>
                          <InsightHeading $tone="con">Nhược điểm</InsightHeading>
                          {insight.cons.map((c) => (
                            <InsightRow key={c}>
                              <IconWrap $tone="con"><FiX size={13} /></IconWrap>
                              <span>{c}</span>
                            </InsightRow>
                          ))}
                        </InsightGroup>
                      )}

                      {insight.pros.length === 0 && insight.cons.length === 0 && (
                        <MutedText>Chưa đủ dữ liệu để phân tích.</MutedText>
                      )}

                      {insight.comments.length > 0 && (
                        <SourceNote>Dựa trên {insight.comments.length} bình luận</SourceNote>
                      )}
                    </Divider>
                  )}
                </PopupBody>
              </Popup>
            </Marker>
          ) : null
        })}
      </LeafletMap>
    </div>
  )
}
