<template>
    <div class="loading-spinner">
        <div class="relative flex flex-col items-center gap-5 animate-fade-in">
            <div class="relative size-16">
                <div class="absolute inset-0 rounded-full bg-dash-500/25 blur-xl animate-pulse-glow"></div>
                <div class="absolute inset-0 rounded-full border-4 border-white/10 border-t-dash-400"></div>
                <div class="absolute inset-2 rounded-full border-4 border-transparent border-b-space-400/70 animate-spin-slower" style="animation-direction: reverse;"></div>
            </div>
            <span class="text-xs uppercase tracking-[0.25em] text-dash-300">Loading…</span>
        </div>
    </div>
</template>

<style scoped>
.loading-spinner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(5, 6, 15, 0.82);
    backdrop-filter: blur(6px);
    z-index: 9999;
}

@media (prefers-reduced-motion: reduce) {
    .loading-spinner [class*='animate-'],
    .loading-spinner [style*='animation'] {
        animation: none !important;
    }
}
</style>
