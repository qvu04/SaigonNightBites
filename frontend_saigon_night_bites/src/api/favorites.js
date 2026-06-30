import api from './axios'

export const getFavorites = () => api.get('/favorites')

export const addFavorite = (placeData) => api.post('/favorites', placeData)

export const removeFavorite = (id) => api.delete(`/favorites/${id}`)
