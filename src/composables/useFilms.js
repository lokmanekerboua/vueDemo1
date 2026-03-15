import { ref } from 'vue'
import { filmService } from '@/services/filmService.js'

export function usePost(id) {
    const film = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    async function fetchFilm() {
        isLoading.value = true
        try {
            const { data } = await filmService.getById(id)
            film.value = data
        } catch (err) {
            error.value = err.message
        } finally {
            isLoading.value = false
        }
    }

    fetchFilm()

    return { film, isLoading, error }
}