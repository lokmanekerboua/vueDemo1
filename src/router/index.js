import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'FilmList',
        component: () => import('@/views/FilmListView.vue')
    },
    {
        path: '/films/:id',
        name: 'FilmDetail',
        component: () => import('@/views/FilmDetailView.vue'),
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router