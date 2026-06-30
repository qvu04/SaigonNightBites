import api from './axios'

export const getAIRecommendation = ({ mood, budget, radius, latitude, longitude }) =>
  api.post('/ai/recommend', { mood, budget, radius, latitude, longitude })
