import apiClient from './api'

export const filmService = {
    getAll: (page = 1, limit = 10) => apiClient.get('/posts', { params: { page, limit } }),
    getById: (id) => apiClient.get(`/posts/${id}`),
    create: (data) => apiClient.post('/films', data),
    update: (id, data) => apiClient.patch(`/films/${id}`, data),
    delete: (id) => apiClient.delete(`/films/${id}`)
}