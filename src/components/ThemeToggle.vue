<template>
  <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Mode clair' : 'Mode sombre'">
    <!-- Sun -->
    <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a1 1 0 0 0-1.41 0 1 1 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a1 1 0 0 0-1.41 0 1 1 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a1 1 0 0 0 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06a1 1 0 0 0 0-1.41 1 1 0 0 0-1.41 0zM7.05 18.36l-1.06 1.06a1 1 0 0 0 0 1.41 1 1 0 0 0 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/>
    </svg>
    <!-- Moon -->
    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
    </svg>
  </button>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.theme-toggle:hover {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--accent-bg);
}
</style>