/* tailwind.config.ts
 *
 * DashSwap design system — "Evolution" theme.
 * Dash blue (#008DE4) + deep-space violet, glass surfaces, aurora effects.
 * All animations are CSS-only and respect prefers-reduced-motion.
 *
 * NOTE: typed structurally — `tailwindcss` is not a direct dependency here
 *       (it ships inside @nuxtjs/tailwindcss), so no type is imported.
 */

export default {
    /* Class strategy: plugins/theme.client.js toggles `.dark` on <html>;
     * components stay mode-agnostic via the CSS vars in assets/css/theme.css. */
    darkMode: 'class',

    theme: {
        extend: {
            /* Adaptive tokens resolved from assets/css/theme.css vars. */
            colors: {
                'surface': 'var(--surface)',
                'surface-strong': 'var(--surface-strong)',
                'surface-sunken': 'var(--surface-sunken)',
                'ink1': 'var(--text-1)',
                'ink2': 'var(--text-2)',
                'ink3': 'var(--text-3)',
                'line': 'var(--line)',
                'chrome': 'var(--chrome-bg)',
                'backdrop': 'var(--backdrop)',
                'terminal': 'var(--terminal-bg)',

                dash: {
                    50: '#e6f4ff',
                    100: '#bae0ff',
                    200: '#7cc4ff',
                    300: '#36a8ff',
                    400: '#0d95fb',
                    500: '#008de4',
                    600: '#0071bd',
                    700: '#005b99',
                    800: '#064a7a',
                    900: '#0b3e64',
                    950: '#072743',
                },
                'space': {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    950: '#2e1065',
                },
            },
            fontFamily: {
                sans: ['Inter var', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
            },
            animation: {
                'aurora-a': 'aurora-a 26s ease-in-out infinite alternate',
                'aurora-b': 'aurora-b 34s ease-in-out infinite alternate',
                'aurora-c': 'aurora-c 42s ease-in-out infinite alternate',
                'float': 'float 7s ease-in-out infinite',
                'float-slow': 'float 11s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2.6s ease-in-out infinite',
                'shimmer': 'shimmer 2.8s linear infinite',
                'scan': 'scan 2.2s linear infinite',
                'fade-up': 'fade-up 0.5s ease-out both',
                'fade-in': 'fade-in 0.4s ease-out both',
                'pop-in': 'pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                'spin-slow': 'spin 9s linear infinite',
                'spin-slower': 'spin 18s linear infinite',
                'orbit': 'orbit 14s linear infinite',
                'tick': 'tick 1s steps(12) infinite',
                'border-flow': 'border-flow 6s linear infinite',
                'grid-drift': 'grid-drift 24s linear infinite',
            },
            keyframes: {
                'aurora-a': {
                    '0%': { transform: 'translate(-12%, -8%) rotate(0deg) scale(1)' },
                    '50%': { transform: 'translate(10%, 6%) rotate(28deg) scale(1.18)' },
                    '100%': { transform: 'translate(-6%, 10%) rotate(-18deg) scale(0.94)' },
                },
                'aurora-b': {
                    '0%': { transform: 'translate(14%, 4%) rotate(0deg) scale(1.05)' },
                    '50%': { transform: 'translate(-10%, -10%) rotate(-32deg) scale(0.9)' },
                    '100%': { transform: 'translate(6%, 12%) rotate(22deg) scale(1.22)' },
                },
                'aurora-c': {
                    '0%': { transform: 'translate(0%, 10%) scale(1)' },
                    '100%': { transform: 'translate(-8%, -12%) scale(1.35)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-14px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.55', filter: 'blur(24px)' },
                    '50%': { opacity: '1', filter: 'blur(34px)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'scan': {
                    '0%': { transform: 'translateY(-110%)' },
                    '100%': { transform: 'translateY(410%)' },
                },
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(14px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'pop-in': {
                    '0%': { opacity: '0', transform: 'scale(0.82)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'orbit': {
                    '0%': { transform: 'rotate(0deg) translateX(6px) rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg) translateX(6px) rotate(-360deg)' },
                },
                'tick': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                'border-flow': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '200% 50%' },
                },
                'grid-drift': {
                    '0%': { backgroundPosition: '0 0' },
                    '100%': { backgroundPosition: '56px 56px' },
                },
            },
            boxShadow: {
                'glow-dash': '0 0 24px rgba(0, 141, 228, 0.35), 0 0 64px rgba(0, 141, 228, 0.12)',
                'glow-space': '0 0 24px rgba(139, 92, 246, 0.35), 0 0 64px rgba(139, 92, 246, 0.12)',
                'glass': 'inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 50px -12px rgba(0,0,0,0.65)',
            },
            backgroundImage: {
                'brand-gradient': 'linear-gradient(120deg, #36a8ff 0%, #008de4 35%, #8b5cf6 100%)',
                'text-gradient': 'linear-gradient(92deg, #7cc4ff 0%, #36a8ff 30%, #c4b5fd 70%, #f0abfc 100%)',
                'glass-surface': 'linear-gradient(160deg, rgba(23, 27, 45, 0.82) 0%, rgba(10, 12, 24, 0.86) 100%)',
            },
        },
    },
}

