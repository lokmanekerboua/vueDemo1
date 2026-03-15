<template>
  <div class="container">
    <RouterLink :to="{ name: 'FilmList' }">← Retour</RouterLink>

    <div v-if="isLoading">Chargement...</div>

    <article v-else-if="film">
      <h1>{{ film.title }}</h1>
      <p>{{ film.body }}</p>
    </article>
  </div>
</template>

<script setup>
import { usePost } from '@/composables/useFilms.js'

const props = defineProps({ id: String })

const { post: film, isLoading, error } = usePost(props.id)
</script>