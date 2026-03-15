import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { filmService } from '@/services/filmService'

export const useFilmStore = defineStore('films', () => {
    const films = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    const total = ref(0)
    const page = ref(1)
    const limit = ref(10)

    const filmCount = computed(() => total.value)

    async function fetchFilms() {
        isLoading.value = true
        error.value = null
        try {
            const { data } = await filmService.getAll(page.value, limit.value)
            films.value = data.data
            total.value = data.total
        } catch (err) {
            error.value = err.message
        } finally {
            isLoading.value = false
        }
    }

    async function deleteFilm(id) {
        await filmService.delete(id)
        films.value = films.value.filter(f => f.id !== id)
        total.value--
    }

    return { films, isLoading, error, filmCount, fetchFilms, deleteFilm }
})