import api from './axios'

export const searchPlaces = ({ keywords, latitude, longitude, radius }) =>
  api.get('/places/search', {
    params: {
      keywords: Array.isArray(keywords) ? keywords.join(',') : keywords,
      latitude,
      longitude,
      radius,
    },
  })
