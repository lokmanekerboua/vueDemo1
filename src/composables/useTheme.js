import { ref, watch, onMounted } from 'vue'

const isDark = ref(true)

export function useTheme() {
    function applyTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
        localStorage.setItem('theme', dark ? 'dark' : 'light')
    }

    function toggleTheme() {
        isDark.value = !isDark.value
    }

    function initTheme() {
        const saved = localStorage.getItem('theme')
        isDark.value = saved ? saved === 'dark' : true
        applyTheme(isDark.value)
    }

    watch(isDark, (val) => applyTheme(val))

    return { isDark, toggleTheme, initTheme }
}