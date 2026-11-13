/* plugins/theme.client.js
 *
 * Applies the saved color mode before the app mounts (no flash): `dark` by
 * default, `light` when saved. The `.dark` class on <html> drives both the
 * CSS vars (assets/css/theme.css) and Tailwind's dark: variants.
 */

export default defineNuxtPlugin(() => {
    const saved = localStorage.getItem('dashswap_theme') || 'dark'
    const isDark = saved !== 'light'

    document.documentElement.classList.toggle('dark', isDark)

    /* Shared reactive state for components (ThemeToggle). */
    useState('theme:dark', () => isDark)
})
