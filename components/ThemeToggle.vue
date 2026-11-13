<template>
    <!--
        Light/dark toggle. Persists to localStorage (dashswap_theme) and
        toggles `.dark` on <html>, which drives the CSS var theme.
    -->
    <button
        class="group relative rounded-xl p-2 text-ink2 ring-1 ring-line bg-surface-sunken transition-all duration-200 hover:text-ink1 hover:ring-dash-300/50 hover:-translate-y-0.5"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggle"
    >
        <Transition
            enter-active-class="duration-200 ease-out"
            enter-from-class="opacity-0 -rotate-90 scale-50"
            leave-active-class="duration-150 ease-in absolute inset-0"
            leave-to-class="opacity-0 rotate-90 scale-50"
            mode="default"
        >
            <SunIcon v-if="isDark" class="size-5 relative" />
            <MoonIcon v-else class="size-5 relative" />
        </Transition>
    </button>
</template>

<script setup>
/* components/ThemeToggle.vue — light/dark mode switch. */

import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const isDark = useState('theme:dark', () => true)

const toggle = () => {
    const next = !isDark.value
    isDark.value = next
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('dashswap_theme', next ? 'dark' : 'light')
}
</script>
